# vitest + jsdom v27 の ESM 互換性問題

**作成日**: 2026-03-29
**カテゴリ**: coding
**タグ**: #vitest, #jsdom, #happy-dom, #testing, #ESM

## 概要

vitest で `environment: 'jsdom'` を使うと、jsdom v27 以降が依存する `@asamuzakjp/css-color` や `@csstools/css-calc` が ESM 専用モジュールであるため `ERR_REQUIRE_ESM` エラーが発生する。`happy-dom` に切り替えることで解消できる。

## 詳細

### 問題の背景

- jsdom v27 以降、内部で ESM Only なパッケージを使うようになった
- vitest の CommonJS コンテキストでそれらを `require()` しようとして失敗する

### エラー内容

```
ERR_REQUIRE_ESM
Instead change the require of @csstools/css-calc/dist/index.mjs to a dynamic import()
```

### 解決手順

`jsdom` の代わりに `happy-dom` をインストールして切り替える。

```bash
npm install -D happy-dom
```

```ts
// vite.config.ts
test: {
  globals: true,
  environment: 'happy-dom',  // 'jsdom' から変更
  setupFiles: './src/test/setup.ts',
},
```

### なぜ happy-dom か

- ESM 互換性の問題がない
- vitest との相性が良く、軽量で起動が速い
- `@testing-library/react` との組み合わせで問題なく動作する

## 参考・関連情報

- vitest 公式: https://vitest.dev/config/#environment
- happy-dom: https://github.com/capricorn86/happy-dom
