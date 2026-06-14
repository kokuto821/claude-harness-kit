# shared-ai-docs

Claude Code のスキル・ルール・ナレッジを共有するリポジトリです。

すべてのコンテンツは `plugins/shared-ai-skills/` 配下にまとまっており、`.claude-plugin/marketplace.json` 経由でマーケットプレイスプラグインとして読み込まれます。

## 主なディレクトリ

- `plugins/shared-ai-skills/` … スキル・ルール・ドキュメント・ナレッジ・エージェント・テンプレートの本体（source of truth）
- `.claude-plugin/` … マーケットプレイスカタログ
- `.claude/` … このリポジトリ用の Claude Code ローカル設定

AI 向けのプロジェクト指示は `CLAUDE.md` を参照してください。
