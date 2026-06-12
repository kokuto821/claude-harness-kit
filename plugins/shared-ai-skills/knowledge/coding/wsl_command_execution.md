# WSLを用いたターミナルコマンドの実行

**作成日**: 2026-02-26
**カテゴリ**: coding
**タグ**: [#wsl, #windows, #powershell, #git]

## 概要

Windows環境において、PowerShellの権限（管理者権限等）や実行ポリシーの問題でコマンドが実行できない場合、コマンドの先頭に `wsl` を付与することで、WSL (Ubuntu) サブシステム上でコマンドを実行できる。

## 詳細

- **問題の背景**:
  WindowsのPowerShell環境でGitコマンド（例: `git config` や `git commit`）やnpmコマンドなどを実行しようとした際、管理者権限が不足している、あるいはファイルのパーミッションエラー（例: `chmod on .git/config.lock failed: Operation not permitted`）などが発生し、処理がブロックされるケースがある。

- **具体的な解決手順や改善点、気づき**:
  - `wsl` プレフィックスを使用する:
    コマンドの先頭に `wsl` を付けることで、Windows側の制約を回避し、内部のLinux（Ubuntu等）環境としてコマンドを処理させることができる。
    - 例: `wsl git status`
    - 例: `wsl git commit -m "メッセージ"`
  - エージェントの動作ルール化:
    人間（ユーザー）のPC環境に依存するエラーを避けるため、一連のターミナル操作においてデフォルトで `wsl` を使用するよう、`.gemini/antigravity/rules/` にカスタムルール（例: `wsl-commands.md`）として定義しておくことが有効であった。
  - Gitのユーザー設定もWSL側で評価されるため、一時的な設定が必要な場合は `wsl git -c user.name="..." -c user.email="..." commit ...` のようにインラインでオプションを付与すると安全に実行できる。

## 参考・関連情報

- [Windows Subsystem for Linux (WSL) の公式ドキュメント](https://learn.microsoft.com/ja-jp/windows/wsl/)
- 本件のルールファイル定義: `C:\Users\ihcia\.gemini\antigravity\rules\wsl-commands.md`
