# coding

対象コードを分析して frontend / backend を判定し、対応する専門サブエージェント（`frontend-coder` / `backend-coder`）へ新規実装を委譲する統合スキルです。

定義は `SKILL.md` を参照してください。frontend/backend 以外の domain で専用サブエージェントが無い場合は、本スキル自身が推論で実装します（フォールバック）。

規約準拠のレビューはこのスキルの担当外です。別スキルの `coding-review` を使ってください（実装者に自作物のレビューをさせない。`rules/harness-engineering/review-independence-rule.md`）。
