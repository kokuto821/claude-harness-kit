# tdd

TDD（テスト駆動開発）の Red→Green→Refactor→Commit サイクルを統括するスキルです。

各フェーズを既存の役割に委譲します:

- **Red**（失敗テスト）→ `frontend-tester`
- **Green**（最小実装）→ `frontend-coding`
- **Refactor**（改善）→ レビュアー（`frontend-code-reviewer` / `frontend-test-reviewer`）が指摘し、産出者が緑を保ったまま適用
- **Commit** → 緑を確認してチェックポイント化

バックエンドはまだ具象エージェントが未定義のため、**フローの統括のみ**を行い、コードの詳細には関与しません。

方法論の定義は `rules/coding-conventions/tdd-rule.md`、詳細な手順は `SKILL.md` を参照してください。
