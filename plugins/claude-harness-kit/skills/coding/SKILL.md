---
name: coding
description: >
  「実装して」「関数を書いて」「hooks を作って」「型を定義して」「この処理を書いて」
  と言われたとき、対象コードを分析して frontend / backend を判定した上で、
  対応する専門サブエージェントへ委譲して新規実装する。domain を問わない単一の入口。
  TDD フローの Green フェーズの委譲先としても使う。UI コンポーネントの新規作成は
  create-ui-component を優先する。
# when_to_use: 関数・カスタムhooks・型定義・ユーティリティなどコードを新規に書くとき（domainを問わない単一の入口として）
---

# coding

## 概要

対象コードを分析して domain を判定した上で、対応する専門サブエージェントへ実装を委譲する
統合エントリスキル。TDD フローで「今回は frontend 用スキルを見るのか、汎用スキルを見るのか」
といった参照先の使い分けを発生させないため、coding 系の入口をこのスキル1本に集約する。

## ルール

- domain の判定基準・対応サブエージェント・専用サブエージェントが無い場合の委譲方針は [[domain-classification-rule]] (`shared-rules/coding-conventions/domain-classification-rule.md`) を唯一の正とする。本スキルには再掲しない。
- 産出者とレビュワーの分離は [[review-independence-rule]] に従う。本スキル・委譲先サブエージェントは実装のみを担い、規約準拠レビューは別エントリの `coding-review` スキルに委ねる。

## 手順

1. **対象を特定する** — 実装対象のファイルパス・既存コードを確認する。新規ファイルの場合は配置先ディレクトリと周辺コードから判定する。
2. **domain を判定する** — [[domain-classification-rule]] の判定基準に従う。
3. **委譲する**（隔離起動） — [[domain-classification-rule]] の対応表に従い、frontend/backend なら専用サブエージェントへ、専用サブエージェントが無い domain なら同ルールのフォールバック方針に従い汎用サブエージェントへ委譲する。
4. **産出結果を受け取る** — 委譲先の実装結果をそのまま返す。自己レビューはしない（規約準拠レビューが要る場合は `coding-review` スキルに委ねる）。

## 出力

- 実装コード（型・実装。テストの新規実装は対象外 → `test-coding` スキル）
- 判定した domain と委譲先
