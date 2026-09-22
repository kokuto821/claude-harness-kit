# coding-conventions

コーディング規約のルールを置く場所です。

実装時に守るコーディング上の取り決めを `coding-rule.md` に、テスト固有の取り決めを `test-rule.md` に、TDD の方法論を `tdd-rule.md` に、coding/test-coding/coding-review スキルの domain 判定・委譲基準を `domain-classification-rule.md` にまとめています。`coding-rule.md`・`test-rule.md` のうち機械的に判定可能な項目（linter対応可能）は、それぞれ `coding-lint-rule.md` / `test-lint-rule.md` に分離しています。

| ファイル | 内容 |
|---------|------|
| `coding-rule.md` | 命名・TypeScript・定数・スタイリング・関数設計・hooks など、文脈依存でレビューでしか検出できない実装全般の規約 |
| `coding-lint-rule.md` | `coding-rule.md` のうち機械的に判定可能な項目と、対応する ESLint ルール名 |
| `test-rule.md` | テストの命名・分割・ヘルパー・AAA パターンなど、文脈依存でレビューでしか検出できないテスト固有の規約 |
| `test-lint-rule.md` | `test-rule.md` のうち機械的に判定可能な項目と、対応する `eslint-plugin-jest` 等のルール名 |
| `tdd-rule.md` | TDD の核心哲学・List-Red-Green-Refactor-Commit サイクル・コーディング標準 |
| `domain-classification-rule.md` | coding / test-coding / coding-review スキルの domain（frontend/backend等）判定基準と、専用サブエージェントが無い場合の委譲方針 |
