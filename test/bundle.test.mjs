import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fakeLocal = (() => {
	const m = new Map();
	return {
		getItem(k) { return m.has(k) ? m.get(k) : null; },
		setItem(k, v) { m.set(k, String(v)); },
		_() { return m; }
	};
})();

function loadBundle() {
	globalThis.window = { __ModuleLoader__: { load: (h) => { globalThis.__handoff = h; } } };
	globalThis.localStorage = fakeLocal;
	const src = readFileSync(new URL("../lib/client.js", import.meta.url), "utf8");
	(0, eval)(src);
	const h = globalThis.__handoff;
	assert.ok(h, "bundle did not register via __ModuleLoader__.load");
	return h;
}

test("client bundle registers the plugin and exposes apply/inject", () => {
	const h = loadBundle();
	assert.equal(h.id, "dsh-mcp-view");
	const fakeReact = {
		useState: () => [undefined, () => {}],
		useEffect: () => {},
		useCallback: (f) => f,
		useRef: () => ({}),
		useReducer: (_r, init) => [init, () => {}],
		useSyncExternalStore: (_s, g) => g(),
		createElement: () => ({})
	};
	const ex = h.factory((spec) => {
		if (spec === "react") return fakeReact;
		throw new Error("unexpected require: " + spec);
	});
	assert.equal(typeof ex.apply, "function");
	assert.deepEqual(ex.inject, ["slots"]);
});

test("client plugin registers both slots when applied", () => {
	const h = loadBundle();
	const fakeReact = {
		useState: () => [undefined, () => {}],
		useEffect: () => {},
		useCallback: (f) => f,
		useRef: () => ({}),
		useReducer: (_r, init) => [init, () => {}],
		useSyncExternalStore: (_s, g) => g(),
		createElement: () => ({})
	};
	const ex = h.factory((spec) => {
		if (spec === "react") return fakeReact;
		throw new Error("unexpected require: " + spec);
	});
	const registrations = [];
	const mockCtx = {
		effect: (fn) => { return () => {}; },
		inject: (_deps, fn) => {
			fn({ slots: {
				inject: (_name, reg) => reg(),
				register: (opts, comp) => {
					registrations.push(opts.name + "#" + opts.id);
					return () => {};
				}
			} });
		}
	};
	ex.apply(mockCtx);
	assert.deepEqual(registrations, ["sidebar.footer.action#mcp-view-toggle", "shell.overlay#mcp-view-panel"]);
});
