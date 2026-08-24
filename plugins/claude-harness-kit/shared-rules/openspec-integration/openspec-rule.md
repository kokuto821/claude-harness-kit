# OpenSpec 統合ルール

## 原則

**OpenSpec は「大規模変更の合意形成」だけを担う。実装は既存の産出 skill、レビューは既存のレビュー skill にそのまま委ねる。** OpenSpec 自体が実装・レビューを兼ねることはない。OpenSpec は steering 手法（[[selection-rule]] が扱う CLAUDE.md/rules/skills/subagents 等）の一つではなく、外部の CLI ツールである。両者はレイヤーが異なるため、OpenSpec の役割分担は [[selection-rule]] には追記せず本ルールに独立して置く。

## 判断基準

### いつ OpenSpec の propose を使うか

| 状況（該当する具体的シグナル） | どうする |
|------|---------|
| 実装方針の候補が複数あり比較・トレードオフの整理が要る／設計判断のやり直しが高コスト（後戻りしにくい）／複数の capability（`openspec/specs/` 配下）にまたがる | OpenSpec の `propose`（`/opsx:propose` または `openspec-propose` スキル）を使う |
| 実装方針が一択で、対話の中で完了条件がその場で1〜3行にまとまる | 使わない。従来どおり `github-issue-resolve` の PLAN フェーズで進める |
| 何から手をつけるか自体が固まっていない | 先に `explore`（`/opsx:explore`）で壁打ちしてから判断する |

境界例: 変更自体は小規模でも、既存の振る舞いを変える破壊的変更のように後戻りコストが高い場合は `propose` を使う。

issue 化すべきかどうかの判断（issue の粒度）自体は [[issue-driven-rule]] の基準に従う。本ルールが扱うのは「issue 化した後、その PLAN フェーズで OpenSpec を使うか」の一段下の判断である。

### OpenSpec フェーズと既存フェーズ・skill の対応

| OpenSpec フェーズ | 対応する既存フェーズ・skill |
|---|---|
| `explore`（任意） | PLAN フェーズの壁打ちの代替・補助 |
| `propose` | PLAN フェーズの合意形成手段。proposal/design/specs delta/tasks.md を生成する |
| `apply` | IMPLEMENT フェーズの上位ループにすぎない。tasks.md の各項目は、既存の委譲表（[[github-issue-resolve]] 手順4: テストを伴う実装は [[tdd]]、伴わない実装は [[coding]]、テストのみは [[test-coding]] 等）にそのまま従って実装する。**OpenSpec 自身はコードを書かない**。 |
| `archive` / `sync-specs` | REVIEW〜COMMIT フェーズ内、または PR 作成前に実施し、`openspec/specs/` を確定させる |

### レビュー独立性

**`apply` 実行後のレビューは、`propose`/`apply` を行った本人（同一エージェント）が兼ねない。** 既存の `coding-review`（実装コード）または `ai-engineering-review`（md 資産）に必ず委譲する。これは [[review-independence-rule]] の帰結であり、OpenSpec 専用の新しいメカニズムを追加するものではない。`archive` は、このレビューが完了してから実行する。

### `openspec/specs/` と `rules/`・`shared-rules/` の関係

観点が異なるため二重管理ではない。

- `openspec/specs/`: **これから作る／変えていく機能の仕様**（何を作るか。observable behavior の契約）
- `plugins/claude-harness-kit/rules/` ・ `shared-rules/`: **Claude がどう振る舞うか**（steering。この kit 自身の規約）

既存コードの後追いスペック化はしない。これから変更する部分だけを段階的に `openspec/specs/` に落とす方針を取る。

## やってはいけないこと

- 対話ですぐ合意できる小規模な変更にまで OpenSpec の `propose` を持ち込み、フェーズを重くする。
- `apply` フェーズ中に、既存の委譲表を経由せず本ワークフロー自身が実装コードを書く。
- `apply` を実行した本人がそのままレビューを兼ねて `archive` まで進める。
- `openspec/config.yaml` の `context` / `rules` や、`openspec/schemas/*/templates/*.md` に、この kit のルール本文をコピーする（参照ポインタのみ埋め込む。[[externalization-rule]] §単一情報源）。
- OpenSpec のフェーズ・スキーマの扱いを [[selection-rule]] に追記する（steering 手法の選択基準とは主旨が異なるため、本ルールに独立させている）。

## 背景

issue #13。`openspec/config.yaml`（`context`/`rules`/`operations`）と、ローカルに同名 fork した `spec-driven` スキーマのテンプレート（`openspec/schemas/spec-driven/templates/{proposal,design,tasks}.md`）に、本ルールおよび各ルールファイルへの HTML コメント参照ポインタを埋め込み済み。`openspec-propose` スキルの契約上、`config.yaml` の `context`/`rules` は生成されるアーティファクトに一切コピーされない（AI への制約としてのみ働く）ため、ルール本文の二重管理は発生しない。

OpenSpec の事実（`openspec init` の実際の挙動、コマンド一覧、config.yaml のフィールド等）は本ルールに書かず、[[openspec-overview]]（`documents/reference/spec-driven-development/openspec-overview.md`）を参照する。

## 関連ルール

- [[issue-driven-rule]]（`shared-rules/issue-driven-development/issue-driven-rule.md`） — issue 化の判断・粒度・ブランチ運用
- [[review-independence-rule]]（`rules/harness-engineering/review-independence-rule.md`） — レビュワーと産出者を別エージェントにする原則
- [[design-rule]]（`rules/design-principles/design-rule.md`） — design.md で比較する設計原則
- [[externalization-rule]]（`shared-rules/rule-externalization/externalization-rule.md`） — ルール本文を再掲せず参照する原則
- [[selection-rule]]（`rules/harness-engineering/selection-rule.md`） — steering 手法の選択基準（OpenSpec はこの対象外）
- [[openspec-overview]]（`documents/reference/spec-driven-development/openspec-overview.md`） — OpenSpec 自体の事実整理
