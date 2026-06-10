# リポジトリ構造とファイル配置ルール

## source of truth

すべてのコンテンツは `plugins/shared-ai-skills/` 配下が唯一の source of truth。

`.claude/` 配下はシンボリックリンクのみ置く。**実ファイル・実ディレクトリを `.claude/` 直下に作成しない。**

## ファイルの配置先

| 種類 | 正しい配置先 |
|------|------------|
| スキル | `plugins/shared-ai-skills/skills/<skill-name>/SKILL.md` |
| ルール | `plugins/shared-ai-skills/rules/<rule-name>.md` |
| 調査・参考ドキュメント | `plugins/shared-ai-skills/documents/research/<file>.md` |
| 経験・知見メモ | `plugins/shared-ai-skills/experiences/<category>/<file>.md` |
| サブエージェント | `plugins/shared-ai-skills/agent/<name>.md` |
| テンプレート | `plugins/shared-ai-skills/template/<category>/` |

プロジェクトルート直下へのファイル直置きも不可。ルート直下はシンボリックリンクのみ。

## .claude/ のシンボリックリンク構成

```
.claude/
├── agent     → ../plugins/shared-ai-skills/agent
├── documents → ../plugins/shared-ai-skills/documents
├── rules     → ../plugins/shared-ai-skills/rules
├── skills/   → gitignored（junction/symlink 置き場）
└── template  → ../plugins/shared-ai-skills/template
```

`experiences/` は `.claude/` 経由で参照する必要がある場合のみシンボリックリンクを追加する。

## よくある誤り

- ❌ `.claude/documents/research/` に直接ファイルを作成する
- ❌ プロジェクトルートに `.md` ファイルを直置きする（CLAUDE.md を除く）
- ✅ `documents/research/` または `plugins/shared-ai-skills/documents/research/` に置く（同じ場所）
