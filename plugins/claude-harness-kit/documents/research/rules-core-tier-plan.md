# rules 2層化（コア/参照ディレクトリ分割）実装プラン

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** rules を「コア（`rules/`・必読）」と「参照（`shared-rules/`・任意タイミング）」に分割し、`rules/` を `.claude/rules` へディレクトリ symlink して native 自動ロードする。

**Architecture:** 非コア11トピック + 雛形を `rules/` → `shared-rules/` へ移動。参照パスを一括更新。`.claude/rules` → `../plugins/claude-harness-kit/rules` のディレクトリ symlink 1本でコアのみ常時ロード。関連規約と CLAUDE.md 索引を2ディレクトリ構成に更新。

**Tech Stack:** Markdown、`git mv`、`perl` 置換、POSIX symlink、Claude Code の `.claude/rules/` native rule 機構。テストコードは無く、検証は grep/readlink と新規セッションでのロード確認（手動）。

## Global Constraints

- 実体の source of truth は `plugins/claude-harness-kit/` 配下に単一。コピー同期はしない。
- symlink は**相対パス・ディレクトリ単位**（`.claude/rules` → `../plugins/claude-harness-kit/rules`）。
- コア6本（`structure-rule`/`harness-rule`/`selection-rule`/`review-independence-rule`/`content-fidelity-rule`/`design-rule`）は移動・改名しない。
- 既存ルールの**内容の意味改変はしない**。移動・参照パス更新・規約への2ディレクトリ記述追加に限る。
- 対象は WSL 内完結。Windows チェックアウトは前提にしない。
- 文書は通常日本語。コミットメッセージはプレフィックス付き日本語。コミットはユーザー承認後。
- 設計根拠は `plugins/claude-harness-kit/documents/research/rules-core-tier.md` を参照。
- 移動対象11トピック: `rules-directory` `naming-conventions` `readme-convention` `rule-externalization` `code-review` `review-severity` `prompt-engineering` `context-engineering` `ui-design` `coding-conventions` `user-feedback`（＋ `template`）。

---

### Task 1: 非コア11トピック + 雛形を `shared-rules/` へ移動

**Files:**
- Create: `plugins/claude-harness-kit/shared-rules/`（新ディレクトリ）
- Move: 上記11トピック + `template/` を `rules/` → `shared-rules/`

- [ ] **Step 1: 移動前の状態を記録**

```bash
cd /home/ihcia/workspace/claude-harness-kit/plugins/claude-harness-kit
ls rules/
```
Expected: コア4トピック（`repository-structure` `harness-engineering` `content-fidelity` `design-principles`）+ 非コア11 + `template` + `README.md`。

- [ ] **Step 2: `git mv` で移動**

```bash
cd /home/ihcia/workspace/claude-harness-kit/plugins/claude-harness-kit
mkdir -p shared-rules
for t in rules-directory naming-conventions readme-convention rule-externalization code-review review-severity prompt-engineering context-engineering ui-design coding-conventions user-feedback template; do
  git mv "rules/$t" "shared-rules/$t"
done
```

- [ ] **Step 3: 移動結果を確認**

```bash
cd /home/ihcia/workspace/claude-harness-kit/plugins/claude-harness-kit
echo "== rules/（コアのみ残る）=="; ls rules/
echo "== shared-rules/（移動分）=="; ls shared-rules/
```
Expected: `rules/` は `repository-structure` `harness-engineering` `content-fidelity` `design-principles` `README.md` のみ。`shared-rules/` に11トピック + `template`。

- [ ] **Step 4: コミット**

```bash
cd /home/ihcia/workspace/claude-harness-kit
git add -A plugins/claude-harness-kit/rules plugins/claude-harness-kit/shared-rules
git commit -m "refactor: 参照層ルールをshared-rulesディレクトリへ分離する"
```

---

### Task 2: 参照パスを `rules/<topic>` → `shared-rules/<topic>` に一括更新

**Files:**
- Modify: リポジトリ全体の `.md`（CLAUDE.md・skills・agent・shared-rules内・README・knowledge 等、のべ約87ファイル）

**Interfaces:**
- Consumes: Task 1 の移動後ディレクトリ構成。

- [ ] **Step 1: `perl` 負後読みで一括置換（二重適用回避）**

`(?<!shared-)` で既存 `shared-rules/` を除外し、`\Q\E` でトピック名をリテラル扱いする。

```bash
cd /home/ihcia/workspace/claude-harness-kit
for t in rules-directory naming-conventions readme-convention rule-externalization code-review review-severity prompt-engineering context-engineering ui-design coding-conventions user-feedback template; do
  grep -rlZ "rules/$t/" --include='*.md' . | while IFS= read -r -d '' f; do
    perl -i -pe "s{(?<!shared-)rules/\Q$t\E/}{shared-rules/$t/}g" "$f"
  done
done
```

- [ ] **Step 2: 二重適用が無いか検証**

```bash
cd /home/ihcia/workspace/claude-harness-kit
grep -rn "shared-shared" --include='*.md' . && echo "!! 二重適用あり — 要修正" || echo "OK: 二重適用なし"
```
Expected: `OK: 二重適用なし`。

- [ ] **Step 3: 取り残し（コア以外で `rules/<topic>` が残存）を検証**

```bash
cd /home/ihcia/workspace/claude-harness-kit
for t in rules-directory naming-conventions readme-convention rule-externalization code-review review-severity prompt-engineering context-engineering ui-design coding-conventions user-feedback template; do
  grep -rn "rules/$t/" --include='*.md' . | grep -v "shared-rules/$t/"
done
echo "上に出力が無ければ取り残しなし"
```
Expected: 出力なし（全て `shared-rules/<topic>/` へ更新済み）。出力があれば手動修正。

- [ ] **Step 4: コア参照が誤って壊れていないか確認**

```bash
cd /home/ihcia/workspace/claude-harness-kit
for c in repository-structure harness-engineering content-fidelity design-principles; do
  echo "== $c =="; grep -rn "shared-rules/$c/" --include='*.md' . && echo "!! コアが誤置換された — 要修正"
done
echo "上に !! が無ければコア参照は無傷"
```
Expected: `shared-rules/<コア>` が1件も無い（コアは `rules/` のまま）。

- [ ] **Step 5: コミット**

```bash
git add -A
git commit -m "refactor: 参照層ルールへのパス参照をshared-rulesに一括更新する"
```

---

### Task 3: `.claude/rules` ディレクトリ symlink を作成

**Files:**
- Create: `.claude/rules`（`../plugins/claude-harness-kit/rules` への symlink）

- [ ] **Step 1: symlink を作成**

```bash
cd /home/ihcia/workspace/claude-harness-kit
mkdir -p .claude
ln -s ../plugins/claude-harness-kit/rules .claude/rules
```

- [ ] **Step 2: 解決先とロード対象を確認**

```bash
cd /home/ihcia/workspace/claude-harness-kit
ls -l .claude/rules
readlink -f .claude/rules
echo "== symlink 経由で見えるトピック =="; ls .claude/rules/
```
Expected: `.claude/rules -> ../plugins/claude-harness-kit/rules`、`readlink -f` が実在ディレクトリに解決、`ls .claude/rules/` はコア4トピック + `README.md` のみ（shared-rules は見えない）。

- [ ] **Step 3: コミット**

```bash
git add .claude/rules
git commit -m "feat: コアルールを.claude/rulesへディレクトリsymlinkし必読ロード対象にする"
```

- [ ] **Step 4: git が symlink として追跡しているか確認**

```bash
cd /home/ihcia/workspace/claude-harness-kit
git ls-files -s .claude/rules
```
Expected: mode `120000`（symlink）で1エントリ記録。`100644`（実ファイル取り込み）でないこと。

---

### Task 4: structure-rule.md（コア・`rules/` 残置）を更新

**Files:**
- Modify: `plugins/claude-harness-kit/rules/repository-structure/structure-rule.md`

- [ ] **Step 1: 配置先テーブルに shared-rules を追加**

`:16` の行を2行に置換:

before:
```
| ルール | `plugins/claude-harness-kit/rules/<rule-name>/<category-rule>.md` |
```
after:
```
| コアルール（必読・毎セッション自動ロード） | `plugins/claude-harness-kit/rules/<topic>/<category-rule>.md` |
| 参照ルール（任意タイミングで参照） | `plugins/claude-harness-kit/shared-rules/<topic>/<category-rule>.md` |
```

- [ ] **Step 2: `:7` の同期禁止に例外を追記**

before:
```
このディレクトリは `.claude-plugin/marketplace.json` を通じてマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込まれる。手動の symlink / junction 同期は行わない。
```
after:
```
このディレクトリは `.claude-plugin/marketplace.json` を通じてマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込まれる。コンテンツを複製する手動の symlink / junction 同期は行わない（コアルールの単一実体参照は例外。「コアルールの symlink 例外」節を参照）。
```

- [ ] **Step 3: `:22` の `.claude/` 制約に例外を追記**

before:
```
プロジェクトルート直下や `.claude/` 配下にコンテンツの実ファイルを直接作成しない。`.claude/` は `settings.local.json` 等のローカル設定のみを置く。
```
after:
```
プロジェクトルート直下や `.claude/` 配下にコンテンツの実ファイルを直接作成しない。`.claude/` は `settings.local.json` 等のローカル設定と、コアルールの symlink（`.claude/rules` → `plugins/.../rules`、実体は plugins 側）のみを置く。
```

- [ ] **Step 4: `:33` の誤り例に注記**

before:
```
- ❌ `.claude/` 配下にコンテンツの実ファイルを作成する
```
after:
```
- ❌ `.claude/` 配下にコンテンツの実ファイルを作成する（実ファイルの直置きは不可。コアルールのディレクトリ symlink は「コアルールの symlink 例外」節の条件下でのみ可）
```

- [ ] **Step 5: 末尾に「コアルールの symlink 例外」節を追加**

```markdown
## コアルールの symlink 例外

ルールは2層で扱う。`rules/`（コア）はタスク領域を問わず毎セッション効くルール、`shared-rules/`（参照層）は任意タイミングで参照する共通ルール。

- コア（`rules/`）は、この kit をカレントディレクトリで開発する際に確実に読ませるため、`.claude/rules` → `plugins/claude-harness-kit/rules` の**ディレクトリ symlink** で native 自動ロード対象にする。
- 実体は plugins 側のまま（source of truth 単一）。symlink はコンテンツの複製・同期ではなく単一実体への参照。
- 対象は WSL 内完結の開発時のみ。marketplace 経由の導入先には配られない。
- 参照層（`shared-rules/`）は symlink せず、CLAUDE.md 索引と `[[link]]` で必要時に参照する（コンテキスト圧迫を避ける）。
```

- [ ] **Step 6: 確認しコミット**

```bash
git -C /home/ihcia/workspace/claude-harness-kit diff plugins/claude-harness-kit/rules/repository-structure/structure-rule.md
git add plugins/claude-harness-kit/rules/repository-structure/structure-rule.md
git commit -m "docs: structure-ruleにコア/参照2層とsymlink例外を明文化する"
```

---

### Task 5: directory-rule.md（`shared-rules/` へ移動済み）を2ディレクトリ規約に更新

**Files:**
- Modify: `plugins/claude-harness-kit/shared-rules/rules-directory/directory-rule.md`（Task 1 で移動済みパス）

- [ ] **Step 1: 目的節にコア/参照2層の定義を追記**

`## 目的` 節（`:3-5`）の本文を置換:

before:
```
`rules/` には Claude が作業中に常に従うべき不変のガイドラインを置く。
```
after:
```
ルールは2ディレクトリで扱う。**`rules/`（コア）** はタスク領域を問わず毎セッション効く不変のガイドライン。**`shared-rules/`（参照層）** は任意タイミングで参照する共通ルール。コアは `.claude/rules` へのディレクトリ symlink で毎セッション自動ロードされ、参照層は `[[link]]`・索引で必要時に参照される（コンテキスト圧迫を避ける）。どちらもサブディレクトリ＋`<短縮トピック>-rule.md` の構造は共通。
```

- [ ] **Step 2: `:51` の運用ノートを2ディレクトリ説明に置換**

before:
```
> **本 kit での運用**: この `rules/` は CLAUDE.md・skills から `[[link]]` で参照される md であり、`.claude/rules/` の自動ロード対象ではない。frontmatter の `paths:` は上記の一般挙動の説明であり、導入先で native rule 化した際に効く。本 kit 内のルールは実際には frontmatter を持たず、必要時に参照で引かれる。
```
after:
```
> **本 kit での運用（2層）**: **コア**（`rules/`）は、この kit をカレントディレクトリで開発する際に `.claude/rules` → `plugins/.../rules` のディレクトリ symlink で native 自動ロードされる（毎セッション必読）。**参照層**（`shared-rules/`）は自動ロードせず、CLAUDE.md 索引・skills から `[[link]]` で必要時に参照する。frontmatter の `paths:` は一般挙動の説明で、導入先で native rule 化した際に効く。symlink 運用の詳細は [[structure-rule]]（rules/repository-structure/structure-rule.md）の「コアルールの symlink 例外」節を参照。
```

- [ ] **Step 3: `:60` の相互リンク節の背景説明を更新**

before:
```
- `rules/` が `.claude/rules/` 自動ロードではなく `[[link]]` 参照で運用される背景は、上記「本 kit での運用」を参照。
```
after:
```
- 参照層（`shared-rules/`）が `[[link]]` 参照で運用される背景、およびコア（`rules/`）が symlink で自動ロードされる例外は、上記「本 kit での運用（2層）」を参照。
```

- [ ] **Step 4: 確認しコミット**

```bash
git -C /home/ihcia/workspace/claude-harness-kit diff plugins/claude-harness-kit/shared-rules/rules-directory/directory-rule.md
git add plugins/claude-harness-kit/shared-rules/rules-directory/directory-rule.md
git commit -m "docs: directory-ruleをrules/shared-rulesの2ディレクトリ規約に更新する"
```

---

### Task 6: ARCHITECTURE.md と .claude/README.md を更新

**Files:**
- Modify: `ARCHITECTURE.md:9-23`
- Modify: `.claude/README.md:5`

- [ ] **Step 1: `ARCHITECTURE.md` のツリーに shared-rules と .claude/rules を追記**

`:11` の後に行追加、`:20` を更新:

`:11` の
```
│   ├── rules/                  ← Claude が参照するルール
```
を
```
│   ├── rules/                  ← コアルール（必読・.claude/rules へ symlink）
│   ├── shared-rules/           ← 参照層（任意タイミングで参照）
```
に置換。`:20` の
```
└── .claude/                    ← Claude Code 設定（settings.local.json）
```
を
```
└── .claude/                    ← Claude Code 設定（settings.local.json）
    └── rules → plugins/claude-harness-kit/rules  ← コアの symlink（開発時のみ）
```
に置換。

- [ ] **Step 2: `:23` の同期説明に例外注記**

before:
```
スキル・ルール・エージェント等は `.claude-plugin/marketplace.json` 経由でマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込む。手動の symlink 同期は不要。
```
after:
```
スキル・ルール・エージェント等は `.claude-plugin/marketplace.json` 経由でマーケットプレイスプラグイン（`plugins/claude-harness-kit`）として読み込む。コンテンツを複製する手動の symlink 同期は不要。例外として、コアルール（`rules/`）は開発時のみ `.claude/rules` へのディレクトリ symlink で native 自動ロードする（詳細は structure-rule の「コアルールの symlink 例外」節）。
```

- [ ] **Step 3: `.claude/README.md:5` を更新**

before:
```
`settings.local.json` などの設定ファイルのみを置き、スキルやルールなどのコンテンツ本体は置きません（それらは `plugins/claude-harness-kit/` 配下）。
```
after:
```
`settings.local.json` などの設定ファイルを置きます。コンテンツ本体（スキル・ルール等の実ファイル）は置きません（それらは `plugins/claude-harness-kit/` 配下）。例外として `rules` はコアルールのディレクトリ symlink です（実体は `plugins/claude-harness-kit/rules`、この kit 開発時に毎セッション native 自動ロードさせるため）。
```

- [ ] **Step 4: 確認しコミット**

```bash
git -C /home/ihcia/workspace/claude-harness-kit diff ARCHITECTURE.md .claude/README.md
git add ARCHITECTURE.md .claude/README.md
git commit -m "docs: ARCHITECTUREと.claude/READMEにshared-rules分割とsymlink例外を反映する"
```

---

### Task 7: CLAUDE.md 索引を「コア（必読）／参照」の2節に分割

**Files:**
- Modify: `CLAUDE.md`（`## ルール` 節の表。非コアパスは Task 2 で `shared-rules/` に更新済み）

- [ ] **Step 1: 表を2節に置換**

`## ルール` 節の単一表を、コア節（`rules/...` の6行）と参照節（`shared-rules/...` の残り）に分割する。コア6行:

```markdown
### コアルール（必読・`.claude/rules` で自動ロード）

タスク領域を問わず毎セッション効く。開発時は symlink 経由で自動ロードされる（下表は一覧、内容は自動注入）。

| トピック | ルールファイル |
|----------|--------------|
| ファイル配置・リポジトリ構造 | `plugins/claude-harness-kit/rules/repository-structure/structure-rule.md` |
| ハーネス制御（コード vs Markdown の一次判定） | `plugins/claude-harness-kit/rules/harness-engineering/harness-rule.md` |
| ステアリング手法の選択（CLAUDE.md/rules/skills/subagents等） | `plugins/claude-harness-kit/rules/harness-engineering/selection-rule.md` |
| レビュー独立性（レビュワーと産出者は常に別エージェント） | `plugins/claude-harness-kit/rules/harness-engineering/review-independence-rule.md` |
| 原典の忠実な取り扱い | `plugins/claude-harness-kit/rules/content-fidelity/content-fidelity-rule.md` |
| コード設計の普遍原則（DRY 等） | `plugins/claude-harness-kit/rules/design-principles/design-rule.md` |
```

参照節（残り。パスは Task 2 で `shared-rules/` 化済みなのでそれに合わせる）:

```markdown
### 参照ルール索引（必要時に参照）

| トピック | ルールファイル |
|----------|--------------|
| rules/ ディレクトリ規約（配置・命名・相互リンク記法 `[[slug]]`） | `plugins/claude-harness-kit/shared-rules/rules-directory/directory-rule.md` |
| 命名規則（スキル・エージェント） | `plugins/claude-harness-kit/shared-rules/naming-conventions/naming-rule.md` |
| ユーザーフィードバックのルール化 | `plugins/claude-harness-kit/shared-rules/user-feedback/feedback-rule.md` |
| コードレビュー共通ルール（目的＝コードの健康状態の改善・承認の閾値・観点） | `plugins/claude-harness-kit/shared-rules/code-review/review-rule.md` |
| レビュー重大度（Critical/Warning/Suggestion）の共通定義 | `plugins/claude-harness-kit/shared-rules/review-severity/severity-rule.md` |
| スキル・エージェント内のルール外部化 | `plugins/claude-harness-kit/shared-rules/rule-externalization/externalization-rule.md` |
| README の配置（全ディレクトリに必須） | `plugins/claude-harness-kit/shared-rules/readme-convention/readme-rule.md` |
| プロンプト構成要素のチェックリスト | `plugins/claude-harness-kit/shared-rules/prompt-engineering/composition-rule.md` |
| 推論の足場（分解・自己検証）の要否 | `plugins/claude-harness-kit/shared-rules/prompt-engineering/scaffolding-rule.md` |
| プロンプト・スキル改善の原則 | `plugins/claude-harness-kit/shared-rules/prompt-engineering/improvement-rule.md` |
| プロンプト頑健性・安全性 | `plugins/claude-harness-kit/shared-rules/prompt-engineering/robustness-rule.md` |
| コンテキスト管理（有限な注意予算のキュレーション・長時間軸タスク、索引から各ルールへ） | `plugins/claude-harness-kit/shared-rules/context-engineering/README.md` |
| UIデザイン（索引から各ルールへ） | `plugins/claude-harness-kit/shared-rules/ui-design/README.md` |
```

- [ ] **Step 2: 被覆を確認**

```bash
grep -c 'rules/.*\.md`' /home/ihcia/workspace/claude-harness-kit/CLAUDE.md
```
Expected: コア6（`rules/...`）+ 参照13行（`shared-rules/...`）= 19パス。欠落・重複なし。

- [ ] **Step 3: コミット**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md索引をコア必読/参照の2節に分割する"
```

---

### Task 8: rules/README.md と shared-rules/README.md を整備

**Files:**
- Modify: `plugins/claude-harness-kit/rules/README.md`
- Create: `plugins/claude-harness-kit/shared-rules/README.md`（無ければ）

- [ ] **Step 1: `rules/README.md` をコア層の説明に更新（短く保つ）**

symlink で native ロードされうるため簡潔に。

before:
```
経験から体系化した取り決めをトピックごとのサブディレクトリにまとめ、スキルやサブエージェントがここを参照します。
```
after:
```
ここには**コアルール**（タスク領域を問わず毎セッション効くルール）のみを置きます。`.claude/rules` へのディレクトリ symlink で開発時に自動ロードされます。任意タイミングで参照する共通ルールは `../shared-rules/` にあります。
```

- [ ] **Step 2: `shared-rules/README.md` を確認/作成**

Task 1 の移動で `shared-rules/` 直下に README が無い場合は作成:
```markdown
# shared-rules

任意のタイミングで参照する**共通ルール（参照層）**を置く場所です。トピックごとのサブディレクトリに `<短縮トピック>-rule.md` としてまとめ、CLAUDE.md 索引・スキル・サブエージェントから `[[link]]` で必要時に参照します（自動ロードはされません）。毎セッション必読のコアルールは `../rules/` にあります。
```

（`readme-convention` は全ディレクトリに README 必須なので、`shared-rules/` にも必ず置く。）

- [ ] **Step 3: 確認しコミット**

```bash
git -C /home/ihcia/workspace/claude-harness-kit status plugins/claude-harness-kit/rules/README.md plugins/claude-harness-kit/shared-rules/README.md
git add plugins/claude-harness-kit/rules/README.md plugins/claude-harness-kit/shared-rules/README.md
git commit -m "docs: rules/shared-rulesのREADMEを2層構成に整備する"
```

---

### Task 9: 新規セッションでのロード検証（手動・ユーザー実施）

**Files:** なし（動作確認のみ）

- [ ] **Step 1: Claude Code を再起動し、このリポジトリをカレントディレクトリに新規セッションを開く**

- [ ] **Step 2: コアのみロード・参照層は非ロードを確認**

- コア6本の**内容**（例 `content-fidelity-rule.md`・`design-rule.md` の本文）がルール文脈に載っている。
- 参照層11トピック（例 `ui-design`・`coding-conventions`・`prompt-engineering`）の本文は載っていない（索引のパスのみ）。
- `rules/README.md` がロードされても実害が無い。

Expected: コアのみ自動ロード、参照層は未ロード。載らない場合は Claude Code が `.claude/rules` のディレクトリ symlink／サブディレクトリ再帰を辿らない可能性 → `readlink -f .claude/rules` と Claude Code バージョン挙動を確認し、必要ならコアをファイル単位 symlink に切替（フォールバック）。

- [ ] **Step 3: 参照整合の最終確認**

```bash
cd /home/ihcia/workspace/claude-harness-kit
grep -rn "shared-shared" --include='*.md' . && echo "!! 二重適用残存" || echo "OK"
grep -rln "plugins/claude-harness-kit/rules/" --include='*.md' . | xargs -r grep -l "rules-directory\|naming-conventions\|coding-conventions\|ui-design\|review-severity\|code-review\|context-engineering\|prompt-engineering\|rule-externalization\|readme-convention\|user-feedback" && echo "!! 非コアが rules/ 参照で残存" || echo "OK: 非コア参照は shared-rules へ"
```
Expected: いずれも `OK`。

---

## Self-Review（記入済み）

- **Spec coverage**: 設計 doc の各節に対応タスクあり — 分割→Task1、参照更新→Task2、symlink→Task3、規約更新（structure/directory/ARCHITECTURE/.claude README）→Task4,5,6、CLAUDE.md 2節化→Task7、README整備→Task8、検証→Task9。漏れなし。
- **Placeholder scan**: TBD/TODO なし。各編集は before/after を実文言で記載。置換・検証は実コマンド。
- **Type consistency**: 移動対象11トピック + `template` のリストを Task1/2/9 で統一。コア4トピック/6ファイル名を全タスクで統一。symlink は全タスクで `.claude/rules` → `../plugins/claude-harness-kit/rules`（ディレクトリ単位）に統一。
