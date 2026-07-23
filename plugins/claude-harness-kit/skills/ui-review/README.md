# ui-review

既存の UI 実装を `shared-rules/ui-design/` のルールに照らしてレビューし、違反・逸脱を指摘するスキルの**入口・承認ゲート**です。

定義は `SKILL.md`、ルール本体は `shared-rules/ui-design/README.md`（索引）を参照してください。監査は `ui-reviewer` エージェントに委譲し、改善の適用まで行う場合は人の承認を得たうえで `ui-designer` エージェント（修正適用専用）に委ねます。レビュワーと産出者は別エージェント（`rules/harness-engineering/review-independence-rule.md`）。
