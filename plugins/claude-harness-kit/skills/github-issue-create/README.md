# github-issue-create

issue 駆動開発の**作成フェーズ**を担うスキルです。issue 化すべきかを判断したうえで、定型フォーマット（概要 / 背景・目的・再現手順 / 要件 / 対応方針）で GitHub issue の本文を組み立て、承認を得てから `gh` CLI で issue を作成します。

定義は `SKILL.md`、issue 本文の雛形は `reference/`、判断基準は `shared-rules/issue-driven-development/issue-driven-rule.md` を参照してください。作成した issue を実装・マージまで進める**実行フェーズ**は `skills/github-issue-resolve/` です。
