# .claude

このリポジトリ用の Claude Code ローカル設定を置く場所です。

`settings.local.json` などの設定ファイルを置きます。コンテンツ本体（スキル・ルール等の実ファイル）は置きません（それらは `plugins/claude-harness-kit/` 配下）。例外として `rules` はコアルールのディレクトリ symlink です（実体は `plugins/claude-harness-kit/rules`、この kit 開発時に毎セッション native 自動ロードさせるため）。
