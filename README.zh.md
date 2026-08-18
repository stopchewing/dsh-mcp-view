<div align="center">

<img src="docs/logo.svg" width="96" alt="dsh-mcp-view logo" />

# 🔌 dsh-mcp-view

### 在 DeepSeek Harness Web GUI 中，一眼看清会话里所有的 MCP 服务器与工具。

**中文** · [English](README.md) · [Русский](README.ru.md)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/dsh-mcp-view)](https://www.npmjs.com/package/dsh-mcp-view)
[![Platform](https://img.shields.io/badge/platform-web-7c3aed)](#)
[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.1.0--rc.6-0d1117)](#)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-339933)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contributing)
[![Awesome DSH Plugin](https://beancookie.github.io/awesome-dsh-plugin/badge.svg)](https://github.com/beancookie/awesome-dsh-plugin)

*一个悬浮的 MCP 清单面板：服务器分组展示、工具 JSON Schema、实时搜索，以及**从真实会话日志中提取的最近使用时间**——绝不凭空捏造。*

</div>

---

![MCP Tools 面板 — 浅色主题](docs/screenshots/panel-light.png)

DSH 会运行你的 MCP 服务器（文档、构建、分析——任意你配置的服务器），并把它们的工具注册进共享的 `mcp__*` 命名空间——但**一直没有一个 UI 可以查看它们**。这个插件提供一个一键面板，回答三个问题：*配了哪些 MCP 服务器、注册了哪些工具、每个工具的参数模式长什么样、各自最后一次被调用是什么时候。*

## ✨ 功能特性

| | |
|---|---|
| 🖥 **一个面板看全部服务器** | 配置里的每个 `dsh-mcp-client` 实例，含传输方式（`stdio` / `streamable-http`）与端点（命令或 URL），以及连接状态（运行中 / 已禁用 / 无工具）。 |
| 🗂 **默认折叠** | 服务器折叠成一行紧凑条目，点击即可展开工具列表；面板头部的 `+` / `−` 一键全部展开或收起。 |
| 🧬 **完整 JSON Schema** | 每个工具展示原始名称、描述和模型实际看到的 `inputSchema`，可展开、美化显示。 |
| 🕘 **最近使用时间与用量** | 从 `~/.dsh/sessions/**/session.jsonl[.zstd]` 中的真实 `tool/call` 事件提取——工具级与服务器级都有，另有用量页：总调用数、每日调用图、最常用工具。 |
| 🔍 **实时搜索** | 按工具名、原始名、描述、服务器**或参数名**过滤；每 10 秒自动刷新，另有手动刷新按钮。 |
| 🎯 **按会话视图** | 可切换到只显示当前会话 agent 真正可见的工具（按会话的 agent scope 解析）。 |
| ❤️ **收藏与排序** | 收藏服务器/工具；按名称/工具数/最近使用/收藏排序；状态保存在 `localStorage`。 |
| ⚕️ **健康检查** | 一键探测 streamable-http 端点（HEAD）→ 每个服务器的 up/down 徽标。 |
| 📤 **导出** | 将完整清单下载为 JSON 或 Markdown。 |
| 🧩 **非 MCP 工具上下文** | 可折叠展示其它（内置 / 插件）全局注册的工具，一眼看清完整的工具版图。 |

## 📸 截图

| | 浅色 | 深色 |
|---|---|---|
| **Servers** | ![servers light](docs/screenshots/panel-light.png) | ![servers dark](docs/screenshots/panel-dark.png) |
| **Usage** | ![usage light](docs/screenshots/panel-usage-light.png) | ![usage dark](docs/screenshots/panel-usage-dark.png) |

## ⚡ 快速开始

```sh
git clone https://github.com/stopchewing/dsh-mcp-view.git
cd dsh-mcp-view
dsh plugin --profile web add link:$(pwd)
```

然后**重启 `dsh web`** 并刷新页面——侧边栏底部会出现 **「MCP Tools」** 按钮。

## 📦 安装

### 从 npm

```sh
dsh plugin --profile web add dsh-mcp-view
```

### 从仓库

```sh
git clone https://github.com/stopchewing/dsh-mcp-view.git
dsh plugin --profile web add link:/absolute/path/to/dsh-mcp-view
```

### 手动安装（不使用 CLI）

1. 把本包放进 profile 的 `node_modules`（复制，或在 Windows 上创建 junction）：

   ```powershell
   New-Item -ItemType Junction -Path "$env:USERPROFILE\.dsh\profiles\web\node_modules\dsh-mcp-view" -Target "<abs-path>\dsh-mcp-view"
   ```

2. 在 `~/.dsh/profiles/web/cordis.patch.yml` 末尾追加：

   ```yaml
   - insert:
       - id: mcp-view
         name: 'dsh-mcp-view'
   ```

3. 重启 `dsh web`，然后按 **F5** 刷新页面。

> profile 的补丁文件是被监听的，host 半区会热生效；client 包在 `/plugins/dsh-mcp-view/client.js` 每次实时读取——浏览器只需刷新一次页面。

## ⚙️ 配置

插件在 `cordis.patch.yml` 的对应行上接受可选的 `config` 对象：

```yaml
- insert:
    - id: mcp-view
      name: 'dsh-mcp-view'
      config:
        enabled: true          # 总开关（默认 true）
        announceToAgent: true  # 是否在模型提示带中宣告插件（默认 true）
```

## 🎛 使用方法

1. 点击侧边栏底部的 **「MCP Tools」**（侧边栏收起时仅显示图标）。
2. 浏览服务器——每行显示传输方式、工具数量与最近使用时间；点击展开工具。
3. 点击工具查看描述、完整公开名与 JSON 输入模式。
4. 在过滤框中输入关键字缩小范围；`Esc` 或 ✕ 关闭面板。

## 🗺 架构

![架构图](docs/architecture.svg)

| 半区 | 文件 | 职责 |
|---|---|---|
| **Host** | `lib/index.js` | `GET /api/mcp-view/tools` 返回 JSON 清单：来自 Cordis loader 的 MCP 实例、来自 `ctx.tools` 的实时工具模式，以及从会话日志扫描的最近使用历史（按文件 mtime/size 增量扫描，15 秒 TTL）。 |
| **Browser** | `lib/client.js` | 客户端插件包：在 `sidebar.footer.action` 插槽注册侧边栏开关，在 `shell.overlay` 插槽注册悬浮面板。 |

不改动 dsh 源码——它是可热插拔的 profile 插件，与 `@linxin666` web-ui 家族同一机制。

## 🔒 安全与隐私

- **完全本地化。** 一切都在你的 dsh host 进程与浏览器中运行；唯一的网络流量是发给你**已经配置过**的 MCP 服务器。
- **无遥测、无统计、无外部请求**——面板数据不会离开你的机器。
- `/api/mcp-view/tools` 路由由同源 webserver 提供，**只读**——只能列出工具，不能调用工具。
- 最近使用时间来自你本机的会话日志，不会发送到任何地方。
- MCP 服务器的密码 / 凭据**绝不**暴露——只显示传输类型与端点 URL。

## 🧩 兼容性

- `@deepseek-ai/dsh` `0.1.0-rc.6`（web profile）——与生态内固定版本的 SDK 保持一致节奏。
- Node `^22.19.0 || >=24.0.0`（dsh 运行时的要求——需要 zstd 会话解码）。
- 浏览器：Chrome / Edge / Firefox（React 18，客户端包无需构建步骤）。

## ❓ 常见问题

**MCP 服务器是按会话还是全局共享？**
全局共享。MCP 服务器在 profile 层（`cordis.patch.yml`）配置一次，每个进程连接一次，工具注册进进程级 `ToolRuntime`——所有会话与工作区看到同一集合。若某会话的 agent 预设限制了工具，可能对模型隐藏部分工具，但注册表始终是全局的。

**「used …」时间从哪来？**
来自持久化的会话日志（`~/.dsh/sessions`）中的 `tool/call` 事件，即该工具最后一次真实调用的时间戳。如果日志里没有该工具的调用记录，则不显示。

**为什么「Other tools」里只有部分工具？**
面板展示的是*全局*注册表。按会话注册的 agent 工具（如 `pwsh`、`read`）位于会话的 scope 层，不属于全局视图。

**面板会影响性能吗？**
不会。会话扫描是增量的（只重读有变化的文件），并限流为每 15 秒最多一次；浏览器自动刷新为 10 秒。

## 🛠 开发

```
dsh-mcp-view/
├─ src/
│  └─ index.ts      # host 插件（TypeScript）：路由 + 清单 + 会话扫描
├─ lib/
│  ├─ index.js      # 编译后的 host 产物（npm run build）
│  └─ client.js     # 浏览器包（window.__ModuleLoader__）
├─ test/            # node --test 单元测试
├─ cordis.patch.yml # profile 名单插入
├─ docs/            # 预览数据、模板、截图、架构图
└─ package.json     # dsh.bundle.patch + dsh.client 清单
```

host 插件用 TypeScript 编写（`src/index.ts`）；执行 `npm run build` 编译
（输出 `lib/index.js` 与类型）。浏览器包（`lib/client.js`）沿用 DSH 的
module-loader 格式，以经过检查的 JS 包维护。本地运行 `npm test`（Node 内置
测试运行器）与 `npm run typecheck`。

重新生成 README 预览截图（需要 Chrome）：

```sh
# 1. 将实时清单 + 会话扫描合并进 docs/preview.html
#    （node docs/build-preview.mjs 由 preview-data.json + preview.template.html 生成）
# 2. 用 headless Chrome 截图（?view=servers 服务页 / ?view=usage 用量页）：
chrome --headless=new --screenshot=docs/screenshots/panel-light.png --window-size=1120,760 "file:///abs/path/docs/preview.html?view=servers&theme=light"
chrome --headless=new --screenshot=docs/screenshots/panel-usage-light.png --window-size=1120,760 "file:///abs/path/docs/preview.html?view=usage&theme=light"
#    深色同理，参数改为 theme=dark
```

## 🤝 参与贡献

发现 bug，或想要新视图（按会话可见性、工具统计、深色模式打磨）？欢迎提交 [issue](https://github.com/stopchewing/dsh-mcp-view/issues) 或 PR。

**如果这个面板让你的 MCP 工具链变得可见，请给仓库点个 ⭐**——这会帮助更多 DSH 用户找到它（也能激励维护者继续更新）。发布首个版本后，可以把它提交到 [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin) 和 [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness)，触达整个生态。

## 📜 许可证

[MIT](LICENSE) © 2026 stopchewing

---

<div align="center"><sub>非 DeepSeek 官方产品——面向 <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> 的社区插件。</sub></div>
