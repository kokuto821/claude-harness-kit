---
name: test-coding
description: >
  「テストコードを書いて」「TDDのREDを書いて」「失敗するテストを実装して」と言われたとき、
  テスト観点の洗い出しからテストケース設計、失敗するテストコード（TDD Red相当）の実装までを行う。
  対象コードを分析して frontend / backend を判定し、対応する専門サブエージェントへ実装を
  委譲する domain 非依存の単一入口スキル。プロダクションコードの実装は行わない。
---

# test-coding

## 概要

TDD の **List（テストリスト洗い出し）と Red（失敗するテストを書く）** の両フェーズを担うスキル
（[[tdd-rule]] Phase 0-1）。テスト観点を洗い出し、抜け漏れのないテストケースを設計する
（List 相当）。その上で、対象コードを分析し domain を判定し、対応する専門サブエージェント
（`frontend-tester` / `backend-tester` 等）へ失敗するテストコードの実装（Red 相当）を委譲する。
呼び出し元からは言語・domain に依存しない単一の入口として使える。

## ルール

- テスト観点の洗い出し技法は [[test-design]] (`shared-rules/test-design/test-design.md`) を参照する。List フェーズでは実装設計判断を混ぜない（[[tdd-rule]] Phase 0 の条件）。テストリストは固定ではなく、作業中に気づいた項目を随時追加してよい。
- TDD List/Red フェーズの考え方・コーディング標準は [[tdd-rule]] (`shared-rules/coding-conventions/tdd-rule.md`) に従う。本スキルは List フェーズと Red フェーズを担い、失敗するテストコードの実装まで行う。プロダクションコードの実装は行わない。
- テスト項目の抜け漏れがないことを重視する。`test.todo` が使える言語ではこれを用い、未実装のテスト項目を可視化する。
- domain の判定基準・対応サブエージェント・専用サブエージェントが無い場合の委譲方針は [[domain-classification-rule]] (`shared-rules/coding-conventions/domain-classification-rule.md`) を唯一の正とする。本スキルには再掲しない。
- テストコードの実装は [[design-rule]] (`rules/design-principles/design-rule.md`) の設計原則（DRY/SRP/SoC等）に従う。
- レビューと産出の分離は [[review-independence-rule]] に従う。テスト観点・ケースの抜け漏れは `test-design-reviewer`、実装したテストコードの設計原則は `design-principles-reviewer` に委譲し、本スキル・委譲先サブエージェント（産出者）は指摘の反映のみを行う。
- 対象物はテストコード。テスト仕様書（ドキュメント）の作成は行わない。

## 手順

### List（テストリスト洗い出し）

1. テスト観点を決める（[[test-design]] の技法を参照する）
2. テストケースを設計する（`test.todo` が使える言語では `test.todo` で列挙する）
3. `test-design-reviewer` エージェントへ委譲し、テスト観点・ケースの抜け漏れをレビューしてもらう
4. 指摘を踏まえてテスト設計を修正する

### Red（失敗するテストを書く）

5. **domain を判定する** — [[domain-classification-rule]] の判定基準に従う。
6. **失敗するテストコードを実装する（RED）**（隔離起動） — [[domain-classification-rule]] の対応表に従い、frontend/backend なら専用サブエージェントへ、専用サブエージェントが無い domain なら同ルールのフォールバック方針に従い汎用サブエージェントへ委譲する。リストから1項目だけを選んで実装する（[[tdd-rule]] Phase 1 の禁止事項に従う）。
7. `design-principles-reviewer` エージェントへ委譲し、テストコードの設計原則違反をレビューしてもらう
8. 指摘を踏まえてテストコードを修正する（RED 状態を維持したまま。修正は委譲元と同じ経路で行う）

## 出力

失敗するテストコード（RED 状態。`test.todo` を含む場合はそれも含む）。判定した domain と委譲先
