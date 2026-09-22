# .agents

Google Antigravity（`agy`）がこのワークスペースを開いたときに読み込むディレクトリです。`plugins/matagi/plugin.json` と `hooks.json` は `plugins/matagi/adapters/antigravity/` の変換スクリプトで生成する成果物（git 管理外）で、`skills`/`rules`/`agents`/`hooks` は `plugins/matagi/` 配下への symlink です（source of truth は複製しない）。詳細は `plugins/matagi/documents/reference/multi-agent-support/antigravity-adapter.md` を参照してください。
