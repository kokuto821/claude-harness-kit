# スキル・エージェント命名規則

## スキル

### ディレクトリ名（= コマンド名）

ディレクトリ名がそのまま `/コマンド名` になる。`name:` フロントマターは一覧表示用ラベルにすぎない。

- **kebab-case 必須**（小文字・数字・ハイフンのみ）
- 具体的・記述的に（`helper`, `stuff`, `my-skill-v2` などは不可）
- マーケットプレイス配布前提なら kebab-case は必須（非準拠は弾かれる）

```
✅ commit-message-simple, tdd-expert, record-knowledge
❌ tdd_expert, MySkill, commitMessageSimple
```

### SKILL.md フロントマター

必須フィールド:

```yaml
---
name: kebab-case-name       # ディレクトリ名と一致させる
description: >              # Claudeの自動起動トリガー。主要ユースケースを先頭に書く
  （説明文。description + when_to_use の合計が1,536文字に切り詰められるため要点を先頭に）
---
```

**`name` と `description` の役割分担:**

| フィールド | 用途 | 書き方 |
|-----------|------|--------|
| `name` | 人間が `/コマンド` で呼ぶラベル | kebab-case |
| `description` | Claude が自動委譲を判断するキー | トリガーキーワードを含む自然文 |

### 公開済みスキルのリネーム

マーケットプレイス配布後のリネームは事実上の破壊的変更（semver-major相当）。安易にリネームしない。

---

## エージェント（.claude/agent/*.md）

- ファイル名: **kebab-caseのロール名**（役割を表す名詞・名詞句）
- スキルが「動詞（タスク）寄り」なのに対し、エージェントは持続的な役割を持つ存在

```
✅ code-reviewer, security-reviewer, competitive-research-agent
❌ doCodeReview, helper, reviewer
```

- **`description` が最重要**: 自動委譲は description の具体性で決まる。「どんなタスクか／何を返すか／いつ起動すべきか」を明確に書く
- ボディ（`---` 以降）は会話文ではなく **職務記述書** スタイルで書く
- 組み込みエージェントのキーワードと衝突する汎用名に注意（`code-reviewer` などは Anthropic 側の定義済みルールを誘発してシステムプロンプトを上書きするリスクがある）

---

## フォルダ・ファイル全般

| 対象 | 規則 |
|------|------|
| スキルディレクトリ | kebab-case |
| ルールファイル | `kebab-case.md` |
| エージェントファイル | `kebab-case.md` |
| プラグイン名 | kebab-case |
