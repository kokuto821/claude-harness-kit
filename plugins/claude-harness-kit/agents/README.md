# agent

サブエージェントの定義ファイル（`<role>.md`）を置く場所です。

特定の役割を持つエージェントを定義します。**1エージェント＝1役割**：レビュワー（評価・指摘のみ）と産出者（実装／修正適用）は常に別エージェントに分ける（`rules/harness-engineering/review-independence-rule.md`）。

### レビュワー（評価・指摘のみ。修正は適用しない）

| エージェント | 役割 | 対の産出者 |
|------------|------|-----------|
| `frontend-code-reviewer` | フロントエンドのコーディング規約に照らしたコードのレビュー・監査（テストは除く） | `frontend-coder` エージェント |
| `backend-code-reviewer` | バックエンドのコードのレビュー・監査（backend専用規約は未整備のため design-rule・一般イディオムに基づく） | `backend-coder` エージェント |
| `frontend-test-reviewer` | フロントエンドのテスト規約に照らした既存テストのレビュー・監査 | `frontend-tester` エージェント |
| `backend-test-reviewer` | バックエンドの既存テストのレビュー・監査（backend専用規約は未整備のため design-rule・一般作法に基づく） | `backend-tester` エージェント |
| `test-design-reviewer` | テスト技法に照らしたテスト観点・ケース設計の抜け漏れレビュー | `test-coding` スキル |
| `design-principles-reviewer` | design-rule（DRY/SRP/SoC等）に照らした設計原則のレビュー（コード全般） | 複数（`test-coding` / `coding` 等、design-rule に従うスキル） |
| `ui-reviewer` | ui-design ルールに照らした UI 実装のレビュー | `ui-designer` |
| `prompt-reviewer` | prompt-* ルールに照らしたプロンプトのレビュー | `prompt-engineer` |
| `context-reviewer` | context-engineering ルールに照らしたコンテキスト管理のレビュー | `context-engineer` |
| `steering-reviewer` | selection-rule/harness-rule に照らしたステアリング構成のレビュー | （産出者なし・指摘のみ） |

### 産出者（実装／承認後の修正適用のみ。自作物のレビューはしない）

| エージェント | 役割 |
|------------|------|
| `frontend-coder` | フロントエンドの本番コードの実装（`coding-rule` 準拠。`coding` スキルから frontend 判定時に委譲される） |
| `backend-coder` | バックエンドの本番コードの実装（backend専用規約は未整備のため design-rule・一般イディオムに基づく。`coding` スキルから backend 判定時に委譲される） |
| `frontend-tester` | フロントエンドのテストの実装（`test-rule` 準拠。TDD サイクルの統括は `tdd` スキル） |
| `backend-tester` | バックエンドのテストの実装（backend専用規約は未整備のため design-rule・一般作法に基づく） |
| `ui-designer` | ui-design ルールに照らした UI 実装の修正適用 |
| `prompt-engineer` | prompt-* ルールに照らしたプロンプトの修正適用 |
| `context-engineer` | context-engineering ルールに照らしたコンテキスト管理の修正適用 |

> コードの新規実装（産出）は、domain 非依存の入口スキル `coding` から domain 判定の上で `frontend-coder` / `backend-coder` エージェントへ委譲される。frontend/backend 以外の domain で専用サブエージェントが無い場合は `coding` スキル自身がフォールバックする。
