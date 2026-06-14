# pnpm + WSL2 + Windows VSCode でTypeScript型解決エラーが発生する問題

**作成日**: 2026-05-18
**カテゴリ**: coding
**タグ**: #pnpm #wsl2 #vscode #typescript #react

## 概要

WSL2上でpnpmを使い、プロジェクトがWindowsファイルシステム（`/mnt/c/`）上にある場合、Windows ネイティブの VSCode から TypeScript の型定義（`@types/react` など）が解決できない。pnpm が WSL2 から作成したシムリンクを Windows プロセスが辿れないことが原因。`.npmrc` に `node-linker=hoisted` を追加して `pnpm install` を再実行することで解決する。

## 詳細

### 問題の背景

以下の環境の組み合わせで発生する：

- プロジェクトが `/mnt/c/`（Windows NTFS）上にある
- pnpm を WSL2 のターミナルから使っている
- VSCode を **Windows ネイティブ**で起動している（Remote-WSL 拡張機能なし）

pnpm はデフォルトでシムリンクベースの `node_modules` 構造を作成する。WSL2 から NTFS 上に作成したシムリンクは特殊なリパースポイントとして保存されており、**Windows ネイティブのプロセスからは辿ることができない**。

### 発生したエラー

```
インターフェイス 'JSX.IntrinsicElements' が存在しないため、暗黙的に JSX 要素の型は 'any' になります。ts(7026)
この JSX タグにはモジュール パス 'react/jsx-runtime' が存在する必要がありますが、見つかりませんでした。ts(2875)
```

全ての `.tsx` ファイルで発生する。

### 原因の特定方法

- `tsc -p tsconfig.app.json --noEmit` → エラーなし（WSL2内で実行されるため）
- VSCode（Windows プロセス）→ 型エラー多数

この差異から、TypeScript の設定ではなく **環境（シムリンクの辿れない問題）** と判断できる。

```bash
# シムリンクになっていることの確認
ls -la node_modules/@types/react
# lrwxrwxrwx ... -> ../../../../node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react
```

### 解決策

プロジェクトルートに `.npmrc` を作成し `node-linker=hoisted` を追加する。

```ini
# .npmrc
node-linker=hoisted
```

```bash
pnpm install  # node_modules をシムリンクなしで再構築
```

`node-linker=hoisted` により、pnpm が npm と同様のフラットな `node_modules` 構造（シムリンクなし）を作成するため、Windows ネイティブ VSCode からも直接アクセス可能になる。

### 試して効果がなかった対策（参考）

| 対策 | 結果 |
|------|------|
| `tsconfig.app.json` の `types` フィールド変更 | ❌ |
| `tsconfig.json` に `compilerOptions` を追加 | ❌ |
| `.vscode/settings.json` で `typescript.tsdk` を指定 | ❌ |
| `preserveSymlinks: true` を tsconfig に追加 | ❌ |
| `paths` に `react/jsx-runtime` を明示指定 | ❌ |
| TS Server 再起動 / Developer: Reload Window | ❌ |

## 参考・関連情報

- 根本原因: WSL2 が NTFS 上に作成するシムリンクは Windows ネイティブプロセスから辿れない
- 恒久対策として Remote-WSL 拡張機能経由で VSCode を使う方法もある
