import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMcpName } from "../lib/index.js";

test("parseMcpName: splits mcp__<server>__<tool> via known server prefix", () => {
	const byName = new Map([["ams-graph", { serverName: "ams-graph" }]]);
	const r = parseMcpName("mcp__ams-graph__search_metadata", byName);
	assert.equal(r.rawName, "search_metadata");
	assert.equal(r.server, byName.get("ams-graph"));
});

test("parseMcpName: server name containing underscores matches longest prefix", () => {
	const byName = new Map([["my_server", { serverName: "my_server" }]]);
	const r = parseMcpName("mcp__my_server__do_thing", byName);
	assert.equal(r.rawName, "do_thing");
	assert.equal(r.server, byName.get("my_server"));
});

test("parseMcpName: unknown server falls back to first __ separator", () => {
	const r = parseMcpName("mcp__unknown-server__tool_name", new Map());
	assert.equal(r.rawName, "tool_name");
	assert.equal(r.server, undefined);
});

test("parseMcpName: no separator keeps the remainder", () => {
	const r = parseMcpName("mcp__tool", new Map());
	assert.equal(r.rawName, "tool");
	assert.equal(r.server, undefined);
});

test("parseMcpName: non-mcp__ names fall through to the prefix-stripped remainder", () => {
	// The function assumes an `mcp__` prefix; "pwsh" has none, so the stripped
	// remainder is empty. The caller only invokes it on mcp__-prefixed names.
	const r = parseMcpName("pwsh", new Map());
	assert.equal(r.rawName, "");
	assert.equal(r.server, undefined);
});
