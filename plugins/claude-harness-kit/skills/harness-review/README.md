# harness-review

Claude Code のステアリング資産（CLAUDE.md・rules・skills・subagents・hooks）を**まとめてレビュー**する統合オーケストレータースキルです。

「プロンプト品質」（`prompt-engineer` エージェント）と「ステアリング手法の選択」（`steering-reviewer` エージェント）の2観点に並行委譲し、所見を統合して指摘のみ返します（改善の適用はしない）。単一観点だけでよければ `prompt-review` / `steering-review` を直接使います。人間向けの概要はここ、AI/ハーネス向けの定義は `SKILL.md` にあります。
