# Google Antigravity アダプタ

issue #59。`plugins/matagi/` を Google Antigravity から利用するための変換スクリプトと、その前提事実をまとめる。判断基準は `shared-rules/issue-driven-development/issue-driven-rule.md` 等の既存ルールに委ね、本ドキュメントは Antigravity 固有の事実・使い方のみを持つ。

## Antigravity のプラグイン機構（前提事実）

- プラグインはワークスペースの `.agents/plugins/<name>/` に配置するか、`agy plugins install <plugin-name>` で `~/.gemini/antigravity-cli/plugins/<name>/` にステージすると、Antigravity Agent が自動検出する。
- `plugin.json` はプラグインの marker で、`skills/`・`agents/`・`rules/`・`hooks.json`・`mcp_config.json` を配下から自動検出する。
- 各作業リポジトリ側での個別配線（symlink 等）は不要 — Claude Code の marketplace と同様、ディレクトリを配置するだけでよい。

出典: [Plugins | Google Antigravity Docs](https://antigravity.google/docs/plugins/)、[Where does Antigravity look for Plugins?](https://atamel.dev/posts/2026/08-18_where_agy_plugins/)（2026-09時点）。

## plugin.json の互換性

Antigravity の `plugin.json` は必須 `name`（`^[a-zA-Z0-9-_]+$`）、任意 `description`、任意 `$schema` のみを持つ。Claude Code の `plugin.json`（`plugins/matagi/.claude-plugin/plugin.json`）は `hooks` フィールドを直接埋め込んでおり形式が異なるため、symlink ではなく変換スクリプトで `name`/`description` のみを抽出したファイルを生成する。

## 変換スクリプト

`plugins/matagi/adapters/antigravity/` に置く。

| スクリプト | 入力 | 出力 | 実行方法 |
|-----------|------|------|---------|
| `generate-plugin-json.ts` | `plugins/matagi/.claude-plugin/plugin.json` | Antigravity 向け `plugin.json`（`name`/`description` のみ） | `node --experimental-strip-types generate-plugin-json.ts [出力先パス]` |
| `generate-hooks-json.ts` | 同上の `hooks` フィールド | Antigravity 向け `hooks.json`（`{ hooks: [{ event, matcher, command }] }`） | `node --experimental-strip-types generate-hooks-json.ts [出力先パス]` |

既存 `hooks/*.ts` スクリプト本体は変更せず、`command` の参照パスをそのまま引き継ぐ。既定の出力先は各スクリプト内の `dist/` 配下（git 管理対象外、都度生成する成果物）。

## rules・agents の扱い

Antigravity のプラグイン仕様は `rules/`・`agents/` をプラグイン直下のディレクトリとして持つ（前掲の Plugin Directory Layout）。対応方針・変換要否の判断は [[multi-agent-support]]（`documents/research/multi-agent-support.md`）を参照。`agents/*.md` の frontmatter フィールドの完全互換性は実機未検証であり、本 issue のスコープ外とした（issue #59 要件1）。実機で Antigravity を導入できる環境で個別に検証すること。

## 未確定事項（本 issue 完了時点で残るもの）

- `agents/*.md` frontmatter の Antigravity `agent.md` との完全互換性（実機検証待ち）
- `generate-hooks-json.ts` が生成する `hooks.json` のフィールド名・イベント名（公式ドキュメントの記述から類推した構造であり、実機での動作検証待ち。スクリプト内にも同旨のコメントを明記）
- `rules/` をプラグインの `rules/` としてそのまま配置した場合に Antigravity が期待通り読み込むか（実機検証待ち）

## 関連

- [[multi-agent-support]]（`documents/research/multi-agent-support.md`） — issue #55 時点の3エージェント横断調査・対応方針
- [[structure-rule]]（`rules/repository-structure/structure-rule.md`） — `plugins/matagi/` を唯一の source of truth とする原則
