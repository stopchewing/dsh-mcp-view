/**
 * @module dsh-mcp-view
 *
 * Host half of the dsh-mcp-view plugin: exposes the MCP inventory of the
 * running DSH instance over HTTP so the browser half can render it.
 *
 * Data sources (all live, read per request):
 *  - `ctx.loader` entries with `name === '@deepseek-ai/dsh-mcp-client'` —
 *    the configured MCP server instances (serverName, transport, endpoint,
 *    disabled/active state);
 *  - `ctx.tools.schemas()` — every tool currently registered in the harness
 *    ToolRuntime; MCP tools carry the public name `mcp__<serverName>__<rawName>`;
 *  - persisted session logs under `<dsh-home>/sessions` (files named
 *    `session.jsonl` or `session.jsonl.zstd` at any depth)
 *    — `tool/call` events carry `data.name` (public tool name) and `time`
 *    (epoch ms), so the last use of every MCP tool is derived from real
 *    history, never invented. Files are concatenations of zstd frames; the
 *    scan is memoized per (mtime, size) so unchanged sessions are not re-read.
 *
 * Route:
 *  - GET /api/mcp-view/tools → JSON inventory (servers, tools, last-used data).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { zstdDecompressSync } from "node:zlib";

/** Cordis plugin name used by loader diagnostics. */
const name = "mcp-view";

/** Services required by this plugin. */
const inject = [
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
/** Re-scan the session logs at most once per this window (ms). */
const SCAN_TTL_MS = 15000;

/** Resolve the dsh home directory (honours DSH_HOME, else ~/.dsh). */
function dshHome() {
	const override = process.env.DSH_HOME;
	if (typeof override === "string" && override !== "") return override;
	return join(homedir(), ".dsh");
}

/** Recursively collect session log files under `root`. */
function walkSessionFiles(root) {
	const out = [];
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
 * (each append in the persistence layer is one frame). Returns the raw text.
 */
function decompressSessionFile(path) {
	const raw = readFileSync(path);
	if (!path.endsWith(".zstd")) return raw.toString("utf8");
	const parts = [];
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

/** Memoized scan state: per-file keys + the last-used map. */
let scanCache = null;

/**
 * Scan persisted session logs for `tool/call` events and derive the last use
 * timestamp (epoch ms) per public tool name. Incremental: only files whose
 * (mtime, size) changed since the previous scan are re-read.
 *
 * @returns `{ ok, at, lastUsed: Map<name, ms> }`.
 */
function scanLastUsed() {
	const now = Date.now();
	if (scanCache !== null && now - scanCache.at < SCAN_TTL_MS) return scanCache;
	const root = join(dshHome(), "sessions");
	const files = walkSessionFiles(root);
	const lastUsed = scanCache !== null ? new Map(scanCache.lastUsed) : /* @__PURE__ */ new Map();
	const seen = /* @__PURE__ */ new Map();
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
		let text;
		try {
			text = decompressSessionFile(file);
		} catch {
			continue;
		}
		for (const line of text.split("\n")) {
			const trimmed = line.trim();
			if (trimmed === "") continue;
			let event;
			try {
				event = JSON.parse(trimmed);
			} catch {
				continue;
			}
			if (event?.type === "tool/call" && event.data && typeof event.data.name === "string" && typeof event.time === "number") {
				const previous = lastUsed.get(event.data.name);
				if (previous === void 0 || event.time > previous) lastUsed.set(event.data.name, event.time);
			}
		}
	}
	// Forget files that no longer exist so a recreated one is re-read.
	if (scanCache !== null) {
		for (const file of scanCache.files.keys()) if (!seen.has(file)) scanCache.files.delete(file);
	}
	scanCache = { ok: true, at: now, files: seen, lastUsed };
	return scanCache;
}

/**
 * Resolve a public MCP tool name back to its owning server record and raw
 * name. Exact longest-prefix matching against the configured serverNames is
 * tried first (a serverName may itself contain `_`), then a first-`__` split
 * as a fallback for tools whose server is not in the loader config.
 *
 * @param publicName - the registered tool name (`mcp__...`).
 * @param byName - map of configured serverName → server record.
 * @returns the owning record (or undefined) and the raw tool name.
 */
function parseMcpName(publicName, byName) {
	for (const [serverName, record] of byName) {
		const prefix = `${MCP_PREFIX}${serverName}__`;
		if (publicName.startsWith(prefix)) {
			return { server: record, rawName: publicName.slice(prefix.length) };
		}
	}
	const rest = publicName.slice(MCP_PREFIX.length);
	const sep = rest.indexOf("__");
	if (sep === -1) return { server: void 0, rawName: rest };
	return { server: void 0, rawName: rest.slice(sep + 2) };
}

/**
 * Build the current MCP inventory snapshot: configured servers (from the
 * loader) merged with the live registered tool schemas (from ctx.tools) and
 * the last-use history (from the persisted session logs).
 *
 * @param ctx - host plugin context.
 * @returns a plain JSON-serializable inventory object.
 */
function collectSnapshot(ctx) {
	const servers = [];
	const byName = /* @__PURE__ */ new Map();
	try {
		for (const entry of ctx.loader.entries()) {
			const options = entry.options;
			if (options == null || options.name !== MCP_CLIENT_PACKAGE) continue;
			const config = options.config ?? {};
			const serverName = config.serverName;
			if (typeof serverName !== "string" || serverName === "") continue;
			const record = {
				id: options.id ?? "",
				serverName,
				transport: typeof config.transport === "string" ? config.transport : "unknown",
				endpoint: config.transport === "stdio"
					? (typeof config.command === "string" ? config.command : "")
					: (typeof config.url === "string" ? config.url : ""),
				disabled: entry.disabled === true,
				active: entry.fiber !== void 0 && entry.disabled !== true,
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

	let schemas = [];
	try {
		schemas = ctx.tools.schemas();
	} catch (error) {
		ctx.logger.warn(`mcp-view: reading tool schemas failed: ${String(error)}`);
	}

	const usage = scanLastUsed();
	const unknownTools = [];
	const otherToolNames = [];
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
		const tool = {
			name: schema.name,
			rawName: parsed.rawName,
			description: schema.description ?? "",
			parameters: schema.parameters ?? {},
			lastUsedAt: typeof lastUsedMs === "number" ? new Date(lastUsedMs).toISOString() : null
		};
		if (parsed.server !== void 0) {
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

	for (const record of servers) {
		record.tools.sort((a, b) => a.rawName.localeCompare(b.rawName));
	}
	unknownTools.sort((a, b) => a.rawName.localeCompare(b.rawName));
	otherToolNames.sort((a, b) => a.localeCompare(b));

	return {
		ok: true,
		generatedAt: new Date().toISOString(),
		totalMcpTools,
		otherToolCount: otherToolNames.length,
		otherToolNames,
		usage: {
			available: usage.ok,
			scannedAt: new Date(usage.at).toISOString()
		},
		servers,
		unknownTools
	};
}

/**
 * Mount the plugin: register the JSON route and the prompt-guidance section.
 *
 * @param ctx - host plugin context carrying webServer/tools/loader/systemPrompt.
 */
function apply(ctx) {
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
			let body;
			try {
				body = JSON.stringify(collectSnapshot(ctx));
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

	ctx.effect(() => ctx.systemPrompt.section({
		name: "plugin:mcp-view",
		order: SECTION_ORDER,
		text: "本机已安装 dsh-mcp-view 插件（MCP Tools 面板）：Web GUI 侧边栏底部「MCP Tools」按钮打开浮动面板，列出当前实例可用的全部 MCP 服务器与工具（按服务器分组，默认折叠，含传输方式、端点、工具描述、JSON Schema 与最近使用时间，支持搜索、展开与刷新）。数据来自宿主 ctx.tools 注册表、loader 中的 dsh-mcp-client 实例配置，以及会话日志（~/.dsh/sessions 中 tool/call 事件），经 /api/mcp-view/tools 路由提供。用户提到「MCP 工具列表 / 有哪些 MCP / MCP 面板 / mcp view」时即指本插件，请据此协作。"
	}), "mcp-view: prompt section");
}

export { name, inject, apply };
