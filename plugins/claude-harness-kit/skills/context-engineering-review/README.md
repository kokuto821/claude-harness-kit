# context-engineering-review

スキル・サブエージェント定義・CLAUDE.md・プロンプトを `rules/context-engineering/*` に照らして、コンテキスト管理（有限な注意予算のキュレーション）の観点でレビューする入口スキルです。

最小集合・構成（altitude/区切り）・実行時取得・長時間軸戦略・ツール効率の観点で違反・逸脱を指摘します。監査は `context-reviewer` エージェントに委譲し、修正が必要なら人の承認を得てから `context-engineer` エージェント（修正適用専用）に適用を委譲します。レビュワーと産出者は別エージェント（`rules/harness-engineering/review-independence-rule.md`）。人間向けの概要はここ、AI/ハーネス向けの定義は `SKILL.md` にあります。
