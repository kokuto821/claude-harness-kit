# shared_ai_docs

Claude Code スキル・ナレッジの共有リポジトリ。

## ディレクトリ構造

```
shared_ai_docs/
├── plugins/shared-ai-skills/   ← すべてのコンテンツの source of truth
│   ├── skills/                 ← Claude Code スキル（SKILL.md）
│   ├── rules/                  ← Claude が参照するルール
│   ├── documents/              ← 調査・参考ドキュメント
│   ├── knowledge/              ← 経験・知見メモ
│   ├── agent/                  ← サブエージェント定義
│   ├── template/               ← テンプレート
│   └── .claude-plugin/         ← プラグインマニフェスト
│
├── .claude-plugin/             ← マーケットプレイスカタログ
│
└── .claude/                    ← Claude Code 設定（シンボリックリンク群）
    ├── agent   → ../plugins/shared-ai-skills/agent
    ├── documents → ../plugins/shared-ai-skills/documents
    ├── rules   → ../plugins/shared-ai-skills/rules
    ├── skills/ → gitignored（junction/symlink の置き場）
    └── template → ../plugins/shared-ai-skills/template
```

ルート直下の `rules/`, `documents/`, `agent/`, `template/` はシンボリックリンク。

## ルール

詳細は各ルールファイルを参照。

| トピック | ルールファイル |
|----------|--------------|
| ファイル配置・リポジトリ構造 | `rules/repository-structure/structure-rule.md` |
| 命名規則（スキル・エージェント） | `rules/naming-conventions/naming-rule.md` |
| スキル同期 | `rules/skill-sync/sync-rule.md` |
| ユーザーフィードバックのルール化 | `rules/user-feedback/feedback-rule.md` |
