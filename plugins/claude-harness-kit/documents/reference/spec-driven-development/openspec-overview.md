# OpenSpec 概要（事実整理）

`@fission-ai/openspec`（[Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)）の挙動を、公式ドキュメント調査と本リポジトリでの実行結果に基づいて整理する。判断（この kit でどう使うか）は [[openspec-rule]]（`shared-rules/openspec-integration/openspec-rule.md`）を参照。本ファイルは事実のみを持つ。

## インストールと init

- グローバルインストール: `npm install -g @fission-ai/openspec@latest`
- 初期化: `openspec init --tools claude --profile core`（Claude Code 向け、非対話）
- Claude Code 選択時に生成されるもの（本リポジトリでの実測。バージョン 1.10.0）:
  - `.claude/skills/openspec-{explore,propose,update-change,apply-change,archive-change,sync-specs}/SKILL.md`（6スキル）
  - `.claude/commands/opsx/{explore,propose,update,apply,archive,sync}.md`（6スラッシュコマンド。内容はスキルとほぼ同一）
  - `openspec/config.yaml`（`schema: spec-driven` が既定で入る。`spec-driven` は組み込みスキーマとして最初から存在し、fork しなくても使える）
  - `openspec/specs/`, `openspec/changes/archive/`
- **CLAUDE.md / AGENTS.md への書き込みは発生しなかった**。Claude Code 向けの統合はスキル（`.claude/skills/`）とスラッシュコマンド（`.claude/commands/`）のみで完結する。他ツール（Cursor 等）ではマーカーブロックを CLAUDE.md/AGENTS.md 相当のファイルに注入する場合があるとドキュメントに記載があるが、Claude Code では確認されなかった。
- `.claude/skills/openspec-*` および `.claude/commands/opsx/*` は `openspec` CLI が生成する成果物であり、本リポジトリでは `.gitignore` で未追跡にしている（既存の `.claude/skills/` の扱いに揃えた）。クローンした各自が `openspec init` を実行して再生成する前提。

## config.yaml のフィールド

- `schema`: 既定で使うワークフロースキーマ名（例: `spec-driven`）。
- `context`（省略可）: 全アーティファクト生成時に AI へ渡されるプロジェクト背景。**生成されるアーティファクトには一切コピーされない**（`openspec-propose` スキルの契約として明記されている。「context/rules は AI への制約であり、ファイルの内容ではない」）。
- `rules`（省略可）: アーティファクト種別（`proposal` / `design` / `tasks` 等）ごとの制約。これも生成物にはコピーされない。
- `operations`（省略可）: `apply` / `archive` の実行時ガイダンス（`guidance:` 配列）。

## schema の仕組み

- `openspec schema which <name>` で解決元（`package` = 組み込み / `project` = ローカル）とパスを確認できる。
- `openspec schema fork <source> <name>` で `openspec/schemas/<name>/` にテンプレート一式（`schema.yaml` + `templates/{proposal,design,spec,tasks}.md`）をコピーする。
- **同名で fork するとローカル版が組み込み版を shadow する**（本リポジトリで実測: `openspec schema fork spec-driven spec-driven` 後、`openspec schema which spec-driven` の `Source` が `project` に変わり、`Shadows: package: ...` と表示される）。
- `openspec schema validate <name>` でフォーク後のスキーマ構造・テンプレートの妥当性を検証できる。

### spec-driven スキーマの4アーティファクト

`proposal → specs → design → tasks` の順（`schema.yaml` の `requires` で依存関係が定義される）。各アーティファクトの生成指示は `schema.yaml` の `instruction:`（自然文）で与えられ、`templates/*.md` はその出力の**骨格**（見出し＋ HTML コメントのプレースホルダ）を提供する。

- `proposal.md`: Why / What Changes / Capabilities（New/Modified） / Impact
- `specs/<capability-path>/spec.md`: 振る舞い契約（ADDED/MODIFIED/REMOVED/RENAMED Requirements、`#### Scenario:` 形式）
- `design.md`: Context / Goals-NonGoals / Decisions / Risks-Trade-offs（複雑な変更のみ作成。生成要否は `instruction` が条件付きで示す）
- `tasks.md`: `- [ ] N.M タスク` のチェックボックス形式。`apply` フェーズはこのチェックボックスをパースして進捗を追跡するため、この形式を外れたタスクは追跡されない。

## テンプレートへのカスタム注記の埋め込み

`templates/*.md` 内の HTML コメント（例: `<!-- Explain the motivation... -->`）は、生成 AI（`openspec-propose` 等のスキル）が「このセクションに何を書くか」を判断するためのインライン指示であり、最終的な生成物では実コンテンツに置き換えられる（既存の英語コメントと同じ扱い）。この kit のルールファイルへの参照ポインタも同じ形式（HTML コメント）で追記しており、ルール本文そのものはコピーしていない。

## フェーズワークフロー

`explore`（任意・壁打ち） → `propose`（proposal/design/specs delta/tasks.md 一式を生成） → `apply`（tasks.md を1つずつ実装） → `archive`（specs delta を `openspec/specs/` にマージし `openspec/changes/archive/` へ格納）。スペックだけを本流に取り込みたい場合は `sync-specs` を使う。

Claude Code では `openspec-*`（`.claude/skills/`、グローバル/プロジェクトローカルいずれの経路でインストールされていても同じ内容）と `/opsx:*`（`.claude/commands/`）は同一の内容を指す。

## 参照

- 公式リポジトリ: https://github.com/Fission-AI/OpenSpec
- ドキュメント: `docs/installation.md`, `docs/customization.md`, `docs/cli.md`, `docs/README.md`（同リポジトリ内）
