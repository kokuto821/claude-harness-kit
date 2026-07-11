# プロジェクト固有ルールを共有ルール化するときの方針

**作成日**: 2026-06-24
**カテゴリ**: documentation
**タグ**: [#rule, #externalization, #content-fidelity, #refactor]

## 概要

実プロジェクトから持ってきたルール文書を共有ルール化するとき、「プロジェクト固有だから全部消す」は誤り。固有の**例値**は削除せず**中立な例に差し替え**、ルール本文と例の構造は残す。固有名でも**一般化できる規約**は概念を残して説明だけ一般化する。例を全消しすると、例駆動のこのリポジトリでは伝わらないルールになり本末転倒。

## 詳細

### 背景

`coding-rule.md` は元々あるプロジェクトの規約をそのまま持ってきたもので、共有ルール化したかった。`Nei` プレフィックスなどプロダクト・ドメイン固有の記述が混在していた。

### 「固有」を2種類に分けて扱う

- **(A) 例の値だけが固有**（`NeiButton`, `geoparkTypes`, `MAX_ZOOM_LEVEL`, `isWGeopark`, `ecruWhite` 等）
  → ルール自体は一般的。**削除ではなく中立な例に差し替え**る。
  例: `NeiButton`→`AppButton`、`geoparkTypes`→`userTypes`、`MAX_ZOOM_LEVEL`→`MAX_RETRY_COUNT`。
- **(B) スタック・設計そのものが固有**（Framer Motion, Supabase, Atomic Design, `feature/map/` 構成 等）
  → 例の差し替えでは済まない。「共有ルールがどこまで縛るか」の**スコープを先に決めてから一括判断**する。
  今回は「React/Tailwind/Next 前提」と決め、スタックは温存・ドメイン名のみ中立化した。

### 一般化できる規約は概念を残す

`Nei` という文字列はプロダクト固有だが、「**プロジェクト固有コンポーネントに共通プレフィックスで名前空間を切る**」という考え方は転用可能。行ごと消さず、ルールを「プロジェクト固有プレフィックス（プロジェクトごとに定める）」へ一般化し、`Nei` は "採用する場合の例" として残した。

### やってはいけないこと

- **例を全消しする**：このリポジトリは「✅良い例 / ❌悪い例」の例駆動。例を消すと抽象的で従えないルールになり本末転倒。
- **一箇所だけ外科手術**：`Nei` だけ消して `geopark`/`map` を残すと不整合。同じ基準でまとめて棚卸しする。
- **参照先の放置**：本体だけ直すと参照側がドリフトする。`agent/frontend-code-reviewer.md`（旧 `frontend-coder`）の `Nei` 言及も「プロジェクト固有プレフィックス」へ同期した。

### content-fidelity との整合

原典の名残（`Nei` 等）を "例" として残すことで、原典の忠実な取り扱いルールとも喧嘩しない。出自を完全に蒸発させず、一般化された形で痕跡を残せる。

## 参考・関連情報

- `plugins/claude-harness-kit/rules/coding-conventions/coding-rule.md`（適用対象）
- `plugins/claude-harness-kit/rules/content-fidelity/content-fidelity-rule.md`
- `plugins/claude-harness-kit/rules/rule-externalization/externalization-rule.md`
- コミット `84123ca`
