---
name: sync-skills
description: shared_ai_skills の全スキルを WSL ~/.claude/skills/ にシンボリックリンク、プロジェクト .claude/skills/ に Windows ジャンクションで同期する。新規スキル追加・削除後に実行する。
---

# sync-skills

`shared_ai_skills` の全スキルを以下の2箇所に同期するスキル。

| 対象 | 方式 | 備考 |
|------|------|------|
| WSL `~/.claude/skills/` | `ln -s`（WSL シンボリックリンク） | WSL 環境で Claude Code を使う場合 |
| プロジェクト `.claude/skills/` | Windows ジャンクション | Windows 環境で Claude Code を使う場合 |

> **注意:** `C:\Users\ihcia\.claude\skills` は Windows ジャンクションが `shared_ai_skills` を直接指しているため操作不要。

以下を **必ず Bash ツールで実行** する。説明だけして終わらないこと。

---

## Step 1: WSL シンボリックリンクの同期

```bash
SKILLS_SRC="/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/shared_ai_skills"
SKILLS_DST="$HOME/.claude/skills"

# 新規リンク作成
for dir in "$SKILLS_SRC"/*/; do
  name=$(basename "$dir")
  target="$SKILLS_DST/$name"
  if [ -L "$target" ]; then
    echo "SKIP: $name"
  elif [ -e "$target" ]; then
    echo "WARN (not a symlink): $name"
  else
    ln -s "$dir" "$target" && echo "LINKED: $name"
  fi
done

# 不要リンク削除
for link in "$SKILLS_DST"/*/; do
  [ -L "${link%/}" ] || continue
  resolved=$(readlink -f "${link%/}" 2>/dev/null || true)
  if [[ "$resolved" != "$SKILLS_SRC"* ]] || [ ! -d "$resolved" ]; then
    echo "REMOVE (stale): $(basename "${link%/}")"
    rm "${link%/}"
  fi
done
```

---

## Step 2: Windows ジャンクションの同期

```bash
SKILLS_SRC_WIN="C:\\Users\\ihcia\\Desktop\\creative\\dev_workspace\\shared_ai_docs\\shared_ai_skills"
SKILLS_DST_WIN="C:\\Users\\ihcia\\Desktop\\creative\\dev_workspace\\shared_ai_docs\\.claude\\skills"
SKILLS_SRC="/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/shared_ai_skills"
SKILLS_DST_POSIX="/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/.claude/skills"

# 新規ジャンクション作成
for dir in "$SKILLS_SRC"/*/; do
  name=$(basename "$dir")
  target="$SKILLS_DST_POSIX/$name"
  if [ -e "$target" ]; then
    echo "SKIP: $name"
  else
    powershell.exe -Command "New-Item -ItemType Junction -Path '${SKILLS_DST_WIN}\\${name}' -Target '${SKILLS_SRC_WIN}\\${name}' | Out-Null" 2>&1
    echo "JUNCTION: $name"
  fi
done

# 不要ジャンクション削除（shared_ai_skills に存在しないもの）
for entry in "$SKILLS_DST_POSIX"/*/; do
  name=$(basename "${entry%/}")
  if [ ! -d "$SKILLS_SRC/$name" ]; then
    powershell.exe -Command "Remove-Item -Path '${SKILLS_DST_WIN}\\${name}'" 2>&1
    echo "REMOVE (stale junction): $name"
  fi
done
```

---

## Step 3: 結果確認

```bash
echo "=== WSL ~/.claude/skills/ ==="
ls -la "$HOME/.claude/skills/"

echo "=== プロジェクト .claude/skills/ ==="
ls -la "/mnt/c/Users/ihcia/Desktop/creative/dev_workspace/shared_ai_docs/.claude/skills/"
```

---

## 完了後の報告

- WSL にリンクしたスキル名 / スキップ / 削除
- Windows ジャンクションを作成したスキル名 / スキップ / 削除

を箇条書きで報告する。
