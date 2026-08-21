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

TDD の Red フェーズを担うスキル。テスト観点を洗い出し、抜け漏れのないテストケースを設計したうえで、失敗するテストコードを実装する。呼び出し元からは言語・domain に依存しない単一の入口として使え、失敗するテストコードの実装段階で対象コードを分析し frontend / backend を判定した上で、対応する専門サブエージェント（`frontend-tester` / `backend-tester`）へ委譲する。

判定した domain に対応する専用サブエージェントが無い場合（frontend/backend 以外の領域、例えば言語の違いなど）は、専用サブエージェントへの委譲を諦めてエラーにするのではなく、本スキル自身が推論で in-context 実装するフォールバックを標準の方針とする。

## ルール

- テスト観点の洗い出し技法は [[test-design]] (`shared-rules/test-design/test-design.md`) を参照する。
- TDD Red フェーズの考え方・コーディング標準は [[tdd-rule]] (`shared-rules/coding-conventions/tdd-rule.md`) に従う。本スキルは RED フェーズを担い、失敗するテストコードの実装まで行う。プロダクションコードの実装は行わない。
- テスト項目の抜け漏れがないことを重視する。`test.todo` が使える言語ではこれを用い、未実装のテスト項目を可視化する。
- テストコードの実装は [[design-rule]] (`rules/design-principles/design-rule.md`) の設計原則（DRY/SRP/SoC等）に従う。フォールバック時（対応するサブエージェントが無い domain）も同様にこの原則に従う。
- レビューと産出の分離は [[review-independence-rule]] に従う。テスト観点・ケースの抜け漏れは `test-design-reviewer`、実装したテストコードの設計原則は `design-principles-reviewer` に委譲し、本スキル・委譲先サブエージェント（産出者）は指摘の反映のみを行う。
- 対象物はテストコード。テスト仕様書（ドキュメント）の作成は行わない。

## 手順

1. テスト観点を決める（[[test-design]] の技法を参照する）
2. テストケースを設計する（`test.todo` が使える言語では `test.todo` で列挙する）
3. `test-design-reviewer` エージェントへ委譲し、テスト観点・ケースの抜け漏れをレビューしてもらう
4. 指摘を踏まえてテスト設計を修正する
5. **domain を判定する** — 対象コードが frontend / backend / いずれにも判定できない（専用サブエージェント未整備の domain）かを見る
6. **失敗するテストコードを実装する（RED）**
   - frontend → `frontend-tester` サブエージェントへ委譲（隔離起動）
   - backend → `backend-tester` サブエージェントへ委譲（隔離起動）
   - 専用サブエージェントが無い場合 → 本スキル自身が [[design-rule]] に基づき in-context で実装する（フォールバック）
7. `design-principles-reviewer` エージェントへ委譲し、テストコードの設計原則違反をレビューしてもらう
8. 指摘を踏まえてテストコードを修正する（RED 状態を維持したまま。修正は委譲元と同じ経路で行う）

## 出力

失敗するテストコード（RED 状態。`test.todo` を含む場合はそれも含む）。判定した domain と委譲先（フォールバック時はその旨）
