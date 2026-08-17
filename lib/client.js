window.__ModuleLoader__.load({
	id: "dsh-mcp-view",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		//#region styles
		const css = [
			/* Sidebar footer toggle */
			".dmv-toggle{width:100%;height:32px;color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-radius:8px;align-items:center;gap:8px;padding:0 12px;font-size:13px;display:flex}",
			".dmv-toggle:hover{background:var(--dsw-specific-sidebar-nav-item-hover);color:var(--dsw-alias-label-primary)}",
			".dmv-toggle[data-active]{background:var(--dsw-specific-sidebar-nav-item-active);color:var(--dsw-alias-label-primary);font-weight:600}",
			"[data-dsh-frame][data-sidebar-collapsed] .dmv-toggle{justify-content:center;width:100%;padding:0}",
			"[data-dsh-frame][data-sidebar-collapsed] .dmv-toggleLabel{display:none}",
			".dmv-toggleIcon{flex:none;justify-content:center;align-items:center;display:inline-flex}",
			/* Floating panel */
			".dmv-panel{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);flex-direction:column;gap:8px;padding:12px 14px 14px;display:flex;position:fixed;top:16px;right:16px;width:min(440px,calc(100vw - 32px));max-height:calc(100vh - 32px);z-index:30;border-radius:14px;overflow:hidden}",
			".dmv-panelHeader{flex:none;align-items:center;gap:8px;display:flex}",
			".dmv-panelTitle{color:var(--dsw-alias-label-primary);white-space:nowrap;flex:1;margin:0;font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px;min-width:0}",
			".dmv-countBadge{color:var(--dsw-alias-state-business-primary);border:1px solid var(--dsw-alias-state-business-primary);white-space:nowrap;border-radius:999px;padding:0 7px;font-size:11px;line-height:1.7;display:inline-block}",
			".dmv-iconButton{width:24px;height:24px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;font-size:12px;display:inline-flex;flex:none}",
			".dmv-iconButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
			".dmv-iconButton:disabled{opacity:.5;cursor:default}",
			".dmv-iconButton[data-label]{font-size:12px;font-weight:600;gap:4px;width:auto;padding:0 6px;color:var(--dsw-alias-label-secondary)}",
			".dmv-summary{flex:none;flex-wrap:wrap;gap:4px 10px;font-size:11.5px;color:var(--dsw-alias-label-tertiary);display:flex}",
			".dmv-search{color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;flex:none;padding:5px 10px;font-size:12.5px;width:100%;box-sizing:border-box}",
			".dmv-search:focus{border-color:var(--dsw-alias-state-business-primary)}",
			".dmv-search::placeholder{color:var(--dsw-alias-label-tertiary)}",
			".dmv-body{flex-direction:column;flex:1;min-height:0;gap:8px;display:flex;overflow-y:auto}",
			/* Server card */
			".dmv-server{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);border-radius:10px;flex:none;flex-direction:column;display:flex;overflow:hidden}",
			".dmv-serverHead{width:100%;text-align:left;cursor:pointer;background:0 0;border:none;flex:none;align-items:center;gap:8px;padding:7px 10px;font:inherit;color:var(--dsw-alias-label-primary);display:flex;flex-wrap:wrap}",
			".dmv-serverHead:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-serverName{color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}",
			".dmv-serverMeta{flex:none;align-items:center;gap:6px;display:flex;flex-wrap:wrap}",
			".dmv-badge{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:999px;padding:0 7px;font-size:10.5px;line-height:1.7;display:inline-block}",
			".dmv-badge[data-kind=transport]{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}",
			".dmv-badge[data-kind=ok]{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}",
			".dmv-badge[data-kind=disabled]{color:var(--dsw-alias-label-tertiary);border-color:var(--dsw-alias-border-l2)}",
			".dmv-badge[data-kind=warn]{color:var(--dsw-alias-state-warn-primary);border-color:var(--dsw-alias-state-warn-primary)}",
			".dmv-serverBody{border-top:1px solid var(--dsw-alias-separator-primary);flex-direction:column;display:flex}",
			".dmv-endpoint{color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;padding:4px 12px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:none}",
			/* Tool rows */
			".dmv-tool{border-top:1px solid var(--dsw-alias-separator-primary);flex-direction:column;display:flex}",
			".dmv-toolHead{width:100%;text-align:left;cursor:pointer;background:0 0;border:none;align-items:center;gap:8px;padding:5px 10px;font:inherit;display:flex;min-width:0}",
			".dmv-toolHead:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-toolName{color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}",
			".dmv-toolUsed{color:var(--dsw-alias-label-tertiary);font-size:10.5px;white-space:nowrap;flex:none;margin-left:auto;padding-left:8px}",
			".dmv-toolDetails{flex-direction:column;gap:6px;padding:0 10px 8px;display:flex;min-width:0}",
			".dmv-toolFull{color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;word-break:break-all}",
			".dmv-toolDesc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.45;margin:0;overflow-wrap:anywhere}",
			".dmv-schema{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:7px 9px;overflow:auto;max-height:220px}",
			".dmv-schema pre{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;color:var(--dsw-alias-label-primary);margin:0;white-space:pre-wrap;word-break:break-all}",
			".dmv-empty,.dmv-loading{text-align:center;color:var(--dsw-alias-label-tertiary);padding:22px 12px;font-size:12px}",
			".dmv-error{color:var(--dsw-alias-state-error-primary);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 12px;font-size:12px;line-height:1.5;overflow-wrap:anywhere}",
			/* Other tools section */
			".dmv-other{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);border-radius:10px;flex:none;flex-direction:column;display:flex;overflow:hidden}",
			".dmv-otherHead{width:100%;cursor:pointer;user-select:none;flex:none;align-items:center;gap:8px;padding:7px 10px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary);background:0 0;border:none;text-align:left;display:flex}",
			".dmv-otherHead:hover{background:var(--dsw-alias-interactive-bg-hover)}",
			".dmv-otherChips{flex:none;flex-wrap:wrap;gap:4px;padding:0 10px 9px;display:flex}",
			".dmv-chip{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:1px 6px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;white-space:nowrap}",
			".dmv-spinner{border:2px solid var(--dsw-alias-state-business-primary);vertical-align:-1px;border-top-color:#0000;border-radius:50%;flex:none;width:10px;height:10px;animation:.8s linear infinite dmvSpin;display:inline-block}",
			"@keyframes dmvSpin{to{transform:rotate(360deg)}}",
			".dmv-fadeIn{animation:.18s ease-out dmvFadeIn}",
			"@keyframes dmvFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}"
		].join("");
		//#endregion

		//#region module state
		/** Open-state store shared by the sidebar toggle and the overlay panel. */
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

		/** Server/tool expansion state, kept at module level so it survives panel close/reopen. */
		const serverExpanded = /* @__PURE__ */ new Map();
		const toolExpanded = /* @__PURE__ */ new Map();
		//#endregion

		//#region api
		async function fetchInventory() {
			const response = await fetch("/api/mcp-view/tools", {
				method: "GET",
				headers: { "accept": "application/json" }
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const data = await response.json();
			if (typeof data !== "object" || data === null || data.ok !== true) {
				throw new Error(data && typeof data.error === "string" ? data.error : "invalid inventory payload");
			}
			return data;
		}
		//#endregion

		//#region helpers
		/** Compact relative time from an ISO timestamp; null when absent. */
		function formatLastUsed(iso) {
			if (typeof iso !== "string" || iso === "") return null;
			const ms = Date.now() - Date.parse(iso);
			if (!Number.isFinite(ms)) return null;
			if (ms < 0 || ms < 60 * 1000) return "just now";
			const minutes = Math.floor(ms / 60000);
			if (minutes < 60) return `${minutes}m ago`;
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return `${hours}h ago`;
			const days = Math.floor(hours / 24);
			if (days < 30) return `${days}d ago`;
			const date = new Date(iso);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		}
		//#endregion

		//#region components
		/** Inline 16px "tool grid" icon (no external deps). */
		function ToolsIcon() {
			return react.createElement("svg", {
				width: 15,
				height: 15,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": true,
				style: { display: "block" }
			}, react.createElement("path", {
				d: "M2 3.5A1.5 1.5 0 0 1 3.5 2h2A1.5 1.5 0 0 1 7 3.5v2A1.5 1.5 0 0 1 5.5 7h-2A1.5 1.5 0 0 1 2 5.5v-2Zm7 0A1.5 1.5 0 0 1 10.5 2h2A1.5 1.5 0 0 1 14 3.5v2A1.5 1.5 0 0 1 12.5 7h-2A1.5 1.5 0 0 1 9 5.5v-2ZM2 10.5A1.5 1.5 0 0 1 3.5 9h2A1.5 1.5 0 0 1 7 10.5v2A1.5 1.5 0 0 1 5.5 14h-2A1.5 1.5 0 0 1 2 12.5v-2Zm7 0a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-2a1.5 1.5 0 0 1-1.5-1.5v-2Z",
				fill: "currentColor"
			}));
		}

		function RefreshIcon() {
			return react.createElement("svg", {
				width: 13,
				height: 13,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": true,
				style: { display: "block" }
			}, react.createElement("path", {
				d: "M13.65 8a5.65 5.65 0 1 1-1.65-4L13.5 2.5V7h-4.5l1.9-1.9A4 4 0 1 0 12 8h1.65Z",
				fill: "currentColor"
			}));
		}

		function CloseIcon() {
			return react.createElement("svg", {
				width: 13,
				height: 13,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": true,
				style: { display: "block" }
			}, react.createElement("path", {
				d: "M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5",
				stroke: "currentColor",
				"stroke-width": 1.6,
				"stroke-linecap": "round"
			}));
		}

		/** Sidebar footer toggle (list slot `sidebar.footer.action`). */
		function McpViewToggle(props) {
			const isOpen = react.useSyncExternalStore(openStore.subscribe, openStore.getSnapshot);
			const wide = props.wide === true;
			return react.createElement("button", {
				type: "button",
				className: "dmv-toggle",
				"data-active": isOpen || void 0,
				"aria-label": "MCP tools",
				"aria-pressed": isOpen,
				title: "MCP tools",
				onClick: () => setOpen(!open)
			}, react.createElement("span", { className: "dmv-toggleIcon" }, react.createElement(ToolsIcon, null)),
				wide ? react.createElement("span", { className: "dmv-toggleLabel" }, "MCP Tools") : null);
		}

		/** Floating MCP inventory panel (list slot `shell.overlay`). */
		function McpViewPanel() {
			const isOpen = react.useSyncExternalStore(openStore.subscribe, openStore.getSnapshot);
			if (!isOpen) return null;
			return react.createElement(McpViewPanelInner, null);
		}

		function matchesQuery(tool, serverName, query) {
			if (query === "") return true;
			const needle = query.toLowerCase();
			return tool.rawName.toLowerCase().includes(needle)
				|| tool.name.toLowerCase().includes(needle)
				|| (tool.description || "").toLowerCase().includes(needle)
				|| serverName.toLowerCase().includes(needle);
		}

		function McpViewPanelInner() {
			const [data, setData] = react.useState(null);
			const [error, setError] = react.useState(null);
			const [loading, setLoading] = react.useState(true);
			const [query, setQuery] = react.useState("");
			const [showOther, setShowOther] = react.useState(false);
			const [, forceRender] = react.useReducer((x) => x + 1, 0);

			const load = react.useCallback(async (silent) => {
				if (!silent) setLoading(true);
				try {
					const result = await fetchInventory();
					setData(result);
					setError(null);
				} catch (cause) {
					setError(cause && typeof cause.message === "string" ? cause.message : String(cause));
				} finally {
					setLoading(false);
				}
			}, []);

			react.useEffect(() => {
				load(false);
				const timer = setInterval(() => load(true), 10000);
				const onKeyDown = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				window.addEventListener("keydown", onKeyDown);
				return () => {
					clearInterval(timer);
					window.removeEventListener("keydown", onKeyDown);
				};
			}, [load]);

			const toggleServer = react.useCallback((serverName) => {
				serverExpanded.set(serverName, !(serverExpanded.get(serverName) === true));
				forceRender();
			}, []);
			const toggleTool = react.useCallback((toolName) => {
				toolExpanded.set(toolName, !(toolExpanded.get(toolName) === true));
				forceRender();
			}, []);
			const setAllServers = react.useCallback((value) => {
				for (const server of data?.servers ?? []) serverExpanded.set(server.serverName, value);
				forceRender();
			}, [data]);

			const trimmed = query.trim();
			const needle = trimmed.toLowerCase();
			const servers = (data?.servers ?? [])
				.map((server) => ({
					...server,
					tools: server.tools.filter((tool) => matchesQuery(tool, server.serverName, needle))
				}))
				.filter((server) => server.tools.length > 0 || needle === "");
			const unknownTools = (data?.unknownTools ?? [])
				.filter((tool) => matchesQuery(tool, "", needle));
			const otherNames = (data?.otherToolNames ?? [])
				.filter((toolName) => needle === "" || toolName.toLowerCase().includes(needle));

			const anyServerOpen = servers.some((server) => serverExpanded.get(server.serverName) === true);

			const header = react.createElement("div", { className: "dmv-panelHeader" },
				react.createElement("h2", { className: "dmv-panelTitle" },
					react.createElement(ToolsIcon, null),
					"MCP Tools",
					typeof data?.totalMcpTools === "number" && data.totalMcpTools > 0
						? react.createElement("span", { className: "dmv-countBadge" }, String(data.totalMcpTools))
						: null),
				react.createElement("button", {
					type: "button",
					className: "dmv-iconButton",
					"data-label": true,
					title: anyServerOpen ? "Collapse all" : "Expand all",
					onClick: () => setAllServers(!anyServerOpen)
				}, anyServerOpen ? "−" : "+"),
				react.createElement("button", {
					type: "button",
					className: "dmv-iconButton",
					title: "Refresh",
					"aria-label": "Refresh",
					onClick: () => load(false),
					disabled: loading
				}, loading ? react.createElement("span", { className: "dmv-spinner" }) : react.createElement(RefreshIcon, null)),
				react.createElement("button", {
					type: "button",
					className: "dmv-iconButton",
					title: "Close",
					"aria-label": "Close",
					onClick: () => setOpen(false)
				}, react.createElement(CloseIcon, null)));

			const summary = react.createElement("div", { className: "dmv-summary" },
				react.createElement("span", null, `${data?.servers?.length ?? 0} servers`),
				react.createElement("span", null, `${data?.totalMcpTools ?? 0} MCP tools`),
				typeof data?.otherToolCount === "number" && data.otherToolCount > 0
					? react.createElement("span", null, `${data.otherToolCount} other`)
					: null,
				data?.usage?.available === true
					? react.createElement("span", null, "usage from session logs")
					: null);

			const search = react.createElement("input", {
				type: "search",
				className: "dmv-search",
				placeholder: "Filter tools, servers…",
				value: query,
				spellCheck: false,
				onChange: (event) => setQuery(event.target.value)
			});

			let body;
			if (error !== null) {
				body = react.createElement("div", { className: "dmv-error" }, `Failed to load MCP inventory: ${error}`);
			} else if (data === null && loading) {
				body = react.createElement("div", { className: "dmv-loading" }, "Loading…");
			} else {
				const serverNodes = servers.map((server) => {
					const openState = serverExpanded.get(server.serverName) === true;
					const serverUsed = formatLastUsed(server.lastUsedAt);
					const badges = [
						react.createElement("span", { key: "transport", className: "dmv-badge", "data-kind": "transport" }, server.transport),
						server.disabled
							? react.createElement("span", { key: "state", className: "dmv-badge", "data-kind": "disabled" }, "disabled")
							: server.toolCount > 0
								? react.createElement("span", { key: "state", className: "dmv-badge", "data-kind": "ok" }, `${server.toolCount}`)
								: react.createElement("span", { key: "state", className: "dmv-badge", "data-kind": "warn" }, "0")
					];
					const head = react.createElement("button", {
						type: "button",
						className: "dmv-serverHead",
						"aria-expanded": openState,
						onClick: () => toggleServer(server.serverName)
					},
						react.createElement("span", { className: "dmv-serverName" }, `${openState ? "▾" : "▸"} ${server.serverName}`),
						serverUsed !== null ? react.createElement("span", { className: "dmv-toolUsed" }, `used ${serverUsed}`) : null,
						react.createElement("span", { className: "dmv-serverMeta" }, badges));

					const tools = server.tools.map((tool) => {
						const toolOpen = toolExpanded.get(tool.name) === true;
						const toolUsed = formatLastUsed(tool.lastUsedAt);
						const details = toolOpen
							? react.createElement("div", { className: "dmv-toolDetails" },
								typeof tool.description === "string" && tool.description !== ""
									? react.createElement("p", { className: "dmv-toolDesc" }, tool.description)
									: null,
								react.createElement("div", { className: "dmv-toolFull" }, tool.name),
								react.createElement("div", { className: "dmv-schema" },
									react.createElement("pre", null, JSON.stringify(tool.parameters, null, 2))))
							: null;
						return react.createElement("div", { key: tool.name, className: "dmv-tool" },
							react.createElement("button", {
								type: "button",
								className: "dmv-toolHead",
								"aria-expanded": toolOpen,
								onClick: () => toggleTool(tool.name)
							},
								react.createElement("span", { className: "dmv-toolName" }, `${toolOpen ? "▾" : "▸"} ${tool.rawName}`),
								toolUsed !== null ? react.createElement("span", { className: "dmv-toolUsed" }, toolUsed) : null),
							details);
					});

					return react.createElement("div", { key: server.serverName, className: "dmv-server" },
						head,
						openState
							? react.createElement("div", { className: "dmv-serverBody" },
								typeof server.endpoint === "string" && server.endpoint !== ""
									? react.createElement("div", { className: "dmv-endpoint" }, server.endpoint)
									: null,
								tools.length > 0 ? tools : react.createElement("div", { className: "dmv-empty" }, "no matching tools"))
							: null);
				});

				const unknownNode = unknownTools.length > 0
					? react.createElement("div", { className: "dmv-server" },
						react.createElement("button", {
							type: "button",
							className: "dmv-serverHead",
							onClick: () => toggleServer("__unknown__")
						}, react.createElement("span", { className: "dmv-serverName" }, `${serverExpanded.get("__unknown__") === true ? "▾" : "▸"} unmatched mcp__ tools`),
							react.createElement("span", { className: "dmv-serverMeta" }, react.createElement("span", { className: "dmv-badge", "data-kind": "warn" }, String(unknownTools.length)))),
						serverExpanded.get("__unknown__") === true
							? react.createElement("div", { className: "dmv-serverBody" },
								unknownTools.map((tool) => {
									const toolOpen = toolExpanded.get(tool.name) === true;
									return react.createElement("div", { key: tool.name, className: "dmv-tool" },
										react.createElement("button", {
											type: "button",
											className: "dmv-toolHead",
											onClick: () => toggleTool(tool.name)
										}, react.createElement("span", { className: "dmv-toolName" }, `${toolOpen ? "▾" : "▸"} ${tool.rawName}`)),
										toolOpen
											? react.createElement("div", { className: "dmv-toolDetails" },
												react.createElement("div", { className: "dmv-toolFull" }, tool.name),
												react.createElement("div", { className: "dmv-schema" },
													react.createElement("pre", null, JSON.stringify(tool.parameters, null, 2))))
											: null);
								}))
							: null)
					: null;

				const otherNode = otherNames.length > 0
					? react.createElement("div", { className: "dmv-other" },
						react.createElement("button", {
							type: "button",
							className: "dmv-otherHead",
							onClick: () => setShowOther((prev) => !prev)
						}, showOther ? "▾" : "▸", `Other tools (${otherNames.length})`),
						showOther
							? react.createElement("div", { className: "dmv-otherChips" },
								otherNames.map((toolName) => react.createElement("span", { key: toolName, className: "dmv-chip" }, toolName)))
							: null)
					: null;

				const nodes = [
					...serverNodes,
					unknownNode,
					otherNode
				];
				body = nodes.length > 0
					? nodes
					: react.createElement("div", { className: "dmv-empty" }, "No MCP tools registered");
			}

			return react.createElement("div", { className: "dmv-panel dmv-fadeIn" },
				header,
				summary,
				search,
				react.createElement("div", { className: "dmv-body" }, body));
		}
		//#endregion

		//#region plugin
		/** Services required by the browser half. */
		const inject = ["slots"];

		/** Inject the panel stylesheet once; returns a disposer. */
		function injectStyles() {
			if (typeof document === "undefined") return () => {};
			let el = document.querySelector('style[data-plugin="dsh-mcp-view"]');
			if (el === null) {
				el = document.createElement("style");
				el.setAttribute("data-plugin", "dsh-mcp-view");
				el.textContent = css;
				document.head.appendChild(el);
			}
			return () => {
				if (el !== null && el.parentNode !== null) el.parentNode.removeChild(el);
			};
		}

		/** Apply the browser half: stylesheet, sidebar toggle, overlay panel. */
		function apply(ctx) {
			ctx.effect(injectStyles, "mcp-view: styles");
			ctx.inject(["slots"], (scope) => {
				const slots = scope.slots;
				slots.inject("sidebar.footer.action", () => slots.register({
					name: "sidebar.footer.action",
					id: "mcp-view-toggle",
					order: 80
				}, McpViewToggle));
				slots.inject("shell.overlay", () => slots.register({
					name: "shell.overlay",
					id: "mcp-view-panel",
					order: 90
				}, McpViewPanel));
			});
		}
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
