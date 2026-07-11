# frontend-code-review

フロントエンドの変更を、コーディング規約・テスト規約・UIデザインの3観点でまとめてレビューする統合オーケストレーターのスキルです（指摘のみ）。

定義は `SKILL.md`。各観点は `frontend-code-reviewer` / `frontend-test-reviewer` / `ui-reviewer` エージェント（いずれもレビュー専用）へ委譲します。改善の適用まで行う場合は産出者を使います: コードは `frontend-coder` スキル、テストは `frontend-tester` エージェント、UI は `ui-review`（承認後 `ui-designer` エージェント）。
