# github-issue-resolve

issue 駆動開発の**実行フェーズ**を担うスキルです。既存の issue を1件選び、ブランチ作成 → 実装方針の合意 → 実装 → セルフレビュー → PR 作成 → マージ → issue クローズまでを一気通貫で進めます。

実装やレビューの中身は既存スキル（`tdd` / `coding` / `coding-review` など）へ委譲し、このスキル自身はフェーズの進行と GitHub 操作だけを担当します。

定義は `SKILL.md`、判断基準は `shared-rules/issue-driven-development/issue-driven-rule.md` を参照してください。issue を新規に作る**作成フェーズ**は `skills/github-issue-create/` です。
