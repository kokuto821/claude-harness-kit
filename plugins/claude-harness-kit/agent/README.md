# agent

サブエージェントの定義ファイル（`<role>.md`）を置く場所です。

特定の役割を持つエージェント（例: コーディング規約のレビュアー、テストの TDD 実装・レビュアー、UIデザインのレビュアー、プロンプト設計のレビュー・改善適用）を定義します。

| エージェント | 役割 |
|------------|------|
| `frontend-coder` | コーディング規約に照らしたコードのレビュー・監査（テストは除く） |
| `frontend-tester` | テストの TDD 実装、および既存テストの規約レビュー |
| `ui-designer` | ui-design ルールに照らした UI 実装のレビュー、および承認後の改善適用（2モード） |
| `prompt-engineer` | prompt-* ルールに照らしたプロンプトのレビュー、および承認後の修正適用（2モード） |
| `context-engineer` | context-engineering ルールに照らしたコンテキスト管理（注意予算・構成・実行時取得・長時間軸・ツール効率）のレビュー、および承認後の改善適用（2モード） |
| `steering-reviewer` | selection-rule/harness-rule に照らしたステアリング構成（CLAUDE.md/rules/skills/subagents/hooks）のレビュー |
