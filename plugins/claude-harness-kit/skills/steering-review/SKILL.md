---
name: steering-review
description: >
  「ステアリング構成をレビューして」「CLAUDE.md/rules/skills/hooks の使い分けをチェックして」
  「この設定が各手法の意図通りか見て」と言われたとき、プロジェクトの Claude Code
  ステアリング構成（CLAUDE.md・rules・skills・subagents・hooks・output styles）を
  selection-rule / harness-rule に照らしてレビューし、手法の誤用・逸脱を指摘する
  （改善の適用はしない）。
# when_to_use: 実装済みのステアリング構成が各手法の公式の意図通りかの準拠チェック・レビュー（指摘のみ）を依頼されたとき
---

# steering-review

## 概要

ステアリング構成レビュアーとして、プロジェクトの Claude Code カスタマイズ資産
（CLAUDE.md・`rules/`・`skills/`・`agent/`・hooks・output styles）を、各手法の
公式の意図に照らしてレビューし、手法の誤用・逸脱を Critical / Warning / Suggestion
で指摘するタスクスキル。**指摘までが責務**で、改善の適用は行わない。

判断の土台は `documents/reference/steering-claude-code.md`（7手法の意図）。

## ルール

- どの手法を使うべきかは [[selection-rule]] (`rules/mechanism-selection/selection-rule.md`) に照らす。
- コードで強制すべきか md でよいかは [[harness-rule]] (`rules/harness-control/harness-rule.md`) に照らす。
- 手法ごとの挙動・事実は [[steering-claude-code]] (`documents/reference/steering-claude-code.md`) を参照する。

## 手順

### 1. レビュー範囲を特定する

対象プロジェクトのステアリング資産を洗い出す：ルート/サブディレクトリの CLAUDE.md、
`.claude/rules/`（`rules/`）、`.claude/skills/`、`.claude/agents/`（`agent/`）、
`settings.json` の hooks、`.claude/output-styles/`。差分が分かる場合は変更箇所を優先する。

### 2. 手法の使い分けを照合する

各資産を [[selection-rule]] のアンチパターンと [[harness-rule]] の判定に照らす。観点：

- **CLAUDE.md**: 200行超で肥大化していないか／30行超の手順を抱えていないか
  （→ skill）／「毎回Xしたら必ずY」「絶対〜するな」を散文で書いていないか
  （→ hooks・[[harness-rule]]）／個人の好みを混ぜていないか（→ ユーザーファイル）。
- **rules**: 一部の層・拡張子にしか効かない規約を未スコープにしていないか
  （→ `paths:`）／事実・挙動の説明で膨らんでいないか（→ reference）。
- **skills / subagents**: 手順が CLAUDE.md でなく skill に置かれているか／隔離すべき
  副次タスクが subagent 化されているか。
- **hooks**: 破られたら困る制御が散文でなく hooks/settings.json で強制されているか。
- **output styles**: 組み込みで足りるものをカスタム化していないか。

### 3. 指摘を抽出する

各観点の誤用・逸脱を洗い出し、優先度を付ける。

## 出力

優先度ごとに整理して指摘を返す。**修正の適用は行わない**。

- **Critical**: 保証されるべき制御が散文頼みなど、破られると困る誤配置。
- **Warning**: 手法の誤用だが局所的なもの（手順が CLAUDE.md に直書き、未スコープ rule など）。
- **Suggestion**: より意図に沿わせる改善提案（output styles の見直しなど）。

各項目は 箇所 ／ 逸脱した手法選択（根拠ルールのパス）／ 問題点 ／ あるべき置き場所 の形で示す。
逸脱がなければ「各手法の意図に準拠、問題なし」と明記する。
