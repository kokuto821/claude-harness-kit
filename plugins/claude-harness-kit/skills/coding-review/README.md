# coding-review

対象コードの変更を分析して frontend / backend を判定し、コーディング規約・テスト規約（frontend のみ追加で UI デザイン）の観点で専門サブエージェントへ横断レビューを委譲する統合オーケストレーターです（指摘のみ）。

定義は `SKILL.md` を参照してください。各観点は `frontend-code-reviewer` / `backend-code-reviewer` / `frontend-test-reviewer` / `backend-test-reviewer` / `ui-reviewer`（いずれもレビュー専用）へ委譲します。専用サブエージェントが無い domain は本スキル自身が推論でレビューします（フォールバック）。

改善の適用まで行う場合は産出者を使います: コード・テストの実装は `coding` / `test-coding` スキル、UI は `ui-review`（承認後 `ui-designer` エージェント）。
