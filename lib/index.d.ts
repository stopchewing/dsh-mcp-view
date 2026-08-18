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
/** Cordis plugin name used by loader diagnostics. */
export declare const name = "mcp-view";
/** Minimal structural view of a Cordis plugin context we actually use. */
interface CordisCtx {
    loader: {
        entries: () => Iterable<LoaderEntry>;
    };
    tools: {
        schemas: (scope?: unknown) => ToolSchema[];
    };
    get: (service: string) => unknown;
    logger: {
        warn: (msg: string) => void;
        info: (msg: string) => void;
    };
    effect: (fn: () => () => void, label: string) => void;
    webServer: {
        register: (route: Route) => () => void;
    };
    systemPrompt: {
        section: (opts: {
            name: string;
            order: number;
            text: string;
        }) => () => void;
    };
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
export declare const inject: string[];
/** Resolve the dsh home directory (honours DSH_HOME, else ~/.dsh). */
export declare function dshHome(): string;
/**
 * Decompress a session log: plaintext, or a concatenation of zstd frames
 * (each append in the persistence layer is one frame). Returns raw text.
 */
export declare function decompressSessionFile(path: string): string;
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
/** Clear the memoized scan cache. Exposed for tests (deterministic isolation). */
export declare function __resetScanCacheForTests(): void;
/** Scan the persisted session logs for `tool/call` events. */
export declare function scanLastUsed(): ScanCache;
interface UsageSummary {
    available: boolean;
    scannedAt: string;
    capped: boolean;
    totalCalls: number;
    byDay: {
        day: string;
        count: number;
    }[];
    topTools: {
        name: string;
        count: number;
    }[];
}
/** Build the compact usage summary attached to the inventory. */
export declare function usageSummary(usage: ScanCache): UsageSummary;
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
export declare function parseMcpName(publicName: string, byName: Map<string, ServerRecord>): {
    server?: ServerRecord;
    rawName: string;
};
/** Resolve the agent scope for a session id, or undefined when unavailable. */
export declare function resolveSessionScope(ctx: CordisCtx, sessionId: string): unknown;
/**
 * Probe streamable-http endpoint reachability. Any HTTP response means the
 * server answered ("up"); connect failure or timeout means "down". stdio and
 * disabled servers are not probed.
 */
export declare function probeHealth(record: ServerRecord): Promise<string>;
/**
 * Build the current MCP inventory snapshot. When `sessionId` is provided and
 * a live agent scope can be resolved, the tool view is scoped to that
 * session; otherwise the global view is returned.
 */
export declare function collectSnapshot(ctx: CordisCtx, sessionId: string): Promise<Inventory>;
interface Inventory {
    ok: boolean;
    generatedAt: string;
    totalMcpTools: number;
    otherToolCount: number;
    otherToolNames: string[];
    serving: {
        view: string;
        sessionId: string;
        agentPreset: string;
    };
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
export declare function apply(ctx: CordisCtx, config?: PluginConfig): void;
export {};
