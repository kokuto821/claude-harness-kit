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
| `generate-plugin-json.ts` | `plugins/matagi/.claude-plugin/plugin.json` | `<出力先ディレクトリ>/plugin.json`（`name`/`description` のみ） | `node --experimental-strip-types generate-plugin-json.ts <出力先ディレクトリ>` |
| `generate-hooks-json.ts` | 同上の `hooks` フィールド | `<出力先ディレクトリ>/hooks.json`（`{ hooks: [{ event, matcher, command }] }`） | `node --experimental-strip-types generate-hooks-json.ts <出力先ディレクトリ>` |

既存 `hooks/*.ts` スクリプト本体は変更しない。`command` 中の `${CLAUDE_PLUGIN_ROOT}` は、**`agy` が `${...}` 変数展開を一切サポートしないため**、指定した出力先ディレクトリ（＝プラグインルート）の絶対パスに置換して書き出す。出力先ディレクトリの指定は必須（省略時はエラー終了）。この作業リポジトリでは `.agents/plugins/matagi/` を出力先に指定して生成物（git 管理対象外）を配置している。

## rules・agents の扱い

Antigravity のプラグイン仕様は `rules/`・`agents/` をプラグイン直下のディレクトリとして持つ（前掲の Plugin Directory Layout）。対応方針・変換要否の判断は [[multi-agent-support]]（`documents/research/multi-agent-support.md`）を参照。`agents/*.md` の frontmatter フィールドの完全互換性は実機未検証であり、本 issue のスコープ外とした（issue #59 要件1）。実機で Antigravity を導入できる環境で個別に検証すること。

## 実機検証状況

- **確認済み**: この作業リポジトリに `.agents/plugins/matagi/skills`（`plugins/matagi/skills/` への symlink）を配置し、`agy` のスキル一覧に認識されることを確認した。
- **未確認**: 個々のスキルが description ベースで正しく自動発火するか。`rules/`・`agents/*.md`・`hooks.json` が実機で期待通り読み込まれるか（`agents/*.md` frontmatter の完全互換性、`hooks.json` のフィールド名・イベント名は公式ドキュメントからの類推のままで動作未検証）。

## 未確定事項（残るもの）

- `agents/*.md` frontmatter の Antigravity `agent.md` との完全互換性
- `generate-hooks-json.ts` が生成する `hooks.json` のフィールド名・イベント名の動作検証
- `rules/` の実機読み込み
- スキルの description ベース自動発火の動作

## 関連

- [[multi-agent-support]]（`documents/research/multi-agent-support.md`） — issue #55 時点の3エージェント横断調査・対応方針
- [[structure-rule]]（`shared-rules/repository-structure/structure-rule.md`） — `plugins/matagi/` を唯一の source of truth とする原則
