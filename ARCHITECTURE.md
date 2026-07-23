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
│   ├── agent/                  ← サブエージェント定義
│   ├── template/               ← テンプレート
│   └── .claude-plugin/         ← プラグインマニフェスト
│
├── .claude-plugin/             ← マーケットプレイスカタログ（marketplace.json）
│
└── .claude/                    ← Claude Code 設定（settings.local.json）
    └── rules → plugins/claude-harness-kit/rules  ← コアの symlink（開発時のみ）
```

スキル・ルール・エージェント等は `.claude-plugin/marketplace.json` 経由でマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込む。コンテンツを複製する手動の symlink 同期は不要。例外として、コアルール（`rules/`）は開発時のみ `.claude/rules` へのディレクトリ symlink で native 自動ロードする（詳細は structure-rule の「コアルールの symlink 例外」節）。
