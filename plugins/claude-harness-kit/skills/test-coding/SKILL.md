---
name: test-coding
description: >
  「テストコードを書いて」「TDDのREDを書いて」「失敗するテストを実装して」と言われたとき、
  テスト観点の洗い出しからテストケース設計、失敗するテストコード（TDD Red相当）の実装までを行う。
  言語・ドメインに依存しない汎用スキル。プロダクションコードの実装は行わない。
---

# test-coding

## 概要

TDD の Red フェーズを担うスキル。テスト観点を洗い出し、抜け漏れのないテストケースを設計したうえで、失敗するテストコードを実装する。言語・ドメインに依存しない汎用スキル。

## ルール

- テスト観点の洗い出し技法は [[test-design]] (`shared-rules/test-design/test-design.md`) を参照する。
- TDD Red フェーズの考え方・コーディング標準は [[tdd-rule]] (`shared-rules/coding-conventions/tdd-rule.md`) に従う。本スキルは RED フェーズを担い、失敗するテストコードの実装まで行う。プロダクションコードの実装は行わない。
- テスト項目の抜け漏れがないことを重視する。`test.todo` が使える言語ではこれを用い、未実装のテスト項目を可視化する。
- テストコードの実装は [[design-rule]] (`rules/design-principles/design-rule.md`) の設計原則（DRY/SRP/SoC等）に従う。
- レビューと産出の分離は [[review-independence-rule]] に従う。テスト観点・ケースの抜け漏れは `test-design-reviewer`、実装したテストコードの設計原則は `design-principles-reviewer` に委譲し、本スキル（産出者）は指摘の反映のみを行う。
- 対象物はテストコード。テスト仕様書（ドキュメント）の作成は行わない。

## 手順

1. テスト観点を決める（[[test-design]] の技法を参照する）
2. テストケースを設計する（`test.todo` が使える言語では `test.todo` で列挙する）
3. `test-design-reviewer` エージェントへ委譲し、テスト観点・ケースの抜け漏れをレビューしてもらう
4. 指摘を踏まえてテスト設計を修正する
5. 失敗するテストコードを実装する（RED。[[design-rule]] に従う）
6. `design-principles-reviewer` エージェントへ委譲し、テストコードの設計原則違反をレビューしてもらう
7. 指摘を踏まえてテストコードを修正する（RED 状態を維持したまま）

## 出力

失敗するテストコード（RED 状態。`test.todo` を含む場合はそれも含む）
