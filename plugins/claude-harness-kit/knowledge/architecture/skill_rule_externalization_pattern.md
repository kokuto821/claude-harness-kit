# スキル・エージェントにおけるルール外部化パターン

**作成日**: 2026-06-13
**カテゴリ**: architecture
**タグ**: [#claude-code, #skills, #rules, #design-pattern]

## 概要

スキル（`skills/`）やエージェント（`agent/`）のファイル内にルール・制約・テンプレートをインラインで書くと、重複・陳腐化・再利用不能が生じる。「どこに置くか」の判断軸として `rules/` と `reference/` の2層構造を設けた。

## 詳細

### 判断フロー

```
スキル/エージェントに書こうとしているコンテンツ
│
├─ 他のスキル・エージェントにも適用できる不変のガイドライン？
│   → YES: rules/<topic>/<name>-rule.md に切り出す
│
├─ そのスキル専用だが、SKILL.md が長大になるテンプレート・ガイドライン？
│   → YES: skills/<name>/reference/<content>.md に切り出す
│
└─ スキル固有の手順・実行ロジック？
    → NO: SKILL.md にインラインのまま
```

### `rules/` と `reference/` の使い分け

| 場所 | 対象 | 例 |
|------|------|----|
| `rules/<topic>/` | 複数スキルで共有できる普遍的ガイドライン | 命名規則、配置ルール、外部化原則 |
| `skills/<name>/reference/` | そのスキル専用の長大な参照素材 | TDDガイドライン、ナレッジテンプレート |
| SKILL.md インライン | 手順・実行ロジック | Step 1: ○○する |

### 実際に適用したケース

- `tdd-expert`: TDDガイドライン全文 → `reference/tdd-guidelines.md`
- `record-knowledge`: マークダウンテンプレート → `reference/template.md`
- `frontend-coder`: コーディングルール（重複）→ `rules/coding-conventions/coding-rule.md` 参照のみに削減

### プラグイン直参照環境での注意

スキルをプラグインとしてリポジトリ直参照でインストールしている場合、`skills/` に新ディレクトリを追加するだけで自動反映される（`sync-skills` 不要）。Claude Code の再起動で有効になる。

## 参考・関連情報

- `rules/rule-externalization/externalization-rule.md` — 外部化原則の定義
- `rules/rules-directory/directory-rule.md` — `rules/` の構造・命名規則
- `skills/create-skill/SKILL.md` — スキル作成時にこのパターンを適用するStep 4
