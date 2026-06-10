# shared_ai_agents のシンリンク設定手順（WSL2）

**作成日**: 2026-03-29
**カテゴリ**: coding
**タグ**: #claude-code, #wsl2, #symlink, #agents, #sub-agents

## 概要

`shared_ai_agents` をサブエージェント管理リポジトリとして作成し、WSL2 の `~/.claude/agents/` から個別シンリンクで参照する構成。
スキル（`shared_ai_skills`）と同じパターンで、`~/.claude/agents/` は実ディレクトリ＋内部に個別シンリンクとする。

## 詳細

### ディレクトリ構成

```
dev_workspace/
├── shared_ai_docs/        ← ナレッジ・スキル管理（既存）
│   ├── shared_ai_knowledge/
│   └── shared_ai_skills/
└── shared_ai_agents/      ← サブエージェント管理（新規）
    └── [agent-name]/
        └── agent.md
```

### 初回セットアップ手順

```bash
# 1. リポジトリ作成
mkdir -p /mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_agents
cd /mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_agents
git init

# 2. ~/.claude/agents/ を実ディレクトリとして作成
mkdir -p ~/.claude/agents

# 3. 既存エージェントを一括シンリンク（agents追加後に実行）
AGENTS_SRC="/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_agents"
for dir in "$AGENTS_SRC"/*/; do
  agent_name=$(basename "$dir")
  ln -sf "$dir" ~/.claude/agents/"$agent_name"
done
```

### 新しいエージェントを追加した際の同期コマンド

```bash
AGENTS_SRC="/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_agents"
for dir in "$AGENTS_SRC"/*/; do
  agent_name=$(basename "$dir")
  ln -sf "$dir" ~/.claude/agents/"$agent_name"
done
```

### 構成イメージ

```
~/.claude/agents/          ← 実ディレクトリ（Linuxファイルシステム上）
├── [agent-name]          → /mnt/c/.../shared_ai_agents/[agent-name]/
└── ...
```

### プロジェクトローカルで使う場合

各プロジェクトの `.claude/agents/` に個別シンリンクを作成することでプロジェクト固有のエージェントとしても利用可能。
ただしグローバル（`~/.claude/agents/`）で管理すれば全プロジェクトから参照できる。

### knowledge シンリンクの typo 修正（2026-03-29）

`~/.claude/knowledge` が `criative`（誤字）を向いていたため修正した。

```bash
rm ~/.claude/knowledge
ln -s "/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/shared_ai_knowledge/" ~/.claude/knowledge
```

## 参考・関連情報

- [claude_code_skills_symlink_wsl2.md](./claude_code_skills_symlink_wsl2.md) — スキルの同様のシンリンク構成
