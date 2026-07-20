# tdd

TDD（テスト駆動開発）の Red→Green→Refactor→Commit サイクルを統括するスキルです。

各フェーズを既存の産出者・レビュアー（`frontend-tester` / `frontend-coding` / 各 reviewer）へ委譲し、
フロントエンドのコードを1サイクルずつ駆動します。具象エージェントが未定義のドメイン（バックエンド等）は、
フローの統括のみを行いコードの詳細には関与しません。

フェーズごとの委譲先・反復上限などの詳細は `SKILL.md`、TDD 方法論の定義は
`rules/coding-conventions/tdd-rule.md` を参照してください。

`tdd-cycle.sh` は、反復サイクル数を決定論的に数えて上限（既定3回）到達を通知する
ガードスクリプトです。スキルがサイクル境界で呼び出します。
