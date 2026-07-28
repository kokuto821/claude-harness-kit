# agent テンプレート

複数のスキルから共有して使うサブエージェントのひな形を置くディレクトリ。

## ここに置くもの

- 2つ以上のスキルから呼ばれるエージェント
- リポジトリ全体で再利用する汎用エージェント

## ここに置かないもの

- 特定スキル専用のエージェント → `template/skills/agent/` に置く

## 使い方

`AGENT.md` をコピーして `plugins/claude-harness-kit/agent/<name>.md` に配置する。

> 命名規則・フロントマターの詳細は `shared-rules/naming-conventions/naming-rule.md` と
> `shared-rules/template/template-rule.md` を参照。