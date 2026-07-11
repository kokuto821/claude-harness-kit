# prompt-review

既存のプロンプト・スキル・サブエージェントの指示文を `rules/prompt-*` に照らしてレビューする入口スキルです。

構成要素・推論の足場・頑健性の観点で違反・逸脱を指摘します。監査は `prompt-reviewer` エージェントに委譲し、修正が必要なら人の承認を得てから `prompt-engineer` エージェント（修正適用専用）に適用を委譲します。レビュワーと産出者は別エージェント（`rules/harness-engineering/review-independence-rule.md`）。人間向けの概要はここ、AI/ハーネス向けの定義は `SKILL.md` にあります。
