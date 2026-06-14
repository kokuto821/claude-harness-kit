---
name: git-submodule-operations
description: "git submoduleに対してルートリポジトリからコミット・プッシュ・更新などの操作を行う際に参照するスキル。cdで移動せずに-Cオプションやforeachを使った操作方法、submoduleと親リポジトリの2段階コミットの手順を提供する。"
---

# git submodule ルートからの操作

## 基本原則

- submoduleのコミットは必ず**submodule側**で行う（gitの仕様）
- submoduleのコミットと親リポジトリのコミットは必ず**2段階**になる
- `-C <path>` オプションで `cd` を省略してルートから操作できる

---

## `-C` オプションを使った操作

ルートにいながらsubmodule側のコマンドを実行できる。

```bash
# submodule側でadd・commit・push
git -C <submodule> add .
git -C <submodule> commit -m "update: <内容>"
git -C <submodule> push

# 親リポジトリのポインタを更新
git add <submodule>
git commit -m "chore: update submodule pointer"
git push
```

---

## foreach を使った一括操作

複数のsubmoduleに対して同じコマンドを一括実行できる。

```bash
# すべてのsubmoduleに対して一括でadd・commit・push
git submodule foreach 'git add . && git commit -m "update" && git push'

# 親リポジトリのポインタを更新
git add .
git commit -m "chore: update submodule pointers"
git push
```

---

## submoduleを最新に更新する

```bash
# 特定のsubmoduleを最新に更新
git submodule update --remote <submodule>

# 親リポジトリのポインタを記録
git add <submodule>
git commit -m "chore: update <submodule> to latest"
git push
```

---

## 新しいプロジェクトにsubmoduleを追加する

```bash
# submoduleを追加
git submodule add https://github.com/<user>/<repo> <directory>

# コミット
git add .
git commit -m "chore: add <repo> as submodule"
git push
```

---

## clone時にsubmoduleも取得する

```bash
# clone時に一括取得
git clone --recurse-submodules https://github.com/<user>/<repo>

# clone済みの場合
git submodule update --init --recursive
```
