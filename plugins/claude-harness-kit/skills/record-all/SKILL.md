---
name: record-all
description: >
  「今のをまとめて記録して」「ナレッジとルール両方残して」「学びと指摘を記録して」
  と言われたとき、会話内容を record-knowledge（knowledge/ へのナレッジ蓄積）と
  record-feedback（rules/ へのフィードバックのルール化）の両方でまとめて記録する
  オーケストレーター。
# when_to_use: 1つの会話から知見の蓄積とフィードバックのルール化を同時に行いたいとき
---

# record-all

## 概要

会話内容や指示を受け取り、**ナレッジ蓄積**と**フィードバックのルール化**を
一度の起動でまとめて行う統合スキル。それぞれの既存スキル
（`record-knowledge` / `record-feedback`）の手順・判断基準を踏襲する。

## 手順

### 1. 記録対象を整理する

会話の文脈から、記録に値する内容を2種類に切り分ける。

- **ナレッジ性**: 学習したこと・調査結果・再利用できる知見 → record-knowledge へ
- **フィードバック性**: ユーザーの指摘・訂正・「次から〇〇して」 → record-feedback へ

両方を含む場合は両方、片方だけなら該当する側だけを実行する。

### 2. ナレッジを記録する（record-knowledge）

`skills/record-knowledge/SKILL.md` の手順に従う。

- カテゴリ（`coding` / `architecture` / `research` / `design` / `documentation`）を選定
- `skills/record-knowledge/reference/template.md` に沿って
  `knowledge/<カテゴリ>/<file>.md` を作成・更新

### 3. フィードバックをルール化する（record-feedback）

`skills/record-feedback/SKILL.md` の手順に従う。

- `shared-rules/user-feedback/feedback-rule.md` の判断基準でルール化の要否を判断
- ルール化すべき場合は追記先／新規ファイルのパスとルール案を提示
- **承認を得てから** `rules/<topic>/` に書き込む（一度限りの指摘なら記録しない）

### 4. まとめて報告する

両方の処理結果を1つにまとめて報告する。スキップした側があればその理由も添える。

## 出力

- **ナレッジ**: 保存先パス（`knowledge/<カテゴリ>/<file>.md`）と内容サマリー。
- **フィードバック**: ルール化した場合は書き込んだ `rules/` パスとサマリー、
  ルール化しない場合はその理由を1文。
- 一方のみ実行した場合は、もう一方を実行しなかった理由を明記する。
