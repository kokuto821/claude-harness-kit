# harness-engineering

Claude Code の**ハーネス側の設計**（どの手法で表現し、どの媒体で強制するか）に関するルールを置く場所です。
プロンプト本文の品質を扱う `prompt-engineering/` と対になり、こちらは「入れ物・仕組み」の設計判断を担う。

- `selection-rule.md`: 「CLAUDE.md / rules / skills / subagents / hooks 等どの手法で表現するか」の選択。
- `harness-rule.md`: 「破られたら困る制御をコードで強制するか md でよいか」の媒体判定。
- `review-independence-rule.md`: 「レビュワーと産出者（実装／修正適用）は常に別エージェント」の役割分離。

`selection-rule` / `harness-rule` は harness-review スキル / steering-reviewer エージェントが土台にします。
