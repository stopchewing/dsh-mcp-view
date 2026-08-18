window.__ModuleLoader__.load({
	id: "dsh-mcp-view",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region styles
		const css = [
			".dmv-toggle{width:100%;height:32px;color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-radius:8px;align-items:center;gap:8px;padding:0 12px;font-size:13px;display:flex}",
			".dmv-toggle:hover{background:var(--dsw-specific-sidebar-nav-item-hover);color:var(--dsw-alias-label-primary)}",
			".dmv-toggle[data-active]{background:var(--dsw-specific-sidebar-nav-item-active);color:var(--dsw-alias-label-primary);font-weight:600}",
			".dmv-toggle[data-disabled]{opacity:.45;cursor:not-allowed}",
			"[data-dsh-frame][data-sidebar-collapsed] .dmv-toggle{justify-content:center;width:100%;padding:0}",
			"[data-dsh-frame][data-sidebar-collapsed] .dmv-toggleLabel{display:none}",
			".dmv-toggleIcon{flex:none;justify-content:center;align-items:center;display:inline-flex}",
			".dmv-panel{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);flex-direction:column;gap:8px;padding:12px 14px 14px;display:flex;position:fixed;top:16px;right:16px;width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 32px);z-index:30;border-radius:14px;overflow:hidden}",
			".dmv-panelHeader{flex:none;align-items:center;gap:6px;display:flex}",
			".dmv-panelTitle{color:var(--dsw-alias-label-primary);white-space:nowrap;flex:1;margin:0;font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px;min-width:0}",
			".dmv-countBadge{color:var(--dsw-alias-state-business-primary);border:1px solid var(--dsw-alias-state-business-primary);white-space:nowrap;border-radius:999px;padding:0 7px;font-size:11px;line-height:1.7;display:inline-block}",
			".dmv-iconButton{width:24px;height:24px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;font-size:12px;display:inline-flex;flex:none}",
			".dmv-iconButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".dmv-iconButton[data-label]{font-size:11.5px;font-weight:600;gap:4px;width:auto;padding:0 6px}",
			".dmv-iconButton:disabled{opacity:.5;cursor:default}",
			".dmv-summary{flex:none;flex-wrap:wrap;gap:4px 10px;font-size:11px;color:var(--dsw-alias-label-tertiary);display:flex;align-items:center}",
			".dmv-toolbar{flex:none;gap:6px;display:flex;flex-wrap:wrap}",
			".dmv-search{color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;flex:1 1 160px;padding:5px 10px;font-size:12.5px;min-width:0}",
			".dmv-search:focus{border-color:var(--dsw-alias-state-business-primary)}",
			".dmv-search::placeholder{color:var(--dsw-alias-label-tertiary)}",
			".dmv-select{color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;padding:5px 8px;font-size:12px;flex:none}",
			".dmv-tabs{flex:none;gap:2px;display:flex;border-bottom:1px solid var(--dsw-alias-border-l1)}",
			".dmv-tab{color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-bottom:2px solid transparent;border-radius:6px 6px 0 0;padding:5px 12px;font-size:12.5px;font-weight:600}",
			".dmv-tab:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-tab[data-active]{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-state-business-primary)}",
			".dmv-body{flex-direction:column;flex:1;min-height:0;gap:8px;display:flex;overflow-y:auto}",
			".dmv-server{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);border-radius:10px;flex:none;flex-direction:column;display:flex;overflow:hidden}",
			".dmv-serverHead{width:100%;text-align:left;cursor:pointer;background:0 0;border:none;flex:none;align-items:center;gap:6px;padding:7px 8px 7px 10px;font:inherit;color:var(--dsw-alias-label-primary);display:flex;flex-wrap:wrap}",
			".dmv-serverHead:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-serverName{color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}",
			".dmv-serverMeta{flex:none;align-items:center;gap:5px;display:flex;flex-wrap:wrap}",
			".dmv-badge{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:999px;padding:0 7px;font-size:10px;line-height:1.7;display:inline-block}",
			".dmv-badge[data-kind=transport]{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}",
			".dmv-badge[data-kind=ok]{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}",
			".dmv-badge[data-kind=down]{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}",
			".dmv-badge[data-kind=warn]{color:var(--dsw-alias-state-warn-primary);border-color:var(--dsw-alias-state-warn-primary)}",
			".dmv-badge[data-kind=disabled]{color:var(--dsw-alias-label-tertiary);border-color:var(--dsw-alias-border-l2)}",
			".dmv-serverBody{border-top:1px solid var(--dsw-alias-separator-primary);flex-direction:column;display:flex}",
			".dmv-endpoint{color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;padding:4px 12px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:none}",
			".dmv-tool{border-top:1px solid var(--dsw-alias-separator-primary);flex-direction:column;display:flex}",
			".dmv-toolHead{width:100%;text-align:left;cursor:pointer;background:0 0;border:none;align-items:center;gap:6px;padding:5px 8px 5px 10px;font:inherit;display:flex;min-width:0}",
			".dmv-toolHead:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-toolName{color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}",
			".dmv-toolUsed{color:var(--dsw-alias-label-tertiary);font-size:10px;white-space:nowrap;flex:none;padding-left:6px}",
			".dmv-star{color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;padding:0;width:20px;height:20px;font-size:12px;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;flex:none}",
			".dmv-star:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-star[data-active]{color:var(--dsw-alias-state-warn-primary)}",
			".dmv-copy{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;padding:0;width:20px;height:20px;font-size:11px;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;flex:none}",
			".dmv-copy:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".dmv-toolDetails{flex-direction:column;gap:6px;padding:0 10px 8px;display:flex;min-width:0}",
			".dmv-toolFull{color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;word-break:break-all}",
			".dmv-toolDesc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.45;margin:0;overflow-wrap:anywhere}",
			".dmv-schema{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:7px 9px;overflow:auto;max-height:220px}",
			".dmv-schema pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;color:var(--dsw-alias-label-primary);margin:0;white-space:pre-wrap;word-break:break-all}",
			".dmv-stats{flex-direction:column;flex:1;min-height:0;gap:10px;display:flex;overflow-y:auto}",
			".dmv-statBig{display:flex;gap:14px;flex:none}",
			".dmv-statCard{flex:1;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}",
			".dmv-statVal{font-size:20px;font-weight:700;color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}",
			".dmv-statLbl{font-size:11px;color:var(--dsw-alias-label-tertiary)}",
			".dmv-days{display:flex;align-items:flex-end;gap:4px;height:64px;flex:none;padding:0 2px}",
			".dmv-day{flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;min-width:0}",
			".dmv-dayBar{background:var(--dsw-alias-state-business-primary);border-radius:3px 3px 0 0;opacity:.85}",
			".dmv-dayLbl{font-size:8.5px;color:var(--dsw-alias-label-tertiary);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".dmv-topTitle{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary);flex:none}",
			".dmv-topRow{display:flex;align-items:center;gap:8px;font-size:11.5px;padding:3px 0;flex:none}",
			".dmv-topName{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--dsw-alias-label-primary)}",
			".dmv-topCount{color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;flex:none}",
			".dmv-topBar{height:6px;border-radius:3px;background:var(--dsw-alias-interactive-bg-hover);flex:none;overflow:hidden;width:120px}",
			".dmv-topFill{height:100%;background:var(--dsw-alias-state-business-primary)}",
			".dmv-other{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);border-radius:10px;flex:none;flex-direction:column;display:flex;overflow:hidden}",
			".dmv-otherHead{width:100%;cursor:pointer;user-select:none;flex:none;align-items:center;gap:8px;padding:7px 10px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary);background:0 0;border:none;text-align:left;display:flex}",
			".dmv-otherHead:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-otherChips{flex:none;flex-wrap:wrap;gap:4px;padding:0 10px 9px;display:flex}",
			".dmv-chip{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:1px 6px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;white-space:nowrap}",
			".dmv-empty,.dmv-loading{text-align:center;color:var(--dsw-alias-label-tertiary);padding:22px 12px;font-size:12px}",
			".dmv-error{color:var(--dsw-alias-state-error-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 12px;font-size:12px;line-height:1.5;overflow-wrap:anywhere}",
			".dmv-disabled{color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;padding:20px 16px;font-size:12.5px;line-height:1.6;text-align:center}",
			".dmv-spinner{border:2px solid var(--dsw-alias-state-business-primary);vertical-align:-1px;border-top-color:#0000;border-radius:50%;flex:none;width:10px;height:10px;animation:.8s linear infinite dmvSpin;display:inline-block}",
			"@keyframes dmvSpin{to{transform:rotate(360deg)}}",
			".dmv-fadeIn{animation:.18s ease-out dmvFadeIn}",
			"@keyframes dmvFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}"
		].join("");
		//#endregion

		//#region module state
		const openListeners = /* @__PURE__ */ new Set();
		let open = false;
		function setOpen(value) {
			if (open === value) return;
			open = value;
			for (const listener of [...openListeners]) listener(open);
		}
		const openStore = {
			getSnapshot: () => open,
			subscribe: (listener) => {
				openListeners.add(listener);
				return () => openListeners.delete(listener);
			}
		};

		function readStore(key, fallback) {
			try {
				const raw = localStorage.getItem(key);
				return raw === null ? fallback : JSON.parse(raw);
			} catch {
				return fallback;
			}
		}
		function writeStore(key, value) {
			try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
		}
		const EXPAND_KEY = "dmv.expanded.v1";
		const FAV_KEY = "dmv.favorites.v1";
		const SORT_KEY = "dmv.sort.v1";
		let favorites = new Set(readStore(FAV_KEY, []));
		const serverExpanded = new Map(Object.entries(readStore(EXPAND_KEY, {})));
		const toolExpanded = new Map(Object.entries(readStore(EXPAND_KEY + ".tools", {})));
		let sortMode = readStore(SORT_KEY, "name");
		function persistFavorites() { writeStore(FAV_KEY, [...favorites]); }
		function persistExpand() {
			writeStore(EXPAND_KEY, Object.fromEntries(serverExpanded));
			writeStore(EXPAND_KEY + ".tools", Object.fromEntries(toolExpanded));
		}
		//#endregion

		//#region api
		async function fetchInventory(sessionId, health) {
			const params = new URLSearchParams();
			if (typeof sessionId === "string" && sessionId !== "") params.set("session", sessionId);
			if (health) params.set("health", "1");
			const qs = params.toString();
			const url = "/api/mcp-view/tools" + (qs ? "?" + qs : "");
			const response = await fetch(url, { method: "GET", headers: { "accept": "application/json" } });
			if (!response.ok) throw new Error("HTTP " + response.status);
			const data = await response.json();
			if (typeof data === "object" && data !== null && data.ok === false && data.disabled === true) {
				throw new Error("plugin-disabled");
			}
			if (typeof data !== "object" || data === null || data.ok !== true) {
				throw new Error(data && typeof data.error === "string" ? data.error : "invalid inventory payload");
			}
			return data;
		}
		//#endregion

		//#region helpers
		function formatLastUsed(iso) {
			if (typeof iso !== "string" || iso === "") return null;
			const ms = Date.now() - Date.parse(iso);
			if (!Number.isFinite(ms)) return null;
			if (ms < 0 || ms < 60000) return "just now";
			const minutes = Math.floor(ms / 60000);
			if (minutes < 60) return minutes + "m ago";
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return hours + "h ago";
			const days = Math.floor(hours / 24);
			if (days < 30) return days + "d ago";
			const d = new Date(iso);
			return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
		}
		async function copyText(text) {
			try {
				await navigator.clipboard.writeText(text);
			} catch {
				const ta = document.createElement("textarea");
				ta.value = text;
				ta.style.position = "fixed";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				try { document.execCommand("copy"); } catch { /* ignore */ }
				document.body.removeChild(ta);
			}
		}
		function downloadFile(name, content, type) {
			const blob = new Blob([content], { type });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = name;
			document.body.appendChild(a);
			a.click();
			setTimeout(function () {
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}, 50);
		}
		function collectParamNames(parameters) {
			const names = [];
			const walk = (node, prefix) => {
				if (node === null || typeof node !== "object") return;
				if (node.properties && typeof node.properties === "object") {
					const keys = Object.keys(node.properties);
					for (const key of keys) {
						names.push(prefix ? prefix + "." + key : key);
						walk(node.properties[key], prefix ? prefix + "." + key : key);
					}
				}
				if (Array.isArray(node.anyOf)) node.anyOf.forEach((c) => walk(c, prefix));
				if (Array.isArray(node.oneOf)) node.oneOf.forEach((c) => walk(c, prefix));
			};
			walk(parameters, "");
			return names;
		}
		function matchesQuery(tool, serverName, query) {
			if (query === "") return true;
			const needle = query.toLowerCase();
			return (tool.rawName || "").toLowerCase().indexOf(needle) !== -1
				|| (tool.name || "").toLowerCase().indexOf(needle) !== -1
				|| (tool.description || "").toLowerCase().indexOf(needle) !== -1
				|| serverName.toLowerCase().indexOf(needle) !== -1
				|| collectParamNames(tool.parameters).some((p) => p.indexOf(needle) !== -1);
		}
		function sortServers(list, mode, favSet) {
			const arr = list.slice();
			return arr.sort(function (a, b) {
				switch (mode) {
					case "tools": return (b.toolCount - a.toolCount) || a.serverName.localeCompare(b.serverName);
					case "used": return (Date.parse(b.lastUsedAt || "0") - Date.parse(a.lastUsedAt || "0")) || a.serverName.localeCompare(b.serverName);
					case "fav": return ((favSet.has(a.serverName) ? 0 : 1) - (favSet.has(b.serverName) ? 0 : 1)) || a.serverName.localeCompare(b.serverName);
					default: return a.serverName.localeCompare(b.serverName);
				}
			});
		}
		//#endregion

		//#region icons
		function ToolsIcon() {
			return react.createElement("svg", { width: 15, height: 15, viewBox: "0 0 16 16", fill: "none", "aria-hidden": true, style: { display: "block" } },
				react.createElement("path", { d: "M2 3.5A1.5 1.5 0 0 1 3.5 2h2A1.5 1.5 0 0 1 7 3.5v2A1.5 1.5 0 0 1 5.5 7h-2A1.5 1.5 0 0 1 2 5.5v-2Zm7 0A1.5 1.5 0 0 1 10.5 2h2A1.5 1.5 0 0 1 14 3.5v2A1.5 1.5 0 0 1 12.5 7h-2A1.5 1.5 0 0 1 9 5.5v-2ZM2 10.5A1.5 1.5 0 0 1 3.5 9h2A1.5 1.5 0 0 1 7 10.5v2A1.5 1.5 0 0 1 5.5 14h-2A1.5 1.5 0 0 1 2 12.5v-2Zm7 0a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-2a1.5 1.5 0 0 1-1.5-1.5v-2Z", fill: "currentColor" }));
		}
		function RefreshIcon() {
			return react.createElement("svg", { width: 13, height: 13, viewBox: "0 0 16 16", fill: "none", style: { display: "block" } },
				react.createElement("path", { d: "M13.65 8a5.65 5.65 0 1 1-1.65-4L13.5 2.5V7h-4.5l1.9-1.9A4 4 0 1 0 12 8h1.65Z", fill: "currentColor" }));
		}
		function CloseIcon() {
			return react.createElement("svg", { width: 13, height: 13, viewBox: "0 0 16 16", fill: "none", style: { display: "block" } },
				react.createElement("path", { d: "M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5", stroke: "currentColor", "stroke-width": 1.6, "stroke-linecap": "round" }));
		}
		function CopyIcon() {
			return react.createElement("svg", { width: 11, height: 11, viewBox: "0 0 16 16", fill: "none", style: { display: "block" } },
				react.createElement("path", { d: "M5 3h7v7M3.5 5.5H3a1 1 0 0 0-1 1V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-.5", stroke: "currentColor", "stroke-width": 1.4, fill: "none" }));
		}
		function DownIcon() {
			return react.createElement("svg", { width: 11, height: 11, viewBox: "0 0 16 16", fill: "none", style: { display: "block" } },
				react.createElement("path", { d: "M3 6l5 5 5-5", stroke: "currentColor", "stroke-width": 1.6, "stroke-linecap": "round", fill: "none" }));
		}
		//#endregion

		//#region components
		function McpViewToggle(props) {
			const isOpen = react.useSyncExternalStore(openStore.subscribe, openStore.getSnapshot);
			const wide = props.wide === true;
			return react.createElement("button", {
				type: "button",
				className: "dmv-toggle",
				"data-active": isOpen || undefined,
				title: "MCP tools",
				"aria-label": "MCP tools",
				"aria-pressed": isOpen,
				onClick: function () { setOpen(!open); }
			}, react.createElement("span", { className: "dmv-toggleIcon" }, react.createElement(ToolsIcon, null)),
				wide ? react.createElement("span", { className: "dmv-toggleLabel" }, "MCP Tools") : null);
		}

		/** Error boundary that isolates the slot's `useSessions` hook so a crash
		 * (e.g. "w is not a function" inside useSyncExternalStore) can never
		 * take down the panel — it falls back to the global view instead. */
		class SessionsErrorBoundary extends react.Component {
			constructor(props) {
				super(props);
				this.state = { failed: false };
			}
			static getDerivedStateFromError() {
				return { failed: true };
			}
			componentDidCatch(error) {
				// The hook is optional: never surface its failure, just degrade.
				void error;
			}
			render() {
				if (this.state.failed) return this.props.fallback;
				return this.props.children;
			}
		}

		/** Calls the slot-provided `useSessions` hook (only valid inside the
		 * occupant's render tree) and passes the resolved id up. */
		function SessionsReader(props) {
			const sessions = props.useSessions();
			const id = sessions && typeof sessions.current === "string" ? sessions.current : "";
			return props.render(id);
		}

		function McpViewPanel(props) {
			const isOpen = react.useSyncExternalStore(openStore.subscribe, openStore.getSnapshot);
			if (!isOpen) return null;
			const useSessions = typeof props.useSessions === "function" ? props.useSessions : null;
			const fallback = react.createElement(McpViewPanelInner, { currentSessionId: "" });
			if (useSessions === null) return fallback;
			return react.createElement(SessionsErrorBoundary, { fallback: fallback },
				react.createElement(SessionsReader, {
					useSessions: useSessions,
					render: function (id) {
						return react.createElement(McpViewPanelInner, { currentSessionId: id });
					}
				}));
		}

		function ProbeIcon() {
			return react.createElement("span", { className: "dmv-spinner" });
		}

		function McpViewPanelInner(props) {
			const currentSessionId = typeof props.currentSessionId === "string" ? props.currentSessionId : "";
			const [data, setData] = react.useState(null);
			const [error, setError] = react.useState(null);
			const [loading, setLoading] = react.useState(true);
			const [query, setQuery] = react.useState("");
			const [sessionMode, setSessionMode] = react.useState(false);
			const [tab, setTab] = react.useState("servers");
			const [showOther, setShowOther] = react.useState(false);
			const [sortLocal, setSortLocal] = react.useState(sortMode);
			const [, forceRender] = react.useReducer(function (x) { return x + 1; }, 0);

			const load = react.useCallback(function (opts) {
				const o = opts || {};
				const effectiveSid = o.sid !== undefined ? o.sid : (sessionMode ? currentSessionId : "");
				if (!o.silent) setLoading(true);
				return fetchInventory(effectiveSid, !!o.health).then(function (result) {
					setData(result);
					setError(null);
				}).catch(function (cause) {
					const msg = cause && typeof cause.message === "string" ? cause.message : String(cause);
					setError(msg);
					if (msg === "plugin-disabled") setOpen(false);
				}).finally(function () {
					setLoading(false);
				});
			}, [sessionMode, currentSessionId]);

			react.useEffect(function () {
				load({ silent: false });
				const timer = setInterval(function () { load({ silent: true }); }, 10000);
				const onKeyDown = function (event) { if (event.key === "Escape") setOpen(false); };
				window.addEventListener("keydown", onKeyDown);
				return function () { clearInterval(timer); window.removeEventListener("keydown", onKeyDown); };
			}, [load]);

			const toggleServer = react.useCallback(function (name) {
				serverExpanded.set(name, !(serverExpanded.get(name) === true));
				persistExpand();
				forceRender();
			}, []);
			const toggleTool = react.useCallback(function (name) {
				toolExpanded.set(name, !(toolExpanded.get(name) === true));
				persistExpand();
				forceRender();
			}, []);
			const setAllServers = react.useCallback(function (value) {
				const list = data ? data.servers : [];
				for (let i = 0; i < list.length; i++) serverExpanded.set(list[i].serverName, value);
				persistExpand();
				forceRender();
			}, [data]);
			const toggleFav = react.useCallback(function (key) {
				if (favorites.has(key)) favorites.delete(key); else favorites.add(key);
				persistFavorites();
				forceRender();
			}, []);
			const changeSort = react.useCallback(function (mode) {
				sortMode = mode;
				setSortLocal(mode);
				writeStore(SORT_KEY, mode);
				forceRender();
			}, []);
			const toggleSessionMode = react.useCallback(function () {
				setSessionMode(function (prev) {
					const next = !prev;
					load({ silent: false, sid: next ? currentSessionId : "" });
					return next;
				});
			}, [currentSessionId, load]);
			const copyTool = react.useCallback(function (text) {
				copyText(text);
			}, []);
			const doExport = react.useCallback(function (fmt) {
				if (!data) return;
				const stamp = new Date().toISOString().slice(0, 10);
				if (fmt === "json") {
					downloadFile("mcp-view-" + stamp + ".json", JSON.stringify(data, null, 2), "application/json");
				} else {
					const lines = ["# MCP inventory - " + stamp, "serving: " + (data.serving ? data.serving.view : "global"), "total MCP tools: " + data.totalMcpTools, ""];
					const servers = data.servers || [];
					for (let s = 0; s < servers.length; s++) {
						const server = servers[s];
						lines.push("## " + server.serverName + "  (" + server.transport + ")");
						if (server.endpoint) lines.push("endpoint: " + server.endpoint);
						if (server.lastUsedAt) lines.push("last used: " + server.lastUsedAt);
						const tools = server.tools || [];
						for (let t = 0; t < tools.length; t++) {
							const tool = tools[t];
							lines.push("- `" + tool.name + "`" + (tool.uses > 0 ? " (used " + tool.uses + "x)" : ""));
						}
						lines.push("");
					}
					downloadFile("mcp-view-" + stamp + ".md", lines.join("\n"), "text/markdown");
				}
			}, [data]);

			const needle = query.trim().toLowerCase();
			let servers = sortServers(data ? data.servers : [], sortLocal, favorites);
			if (needle !== "") {
				servers = servers.filter(function (s) {
					const kept = (s.tools || []).filter(function (t) { return matchesQuery(t, s.serverName, needle); });
					if (kept.length === 0) return false;
					s.tools = kept;
					return true;
				});
			}
			const unknownTools = ((data && data.unknownTools) || []).filter(function (t) { return matchesQuery(t, "", needle); });
			const otherNames = ((data && data.otherToolNames) || []).filter(function (n) { return needle === "" || n.toLowerCase().indexOf(needle) !== -1; });
			const anyServerOpen = servers.some(function (s) { return serverExpanded.get(s.serverName) === true; });

			// header
			const header = react.createElement("div", { className: "dmv-panelHeader" },
				react.createElement("h2", { className: "dmv-panelTitle" },
					react.createElement(ToolsIcon, null),
					"MCP Tools",
					typeof data === "object" && data !== null && data.totalMcpTools > 0
						? react.createElement("span", { className: "dmv-countBadge" }, String(data.totalMcpTools))
						: null),
				react.createElement("button", { type: "button", className: "dmv-iconButton", "data-label": true, title: anyServerOpen ? "Collapse all" : "Expand all", onClick: function () { setAllServers(!anyServerOpen); } },
					anyServerOpen ? "−" : "+"),
				react.createElement("button", { type: "button", className: "dmv-iconButton", "data-label": true, title: "Export Markdown", onClick: function () { doExport("md"); } }, "MD"),
				react.createElement("button", { type: "button", className: "dmv-iconButton", "data-label": true, title: "Export JSON", onClick: function () { doExport("json"); } }, "JSON"),
				react.createElement("button", { type: "button", className: "dmv-iconButton", title: "Run health check", disabled: loading, onClick: function () { load({ silent: false, health: true }); } },
					loading ? react.createElement(ProbeIcon, null) : react.createElement(RefreshIcon, null)),
				react.createElement("button", { type: "button", className: "dmv-iconButton", title: "Close", onClick: function () { setOpen(false); } },
					react.createElement(CloseIcon, null)));

			// summary
			const summaryParts = [];
			summaryParts.push((data ? data.servers.length : 0) + " servers");
			summaryParts.push((data ? data.totalMcpTools : 0) + " MCP");
			if (data && data.otherToolCount > 0) summaryParts.push(data.otherToolCount + " other");
			summaryParts.push(data && data.serving && data.serving.view === "session"
				? "session: " + (data.serving.agentPreset || "?")
				: "global");
			if (data && data.usage && data.usage.capped) summaryParts.push("scan capped");
			const summary = react.createElement("div", { className: "dmv-summary" },
				summaryParts.map(function (p, i) { return react.createElement("span", { key: i }, p); }));

			// tabs
			const tabs = react.createElement("div", { className: "dmv-tabs" },
				react.createElement("button", { type: "button", className: "dmv-tab", "data-active": tab === "servers" || undefined, onClick: function () { setTab("servers"); } }, "Servers"),
				react.createElement("button", { type: "button", className: "dmv-tab", "data-active": tab === "stats" || undefined, onClick: function () { setTab("stats"); } }, "Usage"));

			let body;
			if (error === "plugin-disabled") {
				body = react.createElement("div", { className: "dmv-disabled" }, "This plugin is disabled (enabled: false in cordis.patch.yml).");
			} else if (error !== null) {
				body = react.createElement("div", { className: "dmv-error" }, "Failed to load MCP inventory: " + error);
			} else if (data === null && loading) {
				body = react.createElement("div", { className: "dmv-loading" }, "Loading…");
			} else if (tab === "stats") {
				body = react.createElement(StatsView, { usage: data.usage });
			} else { try {
				const toolbar = react.createElement("div", { className: "dmv-toolbar" },
					react.createElement("input", { type: "search", className: "dmv-search", placeholder: "Filter tools, servers, params…", value: query, spellCheck: false, onChange: function (e) { setQuery(e.target.value); } }),
					react.createElement("select", { className: "dmv-select", value: sortLocal, title: "Sort servers", onChange: function (e) { changeSort(e.target.value); } },
						react.createElement("option", { value: "name" }, "name"),
						react.createElement("option", { value: "tools" }, "tools"),
						react.createElement("option", { value: "used" }, "used"),
						react.createElement("option", { value: "fav" }, "fav")),
					react.createElement("button", { type: "button", className: "dmv-iconButton", "data-label": true, "data-active": sessionMode || undefined, title: "Show only the tools the current session's agent really sees", onClick: toggleSessionMode },
						sessionMode ? "session" : "global"));

				const serverNodes = servers.map(function (server) {
					const openState = serverExpanded.get(server.serverName) === true;
					const serverUsed = formatLastUsed(server.lastUsedAt);
					const badges = [];
					badges.push(react.createElement("span", { key: "t", className: "dmv-badge", "data-kind": "transport" }, server.transport));
					if (server.disabled) {
						badges.push(react.createElement("span", { key: "st", className: "dmv-badge", "data-kind": "disabled" }, "disabled"));
					} else if (server.health === "down") {
						badges.push(react.createElement("span", { key: "st", className: "dmv-badge", "data-kind": "down" }, "down"));
					} else if (server.health === "up") {
						badges.push(react.createElement("span", { key: "st", className: "dmv-badge", "data-kind": "ok" }, "up"));
					} else if (server.toolCount > 0) {
						badges.push(react.createElement("span", { key: "st", className: "dmv-badge", "data-kind": "ok" }, String(server.toolCount)));
					} else {
						badges.push(react.createElement("span", { key: "st", className: "dmv-badge", "data-kind": "warn" }, "0"));
					}
					const head = react.createElement("button", { type: "button", className: "dmv-serverHead", "aria-expanded": openState, onClick: function () { toggleServer(server.serverName); } },
						react.createElement("span", { className: "dmv-star", "data-active": favorites.has(server.serverName) || undefined, title: favorites.has(server.serverName) ? "Remove from favorites" : "Favorite", onClick: function (e) { e.stopPropagation(); toggleFav(server.serverName); } },
							favorites.has(server.serverName) ? "★" : "☆"),
						react.createElement("span", { className: "dmv-serverName" }, (openState ? "▾ " : "▸ ") + server.serverName),
						serverUsed !== null ? react.createElement("span", { className: "dmv-toolUsed" }, "used " + serverUsed) : null,
						react.createElement("span", { className: "dmv-serverMeta" }, badges));

					const tools = (server.tools || []).map(function (tool) {
						const toolOpen = toolExpanded.get(tool.name) === true;
						const toolUsed = formatLastUsed(tool.lastUsedAt);
						const rightBits = [];
						if (toolUsed !== null) rightBits.push(toolUsed);
						if (tool.uses > 0) rightBits.push(tool.uses + "x");
						const details = toolOpen
							? react.createElement("div", { className: "dmv-toolDetails" },
								(typeof tool.description === "string" && tool.description !== "")
									? react.createElement("p", { className: "dmv-toolDesc" }, tool.description)
									: null,
								react.createElement("div", { className: "dmv-toolFull" }, tool.name),
								react.createElement("div", { className: "dmv-schema" },
									react.createElement("pre", null, JSON.stringify(tool.parameters, null, 2))))
							: null;
						return react.createElement("div", { key: tool.name, className: "dmv-tool" },
							react.createElement("div", { className: "dmv-toolHead", onClick: function () { toggleTool(tool.name); } },
								react.createElement("button", { type: "button", tabIndex: -1, className: "dmv-star", "data-active": favorites.has(tool.name) || undefined, title: favorites.has(tool.name) ? "Unfavorite" : "Favorite", onClick: function (e) { e.stopPropagation(); toggleFav(tool.name); } },
									favorites.has(tool.name) ? "★" : "☆"),
								react.createElement("span", { className: "dmv-toolName" }, (toolOpen ? "▾ " : "▸ ") + tool.rawName),
								react.createElement("span", { className: "dmv-toolUsed" }, rightBits.filter(Boolean).join(" · ")),
								react.createElement("button", { type: "button", tabIndex: -1, className: "dmv-copy", title: "Copy public name", onClick: function (e) { e.stopPropagation(); copyTool(tool.name); } },
									react.createElement(CopyIcon, null))),
							details);
					});

					return react.createElement("div", { key: server.serverName, className: "dmv-server" },
						head,
						openState
							? react.createElement("div", { className: "dmv-serverBody" },
								(typeof server.endpoint === "string" && server.endpoint !== "")
									? react.createElement("div", { className: "dmv-endpoint" }, server.endpoint)
									: null,
								tools.length > 0 ? tools : react.createElement("div", { className: "dmv-empty" }, "no matching tools"))
							: null);
				});

				let unknownNode = null;
				if (unknownTools.length > 0) {
					unknownNode = react.createElement("div", { className: "dmv-server" },
						react.createElement("button", { type: "button", className: "dmv-serverHead", onClick: function () { toggleServer("__unknown__"); } },
							react.createElement("span", { className: "dmv-serverName" }, (serverExpanded.get("__unknown__") === true ? "▾ " : "▸ ") + "unmatched mcp__ tools"),
							react.createElement("span", { className: "dmv-serverMeta" }, react.createElement("span", { className: "dmv-badge", "data-kind": "warn" }, String(unknownTools.length)))),
						serverExpanded.get("__unknown__") === true
							? react.createElement("div", { className: "dmv-serverBody" },
								unknownTools.map(function (tool) {
									const toolOpen = toolExpanded.get(tool.name) === true;
									return react.createElement("div", { key: tool.name, className: "dmv-tool" },
										react.createElement("div", { className: "dmv-toolHead", onClick: function () { toggleTool(tool.name); } },
											react.createElement("span", { className: "dmv-toolName" }, (toolOpen ? "▾ " : "▸ ") + tool.rawName),
											react.createElement("button", { type: "button", tabIndex: -1, className: "dmv-copy", title: "Copy", onClick: function (e) { e.stopPropagation(); copyTool(tool.name); } },
												react.createElement(CopyIcon, null))),
										toolOpen
											? react.createElement("div", { className: "dmv-toolDetails" },
												react.createElement("div", { className: "dmv-toolFull" }, tool.name),
												react.createElement("div", { className: "dmv-schema" }, react.createElement("pre", null, JSON.stringify(tool.parameters, null, 2))))
											: null);
								}))
							: null);
				}

				let otherNode = null;
				if (otherNames.length > 0) {
					otherNode = react.createElement("div", { className: "dmv-other" },
						react.createElement("button", { type: "button", className: "dmv-otherHead", onClick: function () { setShowOther(function (p) { return !p; }); } },
							(showOther ? "▾ " : "▸ ") + "Other tools (" + otherNames.length + ")"),
						showOther
							? react.createElement("div", { className: "dmv-otherChips" },
								otherNames.map(function (n) { return react.createElement("span", { key: n, className: "dmv-chip" }, n); }))
							: null);
				}

				const listNodes = [].concat(serverNodes, unknownNode ? [unknownNode] : [], otherNode ? [otherNode] : []);
				body = react.createElement("div", { className: "dmv-body" },
					toolbar,
					listNodes.length > 0 ? listNodes : react.createElement("div", { className: "dmv-empty" }, "No MCP tools registered"));
				} catch (renderErr) {
					body = react.createElement("div", { className: "dmv-error" }, "Panel render error: " + (renderErr && renderErr.message ? renderErr.message : String(renderErr)));
				}
			}

			return react.createElement("div", { className: "dmv-panel dmv-fadeIn" },
				header, summary, tabs, body);
		}

		function StatsView(props) {
			const usage = props.usage;
			if (!usage || usage.available !== true) {
				return react.createElement("div", { className: "dmv-empty" }, "Usage history unavailable");
			}
			const byDay = usage.byDay || [];
			let maxDay = 1;
			for (let i = 0; i < byDay.length; i++) maxDay = Math.max(maxDay, byDay[i].count);
			const top = usage.topTools || [];
			let maxTop = 1;
			for (let i = 0; i < top.length; i++) maxTop = Math.max(maxTop, top[i].count);
			const last = byDay.length > 0 ? byDay[byDay.length - 1].count : 0;

			const dayNodes = byDay.slice(-14).map(function (d) {
				const h = Math.max(4, Math.round((d.count / maxDay) * 44));
				return react.createElement("div", { key: d.day, className: "dmv-day", title: d.day + ": " + d.count },
					react.createElement("div", { className: "dmv-dayBar", style: { height: h + "px" } }),
					react.createElement("div", { className: "dmv-dayLbl" }, d.day.slice(5)));
			});

			const topNodes = top.map(function (t) {
				const w = Math.round((t.count / maxTop) * 100);
				return react.createElement("div", { key: t.name, className: "dmv-topRow" },
					react.createElement("div", { className: "dmv-topBar" }, react.createElement("div", { className: "dmv-topFill", style: { width: w + "%" } })),
					react.createElement("span", { className: "dmv-topName", title: t.name }, t.name),
					react.createElement("span", { className: "dmv-topCount" }, String(t.count)));
			});

			return react.createElement("div", { className: "dmv-stats" },
				react.createElement("div", { className: "dmv-statBig" },
					react.createElement("div", { className: "dmv-statCard" },
						react.createElement("div", { className: "dmv-statVal" }, String(usage.totalCalls || 0)),
						react.createElement("div", { className: "dmv-statLbl" }, "tool calls (session logs)")),
					react.createElement("div", { className: "dmv-statCard" },
						react.createElement("div", { className: "dmv-statVal" }, String(last)),
						react.createElement("div", { className: "dmv-statLbl" }, "calls today")),
					react.createElement("div", { className: "dmv-statCard" },
						react.createElement("div", { className: "dmv-statVal" }, String(top.length)),
						react.createElement("div", { className: "dmv-statLbl" }, "MCP tools used"))),
				dayNodes.length > 0 ? react.createElement("div", { className: "dmv-days" }, dayNodes) : null,
				topNodes.length > 0
					? react.createElement("div", null,
						react.createElement("div", { className: "dmv-topTitle" }, "Most used MCP tools"),
						topNodes)
					: null);
		}
		//#endregion

		//#region plugin
		const inject = ["slots"];

		function injectStyles() {
			if (typeof document === "undefined") return function () {};
			let el = document.querySelector('style[data-plugin="dsh-mcp-view"]');
			if (el === null) {
				el = document.createElement("style");
				el.setAttribute("data-plugin", "dsh-mcp-view");
				el.textContent = css;
				document.head.appendChild(el);
			}
			return function () { if (el !== null && el.parentNode !== null) el.parentNode.removeChild(el); };
		}

		function apply(ctx) {
			ctx.effect(injectStyles, "mcp-view: styles");
			ctx.inject(["slots"], function (scope) {
				const slots = scope.slots;
				slots.inject("sidebar.footer.action", function () {
					return slots.register({ name: "sidebar.footer.action", id: "mcp-view-toggle", order: 80 }, McpViewToggle);
				});
				slots.inject("shell.overlay", function () {
					return slots.register({ name: "shell.overlay", id: "mcp-view-panel", order: 90 }, McpViewPanel);
				});
			});
		}
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
