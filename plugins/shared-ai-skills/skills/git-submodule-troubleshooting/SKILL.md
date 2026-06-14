---
name: git-submodule-troubleshooting
description: "git submoduleで変更差分が消えない、コミットできない、VSCodeの表示がおかしいなどのトラブルが発生した際に参照するスキル。submoduleのポインタズレ・未初期化・リモートとの乖離など典型的な問題の切り分けと対処手順を提供する。"
---

# git submodule トラブルシューティング

## 典型的な問題と対処

### VSCodeでsubmoduleの変更差分が消えない

原因の切り分けを以下の順で行う。

| 確認内容 | コマンド | 対処 |
|---|---|---|
| submodule内に未コミットの変更がある | `git status`（submodule内） | `git add . && git commit` |
| submoduleがリモートより遅れている | `Your branch is behind...` | `git pull` |
| 親リポジトリのポインタがずれている | `git status`（親側） | `git add <submodule> && git commit` |
| VSCodeの表示キャッシュ | — | `Ctrl+Shift+P` → `Developer: Reload Window` |

### 手順

```bash
# 1. submodule内の状態確認
cd your-project/<submodule>
git status

# 2. リモートから最新を取得（behind と表示された場合）
git pull

# 3. 未コミットの変更がある場合
git add .
git commit -m "update: <内容>"
git push
```

---

### 「チェックアウトの前に作業ツリーを消去してください」エラー

親リポジトリ側に未コミットの変更が残っている場合に発生する。

```bash
# 親リポジトリのルートで状態確認
git status

# 変更をコミット
git add .
git commit -m "chore: <内容>"
git push
```

---

### submoduleが空のディレクトリになっている

clone後にsubmoduleを初期化していない場合に発生する。

```bash
git submodule update --init --recursive
```

---

### 親リポジトリのポインタがずれている

submodule側でコミット後、親リポジトリのポインタ更新を忘れた場合に発生する。

```bash
# 親リポジトリのルートで実行
git add <submodule>
git commit -m "chore: update submodule pointer"
git push
```
