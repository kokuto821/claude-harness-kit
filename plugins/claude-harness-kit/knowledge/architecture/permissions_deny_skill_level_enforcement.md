# Skill 単位のブロックは permissions.deny で実現できる（実機検証済み）

**作成日**: 2026-08-25
**カテゴリ**: architecture
**タグ**: [#claude-code, #permissions, #skill, #harness, #openspec]

## 概要

`.claude/settings.json` の `permissions.deny` に `"Skill(<skill-name> *)"` を追加すると、そのスキルの直接起動（自然言語トリガーによる自動起動を含む）をブロックできる。公式ドキュメントの permission rule 対象ツール一覧に `Skill` が明記されていない調査結果があったが、実際に対象スキルを直接呼び出すテストで拒否されることを確認した。**ドキュメントの網羅性より実機確認を優先すべき**という教訓。

## 詳細

### 背景（issue #13, OpenSpec 統合）

OpenSpec CLI が生成するスキル `openspec-apply-change`/`openspec-archive-change` は実装を委譲せず自分で直接コードを書き、レビューゲートも持たない（`.claude/skills/` 配下、CLI再生成物のため直接編集不可）。プロジェクト固有のオーケストレータースキル（`openspec-workflow`）側で「これらを起動しない」と書くだけでは、ユーザー発話が直接これら2スキルの `description` に一致した場合、オーケストレーターを経由せず直接自動起動されうる。これは review-independence（産出者とレビュワーの分離）の保証がルーティング段階で迂回される Critical 級の欠陥だった。

### レビューでの疑義と実機確認

steering-reviewer からこの Critical 指摘を受け、`permissions.deny: ["Skill(openspec-apply-change *)", "Skill(openspec-archive-change *)"]` を `.claude/settings.json` に追加して対処した。ところが修正の再検証で、別のレビュアーが「公式ドキュメント（`code.claude.com/docs/en/permissions.md`）の permission rule 対象ツール一覧に `Skill` が列挙されていない」と指摘し、機構自体が機能しているか疑義が生じた。

そこで実際に `Skill` ツールで対象スキルを直接呼び出して検証した。

```
Skill(skill: "openspec-apply-change") → "Skill execution blocked by permission rules"
Skill(skill: "openspec-archive-change") → "Skill execution blocked by permission rules"
Skill(skill: "openspec-explore")        → 通常どおり起動（対象外は影響なし）
```

- 設定変更は **セッション再起動や `/hooks` 再読込なしに反映された**。
- deny リストに無いスキルは影響を受けない（over-broad ではない）。

ドキュメント検索だけでは「機能しない可能性が高い」という誤った結論に至りかねなかった。**ツールの実際の挙動について確信が持てない場合、ドキュメント調査で止めず、実機で最小のテストケースを組んで確認する**方が確実。

### harness-rule との関係

[[harness_medium_commitment]] は「助言強度のコード（hookはあるが遵守はモデル任せ）」がアンチパターンだと述べる事例だが、本件はその**対照例**: review-independence のような重要な保証を、オーケストレーター側の散文的な「呼ばない」宣言だけに頼らず、`permissions.deny` というコード側の強制で裏付けたことで、迂回不能な保証を実際に得られた（[[harness_medium_commitment]] が推奨する「本当に破られたら困るならコードで強制する」を素直に実践してクリーンに機能したケース）。

## 参考・関連情報

- `plugins/claude-harness-kit/shared-rules/openspec-integration/openspec-rule.md` §レビュー独立性
- `plugins/claude-harness-kit/skills/openspec-setup/SKILL.md` 手順8
- `rules/harness-engineering/harness-rule.md` — 媒体選択の原則
- [[harness_medium_commitment]] — 助言強度コードのアンチパターン（対照的な事例）
