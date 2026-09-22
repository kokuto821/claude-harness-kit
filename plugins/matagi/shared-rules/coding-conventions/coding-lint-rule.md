# コーディングLintルール

`coding-rule.md` のうち、**機械的に判定可能**な項目を linter 対応ルールとして分離したもの。決定論的に判定でき見逃しがないため、本来はレビューではなく linter に任せるべき項目である（**本 kit 自体には ESLint 設定・hooks 等のコードは未配線で、`frontend-code-reviewer`/`frontend-test-reviewer` からもレビュー対象外としているため、導入までの間は検査対象となる保証がない**。詳細は背景節を参照）。文脈依存でレビューでしか検出できない項目は `coding-rule.md` に残している。

## 命名規則

| 対象 | 規則 | 対応する ESLint ルール |
|---|---|---|
| コンポーネントファイル | PascalCase | `unicorn/filename-case`（`case: 'pascalCase'`） |
| hooks / utils ファイル | camelCase | `unicorn/filename-case`（`case: 'camelCase'`） |
| 型定義ファイル | camelCase + `Types.ts` サフィックス | `unicorn/filename-case` + カスタムパターン |
| boolean 変数 | `is` / `has` プリフィックス | `@typescript-eslint/naming-convention`（`selector: 'variable'`, `types: ['boolean']`, `prefix: ['is', 'has']`） |
| state 更新関数 | `set` プリフィックス | `@typescript-eslint/naming-convention`（`prefix: ['set']`） |
| コールバック関数 | `on` / `handle` プリフィックス | `@typescript-eslint/naming-convention`（`prefix: ['on', 'handle']`） |
| プロジェクト固有コンポーネント | プロジェクト固有プレフィックス | `unicorn/filename-case` + プロジェクト固有パターン |
| 定数（オブジェクト/レイアウト） | UPPER_SNAKE_CASE | `@typescript-eslint/naming-convention`（`selector: 'variable'`, `modifiers: ['const']`, `format: ['UPPER_CASE']`） |

## TypeScript

- `interface` は使わず `export type` を使用する → `@typescript-eslint/consistent-type-definitions`（`type`）
- **`any` 型は使用しない** → `@typescript-eslint/no-explicit-any`

## 定数

- マジックナンバーは定数化する → `no-magic-numbers` / `@typescript-eslint/no-magic-numbers`

固定文字列・正規表現リテラルの定数化は標準 ESLint ルールでの機械化が難しいため `coding-rule.md` に残す。

## Export パターン

- **Named export を基本**とする（`export const`）、`default export` は page コンポーネントのみ → `import/no-default-export`（page ファイルのみ `overrides` で除外）

## 関数設計

- 関数は**アロー関数**で定義する → `func-style`（`expression`）

## 背景

issue #32。`coding-rule.md` に命名規則や `any` 禁止など機械的に検出できる項目と、SRP 分離や型ガード活用など文脈依存でレビューでしか検出できない項目が混在していたため分離した。本ファイルの項目は各プロダクトの ESLint 設定へ反映する一次情報源として使う想定（今後 ESLint 設定を導入するスキルが参照する）。

## 関連ルール

- [[coding-rule]]（`shared-rules/coding-conventions/coding-rule.md`） — 文脈依存でレビューが必要な項目
