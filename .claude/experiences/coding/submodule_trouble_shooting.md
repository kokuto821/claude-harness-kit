# git submodule 変更差分が消えない問題の対処

## 原因

submodule（`shared_ai_docs`）のローカルが、リモートより1コミット遅れていたため、親リポジトリとの間でポインタのズレが発生していた。

---

## 対処手順

### 1. submodule内の状態確認

```bash
cd your-project/shared_ai_docs
git status
```

### 2. リモートから最新を取得

```bash
git pull
```

---

## 原因の切り分けフロー

VSCodeでsubmoduleの変更差分が消えない場合、以下の順で確認する。

| 確認内容 | コマンド | 対処 |
|---|---|---|
| submodule内に未コミットの変更がある | `git status` | `git add . && git commit` |
| submoduleがリモートより遅れている | `Your branch is behind...` | `git pull` |
| 親リポジトリのポインタがずれている | `git status`（親側） | `git add shared_ai_docs && git commit` |
| VSCodeの表示キャッシュ | — | `Ctrl+Shift+P` → `Developer: Reload Window` |

今回は **submodule側が `git pull` 忘れ** で1コミット遅れていたケースだった。

---

## ルートリポジトリからサブモジュールを操作する

サブモジュールのコミット自体は必ずサブモジュール側で行う必要がある（gitの仕様）。
ただし `-C` オプションを使うことで、ルートにいながらサブモジュール側のコマンドを実行できる。

### `-C` オプションで実行

```bash
# ルートにいながらサブモジュール側でadd・commit・push
git -C shared_ai_docs add .
git -C shared_ai_docs commit -m "update: skills"
git -C shared_ai_docs push

# 親リポジトリのポインタを更新
git add shared_ai_docs
git commit -m "chore: update submodule pointer"
git push
```

### foreach で全サブモジュールに一括実行

```bash
git submodule foreach 'git add . && git commit -m "update" && git push'
```

### 注意点

- サブモジュールのコミットと親リポジトリのコミットは必ず**2段階**になる
- VSCodeのソース管理パネルでもサブモジュールは別セクションで表示され、個別にコミットが必要
- `cd` を省略できるだけで、2段階の操作自体は省略できない