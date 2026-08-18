import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { zstdCompressSync } from "node:zlib";
import { decompressSessionFile, dshHome, scanLastUsed, __resetScanCacheForTests } from "../lib/index.js";

let home;
const prevHome = process.env.DSH_HOME;

beforeEach(() => {
	__resetScanCacheForTests();
	home = mkdtempSync(join(tmpdir(), "dmv-test-"));
	process.env.DSH_HOME = home;
});
afterEach(() => {
	rmSync(home, { recursive: true, force: true });
	if (prevHome === undefined) delete process.env.DSH_HOME;
	else process.env.DSH_HOME = prevHome;
});

function sessionDir(label, sid) {
	const p = join(home, "sessions", label, "session-" + sid);
	mkdirSync(p, { recursive: true });
	return p;
}
function eventLine(type, name, time, turn = 1) {
	return JSON.stringify({ type, time, data: { name, turn } });
}

test("dshHome honours DSH_HOME", () => {
	assert.equal(dshHome(), home);
});

test("decompressSessionFile: plaintext jsonl", () => {
	const p = join(sessionDir("plain", "s"), "session.jsonl");
	writeFileSync(p, "{\"type\":\"session\"}\n");
	assert.equal(decompressSessionFile(p), "{\"type\":\"session\"}\n");
});

test("decompressSessionFile: concatenated zstd frames", () => {
	const p = join(sessionDir("frames", "s"), "session.jsonl.zstd");
	const f1 = zstdCompressSync(Buffer.from("{\"type\":\"session\"}\n"));
	const f2 = zstdCompressSync(Buffer.from(eventLine("tool/call", "mcp__frm__a", 1, 1) + "\n"));
	writeFileSync(p, Buffer.concat([f1, f2]));
	const text = decompressSessionFile(p);
	assert.match(text, /"type":"session"/);
	assert.match(text, /"type":"tool\/call"/);
});

test("scanLastUsed aggregates last used, counts and daily buckets", () => {
	const p = join(sessionDir("agg", "s"), "session.jsonl.zstd");
	const now = Date.now();
	const lines = [
		eventLine("tool/call", "mcp__agg__search", now - 5000, 1),
		eventLine("tool/call", "mcp__agg__search", now - 1000, 2),
		eventLine("tool/call", "mcp__agg__get", now - 2000, 1)
	].join("\n") + "\n";
	writeFileSync(p, zstdCompressSync(Buffer.from(lines)));
	const result = scanLastUsed();
	assert.equal(result.byTool.get("mcp__agg__search"), 2);
	assert.equal(result.byTool.get("mcp__agg__get"), 1);
	assert.equal(result.lastUsed.get("mcp__agg__search"), now - 1000);
	assert.equal(result.lastUsed.get("mcp__agg__get"), now - 2000);
	assert.equal(result.totalCalls, 3);
	assert.ok(result.dayBuckets.size >= 1);
});

test("scanLastUsed re-reads a rewritten file on a fresh pass", () => {
	const p = join(sessionDir("mod", "s"), "session.jsonl.zstd");
	writeFileSync(p, zstdCompressSync(Buffer.from(eventLine("tool/call", "mcp__mod__x", 10, 1) + "\n")));
	let result = scanLastUsed();
	assert.equal(result.byTool.get("mcp__mod__x"), 1);
	assert.equal(result.byTool.get("mcp__mod__y"), undefined);
	// A fresh pass (TTL elapsed → cache reset) picks up the rewritten file.
	__resetScanCacheForTests();
	const rewritten = eventLine("tool/call", "mcp__mod__x", 10, 1) + "\n" + eventLine("tool/call", "mcp__mod__y", 11, 1) + "\n";
	writeFileSync(p, zstdCompressSync(Buffer.from(rewritten)));
	result = scanLastUsed();
	assert.equal(result.byTool.get("mcp__mod__x"), 1);
	assert.equal(result.byTool.get("mcp__mod__y"), 1);
});

test("scanLastUsed ignores non-tool events", () => {
	const p = join(sessionDir("non", "s"), "session.jsonl.zstd");
	const lines = [
		eventLine("session", undefined, 1),         // no data.name -> skipped
		eventLine("user/message", undefined, 2),    // skipped
		eventLine("tool/call", "mcp__n__k", 3, 1)   // counted
	].join("\n") + "\n";
	writeFileSync(p, zstdCompressSync(Buffer.from(lines)));
	const result = scanLastUsed();
	assert.equal(result.byTool.get("mcp__n__k"), 1);
	assert.equal(result.totalCalls, 1);
});
