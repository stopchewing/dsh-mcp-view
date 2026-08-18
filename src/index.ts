/**
 * @module dsh-mcp-view
 *
 * Host half of the dsh-mcp-view plugin: exposes the MCP inventory of the
 * running DSH instance over HTTP so the browser half can render it.
 *
 * Data sources (all live, read per request):
 *  - `ctx.loader` entries with `name === '@deepseek-ai/dsh-mcp-client'` —
 *    the configured MCP server instances.
 *  - `ctx.tools.schemas(scope)` — every tool currently registered in the
 *    harness ToolRuntime; MCP tools carry the public name
 *    `mcp__<serverName>__<rawName>`.
 *  - persisted session logs under `<dsh-home>/sessions` (files named
 *    `session.jsonl` or `session.jsonl.zstd` at any depth) — `tool/call`
 *    events carry `data.name` and `time`, so the last use, call counts and
 *    daily usage of every tool are derived from real history.
 *
 * Routes:
 *  - GET /api/mcp-view/tools?session=<id>&health=1 → JSON inventory.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { zstdDecompressSync } from "node:zlib";

/** Cordis plugin name used by loader diagnostics. */
export const name = "mcp-view";

/** Minimal structural view of a Cordis plugin context we actually use. */
interface CordisCtx {
	loader: {
		entries: () => Iterable<LoaderEntry>;
	};
	tools: {
		schemas: (scope?: unknown) => ToolSchema[];
	};
	get: (service: string) => unknown;
	logger: { warn: (msg: string) => void; info: (msg: string) => void };
	effect: (fn: () => () => void, label: string) => void;
	webServer: { register: (route: Route) => () => void };
	systemPrompt: { section: (opts: { name: string; order: number; text: string }) => () => void };
}

interface LoaderEntry {
	options?: {
		id?: string;
		name?: string;
		config?: Record<string, unknown>;
	};
	disabled?: boolean;
	fiber?: unknown;
}

interface ToolSchema {
	name?: string;
	description?: string;
	parameters?: unknown;
}

interface Route {
	kind: "exact";
	path: string;
	handler: (req: NodeRequest, res: NodeResponse) => Promise<void> | void;
}

/** Minimal node:http request/response shape used by the route handler. */
interface NodeRequest {
	method?: string;
	url?: string;
}
interface NodeResponse {
	writeHead: (status: number, headers: Record<string, string>) => void;
	end: (body?: unknown) => void;
}

/** Services required by this plugin. */
export const inject = [
	"webServer",
	"tools",
	"loader",
	"systemPrompt"
];

/** The mcp-client package name whose loader entries represent MCP servers. */
const MCP_CLIENT_PACKAGE = "@deepseek-ai/dsh-mcp-client";
/** Public-name prefix for every MCP tool: `mcp__<serverName>__<rawName>`. */
const MCP_PREFIX = "mcp__";
/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 210;

/** zstd frame magic (little-endian 0xFD2FB528). */
const FRAME_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);
/** Re-scan the session logs at most once per this window (ms). HMR-watch sentinel. */
const SCAN_TTL_MS = 15000;
/** Only scan this many session files per pass (bounds first-request cost). */
const MAX_SCAN_FILES = 40;
/** Only decompress this many total bytes per pass. */
const MAX_SCAN_BYTES = 32 * 1024 * 1024;
/** Health probe timeout per streamable-http server (ms). */
const HEALTH_TIMEOUT_MS = 3000;

/** Resolve the dsh home directory (honours DSH_HOME, else ~/.dsh). */
export function dshHome(): string {
	const override = process.env.DSH_HOME;
	if (typeof override === "string" && override !== "") return override;
	return join(homedir(), ".dsh");
}

/** Recursively collect session log files under `root`. */
function walkSessionFiles(root: string): string[] {
	const out: string[] = [];
	let entries;
	try {
		entries = readdirSync(root, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = join(root, entry.name);
		if (entry.isDirectory()) {
			out.push(...walkSessionFiles(full));
		} else if (entry.name === "session.jsonl.zstd" || entry.name === "session.jsonl") {
			out.push(full);
		}
	}
	return out;
}

/**
 * Decompress a session log: plaintext, or a concatenation of zstd frames
 * (each append in the persistence layer is one frame). Returns raw text.
 */
export function decompressSessionFile(path: string): string {
	const raw = readFileSync(path);
	if (!path.endsWith(".zstd")) return raw.toString("utf8");
	const parts: string[] = [];
	let pos = 0;
	while (pos < raw.length) {
		const magicAt = raw.indexOf(FRAME_MAGIC, pos);
		if (magicAt === -1) break;
		const next = raw.indexOf(FRAME_MAGIC, magicAt + 4);
		const end = next === -1 ? raw.length : next;
		parts.push(zstdDecompressSync(raw.subarray(magicAt, end)).toString("utf8"));
		pos = end;
	}
	return parts.join("");
}

interface ScanCache {
	ok: boolean;
	at: number;
	files: Map<string, string>;
	lastUsed: Map<string, number>;
	byTool: Map<string, number>;
	dayBuckets: Map<string, number>;
	totalCalls: number;
	capped: boolean;
}

/** Memoized scan state: per-file keys + derived usage tables. */
let scanCache: ScanCache | null = null;

/** Clear the memoized scan cache. Exposed for tests (deterministic isolation). */
export function __resetScanCacheForTests(): void {
	scanCache = null;
}

/** Scan the persisted session logs for `tool/call` events. */
export function scanLastUsed(): ScanCache {
	const now = Date.now();
	if (scanCache !== null && now - scanCache.at < SCAN_TTL_MS) return scanCache;

	const root = join(dshHome(), "sessions");
	const files = walkSessionFiles(root).slice(0, MAX_SCAN_FILES);

	const lastUsed = scanCache !== null ? new Map(scanCache.lastUsed) : new Map<string, number>();
	const byTool = scanCache !== null ? new Map(scanCache.byTool) : new Map<string, number>();
	const dayBuckets = scanCache !== null ? new Map(scanCache.dayBuckets) : new Map<string, number>();
	let totalCalls = scanCache !== null ? scanCache.totalCalls : 0;
	let capped = scanCache !== null && scanCache.capped;

	const seen = new Map<string, string>();
	let budget = MAX_SCAN_BYTES;
	for (const file of files) {
		let stat;
		try {
			stat = statSync(file);
		} catch {
			continue;
		}
		const key = `${stat.mtimeMs}|${stat.size}`;
		seen.set(file, key);
		if (scanCache !== null && scanCache.files.get(file) === key) continue;
		if (budget <= 0) {
			capped = true;
			continue;
		}
		let text: string;
		try {
			text = decompressSessionFile(file);
		} catch {
			continue;
		}
		budget -= text.length;
		for (const line of text.split("\n")) {
			const trimmed = line.trim();
			if (trimmed === "") continue;
			let event: { type?: string; time?: number; data?: { name?: unknown } } | null;
			try {
				event = JSON.parse(trimmed) as typeof event;
			} catch {
				continue;
			}
			if (event === null || event.type !== "tool/call" || event.data == null) continue;
			const rawName = typeof event.data.name === "string" ? event.data.name : undefined;
			if (rawName === undefined) continue;
			if (typeof event.time === "number") {
				const prev = lastUsed.get(rawName);
				if (prev === undefined || event.time > prev) lastUsed.set(rawName, event.time);
			}
			byTool.set(rawName, (byTool.get(rawName) ?? 0) + 1);
			totalCalls += 1;
			const day = new Date(typeof event.time === "number" ? event.time : now).toISOString().slice(0, 10);
			dayBuckets.set(day, (dayBuckets.get(day) ?? 0) + 1);
		}
	}

	if (scanCache !== null) {
		for (const file of scanCache.files.keys()) if (!seen.has(file)) scanCache.files.delete(file);
	}

	const cutoff = new Date(now - 14 * 86400_000).toISOString().slice(0, 10);
	for (const day of [...dayBuckets.keys()]) if (day < cutoff) dayBuckets.delete(day);

	scanCache = { ok: true, at: now, files: seen, lastUsed, byTool, dayBuckets, totalCalls, capped };
	return scanCache;
}

interface UsageSummary {
	available: boolean;
	scannedAt: string;
	capped: boolean;
	totalCalls: number;
	byDay: { day: string; count: number }[];
	topTools: { name: string; count: number }[];
}

/** Build the compact usage summary attached to the inventory. */
export function usageSummary(usage: ScanCache): UsageSummary {
	const top = [...usage.byTool.entries()]
		.filter(([nm]) => nm.startsWith(MCP_PREFIX))
		.sort((a, b) => b[1] - a[1])
		.slice(0, 20)
		.map(([name, count]) => ({ name, count }));
	return {
		available: usage.ok,
		scannedAt: new Date(usage.at).toISOString(),
		capped: usage.capped,
		totalCalls: usage.totalCalls,
		byDay: [...usage.dayBuckets.entries()]
			.map(([day, count]) => ({ day, count }))
			.sort((a, b) => a.day.localeCompare(b.day)),
		topTools: top
	};
}

interface ServerRecord {
	id: string;
	serverName: string;
	transport: string;
	endpoint: string;
	disabled: boolean;
	active: boolean;
	toolCount: number;
	lastUsedAt: string | null;
	tools: ToolView[];
	health?: string | null;
}

interface ToolView {
	name: string;
	rawName: string;
	description: string;
	parameters: unknown;
	lastUsedAt: string | null;
	uses: number;
}

/**
 * Resolve a public MCP tool name back to its owning server record and raw
 * name. Exact longest-prefix matching against the configured serverNames is
 * tried first, then a first-`__` split as a fallback.
 */
export function parseMcpName(publicName: string, byName: Map<string, ServerRecord>): { server?: ServerRecord; rawName: string } {
	for (const [serverName, record] of byName) {
		const prefix = `${MCP_PREFIX}${serverName}__`;
		if (publicName.startsWith(prefix)) {
			return { server: record, rawName: publicName.slice(prefix.length) };
		}
	}
	const rest = publicName.slice(MCP_PREFIX.length);
	const sep = rest.indexOf("__");
	if (sep === -1) return { server: undefined, rawName: rest };
	return { server: undefined, rawName: rest.slice(sep + 2) };
}

/** Resolve the agent scope for a session id, or undefined when unavailable. */
export function resolveSessionScope(ctx: CordisCtx, sessionId: string): unknown {
	if (typeof sessionId !== "string" || sessionId === "") return undefined;
	try {
		const agents = ctx.get("agents") as { get: (id: string) => { scope?: unknown } | undefined } | undefined;
		if (agents === undefined) return undefined;
		const agent = agents.get(sessionId);
		if (agent !== undefined && agent.scope !== undefined) return agent.scope;
		return undefined;
	} catch {
		return undefined;
	}
}

/**
 * Probe streamable-http endpoint reachability. Any HTTP response means the
 * server answered ("up"); connect failure or timeout means "down". stdio and
 * disabled servers are not probed.
 */
export async function probeHealth(record: ServerRecord): Promise<string> {
	if (record.transport !== "streamable-http") {
		return record.disabled ? "disabled" : (record.toolCount > 0 ? "up" : "unknown");
	}
	if (typeof record.endpoint !== "string" || record.endpoint === "") return "unknown";
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
	try {
		await fetch(record.endpoint, { method: "HEAD", signal: controller.signal });
		return "up";
	} catch {
		if (controller.signal.aborted) return "down";
		return "up";
	} finally {
		clearTimeout(timer);
	}
}

/**
 * Build the current MCP inventory snapshot. When `sessionId` is provided and
 * a live agent scope can be resolved, the tool view is scoped to that
 * session; otherwise the global view is returned.
 */
export async function collectSnapshot(ctx: CordisCtx, sessionId: string): Promise<Inventory> {
	const serving = { view: "global", sessionId: "", agentPreset: "" };
	if (typeof sessionId === "string" && sessionId !== "") {
		serving.sessionId = sessionId;
		try {
			const sessions = ctx.get("sessions") as { get: (id: string) => { agentPreset?: string } | undefined } | undefined;
			const session = sessions?.get(sessionId);
			if (session && typeof session.agentPreset === "string") serving.agentPreset = session.agentPreset;
		} catch (error) {
			ctx.logger.warn(`mcp-view: session lookup failed: ${String(error)}`);
		}
	}

	const servers: ServerRecord[] = [];
	const byName = new Map<string, ServerRecord>();
	try {
		for (const entry of ctx.loader.entries()) {
			const options = entry.options;
			if (options == null || options.name !== MCP_CLIENT_PACKAGE) continue;
			const config = options.config ?? {};
			const serverName = config.serverName;
			if (typeof serverName !== "string" || serverName === "") continue;
			const record: ServerRecord = {
				id: options.id ?? "",
				serverName,
				transport: typeof config.transport === "string" ? config.transport : "unknown",
				endpoint: config.transport === "stdio"
					? (typeof config.command === "string" ? config.command : "")
					: (typeof config.url === "string" ? config.url : ""),
				disabled: entry.disabled === true,
				active: entry.fiber !== undefined && entry.disabled !== true,
				toolCount: 0,
				lastUsedAt: null,
				tools: []
			};
			servers.push(record);
			byName.set(serverName, record);
		}
	} catch (error) {
		ctx.logger.warn(`mcp-view: reading loader entries failed: ${String(error)}`);
	}

	let schemas: ToolSchema[] = [];
	let scopeResolved = false;
	try {
		const scope = resolveSessionScope(ctx, sessionId);
		if (scope !== undefined) {
			schemas = ctx.tools.schemas(scope);
			scopeResolved = true;
		} else {
			schemas = ctx.tools.schemas();
		}
	} catch (error) {
		ctx.logger.warn(`mcp-view: reading tool schemas failed: ${String(error)}`);
	}
	if (scopeResolved) serving.view = "session";

	const usage = scanLastUsed();
	const unknownTools: ToolView[] = [];
	const otherToolNames: string[] = [];
	let totalMcpTools = 0;
	for (const schema of schemas) {
		if (typeof schema?.name !== "string") continue;
		if (!schema.name.startsWith(MCP_PREFIX)) {
			otherToolNames.push(schema.name);
			continue;
		}
		totalMcpTools += 1;
		const parsed = parseMcpName(schema.name, byName);
		const lastUsedMs = usage.lastUsed.get(schema.name);
		const tool: ToolView = {
			name: schema.name,
			rawName: parsed.rawName,
			description: schema.description ?? "",
			parameters: schema.parameters ?? {},
			lastUsedAt: typeof lastUsedMs === "number" ? new Date(lastUsedMs).toISOString() : null,
			uses: usage.byTool.get(schema.name) ?? 0
		};
		if (parsed.server !== undefined) {
			parsed.server.tools.push(tool);
			parsed.server.toolCount += 1;
			if (typeof lastUsedMs === "number") {
				const current = parsed.server.lastUsedAt;
				if (current === null || lastUsedMs > Date.parse(current)) parsed.server.lastUsedAt = tool.lastUsedAt;
			}
		} else {
			unknownTools.push(tool);
		}
	}

	for (const record of servers) record.tools.sort((a, b) => a.rawName.localeCompare(b.rawName));
	unknownTools.sort((a, b) => a.rawName.localeCompare(b.rawName));
	otherToolNames.sort((a, b) => a.localeCompare(b));

	return {
		ok: true,
		generatedAt: new Date().toISOString(),
		totalMcpTools,
		otherToolCount: otherToolNames.length,
		otherToolNames,
		serving,
		usage: usageSummary(usage),
		servers,
		unknownTools
	};
}

interface Inventory {
	ok: boolean;
	generatedAt: string;
	totalMcpTools: number;
	otherToolCount: number;
	otherToolNames: string[];
	serving: { view: string; sessionId: string; agentPreset: string };
	usage: UsageSummary;
	servers: ServerRecord[];
	unknownTools: ToolView[];
}

interface PluginConfig {
	enabled?: boolean;
	announceToAgent?: boolean;
}

/**
 * Mount the plugin: register the JSON route and the prompt-guidance section.
 * The loader passes the entry `config` (see cordis.patch.yml) as the second
 * argument: `enabled` (default true) and `announceToAgent` (default true).
 */
export function apply(ctx: CordisCtx, config?: PluginConfig): void {
	const cfg = config ?? {};
	const enabled = cfg.enabled !== false;
	const announceToAgent = cfg.announceToAgent !== false;

	if (!enabled) {
		ctx.logger.info("mcp-view: plugin disabled via config (enabled: false)");
		return;
	}

	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: "/api/mcp-view/tools",
		handler: async (req, res) => {
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405, { "content-type": "application/json; charset=utf-8" });
				res.end(JSON.stringify({ ok: false, error: "method not allowed" }));
				return;
			}
			let status = 200;
			let body: string;
			try {
				const url = new URL(req.url ?? "/", "http://x");
				const sessionId = url.searchParams.get("session") ?? "";
				const health = url.searchParams.get("health") === "1";
				const inventory = await collectSnapshot(ctx, sessionId);
				for (const record of inventory.servers) {
					record.health = health ? await probeHealth(record) : null;
				}
				body = JSON.stringify(inventory);
			} catch (error) {
				status = 500;
				body = JSON.stringify({ ok: false, error: String(error) });
			}
			res.writeHead(status, {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-cache"
			});
			if (req.method === "HEAD") {
				res.end();
				return;
			}
			res.end(body);
		}
	}), "mcp-view: /api/mcp-view/tools route");

	if (announceToAgent) {
		ctx.effect(() => ctx.systemPrompt.section({
			name: "plugin:mcp-view",
			order: SECTION_ORDER,
			text: "本机已安装 dsh-mcp-view 插件（MCP Tools 面板）：Web GUI 侧边栏底部「MCP Tools」按钮打开浮动面板，列出当前实例可用的全部 MCP 服务器与工具（按服务器分组，默认折叠，含传输方式、端点、工具描述、JSON Schema、最近使用时间、调用次数与健康状态，支持搜索、排序、收藏、导出与刷新；可切换「当前会话」视图，只看本会话 agent 真正可见的工具）。数据来自宿主 ctx.tools 注册表、loader 中的 dsh-mcp-client 实例配置，以及会话日志（~/.dsh/sessions 中 tool/call 事件）。可在 cordis.patch.yml 的 mcp-view 行 config 里设 enabled / announceToAgent。用户提到「MCP 工具列表 / 有哪些 MCP / MCP 面板 / mcp view」时即指本插件，请据此协作。"
		}), "mcp-view: prompt section");
	}
}
