# 設計原則ルール

コード設計の普遍的原則（DRY・SRP・関心の分離・疎結合/高凝集）の唯一の正（source of truth）。
実装・テスト・レビューの各所からはここを参照し、原則の定義を再掲しない。

## 原則

**重複を持たず（DRY）、各単位は単一の責務を持ち（SRP）、関心を分離して疎結合・高凝集に保つ。** 言語・フレームワークに依存しないコード設計の土台であり、実装・リファクタ・レビューの共通の判断基準とする。

## 判断基準

| 原則 | 定義 | 満たしているか |
|------|------|--------------|
| **DRY (Don't Repeat Yourself)** | コードの重複を避け、共通ロジックは抽象化して一箇所に集約・再利用する。 | 同じロジック・値が複数箇所に散っていないか。変更時に複数箇所を直す必要が生じないか。 |
| **単一責任の原則 (SRP)** | すべてのモジュール・クラス・関数は単一の責務を持つ。変更理由をひとつに近づける（「1クラス1メソッド」の意味ではない）。 | 「このユニットは何をするか」を一言で言えるか。変更理由が複数ないか。 |
| **関心の分離 (SoC)** | 異なる関心（表示・状態・データ取得・ドメインロジック等）を混在させず層・単位で切り分ける。 | 無関係な関心が同じ関数・モジュールに同居していないか。 |
| **疎結合・高凝集** | 単位間の依存は最小限（疎結合）、関連するものは一箇所に集約（高凝集）。テストしやすさは良い設計の指標。 | 一部を変えて広範囲に影響しないか。関連ロジックが分散していないか。 |

## やってはいけないこと

- 同じ値・ロジックを複数箇所にコピーして持つ（DRY 違反）。共通化して一箇所に置く。
- 1つの関数・モジュールに複数の責務・関心を詰め込む（SRP / SoC 違反）。
- この原則の定義を参照元（実装・テスト・レビューのルールやエージェント）に再掲する。値の二重管理になりドリフトする（[[externalization-rule]]（`rules/rule-externalization/externalization-rule.md`）§単一情報源）。

## 背景

DRY・SRP・疎結合/高凝集の定義が `coding-conventions/tdd-rule.md`・`coding-conventions/coding-rule.md`・各レビュー/テストエージェントに散在し、文言がずれ始めていた。コード設計の普遍原則を単一情報源として切り出し、各所は参照に寄せる。ドキュメント/資産側での重複回避（単一情報源）は [[externalization-rule]] が担い、本ルールはコード側を担う。

本ルールは中核4原則の**判断基準**だけを持つ。KISS・YAGNI・デメテルの法則ほか周辺の設計法則・用語の説明は、判断基準ではなく参照資料として [[design-principles-glossary]]（`documents/reference/design/design-principles-glossary.md`）に置く。

## 関連ルール・資料

- [[design-principles-glossary]]（`documents/reference/design/design-principles-glossary.md`） — 周辺の設計法則・原則・比喩の用語集（中核4原則の定義は本ルールを参照）
- [[externalization-rule]]（`rules/rule-externalization/externalization-rule.md`） — ドキュメント/資産の単一情報源（本ルールのドキュメント版に相当する DRY）
- [[tdd-rule]]（`rules/coding-conventions/tdd-rule.md`） — Red-Green-Refactor サイクル（Refactor で本原則を適用）
- [[coding-rule]]（`rules/coding-conventions/coding-rule.md`） — 実装全般の規約（関数設計で本原則を適用）
- [[long-horizon-rule]]（`rules/context-engineering/long-horizon-rule.md`） — マルチエージェントにおける関心の分離の応用
