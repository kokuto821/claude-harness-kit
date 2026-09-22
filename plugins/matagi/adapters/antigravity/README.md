# antigravity

Claude Code 向けプラグインマニフェスト（`plugins/matagi/.claude-plugin/plugin.json`）を、Google Antigravity 向けの `plugin.json` / `hooks.json` に変換するスクリプトを置く場所です。

- `generate-plugin-json.ts`: `plugin.json` から `name` / `description` を抽出し、Antigravity 向け `plugin.json` を出力する。
- `generate-hooks-json.ts`: `plugin.json` の `hooks` フィールドを、Antigravity の hooks.json 形式に変換して出力する。

いずれも `node --experimental-strip-types <script>.ts <出力先ディレクトリ>` で実行する。出力先ディレクトリ（= Antigravity プラグインルート）は CLI 引数で必須指定し、その直下に `plugin.json` / `hooks.json` を書き出す（ファイル名は固定）。引数を省略するとエラーで案内される。

例:

```
node --experimental-strip-types generate-plugin-json.ts /path/to/antigravity-plugin-root
node --experimental-strip-types generate-hooks-json.ts /path/to/antigravity-plugin-root
```
