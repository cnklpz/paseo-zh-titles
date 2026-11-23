# paseo-zh-titles

Keep Paseo auto-generated workspace and agent titles in Simplified Chinese. [简体中文](README.zh-CN.md)

Unofficial community plugin. Not affiliated with or endorsed by Paseo.

When Paseo creates a workspace or agent, this plugin adds a Simplified Chinese instruction to the internal title-generation request. The generated title is Chinese while filenames, paths, commands, identifiers, and other proper content remain unchanged; the git branch remains an ASCII lowercase slug.

## Why this exists

Paseo generates titles with a small one-shot call whose prompt is English-only (`packages/server/src/server/worktree-branch-name-generator.ts`: `Generate a title and a git branch name ...`, with the Title style example `"Refactor PR #2638 Playwright specs"`) and contains no language instruction. Claude models follow that prompt literally and emit English; Chinese-centric models such as DeepSeek mirror the Chinese seed and emit Chinese. Titles are never Claude Code's own `ai-title`; Paseo only reads that when importing history.

## How it works

1. A workspace or agent is created.
2. Paseo spawns an internal agent titled `Branch name generator`.
3. This plugin's `agent.open.before` hook matches that title and appends one system-prompt instruction.
4. The generator writes a Chinese `title` and an ASCII `branch` slug.

## Requirements

Paseo >= 0.14 is required for plugin hooks. This was tested on 0.17.3 with the desktop-managed daemon on Windows. It works with every provider because the hook targets the generator agent, not your agent.

## Install

Clone this repository, then run:

```text
paseo plugin install /path/to/paseo-zh-titles     # Windows: F:\path\to\paseo-zh-titles
paseo plugin enable paseo-zh-titles
```

Directory installs read the checkout directly. Moving or deleting the folder breaks the plugin.

## Verify

Run `paseo plugin ls` and `paseo plugin logs paseo-zh-titles`, then create a workspace with a Chinese first prompt and check the sidebar title. The expected log line is:

```text
[zh-titles] injected title instruction provider=... agent=...
```

## Verified behavior

Using the same Paseo metadata prompt, the same Chinese seed, and model `claude-haiku-5-5`:

- Without the instruction: `{"title": "Count files in current directory", "branch": "count-current-directory-files"}`
- With the instruction: `{"title": "统计当前目录文件数量", "branch": "count-current-directory-files"}`

## Limitations

- The hook depends on the internal title string `Branch name generator`. If Paseo renames it, change `TARGET_TITLE`; the symptom is that titles silently revert to English.
- It only affects titles generated after installation.
- This plugin only covers titles. For other metadata types, use repository-level `paseo.json` keys: `metadataGeneration.title.instructions`, `metadataGeneration.branchName.instructions`, `metadataGeneration.commitMessage.instructions`, and `metadataGeneration.pullRequest.instructions`. Each entry replaces Paseo's default style for that artifact; the file must be committed to the base branch.
- The instruction is advisory, not a hard override.

## Alternatives

- Repository-level `paseo.json` with `metadataGeneration.title.instructions`: must be committed to the base branch and is deterministic per repository.
- Settings -> Host -> Metadata manual model: applies to every metadata type on that host (titles, branch names, commit messages, and PR text), and when all configured models fail, nothing is generated.

## Uninstall

```text
paseo plugin disable paseo-zh-titles
paseo plugin remove paseo-zh-titles
```

## Development

```text
npm install
npm run typecheck
```

## License

MIT. See [LICENSE](LICENSE).
