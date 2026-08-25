# アーキテクチャ

claude-harness-kit のディレクトリ構成と読み込みの仕組みを記す。

## ディレクトリ構造

```
claude-harness-kit/
├── plugins/claude-harness-kit/   ← すべてのコンテンツの source of truth
│   ├── skills/                 ← Claude Code スキル（SKILL.md）
│   ├── rules/                  ← コアルール（必読・.claude/rules へ symlink）
│   ├── shared-rules/           ← 参照層（任意タイミングで参照）
│   ├── documents/              ← 調査・参考ドキュメント
│   ├── knowledge/              ← 経験・知見メモ
│   ├── agents/                 ← サブエージェント定義
│   ├── hooks/                  ← フックスクリプト（plugin.json から配線）
│   ├── template/               ← テンプレート
│   └── .claude-plugin/         ← プラグインマニフェスト
│
├── .claude-plugin/             ← マーケットプレイスカタログ（marketplace.json）
│
└── .claude/                    ← Claude Code 設定（settings.local.json）
    └── rules → plugins/claude-harness-kit/rules  ← コアの symlink（開発時のみ）
```

フック（`hooks/`）はプラグインマニフェスト `plugins/claude-harness-kit/.claude-plugin/plugin.json` の `hooks` セクションで配線し、パスは `${CLAUDE_PLUGIN_ROOT}` 起点で書く。

スキル・ルール・エージェント等は `.claude-plugin/marketplace.json` 経由でマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込む。コンテンツを複製する手動の symlink 同期は不要。例外として、コアルール（`rules/`）は開発時のみ `.claude/rules` へのディレクトリ symlink で native 自動ロードする（詳細は structure-rule の「コアルールの symlink 例外」節）。

OpenSpec（仕様駆動開発ツール）は本リポジトリには常設しない。導入先の作業リポジトリでの位置づけは structure-rule の「openspec/ の扱い」節を参照。
