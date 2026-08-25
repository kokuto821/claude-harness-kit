# WSL2 + gh CLI 環境での git push / PR 本文編集の詰まりどころ

**作成日**: 2026-08-25
**カテゴリ**: coding
**タグ**: [#git, #gh-cli, #wsl2, #vscode, #github]

## 概要

WSL2 上で VSCode Remote 経由の Claude Code セッションから `git push` や `gh pr edit` を実行すると、2つの詰まりどころに遭遇することがある。どちらも回避策がある。

## 詳細

### 1. `git push` が古い VSCode askpass ソケットで失敗する

**事象**:
```
Missing or invalid credentials.
Error: connect ECONNREFUSED /tmp/vscode-git-xxxxxxxx.sock
remote: No anonymous write access.
fatal: Authentication failed for 'https://github.com/...'
```

**原因**: 環境変数 `GIT_ASKPASS`（VSCode の askpass スクリプトを指す）と `VSCODE_GIT_IPC_HANDLE`（`/tmp/vscode-git-*.sock`）が、切断済み・古い VSCode リモートセッションのソケットを指したままになっている。`git config --list` にはこの credential.helper は出てこない（環境変数経由のため）。

**対処**: `gh` 自身は `gh auth status` で正常に認証されている前提で、その場だけ `gh` の credential helper を明示指定し、VSCode の askpass を無効化してバイパスする。

```bash
git -c credential.helper='!gh auth git-credential' -c core.askPass= push
```

### 2. `gh pr edit --body-file` が Projects Classic の GraphQL エラーで失敗する

**事象**:
```
GraphQL: Projects (classic) is being deprecated in favor of the new Projects experience,
see: https://github.blog/changelog/2024-05-23-sunset-notice-projects-classic/. (repository.pullRequest.projectCards)
```

**原因**: `gh pr edit` が編集後の PR 情報取得のために投げる GraphQL クエリが、廃止予定の `projectCards` フィールドを含んでいる（gh CLI 側のバグ）。**本文の更新自体が実際に失敗している**（`gh pr view --json body` で確認すると更新前の本文のまま）ので、エラーを無視して「更新できたはず」と判断しないこと。

**対処**: GraphQL を経由しない REST API を `gh api` で直接叩く。

```bash
gh api repos/<owner>/<repo>/pulls/<番号> -X PATCH -f body="$(cat body.md)"
```

`gh pr edit` 自体は他の用途（タイトル変更等）では問題ないことが多いが、本文更新でこのエラーが出た場合は上記で回避し、`gh pr view --json body` で反映を確認する。

## 参考・関連情報

- 本セッションでの実例: PR #24（claude-harness-kit, issue #13）の本文更新
