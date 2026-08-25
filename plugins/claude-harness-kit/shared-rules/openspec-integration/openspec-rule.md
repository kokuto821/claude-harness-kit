# OpenSpec 統合ルール

## 原則

**OpenSpec は「大規模変更の合意形成」だけを担う。実装は既存の産出 skill、レビューは既存のレビュー skill にそのまま委ねる。** OpenSpec 自体が実装・レビューを兼ねることはない。OpenSpec は steering 手法（[[selection-rule]] が扱う CLAUDE.md/rules/skills/subagents 等）の一つではなく、外部の CLI ツールである。両者はレイヤーが異なるため、OpenSpec の役割分担は [[selection-rule]] には追記せず本ルールに独立して置く。

## 判断基準

### いつ OpenSpec の propose を使うか

| 状況（該当する具体的シグナル） | どうする |
|------|---------|
| 実装方針の候補が複数あり比較・トレードオフの整理が要る／設計判断のやり直しが高コスト（後戻りしにくい）／複数の capability（`openspec/specs/` 配下）にまたがる | [[openspec-workflow]]（`skills/openspec-workflow/SKILL.md`）で進める |
| 実装方針が一択で、対話の中で完了条件がその場で1〜3行にまとまる | 使わない。従来どおり `github-issue-resolve` の PLAN フェーズで進める |
| 何から手をつけるか自体が固まっていない | 先に [[openspec-workflow]] の explore フェーズで壁打ちしてから判断する |

`openspec/` が未導入の場合は先に [[openspec-setup]]（`skills/openspec-setup/SKILL.md`）で導入する（§導入 参照）。

境界例: 変更自体は小規模でも、既存の振る舞いを変える破壊的変更のように後戻りコストが高い場合は `propose` を使う。

issue 化すべきかどうかの判断（issue の粒度）自体は [[issue-driven-rule]] の基準に従う。本ルールが扱うのは「issue 化した後、その PLAN フェーズで OpenSpec を使うか」の一段下の判断である。

### 導入

作業ディレクトリごとに [[openspec-setup]]（`skills/openspec-setup/SKILL.md`）で導入する。claude-harness-kit をマーケットプレイスプラグインとして導入したどの作業リポジトリでも同じ手順で再現できるようにするため、`openspec/config.yaml` やフォークしたスキーマ本体（作業リポジトリごとのローカルファイル）ではなく、**この kit 側のスキルとして**導入手順を持たせている（詳細は背景節）。

`openspec-setup` が `openspec/config.yaml` とフォークしたスキーマのテンプレートに埋め込むポインタは、以下を**唯一の正**とする（`openspec-setup` 側には内容を再掲せず、本表を参照させる）。

| 埋め込み先 | 内容 |
|---|---|
| `config.yaml` の `context` | この作業ディレクトリの規約は claude-harness-kit のルール（`plugins/claude-harness-kit/rules/`・`shared-rules/`）を参照し、矛盾しないこと |
| `config.yaml` の `rules.proposal` | 対象 issue 番号を明記すること（[[issue-driven-rule]]） |
| `config.yaml` の `rules.design` | [[design-rule]] の観点で代替案と比較すること |
| `config.yaml` の `rules.tasks` | 各タスクの実装委譲先（tdd/coding/test-coding）を明記すること |
| `config.yaml` の `operations.apply.guidance` | [[openspec-workflow]] スキル経由で進める旨、既存の産出 skill へ委譲する旨 |
| `config.yaml` の `operations.archive.guidance` | archive 前に [[review-independence-rule]] に従ったレビューを済ませる旨 |
| `templates/proposal.md`（HTML コメント） | 対象 issue 番号の明記を促すポインタ（[[issue-driven-rule]]）、[[openspec-workflow]] への参照 |
| `templates/design.md`（HTML コメント） | [[design-rule]]・[[review-independence-rule]] への参照 |
| `templates/tasks.md`（HTML コメント） | 各タスクの実装は [[openspec-workflow]] スキル経由で進める旨の参照 |

いずれも参照ポインタのみで、ルール本文はコピーしない（[[externalization-rule]] §単一情報源）。

### OpenSpec フェーズと既存フェーズ・skill の対応

| OpenSpec フェーズ | 実行手段 | 対応する既存フェーズ・skill |
|---|---|---|
| `explore`（任意） | CLI 生成の `openspec-explore` スキルをそのまま使う（コードを書かないため委譲問題なし） | PLAN フェーズの壁打ちの代替・補助 |
| `propose` | CLI 生成の `openspec-propose`/`openspec-update-change` スキルをそのまま使う（同上） | PLAN フェーズの合意形成手段。proposal/design/specs delta/tasks.md を生成する |
| `apply` | **[[openspec-workflow]] スキル経由。CLI 生成の `openspec-apply-change` は直接使わない**（実装コードを自分で書き、既存の委譲表を無視するため） | IMPLEMENT フェーズの上位ループにすぎない。tasks.md の各項目は、既存の委譲表（[[github-issue-resolve]] 手順4: テストを伴う実装は [[tdd]]、伴わない実装は [[coding]]、テストのみは [[test-coding]] 等）にそのまま従って実装する。**OpenSpec 自身はコードを書かない**。 |
| `archive` / `sync-specs` | **[[openspec-workflow]] スキル経由**（レビューゲートを通してから CLI 生成の `openspec-archive-change`/`openspec-sync-specs` を起動する） | REVIEW〜COMMIT フェーズ内、または PR 作成前に実施し、`openspec/specs/` を確定させる |

### レビュー独立性

**`apply` 実行後のレビューは、`propose`/`apply` を行った本人（同一エージェント）が兼ねない。** 既存の `coding-review`（実装コード）または `ai-engineering-review`（md 資産）に必ず委譲する。これは [[review-independence-rule]] の帰結であり、OpenSpec 専用の新しいメカニズムを追加するものではない。`archive` は、このレビューが完了してから実行する。

**この保証は散文だけに頼らない。** [[openspec-workflow]] が CLI 生成の `openspec-apply-change`/`openspec-archive-change` を起動しない、という記述だけでは、これら2スキル自身の `description` によるユーザー発話からの直接自動起動（[[openspec-workflow]] を経由しないルーティング）を防げない。そのため [[openspec-setup]] が導入時に `.claude/settings.json` の `permissions.deny` へ `Skill(openspec-apply-change *)`・`Skill(openspec-archive-change *)` を追加し、これら2スキルの直接起動そのものを技術的にブロックする（[[harness-rule]] の「破られたら困るか」判定に基づく）。

### `openspec/specs/` と `rules/`・`shared-rules/` の関係

観点が異なるため二重管理ではない。

- `openspec/specs/`: **これから作る／変えていく機能の仕様**（何を作るか。observable behavior の契約）
- `plugins/claude-harness-kit/rules/` ・ `shared-rules/`: **Claude がどう振る舞うか**（steering。この kit 自身の規約）

既存コードの後追いスペック化はしない。これから変更する部分だけを段階的に `openspec/specs/` に落とす方針を取る。

## やってはいけないこと

- 対話ですぐ合意できる小規模な変更にまで OpenSpec の `propose` を持ち込み、フェーズを重くする。
- `apply` フェーズ中に、既存の委譲表を経由せず本ワークフロー自身が実装コードを書く。
- `apply` を実行した本人がそのままレビューを兼ねて `archive` まで進める。
- CLI 生成の `openspec-apply-change`/`openspec-archive-change` を直接起動する。委譲もレビューゲートも持たないため、必ず [[openspec-workflow]] 経由にする。
- `openspec/config.yaml` の `context` / `rules` や、`openspec/schemas/*/templates/*.md` に、この kit のルール本文をコピーする（参照ポインタのみ埋め込む。[[externalization-rule]] §単一情報源）。
- OpenSpec のフェーズ・スキーマの扱いを [[selection-rule]] に追記する（steering 手法の選択基準とは主旨が異なるため、本ルールに独立させている）。

## 背景

issue #13。当初は claude-harness-kit 自身のリポジトリでの利用のみを想定していたが、実際の用途は「マーケットプレイスプラグインとして導入した別の作業リポジトリで OpenSpec を使う」ことだったため、repo-local ファイルへのポインタ直書きから、プラグインとして配布される**スキル**（[[openspec-setup]]・[[openspec-workflow]]）が導入・進行ロジックを持つ方式へ転換した。転換の根拠（`openspec schema fork`/`openspec store` の制約の実機検証結果）は事実であり、本ルールには書かず [[openspec-overview]] を参照する。

OpenSpec の事実（`openspec init` の実際の挙動、コマンド一覧、config.yaml のフィールド等）は本ルールに書かず、[[openspec-overview]]（`documents/reference/spec-driven-development/openspec-overview.md`）を参照する。

## 関連ルール

- [[issue-driven-rule]]（`shared-rules/issue-driven-development/issue-driven-rule.md`） — issue 化の判断・粒度・ブランチ運用
- [[review-independence-rule]]（`rules/harness-engineering/review-independence-rule.md`） — レビュワーと産出者を別エージェントにする原則
- [[design-rule]]（`rules/design-principles/design-rule.md`） — design.md で比較する設計原則
- [[externalization-rule]]（`shared-rules/rule-externalization/externalization-rule.md`） — ルール本文を再掲せず参照する原則
- [[selection-rule]]（`rules/harness-engineering/selection-rule.md`） — steering 手法の選択基準（OpenSpec はこの対象外）
- [[openspec-setup]]（`skills/openspec-setup/SKILL.md`） — 作業ディレクトリへの導入
- [[openspec-workflow]]（`skills/openspec-workflow/SKILL.md`） — フェーズ進行・実装委譲・レビューゲート
- [[github-issue-resolve]]（`skills/github-issue-resolve/SKILL.md`） — apply の実装委譲基準（IMPLEMENT 表）
- [[openspec-overview]]（`documents/reference/spec-driven-development/openspec-overview.md`） — OpenSpec 自体の事実整理
