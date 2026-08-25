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

**`plugins/claude-harness-kit/skills/openspec-workflow/SKILL.md` を使って進めてください。** explore/propose/update-change/sync-specs は CLI が生成するスキル（`openspec-explore` 等）をそのまま使いますが、apply/archive は `openspec-apply-change`/`openspec-archive-change` を直接使わず、`openspec-workflow` が委譲・レビューゲートを挟んで進行します（理由は `openspec-rule.md` を参照）。

OpenSpec 自体の事実（コマンド・config.yaml のフィールド等）は
`plugins/claude-harness-kit/documents/reference/spec-driven-development/openspec-overview.md`、
既存 skill との役割分担は
`plugins/claude-harness-kit/shared-rules/openspec-integration/openspec-rule.md` を参照してください。

## 前提

この `openspec/` は `plugins/claude-harness-kit/skills/openspec-setup/SKILL.md` で導入したものです（claude-harness-kit 自身のリポジトリも他の作業リポジトリと同じ手順で導入しています）。`.claude/skills/openspec-*` と `.claude/commands/opsx/` は `openspec init` の生成物で `.gitignore` により未追跡なので、クローン後は各自 `openspec-setup` スキルを実行して再生成してください。
