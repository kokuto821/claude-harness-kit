# tdd

TDD（テスト駆動開発）の List→Red→Green→Refactor→Commit サイクルを統括するスキルです。

各フェーズを domain 非依存の単一入口スキル（`test-coding` / `coding` / `coding-review`）へ委譲します。
domain（frontend/backend 等）の判定と具象サブエージェント（`frontend-tester`/`backend-tester`、
`frontend-coder`/`backend-coder`、各レビュアー等）への分岐は各入口スキル側の責務で、tdd スキル自身は
フェーズの進行統括のみを行います。

フェーズごとの委譲先・反復上限などの詳細は `SKILL.md`、TDD 方法論の定義は
`shared-rules/coding-conventions/tdd-rule.md` を参照してください。
