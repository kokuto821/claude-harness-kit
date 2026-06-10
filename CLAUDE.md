# shared_ai_docs

Claude Code スキル・ナレッジの共有リポジトリ。

## ディレクトリ構造

```
shared_ai_docs/
├── plugins/shared-ai-skills/   ← すべてのコンテンツの source of truth
│   ├── skills/                 ← Claude Code スキル（SKILL.md）
│   ├── rules/                  ← Claude が参照するルール
│   ├── documents/              ← 調査・参考ドキュメント
│   ├── experiences/            ← 経験・知見メモ
│   ├── agent/                  ← サブエージェント定義
│   ├── template/               ← テンプレート
│   └── .claude-plugin/         ← プラグインマニフェスト
│
├── .claude-plugin/             ← マーケットプレイスカタログ
│
└── .claude/                    ← Claude Code 設定（シンボリックリンク群）
    ├── agent   → ../plugins/shared-ai-skills/agent
    ├── documents → ../plugins/shared-ai-skills/documents
    ├── experiences → ../plugins/shared-ai-skills/experiences  ※未作成
    ├── rules   → ../plugins/shared-ai-skills/rules
    ├── skills/ → gitignored（junction/symlink の置き場）
    └── template → ../plugins/shared-ai-skills/template
```

ルート直下の `rules/`, `documents/`, `experiences/`, `agent/`, `template/` はシンボリックリンク。

## ファイルの置き場所ルール

**新しいファイルは必ず `plugins/shared-ai-skills/<カテゴリ>/` 配下に置く。**

| 種類 | 置き場所 |
|------|---------|
| スキル | `plugins/shared-ai-skills/skills/<skill-name>/SKILL.md` |
| ルール | `plugins/shared-ai-skills/rules/<rule-name>.md` |
| 調査・参考ドキュメント | `plugins/shared-ai-skills/documents/research/<file>.md` |
| 経験・知見メモ | `plugins/shared-ai-skills/experiences/<category>/<file>.md` |
| サブエージェント | `plugins/shared-ai-skills/agent/<name>.md` |
| テンプレート | `plugins/shared-ai-skills/template/<category>/` |

`.claude/` 配下や プロジェクトルート直下にファイルを直接作成しない。`.claude/` 内はシンボリックリンクのみ。

## 命名規則

詳細は `rules/naming-conventions.md` を参照。

- スキルディレクトリ名・エージェントファイル名: **kebab-case**
- `name:` フロントマター: kebab-case（ディレクトリ名と一致）
- `description:` フロントマター: Claude の自動起動トリガー。主要ユースケースを先頭に

## スキル同期

`/sync-skills` を実行すると `plugins/shared-ai-skills/skills/` 配下のスキルを:
- WSL `~/.claude/skills/` にシンボリックリンクで同期
- プロジェクト `.claude/skills/` に Windows ジャンクションで同期
