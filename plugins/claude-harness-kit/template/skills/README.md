# skills テンプレート

新しいスキルを作るときのひな形を置くディレクトリ。

## このディレクトリの構成

| パス | 内容 |
|------|------|
| `SKILL.md` | スキル本体のテンプレート（フロントマター＋本文構成） |
| `agent/` | そのスキル内だけで使うサブエージェント |
| `reference/` | スキルが参照する仕様書・スタイルガイドなど長文ドキュメント |
| `script/` | コマンド実行用の `.sh` や Dynamic Workflow 用の `.js` |

## 使い方

1. `SKILL.md` をコピーして `plugins/claude-harness-kit/skills/<skill-name>/SKILL.md` に配置する
2. 必要なサブディレクトリ（`agent/`, `reference/`, `script/`）だけ持ち込む
3. 不要なサブディレクトリは作成しない

> 命名規則・フロントマターの詳細は `rules/naming-conventions/naming-rule.md` と
> `rules/template/template-rule.md` を参照。