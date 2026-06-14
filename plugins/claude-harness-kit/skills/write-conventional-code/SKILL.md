---
name: write-conventional-code
description: >
  「実装して」「関数を書いて」「hooks を作って」「型を定義して」「この処理を書いて」
  と言われたとき、coding-conventions ルールに沿って TypeScript / React のコードを
  新規実装する。命名・型・定数・関数設計・テストの規約を満たしたコードを生成する。
  UI コンポーネントの新規作成は create-ui-component を優先する。
# when_to_use: 関数・カスタムhooks・型定義・ユーティリティ・テストなどコードを新規に書くとき
---

# write-conventional-code

## 概要

`rules/coding-conventions/coding-rule.md` に沿って、TypeScript / React のコードを
新規実装するスキル。命名規則・型・定数化・関数設計・スタイリング・テストの規約を
満たしたコードを生成する。

## 参照するルール

実装を始める前に必ず `rules/coding-conventions/coding-rule.md` を読み込み、規約に従う。
本スキルでは規約本文を再掲せず、ルールファイルを唯一の正とする。

| 観点 | 規約の要点（詳細はルール参照） |
|------|------------------------------|
| 命名 | PascalCase / camelCase、`is`・`has`・`set`・`on`・`handle`、`Nei` プリフィックス |
| 型 | `interface` 不可・`export type`、`any` 不可・`unknown`＋型ガード、`FC<Props>`、プロパティに TSDOC |
| 定数 | マジックナンバー禁止、UPPER_SNAKE_CASE で定数化 |
| 関数 | アロー関数、単一責任、純粋関数、引数が多ければオブジェクト形式 |
| Export | named export 基本、page のみ default、`@/` エイリアス |
| hooks | `use` プリフィックス、戻り値はオブジェクト、`useEffect` はクリーンアップ必須 |
| コメント | 日本語のみ、関数は TSDOC（`/** */`） |
| テスト | `describe` ネスト1層、`test()`、AAA パターン、ヘルパーは `__tests__/helpers/` |

## 手順

1. **規約を読み込む** — `rules/coding-conventions/coding-rule.md` を読む。
2. **配置先を決める** — ディレクトリ構造（Atomic Design / `feature/<機能名>/`）に従い、
   ファイルの置き場所と命名を確定する。
3. **型から書く** — 入出力の型を `export type` で定義し、各プロパティに TSDOC コメントを付ける。
   不明な値は `any` ではなく `unknown` ＋型ガードで扱う。
4. **実装する** — アロー関数・named export で書く。マジックナンバーは UPPER_SNAKE_CASE で
   定数化する。hooks は戻り値をオブジェクトで返し、`useEffect` にはクリーンアップを付ける。
5. **コメントを付ける** — 日本語で、関数説明は TSDOC 形式にする。
6. **テストを書く**（対象がロジックの場合） — `test()` ＋ AAA パターン。使い回すモックは
   `__tests__/helpers/` のヘルパーに切り出す。
7. **自己チェック** — 上表の各観点を満たしているか確認してから提示する。

## 出力

- 規約に準拠した実装コード（型・実装・必要に応じてテスト）
- 配置先パスと、規約のどの観点に従ったかの簡潔な補足
