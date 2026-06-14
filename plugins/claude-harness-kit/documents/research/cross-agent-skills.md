# Cross-Agent Skills 共通化 調査結果

## 概要

`plugins/claude-harness-kit/skills/` を単一の source of truth として、
Antigravity・Codex CLI・GitHub Copilot の3ツールで同じスキルを使える構成の設計メモ。

---

## 各ツールのスキル読み込み先

| ツール | スキル読み込み先（プロジェクトスコープ） | 備考 |
|--------|----------------------------------------|------|
| Claude Code | `.claude/skills/` | per-skill symlink / Windows junction |
| Antigravity | `.agents/skills/` | ネイティブに認識する特別ディレクトリ |
| Codex CLI | `.codex/skills/` | 起動時にスキャン |
| GitHub Copilot | `.github/skills/` | VS Code v1.107+ は `.claude/skills/` も参照可（実験的） |

**スキルフォーマットはすべて共通**（SKILL.md + `name`/`description` フロントマター）。
Claude Code 固有フィールド（`context: fork` 等）は他ツールで無視される。

---

## サブエージェントの互換性

| ツール | エージェント定義場所 | 形式 |
|--------|---------------------|------|
| Claude Code | `.claude/agents/*.md` | frontmatter 付き Markdown |
| GitHub Copilot | `.github/agents/*.agent.md` | frontmatter 付き Markdown（最も近い） |
| Codex CLI | `config.toml` | 独自形式 |
| Antigravity | `agents.md` + 動的サブエージェント | 独自モデル |

→ **サブエージェントは共通化しない**。知識・手順はスキル側に寄せ、各ツールのエージェント定義はスキルを使う薄いラッパーにする。

---

## 推奨ディレクトリ構成（設計案）

```
claude-harness-kit/
├── plugins/claude-harness-kit/
│   └── skills/                        ← source of truth（変更なし）
│
├── .agents/
│   └── skills -> ../plugins/claude-harness-kit/skills  ← Antigravity 用 symlink
├── .codex/
│   └── skills -> ../plugins/claude-harness-kit/skills  ← Codex 用 symlink
├── .github/
│   └── skills -> ../plugins/claude-harness-kit/skills  ← Copilot 用 symlink
│
├── .claude/
│   └── skills/                        ← 既存（per-skill symlink/junction、gitignore）
│
├── AGENTS.md                          ← Codex / Antigravity 向け共有コンテキスト
└── .gitattributes                     ← symlink の改行変換防止
```

---

## シンボリックリンクの方針

- `.agents/skills`・`.codex/skills`・`.github/skills` は**ディレクトリレベルの symlink 1本**
  - 新しいスキルを追加しても自動で反映される
  - `.claude/skills/` の per-skill symlink 方式とは異なる（Windows junction 対応が不要なため）
- これら3つは **git にコミットする**（`.claude/skills/` と違い gitignore しない）
  - WSL 環境では git が symlink をファイルとして追跡できる
  - clone 後に `/sync-skills` を実行しなくてもすぐ使える

```bash
# 作成コマンド（WSL、リポジトリルートで実行）
mkdir -p .agents .codex .github
ln -s ../plugins/claude-harness-kit/skills .agents/skills
ln -s ../plugins/claude-harness-kit/skills .codex/skills
ln -s ../plugins/claude-harness-kit/skills .github/skills
```

---

## 必要な実装変更

| ファイル | 変更内容 |
|---------|---------|
| `plugins/claude-harness-kit/skills/sync-skills/SKILL.md` | Step 3 を追加: 3ターゲットの symlink 再作成（誤削除時のリカバリ） |
| `plugins/claude-harness-kit/rules/skill-sync/sync-rule.md` | 新同期先3ターゲットを追記 |
| `CLAUDE.md` | ディレクトリ構造に `.agents/`・`.codex/`・`.github/` を追記 |
| `.gitattributes`（新規） | `* text=auto eol=lf` で symlink の改行変換を防ぐ |
| `AGENTS.md`（新規） | Codex / Antigravity 向けリポジトリ説明（CLAUDE.md のツール中立版） |

---

## スキルを移植可能に保つ書き方

shared skills のフロントマターは中立に保つ:

```yaml
---
name: skill-name        # kebab-case
description: >          # 自然文。トリガーキーワードを先頭に
  ...
---
```

- `context: fork`・`allowed-tools` などの Claude Code 固有フィールドは他ツールで無視されるが、依存しないほうが安全
- `description` に主要ユースケースのキーワードを含めると各ツールの自動起動精度が上がる

---

## 参考

- 調査元会話: Antigravity + Codex + Copilot の cross-agent 対応を検討した会話（2026-06-12）
- 関連ルール: `rules/skill-sync/sync-rule.md`、`rules/repository-structure/structure-rule.md`
