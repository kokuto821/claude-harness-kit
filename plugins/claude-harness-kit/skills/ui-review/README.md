# ui-review

既存の UI 実装を `rules/ui-design/` のルールに照らしてレビューし、違反・逸脱を指摘するスキルの**入口・承認ゲート**です。

定義は `SKILL.md`、ルール本体は `rules/ui-design/README.md`（索引）を参照してください。監査は `ui-designer` エージェント（レビューモード）に委譲し、改善の適用まで行う場合は人の承認を得たうえで `ui-designer`（修正モード）に委ねます。
