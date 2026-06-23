---
name: create-skill
description: >
  スキルまたはサブエージェントを新規作成する。命名規則・テンプレート・配置ルールに
  従ってファイルを生成する。
  「スキルを作りたい」「エージェントを追加したい」「SKILL.md を作って」と言ったとき
  に起動する。
---

# create-skill

## 概要

このリポジトリのルール（命名規則・配置先・テンプレート）に沿って、スキルまたは
サブエージェントのファイルを対話的に生成する。

## 参照するルール・テンプレート

| 用途 | パス |
|------|------|
| 命名規則 | `rules/naming-conventions/naming-rule.md` |
| 配置ルール | `rules/repository-structure/structure-rule.md` |
| テンプレートルール | `rules/template/template-rule.md` |
| ルール外部化原則 | `rules/rule-externalization/externalization-rule.md` |
| ハーネス制御の媒体選択 | `rules/harness-control/harness-rule.md` |
| スキルテンプレート | `template/skills/SKILL.md` |
| エージェントテンプレート | `template/agent/AGENT.md` |

## 手順

### 1. 種別と目的を確認する

ユーザーの発言から以下を読み取る。不明な場合は質問する。

- **種別**: スキル or サブエージェント
- **名前（候補）**: ユーザーが挙げた名前、または目的から導出する
- **目的**: 何をするか（1〜2行）

### 2. 名前を命名規則に照らして確定する

`rules/naming-conventions/naming-rule.md` のルールに従う。

| 種別 | 形 | 例 |
|------|----|----|
| スキル（タスク系） | 動詞・命令形 | `deploy`, `create-skill` |
| スキル（知識系） | 名詞句 | `api-conventions` |
| サブエージェント | 役割名詞 | `code-reviewer`, `docker-expert` |

- kebab-case 必須
- `helper`, `stuff`, `my-skill-v2` などは不可
- ユーザーの候補が規則に合わない場合は修正案を提示してから確認する

### 3. 配置先を決定する

`rules/repository-structure/structure-rule.md` に従う。

| 種別 | 配置先 |
|------|--------|
| スキル | `plugins/claude-harness-kit/skills/<name>/SKILL.md` |
| サブエージェント | `plugins/claude-harness-kit/agent/<name>.md` |

### 4. 内包するルールを外部化できるか確認する

`rules/rule-externalization/externalization-rule.md` に従い、スキル・エージェントに書こうとしているルール・制約・判断基準が `rules/` に切り出せるものかを判断する。

- **切り出す**: 他のスキル・エージェントにも適用できる、または「常に従うべき不変のガイドライン」の性質を持つもの
- **インラインのまま**: そのスキル固有の手順・実行ロジック

切り出す場合は先に `rules/<topic>/` にルールファイルを作成し、スキル・エージェントからはパスで参照する。

また、`rules/harness-control/harness-rule.md` に従い、スキルに付随する自動化・制御処理の媒体を判断する。

- **コード（`.sh` / `.ts` / `.js`）**: 「破られたら困る」制御（パーミッション、フック実行ロジック、リトライ）
- **Markdown（`.md`）**: モデルへのソフトな指針（方針、規約、トーン）

### 5. テンプレートを読み込んでドラフトを作成する

#### スキルの場合

`template/skills/SKILL.md` を読み込み、以下を埋める。

```yaml
---
name: <確定した名前>
description: >
  <ユーザーが自然に言う言葉（トリガー語）を先頭に。要点を先頭に>
# when_to_use: （任意）
# allowed-tools: （任意）
# disable-model-invocation: true  （副作用ありのタスク型を手動起動のみにしたい場合）
---
```

本文構成（概要／ルール／手順／出力・500行未満）は [[template-rule]] (`rules/template/template-rule.md`) を唯一の出典とする。テンプレートの構成をそのまま埋め、構成を独自に定義し直さない。Step 4 で外部化したルールがあれば `## ルール` 節に参照を記載し、無ければ節ごと削除する。

#### サブエージェントの場合

`template/agent/AGENT.md` を読み込み、以下を埋める。

```yaml
---
name: <確定した名前>
description: <委譲条件を具体的に。いつ・何を・どう返すかを明示>
# tools: （任意。省略で全ツール継承）
# model: （任意。haiku でコスト最適化など）
---
```

本文は「役割宣言 → 手順 → チェックリスト/観点 → 出力フォーマット」の職務記述書スタイル。

### 6. ドラフトをユーザーに提示して確認を取る

作成予定のファイル内容を全文提示し、以下を確認する。

- 名前・配置先は正しいか
- description のトリガー語は自然か
- 手順・出力フォーマットは意図通りか

修正があれば反映してから再提示する。

### 7. ファイルを書き込む

承認を得たら Write ツールでファイルを作成する。

### 8. 後続作業を案内する

**スキルを作成した場合:**

```
skills/ 配下に配置済みです。Claude Code を再起動すると反映されます。
```

**サブエージェントを作成した場合:**

```
agent/ 配下に配置済みです。Claude Code を再起動すると反映されます。
```

## 出力

- 確認フェーズ: ドラフト全文（フロントマター＋本文）
- 完了フェーズ: 作成したファイルのパスと後続手順
