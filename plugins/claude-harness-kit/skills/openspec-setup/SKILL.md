---
name: openspec-setup
description: >
  「OpenSpecを導入して」「この作業ディレクトリでOpenSpecを使えるようにして」
  「openspec initして」と言われたとき、npm経由でのopenspec CLI導入確認から
  openspec init・schemaのローカルfork・claude-harness-kitのルールファイルへの
  参照ポインタ埋め込みまでを自動化する。グローバルインストールとファイル生成を
  伴うため、各ステップで確認を挟む。
disable-model-invocation: true
---

# openspec-setup

## 概要

作業ディレクトリに OpenSpec（`@fission-ai/openspec`）を導入し、`openspec-workflow`（`skills/openspec-workflow/SKILL.md`）で使う前提を整える。claude-harness-kit がマーケットプレイスプラグインとして導入されているどの作業リポジトリでも、同じ手順で同じ内容の `openspec/config.yaml`・ローカル fork したスキーマを再現できるようにする。

## ルール

- ポインタは参照のみで、ルール本文はコピーしない（[[externalization-rule]]、`shared-rules/rule-externalization/externalization-rule.md`）。
- 本スキルは導入（セットアップ）のみを担う。導入後のワークフロー進行は [[openspec-workflow]]（`skills/openspec-workflow/SKILL.md`）に委ねる。
- OpenSpec フェーズと既存 skill の役割分担・埋め込むポインタの内容は [[openspec-rule]]（`shared-rules/openspec-integration/openspec-rule.md`）を唯一の正とする。
- OpenSpec 自体の事実（コマンド・config.yaml のフィールド等）は [[openspec-overview]]（`documents/reference/spec-driven-development/openspec-overview.md`）を参照する。

## 手順

1. **CLI の有無を確認する** — `openspec --version` を実行する。失敗したら `npm view @fission-ai/openspec version` で最新版を確認し、`npm install -g @fission-ai/openspec@<version>` の実行をユーザーに確認してから実施する（グローバル環境への副作用のため）。
2. **既存導入の確認（冪等性）** — 対象ディレクトリに `openspec/` が既にあれば、以下で不足分を特定し、以降の手順はその不足分のみ実施する（フルスクラッチではないことをユーザーに伝える）。
   - `openspec/config.yaml` の有無・`schema: spec-driven` の有無 → 無ければ手順3・7
   - `openspec schema which spec-driven` の `Source` が `project` か → `package` のままなら手順5未実施
   - `openspec/schemas/spec-driven/templates/proposal.md` に `claude-harness-kit:` を含む HTML コメントがあるか（`grep -l "claude-harness-kit:" openspec/schemas/spec-driven/templates/*.md`） → 無ければ手順6
3. **`openspec init`** — `openspec init --tools claude --profile core` を実行する。他ツールを使いたい場合のみ `--tools` を変更する（ユーザーに確認してから）。
4. **生成物の確認** — `git status`/`git diff` で `.claude/skills/openspec-*` と `.claude/commands/opsx/` が生成されたことを確認する。`.gitignore` に `.claude/skills/`・`.claude/commands/` が無ければ追加を提案する（これらは `openspec init`/`openspec update` のたびに再生成される成果物であり、この kit の管理対象ではない）。
5. **schema のローカル fork** — `openspec schema fork spec-driven spec-driven`（同名でのローカル上書き）を実行する。`openspec schema which spec-driven` で `Source: project` に切り替わったことを確認する。
6. **テンプレートへのポインタ埋め込み** — フォークしたテンプレート（`openspec/schemas/spec-driven/templates/{proposal,design,tasks}.md`）に、`<!-- claude-harness-kit: ... -->` 形式の HTML コメントで参照ポインタを埋め込む(ルール本文はコピーしない)。**埋め込む内容は [[openspec-rule]] §導入 の表を唯一の正とし、本手順には再掲しない**（対象 issue 番号の明記が不要な作業ディレクトリでは、`proposal.md` 側のみユーザーに確認のうえ省略してよい）。実例は claude-harness-kit 自身の `openspec/schemas/spec-driven/templates/*.md` を参照。
7. **`config.yaml` の編集** — `schema`/`context`/`rules`/`operations` を編集する。`context`/`rules` はアーティファクトに一切コピーされない AI 向け制約なので、ここに要点を書いてよい(本文コピーではない)。**書く内容は手順6と同じく [[openspec-rule]] §導入 の表を唯一の正とする。** 実例は claude-harness-kit 自身の `openspec/config.yaml` を参照。
8. **CLI 生成スキルの直接自動起動をブロックする** — `.claude/settings.json`（プロジェクト設定・commit 対象）の `permissions.deny` に以下を追加する（既存の設定は保持してマージする）。理由・位置づけは再掲せず [[openspec-rule]] §レビュー独立性 を唯一の正とする。
   ```json
   "permissions": {
     "deny": [
       "Skill(openspec-apply-change *)",
       "Skill(openspec-archive-change *)"
     ]
   }
   ```
9. **検証** — `openspec schema validate spec-driven` を実行し成功を確認する。
10. **完了報告** — 生成・編集したファイル一覧（`.claude/settings.json` の deny 追加を含む）、`.gitignore` への提案、次は [[openspec-workflow]] スキルで進める旨を提示する。

## 出力

- 確認フェーズ: 各ステップ実行前の確認事項（npm install の要否、`--tools` の選択、`.gitignore` への追加提案）
- 完了フェーズ: 生成・編集したファイル一覧、`openspec schema validate` の結果、次の一手（[[openspec-workflow]] へ）
