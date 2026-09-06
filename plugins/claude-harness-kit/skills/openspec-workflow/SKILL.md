---
name: openspec-workflow
description: >
  「OpenSpecで進めて」「仕様駆動で実装して」「openspec-proposeして」
  「この変更をOpenSpecで合意形成してから実装して」と言われたとき、
  OpenSpec の explore/propose/apply/archive フェーズを統括するオーケストレーター。
  apply の各タスクは既存の産出 skill（tdd/coding/test-coding）へ委譲し、
  archive の前に別エージェントによるレビューを必須で挟む。
  導入がまだの場合は openspec-setup へ誘導する。
---

# openspec-workflow

## 概要

OpenSpec のフェーズ（explore/propose/apply/archive）を統括する。CLI が生成する `openspec-apply-change`/`openspec-archive-change` スキルは、この kit の既存ルール（実装は産出 skill へ委譲する・レビューと産出者は別エージェント）を知らないため、apply/archive では**それらを起動せず**、本スキルが `openspec` CLI を直接叩いて進行・委譲・レビューゲートを担う。explore/propose はコードを書かないため、CLI 生成のスキルをそのまま使う。

## ルール

- OpenSpec フェーズと既存フェーズ・skill の役割分担は [[openspec-rule]]（`shared-rules/openspec-integration/openspec-rule.md`）を唯一の正とする。
- レビューと産出者の分離は [[review-independence-rule]]（`rules/harness-engineering/review-independence-rule.md`）に従う。apply の産出者と、archive 前のレビューは常に別エージェントにする。
- 実装の委譲先判定は [[github-issue-resolve]]（`skills/github-issue-resolve/SKILL.md`）手順4の IMPLEMENT 表と同じ基準を使う。委譲先スキルは in-context 起動する（＝スキル起動。定義は [[selection-rule]] を参照）。domain 判定と具象サブエージェントへの隔離委譲（＝エージェント委譲）は各委譲先スキルの責務。
- `openspec/` が未導入の場合は [[openspec-setup]]（`skills/openspec-setup/SKILL.md`）に委ねる。本スキルでは導入作業をしない。

## 手順

0. **前提確認** — 対象ディレクトリに `openspec/` が無ければ [[openspec-setup]] へ誘導して停止する。

1. **EXPLORE**（任意） — 要件が固まっていなければ、CLI 生成の `openspec-explore` スキルをそのまま in-context 起動する（コードを書かないため委譲問題はない）。

2. **PROPOSE** — CLI 生成の `openspec-propose` スキルをそのまま in-context 起動し、proposal/design/specs delta/tasks.md を生成する（同上、問題なし）。生成後、内容をユーザーに提示し承認を得てから次へ進む。変更が必要な場合は CLI 生成の `openspec-update-change` スキルを使う（コード変更を禁じているため問題なし）。

3. **APPLY** — **CLI 生成の `openspec-apply-change` スキルは起動しない**（実装コードを自分で直接書き、既存の委譲表を無視するため）。代わりに以下を行う。
   - `<name>` の決定: ユーザーが指定していればそれを使う。未指定なら会話の文脈から推測し、`openspec list --json` で確認できる active な change が1件のみならそれを使う。複数ある場合は一覧を提示してユーザーに選んでもらう(勝手に決めない)。
   - `openspec status --change "<name>" --json` で進捗・スキーマ・パスを取得する。
   - `openspec instructions apply --change "<name>" --json` で `contextFiles`（proposal/specs/design/tasks 等）とタスク一覧を取得する。
   - `contextFiles` に列挙された各ファイルを読む。
   - tasks.md の未完了タスク（`- [ ]`）を1件ずつ、[[github-issue-resolve]] の IMPLEMENT 表に従い `tdd`/`coding`/`test-coding` へ委譲する（テストを伴う実装は `tdd`、伴わない実装は `coding`、テストのみは `test-coding`）。委譲先には「このタスクの範囲のみ実装する」ことを明示する。
   - 委譲先から実装結果を受け取ったら、本スキル自身が該当タスクの `- [ ]` を `- [x]` に更新する。
   - タスクが曖昧、実装がタスク・spec の範囲を超える、エラーが起きた場合は、その場で範囲を広げず一旦止めてユーザーに確認する（黙って narrow/defer しない）。
   - 全タスク完了、またはブロックされるまで繰り返す。

4. **REVIEW**（新規ゲート。CLI 生成のワークフローには無い工程） — 実装コード中心の変更なら `coding-review`、md 資産（rules/skills/CLAUDE.md 等）中心なら `ai-engineering-review` を in-context 起動する。両方にまたがる変更は両方を起動する。指摘の適用は手順3で委譲した産出者へ戻す。**適用後、修正した産出者自身に確認させず、レビューを再実行して解消を確認する**（[[review-independence-rule]]: 修正後の再検証も修正した本人に委ねない）。指摘が残る場合はこのラウンドを繰り返す(最大2ラウンド。それでも残るものは残課題として報告する)。**このレビューを経ずに手順5（ARCHIVE）へ進まない。**

5. **ARCHIVE** — レビュー完了後、CLI 生成の `openspec-archive-change` スキルを in-context 起動する（この時点ではファイル移動と spec 統合のみのため、CLI 生成のままで問題ない）。

各手順で現フェーズ（EXPLORE/PROPOSE/APPLY/REVIEW/ARCHIVE）を明示する。

## 出力

- 現フェーズ、委譲先（入口スキルと判明していれば具象サブエージェント）、進捗（N/M タスク完了）
- APPLY: タスクごとの委譲先と結果
- REVIEW: レビュー結果と指摘の適用状況
- ARCHIVE: アーカイブ結果、specs 同期の有無
