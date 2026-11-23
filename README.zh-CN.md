# paseo-zh-titles

让 Paseo 自动生成的工作区和代理标题使用简体中文。[English](README.md)

非官方社区插件，与 Paseo 无关联，也未获其认可。

创建工作区或代理时，本插件会向 Paseo 内部的标题生成请求追加一条简体中文指令。生成的标题使用中文，同时保留文件名、路径、命令、编号和其他专有内容原样；git 分支仍使用 ASCII 小写 slug。

## 为什么需要它

Paseo 使用一次小型单次调用生成标题，提示词只有英文（`packages/server/src/server/worktree-branch-name-generator.ts` 中的 `Generate a title and a git branch name ...`，Title style 还包含示例 `"Refactor PR #2638 Playwright specs"`），没有任何语言指令。Claude 模型会严格遵循这段提示词并输出英文；以中文为中心的模型（例如 DeepSeek）会跟随中文种子并输出中文。标题从来不是 Claude Code 自己的 `ai-title`；Paseo 只会在导入历史时读取它。

## 工作方式

1. 创建工作区或代理。
2. Paseo 启动一个标题为 `Branch name generator` 的内部代理。
3. 本插件的 `agent.open.before` hook 匹配这个标题，并追加一条系统提示词指令。
4. 生成器写出中文 `title` 和 ASCII `branch` slug。

## 环境要求

需要 Paseo >= 0.14（插件 hook）。本插件已在 Windows 上由桌面管理的 daemon、Paseo 0.17.3 中测试。它适用于所有服务商，因为 hook 作用于标题生成器代理，而不是你的代理。

## 安装

克隆本仓库，然后运行：

```text
paseo plugin install /path/to/paseo-zh-titles     # Windows: F:\path\to\paseo-zh-titles
paseo plugin enable paseo-zh-titles
```

目录安装会直接读取该 checkout。移动或删除目录会导致插件失效。

## 验证

运行 `paseo plugin ls` 和 `paseo plugin logs paseo-zh-titles`，然后用中文首条提示创建工作区并检查侧边栏标题。预期日志行是：

```text
[zh-titles] injected title instruction provider=... agent=...
```

## 已验证行为

使用相同的 Paseo 元数据提示词、相同的中文种子和模型 `claude-haiku-5-5`：

- 不加指令：`{"title": "Count files in current directory", "branch": "count-current-directory-files"}`
- 加入指令：`{"title": "统计当前目录文件数量", "branch": "count-current-directory-files"}`

## 限制

- hook 依赖内部标题字符串 `Branch name generator`。如果 Paseo 重命名它，请修改 `TARGET_TITLE`；表现是标题会静默恢复为英文。
- 只影响安装后生成的标题。
- 本插件只处理标题。其他元数据类型请使用仓库级 `paseo.json` 键：`metadataGeneration.title.instructions`、`metadataGeneration.branchName.instructions`、`metadataGeneration.commitMessage.instructions`、`metadataGeneration.pullRequest.instructions`。每个条目都会替换 Paseo 对应产物的默认风格；该文件必须提交到 base branch。
- 该指令是建议，不是强制覆盖。

## 替代方案

- 仓库级 `paseo.json` 的 `metadataGeneration.title.instructions`：必须提交到 base branch，按仓库生效且更确定。
- Settings -> Host -> Metadata 手动模型：会作用于该主机上的所有元数据类型（标题、分支名、commit message 和 PR 文本）；如果所有已配置模型都失败，则不会生成任何内容。

## 卸载

```text
paseo plugin disable paseo-zh-titles
paseo plugin remove paseo-zh-titles
```

## 开发

```text
npm install
npm run typecheck
```

## 许可证

MIT，见 [LICENSE](LICENSE)。
