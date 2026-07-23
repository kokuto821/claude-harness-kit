# rules 2層化: コア/参照のディレクトリ分割設計

## 背景・目的

`rules/` をリポジトリ共通の**コアルール（最優先で守るべきルール）**として位置づけ、**この kit 自身を開発する際に毎セッション必ず読み込ませたい**、という要求から出発した。

現状の課題:

- 本 kit の rules は `plugins/claude-harness-kit/rules/` にあり、Claude Code の native 自動ロード対象（`.claude/rules/`）ではない。CLAUDE.md の rules 参照も索引表（パスのカタログ）にすぎず内容は注入されない。→「必ず読ませる」は未達成。
- 一方、rules 全トピックを必読化すると常時ロードで**コンテキストを圧迫**する。

**解決**: rules を「コア（必読）」と「参照（任意タイミング）」の2ディレクトリに**物理分割**し、コアだけを `.claude/rules/` へ **ディレクトリ symlink** して native 自動ロードする。参照層は symlink 外に置き自動ロードさせない。ディレクトリ symlink 1本で管理が簡潔（コアに追加すれば自動反映）、かつ rules/ にはコアしか無いので全ロードでも圧迫しない。

## スコープ

- **対象**: この kit 自身をカレントディレクトリで開いて開発する時の体験。WSL 内完結。
- **非対象**: marketplace 経由の導入先。`.claude/rules/` の symlink は配布物に含まれず配られない。導入先では従来どおり skills／agents／`[[link]]` 参照で運用。

## 設計

### 2ディレクトリ分割

```
plugins/claude-harness-kit/
├── rules/           ← コアルール（毎セッション必読・.claude/rules へディレクトリ symlink）
│   ├── repository-structure/structure-rule.md
│   ├── harness-engineering/harness-rule.md
│   ├── harness-engineering/selection-rule.md
│   ├── harness-engineering/review-independence-rule.md
│   ├── content-fidelity/content-fidelity-rule.md
│   ├── design-principles/design-rule.md
│   └── README.md    ← コア層の説明（短く保つ）
└── shared-rules/    ← 参照層（任意タイミングで読む共通ルール・symlink 外）
    ├── rules-directory/ naming-conventions/ readme-convention/
    ├── rule-externalization/ code-review/ review-severity/
    ├── prompt-engineering/ context-engineering/ ui-design/
    ├── coding-conventions/ user-feedback/
    ├── template/    ← ルール雛形（旧 rules/template/。native ロード混入を避けるため移動）
    └── README.md
```

### コア（`rules/` 残置・6本）

判断基準 = タスク領域を問わず毎セッション効くもの。

- `repository-structure/structure-rule.md`
- `harness-engineering/harness-rule.md`
- `harness-engineering/selection-rule.md`
- `harness-engineering/review-independence-rule.md`
- `content-fidelity/content-fidelity-rule.md`
- `design-principles/design-rule.md`

### 参照層（`shared-rules/` へ移動・11トピック + 雛形）

`rules-directory`／`naming-conventions`／`readme-convention`／`rule-externalization`／`code-review`／`review-severity`／`prompt-engineering`／`context-engineering`／`ui-design`／`coding-conventions`／`user-feedback`、および `template/`（ルール雛形）。

### ロード機構: ディレクトリ symlink 1本

- `.claude/rules` → `../plugins/claude-harness-kit/rules`（**相対 symlink・ディレクトリ単位**）。
- 実体は `plugins/.../rules/` のまま（source of truth 単一）。symlink はコンテンツの複製ではなく単一実体への参照。
- rules/ 配下（＝コアのみ）が native rule として常時ロードされる。frontmatter `paths:` は不要。
- `rules/README.md` は symlink 内に残るため native ロードされうる。ルール本文ではないので短く保ち、害を最小化する（検証で影響を確認）。

### 移動と参照更新

- 非コア11トピック + `template/` を `rules/` → `shared-rules/` へ `git mv`。
- それらへの参照パスを一括更新: `rules/<topic>/` → `shared-rules/<topic>/`（のべ約87ファイル。`review-severity` 17・`coding-conventions` 11・`ui-design` 9 等）。更新先は CLAUDE.md 索引・各 skill／agent・`[[slug]]` の実パス併記・rules↔shared-rules 相互参照・README・template・knowledge。
- **コア6本への参照は `rules/` のまま不変**（移動しないため影響なし）。
- **`[[slug]]` 自体は不変**（ファイル名ベース）。変わるのは併記された実パスのみ。
- 置換時の注意: `shared-rules/` は文字列 `rules/` を含むため、二重適用で `shared-shared-rules/` になりうる。トピック名を含めた `rules/<topic>/` 単位で置換し、置換後に `grep -r "shared-shared"`（二重適用）と `grep -r "rules/<topic>"`（取り残し、コア以外）で検証する。

### 規約更新

- `repository-structure/structure-rule.md`: 配置先テーブルに `shared-rules/` を追加。コア/参照の定義。`.claude/rules` へのコア symlink 例外を明文化（`:7,22,33` の symlink 全面禁止を緩和）。
- `rules-directory/` は shared-rules へ移動するが、内容を**rules（コア）と shared-rules（参照）の2ディレクトリ規約**に拡張する。
- `ARCHITECTURE.md:9-23`: ツリーに `shared-rules/` を追加、`.claude/rules` symlink 例外を注記。
- `.claude/README.md`: `rules/`（コア symlink）の存在理由を明記。

### CLAUDE.md 索引の2節化

- **コアルール（必読・自動ロード）**節: コア6本、パスは `rules/...`。
- **参照ルール索引**節: 11トピック、パスは `shared-rules/...`。

## symlink 禁止の再評価

- **(a) アーキテクチャ判断**（source of truth 単一・手動同期廃止）: 今回の symlink は単一実体への参照で、コピー二重管理を生まない → source of truth は単一のまま。ただし文言が symlink を広く禁じるため例外の明文化が必要。
- **(b) WSL2 実務トラブル**（`knowledge/coding/` の symlink 3件）: 原因は Windows–WSL 間跨ぎ。今回は WSL 内完結で回避。
- **残る注意点**: git は symlink をコミットするため、将来 Windows 側 clone で壊れうる。WSL 内完結を前提とする。

## 検証

- symlink 作成後、**新規セッション**で:
  - コア6本の内容がロードされている
  - shared-rules 11トピックの本文はロードされていない（索引のパスのみ）
  - `rules/README.md` がロードされても実害が無い
- `grep` で参照の二重適用・取り残しが無いこと。
- `git ls-files -s .claude/rules` で symlink（mode `120000`）として追跡されていること。

## やらないこと（スコープ外）

- コア6本の移動・改名はしない。
- 既存ルールファイルの**内容の意味改変**はしない（移動と参照パス更新のみ。規約ファイルは 2ディレクトリ対応の記述追加に限る）。
