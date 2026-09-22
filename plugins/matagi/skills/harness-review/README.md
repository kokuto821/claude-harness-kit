# harness-review

プロジェクトの Claude Code ステアリング構成（CLAUDE.md・rules・skills・subagents・hooks・output styles）を、各手法の公式の意図に照らしてレビューするスキルです。

手法の誤用・逸脱を Critical / Warning / Suggestion で指摘します（改善の適用はしない）。監査は `steering-reviewer` エージェントに委譲する入口スキルです。判断基準は `rules/harness-engineering/selection-rule.md`・`rules/harness-engineering/harness-rule.md`、事実は `documents/reference/harness-engineering/steering-claude-code.md`。プロンプト品質・コンテキスト設計も含めて横断でまとめて見る場合は `ai-engineering-review` を使います。人間向けの概要はここ、AI/ハーネス向けの定義は `SKILL.md` にあります。
