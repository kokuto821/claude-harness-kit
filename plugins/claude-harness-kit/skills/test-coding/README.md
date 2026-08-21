# test-coding

TDD の List（テストリスト洗い出し）と Red（失敗するテストを書く）を担うスキルです。テスト観点を洗い出しテストケースを設計した上で、対象コードを分析して domain を判定し、対応する専門サブエージェント（`frontend-tester` / `backend-tester` 等）へ実装を委譲する、domain 非依存の単一入口です。

定義は `SKILL.md`、テスト設計技法は `shared-rules/test-design/test-design.md`、TDD List/Red フェーズの考え方は `shared-rules/coding-conventions/tdd-rule.md`、domain 判定基準・委譲方針は `shared-rules/coding-conventions/domain-classification-rule.md` を参照してください。テスト設計の抜け漏れレビューは `test-design-reviewer` エージェントに委譲します。

`tdd` スキルとの関係: `tdd` スキルの List/Red フェーズは常に本スキルへ委譲される（`tdd` スキル手順1）。domain 判定と具象サブエージェントへの分岐は本スキル内部の責務。専用サブエージェントが無い domain も汎用サブエージェントへ委譲する（in-context では実装しない）。
