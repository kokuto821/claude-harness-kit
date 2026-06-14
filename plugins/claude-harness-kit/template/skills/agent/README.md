# skills/agent

そのスキル専用のサブエージェントを置くディレクトリ。

## ここに置くもの

- スキルの手順の一部を委譲するエージェント
- そのスキル以外からは呼ばれないエージェント

## ここに置かないもの

- 複数のスキルで共有するエージェント → `template/agent/` に置く

## ファイル命名

`<role>.md`（kebab-case）。例: `code-reviewer.md`, `diff-analyzer.md`