import { test } from "node:test";
import assert from "node:assert/strict";
import { collectSnapshot } from "../lib/index.js";

function makeCtx({ loaderEntries = [], tools = [] } = {}) {
	return {
		loader: { entries: function* () { yield* loaderEntries; } },
		get() { return undefined; },
		tools: { schemas() { return tools; } },
		logger: { warn() {} }
	};
}

const loaderEntries = [
	{ options: { id: "mcp-a", name: "@deepseek-ai/dsh-mcp-client", config: { serverName: "srv-a", transport: "streamable-http", url: "http://example.test/mcp" } }, disabled: false, fiber: {} },
	{ options: { id: "mcp-b", name: "@deepseek-ai/dsh-mcp-client", config: { serverName: "srv-b", transport: "stdio", command: "npx -y @acme/mcp" } }, disabled: false, fiber: {} },
	{ options: { id: "mcp-off", name: "@deepseek-ai/dsh-mcp-client", config: { serverName: "srv-off", transport: "streamable-http", url: "http://example.test/off" } }, disabled: true, fiber: undefined }
];

const tools = [
	{ name: "mcp__srv-a__search", description: "Search", parameters: { type: "object" } },
	{ name: "mcp__srv-b__build", description: "Build", parameters: { type: "object" } },
	{ name: "pwsh", description: "shell", parameters: { type: "object" } }
];

test("collectSnapshot groups MCP tools by server and counts others", async () => {
	const ctx = makeCtx({ loaderEntries, tools });
	const snap = await collectSnapshot(ctx, "");
	assert.equal(snap.ok, true);
	assert.equal(snap.totalMcpTools, 2);
	assert.equal(snap.otherToolCount, 1);
	assert.deepEqual(snap.otherToolNames, ["pwsh"]);
	const a = snap.servers.find((s) => s.serverName === "srv-a");
	assert.ok(a);
	assert.equal(a.toolCount, 1);
	assert.equal(a.tools[0].name, "mcp__srv-a__search");
	assert.equal(a.tools[0].rawName, "search");
	assert.equal(a.transport, "streamable-http");
	const b = snap.servers.find((s) => s.serverName === "srv-b");
	assert.equal(b.endpoint, "npx -y @acme/mcp");
	const off = snap.servers.find((s) => s.serverName === "srv-off");
	assert.equal(off.disabled, true);
	assert.equal(off.active, false);
	assert.equal(off.toolCount, 0);
});

test("collectSnapshot serves a global view without a session id", async () => {
	const ctx = makeCtx({ loaderEntries, tools });
	const snap = await collectSnapshot(ctx, "");
	assert.equal(snap.serving.view, "global");
	assert.equal(snap.serving.sessionId, "");
});
