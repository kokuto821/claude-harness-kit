# test-coding

テスト観点の洗い出しからテストケース設計、失敗するテストコード（TDD Red相当）の実装までを行うスキルです。言語・ドメインに依存しない汎用スキルです。

定義は `SKILL.md`、テスト設計技法は `shared-rules/test-design/test-design.md`、TDD Red フェーズの考え方は `shared-rules/coding-conventions/tdd-rule.md` を参照してください。テスト設計の抜け漏れレビューは `test-design-reviewer` エージェントに委譲します。

`tdd` スキルとの関係: frontend は `frontend-tester` エージェントに委譲される（`tdd` スキル手順1）。本スキルは frontend 以外（具象エージェントが未定義のドメイン）の Red フェーズ産出を担う。
