# prompt-engineering ルール索引

プロンプト・スキル・サブエージェントの指示文を設計／レビュー／改善するためのルール群の**索引（ルーター）**。
全部を読み込まず、**まずこの索引を読み、扱う関心事に該当するルールだけを読む**運用とする。

対象は Claude Code のプロンプト・SKILL.md・エージェント定義。これらを新規作成するとき、
レビューするとき（`prompt-review` スキル / `prompt-engineer` エージェント）、改善するときの判断基準を定める。

## 全体構成

```
prompt-engineering/
├── composition-rule.md    ← プロンプトの構成要素が揃っているか
├── scaffolding-rule.md    ← 推論の足場（分解・自己検証）の要否
├── robustness-rule.md     ← 頑健性・安全性（敏感さ・過信・値の再掲・外部入力）
└── improvement-rule.md    ← 既存プロンプトの改善の進め方
```

対象は**プロンプト本文の品質**（構成・足場・頑健性・改善）に限る。どの手法で表現するか
（CLAUDE.md/rules/skills/subagents 等の選択）は `rules/harness-control/selection-rule.md` を参照する。

## 利用ガイド（いつどれを読むか）

| 関心事 | ルール |
|--------|--------|
| 指示・出力形式・例示・役割・文脈の過不足を確認したい | `composition-rule.md` |
| 難タスクに推論の足場を組むか／単純タスクにCoTを足していないか判断したい | `scaffolding-rule.md` |
| フォーマットの一貫性・値の再掲によるドリフト・追従/過信・外部入力の扱いを点検したい | `robustness-rule.md` |
| 既存プロンプトを診断ベースで的を絞って改善したい | `improvement-rule.md` |

各ルールは `[[composition-rule]]` のように `[[wikilink]]`（ルールファイル名のスラッグ）で参照される。
リンクはファイル名基準のため不変。
