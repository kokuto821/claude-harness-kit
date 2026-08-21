# test-coding

テスト観点の洗い出しからテストケース設計、失敗するテストコード（TDD Red相当）の実装までを行うスキルです。対象コードを分析して frontend / backend を判定し、対応する専門サブエージェント（`frontend-tester` / `backend-tester`）へ実装を委譲する、domain 非依存の単一入口です。

定義は `SKILL.md`、テスト設計技法は `shared-rules/test-design/test-design.md`、TDD Red フェーズの考え方は `shared-rules/coding-conventions/tdd-rule.md` を参照してください。テスト設計の抜け漏れレビューは `test-design-reviewer` エージェントに委譲します。

`tdd` スキルとの関係: `tdd` スキルの Red フェーズは常に本スキルへ委譲される（`tdd` スキル手順1）。domain 判定と具象サブエージェントへの分岐は本スキル内部の責務。専用サブエージェントが無い domain は本スキル自身が推論で実装する（フォールバック）。
