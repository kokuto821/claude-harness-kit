# agent

サブエージェントの定義ファイル（`<role>.md`）を置く場所です。

特定の役割を持つエージェントを定義します。**1エージェント＝1役割**：レビュワー（評価・指摘のみ）と産出者（実装／修正適用）は常に別エージェントに分ける（`rules/harness-engineering/review-independence-rule.md`）。

### レビュワー（評価・指摘のみ。修正は適用しない）

| エージェント | 役割 | 対の産出者 |
|------------|------|-----------|
| `frontend-code-reviewer` | コーディング規約に照らしたコードのレビュー・監査（テストは除く） | `frontend-coding` スキル |
| `frontend-test-reviewer` | テスト規約に照らした既存テストのレビュー・監査 | `frontend-tester` |
| `ui-reviewer` | ui-design ルールに照らした UI 実装のレビュー | `ui-designer` |
| `prompt-reviewer` | prompt-* ルールに照らしたプロンプトのレビュー | `prompt-engineer` |
| `context-reviewer` | context-engineering ルールに照らしたコンテキスト管理のレビュー | `context-engineer` |
| `steering-reviewer` | selection-rule/harness-rule に照らしたステアリング構成のレビュー | （産出者なし・指摘のみ） |

### 産出者（実装／承認後の修正適用のみ。自作物のレビューはしない）

| エージェント | 役割 |
|------------|------|
| `frontend-tester` | テストの TDD 実装（Red-Green-Refactor-Commit） |
| `ui-designer` | ui-design ルールに照らした UI 実装の修正適用 |
| `prompt-engineer` | prompt-* ルールに照らしたプロンプトの修正適用 |
| `context-engineer` | context-engineering ルールに照らしたコンテキスト管理の修正適用 |

> コードの新規実装（産出）はエージェントではなく `frontend-coding` スキルが担う。
