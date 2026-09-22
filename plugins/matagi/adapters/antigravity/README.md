# antigravity

Claude Code 向けプラグインマニフェスト（`plugins/matagi/.claude-plugin/plugin.json`）を、Google Antigravity 向けの `plugin.json` / `hooks.json` に変換するスクリプトを置く場所です。

- `generate-plugin-json.ts`: `plugin.json` から `name` / `description` を抽出し、Antigravity 向け `plugin.json` を出力する。
- `generate-hooks-json.ts`: `plugin.json` の `hooks` フィールドを、Antigravity の hooks.json 形式に変換して出力する。

いずれも `node --experimental-strip-types <script>.ts` で直接実行する。出力先は既定で `dist/` 配下だが、CLI 引数で上書きできる。
