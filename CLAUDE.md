# claude-harness-kit

Claude Code スキル・ナレッジの共有リポジトリ。

## ディレクトリ構造

```
claude-harness-kit/
├── plugins/claude-harness-kit/   ← すべてのコンテンツの source of truth
│   ├── skills/                 ← Claude Code スキル（SKILL.md）
│   ├── rules/                  ← Claude が参照するルール
│   ├── documents/              ← 調査・参考ドキュメント
│   ├── knowledge/              ← 経験・知見メモ
│   ├── agent/                  ← サブエージェント定義
│   ├── template/               ← テンプレート
│   └── .claude-plugin/         ← プラグインマニフェスト
│
├── .claude-plugin/             ← マーケットプレイスカタログ（marketplace.json）
│
└── .claude/                    ← Claude Code 設定（settings.local.json）
```

スキル・ルール・エージェント等は `.claude-plugin/marketplace.json` 経由でマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込む。手動の symlink 同期は不要。

## ルール

詳細は各ルールファイルを参照。

| トピック | ルールファイル |
|----------|--------------|
| ファイル配置・リポジトリ構造 | `rules/repository-structure/structure-rule.md` |
| 命名規則（スキル・エージェント） | `rules/naming-conventions/naming-rule.md` |
| ユーザーフィードバックのルール化 | `rules/user-feedback/feedback-rule.md` |
| スキル・エージェント内のルール外部化 | `rules/rule-externalization/externalization-rule.md` |
| README の配置（全ディレクトリに必須） | `rules/readme-convention/readme-rule.md` |
| UIデザイン（索引から各ルールへ） | `rules/ui-design/README.md` |
