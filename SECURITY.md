# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x | ✅ |

## Reporting a vulnerability

This plugin is **local-only** by design: it reads the tool registry and session logs of your own
DSH process and renders them in your browser. It performs no network calls of its own and ships
no telemetry.

If you still find a security issue (for example: the `/api/mcp-view/tools` route leaking data,
or the client bundle exposing unintended surfaces), please **do not open a public issue**.
Report it privately by creating a security advisory on GitHub
(`Security → Report a vulnerability`) or by opening a draft issue marked `security`.

Please include:

- DSH version (`dsh --version` or package version) and profile name;
- steps to reproduce;
- expected vs. actual behavior.

## Security model summary

- The route is served by the same-origin webserver; it is read-only and never invokes MCP tools.
- Only transport type and endpoint URL of MCP servers are exposed — never credentials.
- Last-used data comes from local session logs; nothing leaves the machine.
