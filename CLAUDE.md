# claude-harness-kit

Claude Code スキル・ナレッジの共有リポジトリ。

## ディレクトリ構造

ディレクトリ構成と読み込みの仕組みは `ARCHITECTURE.md` を参照。

## ルール

詳細は各ルールファイルを参照。

パスは `plugins/claude-harness-kit/` を起点とする。

| トピック | ルールファイル |
|----------|--------------|
| ファイル配置・リポジトリ構造 | `plugins/claude-harness-kit/rules/repository-structure/structure-rule.md` |
| rules/ ディレクトリ規約（配置・命名・相互リンク記法 `[[slug]]`） | `plugins/claude-harness-kit/shared-rules/rules-directory/directory-rule.md` |
| ハーネス制御（コード vs Markdown の一次判定） | `plugins/claude-harness-kit/rules/harness-engineering/harness-rule.md` |
| ステアリング手法の選択（CLAUDE.md/rules/skills/subagents等） | `plugins/claude-harness-kit/rules/harness-engineering/selection-rule.md` |
| レビュー独立性（レビュワーと産出者は常に別エージェント） | `plugins/claude-harness-kit/rules/harness-engineering/review-independence-rule.md` |
| 原典の忠実な取り扱い | `plugins/claude-harness-kit/rules/content-fidelity/content-fidelity-rule.md` |
| コード設計の普遍原則（DRY 等） | `plugins/claude-harness-kit/rules/design-principles/design-rule.md` |
| 命名規則（スキル・エージェント） | `plugins/claude-harness-kit/shared-rules/naming-conventions/naming-rule.md` |
| ユーザーフィードバックのルール化 | `plugins/claude-harness-kit/shared-rules/user-feedback/feedback-rule.md` |
| コードレビュー共通ルール（目的＝コードの健康状態の改善・承認の閾値・観点） | `plugins/claude-harness-kit/shared-rules/code-review/review-rule.md` |
| レビュー重大度（Critical/Warning/Suggestion）の共通定義 | `plugins/claude-harness-kit/shared-rules/review-severity/severity-rule.md` |
| スキル・エージェント内のルール外部化 | `plugins/claude-harness-kit/shared-rules/rule-externalization/externalization-rule.md` |
| README の配置（全ディレクトリに必須） | `plugins/claude-harness-kit/shared-rules/readme-convention/readme-rule.md` |
| プロンプト構成要素のチェックリスト | `plugins/claude-harness-kit/shared-rules/prompt-engineering/composition-rule.md` |
| 推論の足場（分解・自己検証）の要否 | `plugins/claude-harness-kit/shared-rules/prompt-engineering/scaffolding-rule.md` |
| プロンプト・スキル改善の原則 | `plugins/claude-harness-kit/shared-rules/prompt-engineering/improvement-rule.md` |
| プロンプト頑健性・安全性 | `plugins/claude-harness-kit/shared-rules/prompt-engineering/robustness-rule.md` |
| コンテキスト管理（有限な注意予算のキュレーション・長時間軸タスク、索引から各ルールへ） | `plugins/claude-harness-kit/shared-rules/context-engineering/README.md` |
| UIデザイン（索引から各ルールへ） | `plugins/claude-harness-kit/shared-rules/ui-design/README.md` |
