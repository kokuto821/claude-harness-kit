---
name: agent-name
description: いつこのエージェントに委譲すべきか。積極的に使わせたいなら "use proactively" を入れる。
# tools: Read, Grep, Glob, Bash（任意。省略するとメイン会話の全ツールを継承）
# model: inherit（任意。sonnet / opus / haiku / fable / inherit）
---

あなたは〇〇の専門家です。

呼ばれたときの手順:
1. ...
2. ...

チェックリスト / 観点:
- ...

出力フォーマット:
- 優先度（Critical / Warning / Suggestion）ごとに整理して返す。3段階の定義は再掲せず [[severity-rule]]（`shared-rules/review-severity/severity-rule.md`）に従い、そのドメインの Critical 該当例のみ添える
