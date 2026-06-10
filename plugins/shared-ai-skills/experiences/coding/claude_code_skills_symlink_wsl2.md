# Claude Code スキルディレクトリのシンリンク問題（WSL2）

**作成日**: 2026-03-20
**カテゴリ**: coding
**タグ**: #claude-code, #wsl2, #symlink, #skills

## 概要

WSL2環境でClaude Codeの `~/.claude/skills` 自体をシンリンクにすると、スキルが認識されない。
解決策は `skills` を実ディレクトリとして作成し、各スキルフォルダへの個別シンリンクを内部に置く構成にすること。

## 詳細

### 問題の背景

Windows側（`C:\Users\...`）でスキルを一元管理し、WSL2の `~/.claude/skills` からシンリンクで参照しようとした。

```bash
# やったこと（NG）
ln -s "/mnt/c/Users/ihcia/Desktop/.../shared_ai_skills" ~/.claude/skills
```

この状態では `/skills` コマンドがすぐに閉じ、`Unknown skill: xxx` エラーが発生してスキルを使えない。

### 原因

Claude Codeは `~/.claude/skills` ディレクトリ自体がシンリンクの場合、スキルを読み込まない。

### 解決策：実ディレクトリ＋個別シンリンク

```bash
# シンリンクを削除して実ディレクトリを作成
rm ~/.claude/skills
mkdir ~/.claude/skills

# 各スキルフォルダへのシンリンクを個別に作成
SKILLS_SRC="/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/shared_ai_skills"
for dir in "$SKILLS_SRC"/*/; do
  skill_name=$(basename "$dir")
  ln -s "$dir" ~/.claude/skills/"$skill_name"
done
```

### 新しいスキルを追加した際の同期コマンド

```bash
SKILLS_SRC="/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/shared_ai_skills"
for dir in "$SKILLS_SRC"/*/; do
  skill_name=$(basename "$dir")
  ln -sf "$dir" ~/.claude/skills/"$skill_name"
done
```

### 構成イメージ

```
~/.claude/skills/          ← 実ディレクトリ（Linuxファイルシステム上）
├── commit-message-simple → /mnt/c/.../shared_ai_skills/commit-message-simple/
├── mashimon              → /mnt/c/.../shared_ai_skills/mashimon/
├── tdd_expert            → /mnt/c/.../shared_ai_skills/tdd_expert/
└── ...
```

### 過去の typo トラブル

初回シンリンク作成時に `criative`（`creative`の誤字）でパスを設定していたため、スキルが読めない状態が続いていた。シンリンクの向き先は `ls -la ~/.claude/skills` で必ず確認すること。

## シンボリックリンクを解除して実コピーに置き換える

### 手順

`~/.claude/skills/` 内の個別シンリンクを削除し、実ファイルのコピーに置き換える場合：

```bash
# プロジェクトの .claude/skills から実ファイルをコピー
cp -rp /mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/.claude/skills/. ~/.claude/skills/
```

※ シンリンクを先に削除してからコピーする場合はシンリンク名を個別に `rm` してからコピーすること。  
　 `~/.claude/skills/*/` のグロブはシンリンク先ディレクトリにマッチしないため、ループで処理するなら名前を明示する。

### VS Code がシンボリックリンク（矢印アイコン）のまま表示される場合

**症状**: Windows 側のジャンクションや WSL シンリンクを解除して実ディレクトリに変更後も、VS Code のエクスプローラーでフォルダアイコンに矢印(→)が付いたまま。

**原因**: VS Code がファイルシステムの変更をキャッシュしており、表示が古い状態のまま残っている。

**解決策**: VS Code ウィンドウをリロードする。

```
Ctrl+Shift+P → "Developer: Reload Window"
```

実体が普通のディレクトリであれば、リロード後に矢印アイコンは消える。

## 参考・関連情報

- Claude CodeのVSCode表示：`~/.claude/skills` が実ディレクトリになったことでエクスプローラーにも表示される可能性がある
- WSL2からWindowsファイルシステムへのシンリンクは `/mnt/c/...` 経由で動作する
