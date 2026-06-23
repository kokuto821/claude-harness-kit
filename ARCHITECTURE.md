# アーキテクチャ

claude-harness-kit のディレクトリ構成と読み込みの仕組みを記す。

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
