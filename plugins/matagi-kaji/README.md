# matagi-kaji

`matagi` 自体（スキル・サブエージェント・ルール等のステアリング資産）を設計・レビューするためのハーネス作成系プラグインです。

matagi 本体の開発でのみ使うスキル群（プロンプト・コンテキスト設計・ステアリング構成のレビューと改善適用）をまとめています。issue駆動開発・TDD・実装コードのコーディング/レビューなど、日常的な駆動開発系スキルは `matagi` プラグイン側にあります。

## ディレクトリ

- `skills/` … Claude Code のスキル（`SKILL.md`）
- `agents/` … サブエージェント定義
- `shared-rules/` … 任意タイミングで参照する共通ルール
- `documents/reference/` … 参照用資料
- `knowledge/` … 開発で得た経験・知見メモ
- `template/` … スキル・エージェントのテンプレート（`create-skill` が使用）
- `.claude-plugin/` … このプラグインのマニフェスト

## 依存関係

一部の `shared-rules/` は `matagi` プラグイン側のルール（`matagi/shared-rules/repository-structure/`、`matagi/shared-rules/matagi-lore/`、`matagi/shared-rules/rules-directory/`、`matagi/shared-rules/review-severity/`、`matagi/shared-rules/code-review/` 等）を `[[link]]` で参照する。両プラグインを併用する前提で運用する。
