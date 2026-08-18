# Changelog

All notable changes to **dsh-mcp-view** are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

- Submit to [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) and
  [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness).

## [0.1.0] - 2026-08-17

### Added

- **MCP inventory panel** in the DSH Web GUI — sidebar footer toggle (`sidebar.footer.action` slot)
  + floating panel (`shell.overlay` slot).
- **Server grouping**: every `dsh-mcp-client` instance from the Cordis loader with transport
  (`stdio` / `streamable-http`), endpoint, and connection state.
- **Collapsed-by-default server cards** with expand/collapse-all control.
- **Per-tool detail view**: raw name, public `mcp__<server>__<tool>` name, description, and full
  JSON input schema.
- **Last-used times** per tool and per server, derived from real `tool/call` events in the
  persisted session logs (`~/.dsh/sessions/**/session.jsonl[.zstd]`); incremental scan memoized
  by file (mtime, size) with a 15 s re-scan TTL.
- **Live search** (tool name / description / server) and **auto-refresh** (10 s) + manual refresh.
- **Other-tools section** listing globally-registered non-MCP tools.
- **Model guidance**: the plugin announces itself in the tool-guidance band (`systemPrompt.section`).
- Repo polish: screenshots (light/dark), architecture diagram, MIT license, changelog.

## [0.2.0] - 2026-08-17

### Added

- **Per-session view**: toggle that shows only the tools the current session's
  agent really sees (via `ctx.agents` → agent scope → `tools.schemas(scope)`).
- **Health checks**: optional `?health=1` probes streamable-http endpoints
  (HEAD, 3 s timeout) and shows an up/down badge per server.
- **Usage tab**: total tool calls, calls-per-day chart (last 14 days) and the
  most-used MCP tools — from session logs.
- **Search by parameter names**: the filter now also matches `parameters` keys.
- **Sorting** (name / tools / used / favorites) and **favorites (stars)**,
  persisted to `localStorage`, along with expand/collapse state.
- **Copy public tool name** in one click; **export** inventory to JSON or
  Markdown.
- **Plugin config** via `cordis.patch.yml` (`enabled`, `announceToAgent`).
- **Tests** (Node's `node --test`, zero deps) and **TS check** (`tsc --checkJs`
  on the host module); GitHub Actions CI (test + auto-publish on tag).
  Scan now bounded by `MAX_SCAN_FILES` / `MAX_SCAN_BYTES`.

## [0.1.1] - 2026-08-17

### Changed

- **Privacy**: preview screenshots now use a fictional MCP inventory, and the
  README text no longer references any real server names or workspaces — the
  repository contains no trace of a specific user's MCP setup.
- Author metadata uses the public GitHub handle.

[0.2.0]: https://github.com/stopchewing/dsh-mcp-view/releases/tag/v0.2.0
[0.1.1]: https://github.com/stopchewing/dsh-mcp-view/releases/tag/v0.1.1
[0.1.0]: https://github.com/stopchewing/dsh-mcp-view/releases/tag/v0.1.0
