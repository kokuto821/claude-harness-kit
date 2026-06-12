# スキル同期ルール

## 同期コマンド

`/sync-skills` を実行すると `plugins/shared-ai-skills/skills/` 配下のスキルを以下の2箇所に同期する:

- WSL `~/.claude/skills/` にシンボリックリンクで同期
- プロジェクト `.claude/skills/` に Windows ジャンクションで同期

## 実行タイミング

新規スキル追加・削除後に必ず実行する。
