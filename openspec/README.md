# openspec

OpenSpec（`@fission-ai/openspec`、仕様駆動開発ツール）の設定・確定仕様・変更提案を置く場所です。

`plugins/claude-harness-kit/` の一部ではなく、このリポジトリ自身の開発に使うプロジェクトローカルなツール設定です（配置の判断は `plugins/claude-harness-kit/rules/repository-structure/structure-rule.md` の「openspec/ の扱い」節）。

## 構成

| パス | 内容 |
|------|------|
| `config.yaml` | 既定スキーマ・プロジェクトコンテキスト・アーティファクト別ルールの設定 |
| `schemas/` | ローカルにフォークしたワークフロースキーマ（テンプレート編集用） |
| `specs/` | 確定した仕様 |
| `changes/` | 進行中の変更提案（`archive/` に完了分を格納） |

## ワークフロー

1. **探索**(任意): 要件が固まっていない場合は `openspec-explore` で壁打ちする
2. **提案**: `openspec-propose` で `changes/<name>/` に proposal.md・design.md・specs delta・tasks.md 一式を生成する
3. **提案の見直し**(任意): 起票済みの提案を直すときは手で編集せず `openspec-update-change` に通す
4. **実装**: `openspec-apply-change` で tasks.md を1つずつ消化する
5. **反映**: `openspec-archive-change` で `specs/` へマージし `changes/archive/` へ格納する。実装を伴わずスペックだけ取り込む場合は `openspec-sync-specs` を使う

`openspec-*`（スキル）と `/opsx:*`（スラッシュコマンド、例 `/opsx:propose`）は同一の内容を指します。どちらを使ってもかまいません。

OpenSpec 自体の事実（コマンド・config.yaml のフィールド等）は
`plugins/claude-harness-kit/documents/reference/spec-driven-development/openspec-overview.md`、
既存 skill との役割分担は
`plugins/claude-harness-kit/shared-rules/openspec-integration/openspec-rule.md` を参照してください。

## 前提

`.claude/skills/openspec-*` と `.claude/commands/opsx/` は `openspec init` の生成物で `.gitignore` により未追跡です。クローン後は各自 `openspec init --tools claude --profile core` を実行してください。
