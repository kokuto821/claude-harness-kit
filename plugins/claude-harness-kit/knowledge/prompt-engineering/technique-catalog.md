# プロンプト技術カタログ（タスク型 → 手法の索引）

**作成日**: 2026-07-06
**カテゴリ**: prompt-engineering
**タグ**: [#prompt, #cot, #rag, #agent, #reference]

## 概要

プロンプトエンジニアリング論文群（`documents/reference/prompt-engineering/`）で紹介される手法は状況依存で、常時従う「ルール」ではない。ここでは「こういうタスクにはこの手法が効きやすい」という**引くための索引**を置く。各手法の詳細・数値・出典は下記の原典要約を参照する（ここには再掲しない）。

- The Prompt Report（58手法の体系）: `documents/reference/prompt-engineering/the-prompt-report.md`
- 手法サーベイ（応用領域別41手法）: `documents/reference/prompt-engineering/prompt-engineering-survey.md`
- プロンプトパターンカタログ（16パターン）: `documents/reference/prompt-engineering/prompt-pattern-catalog.md`
- PE2（自動プロンプト改善）: `documents/reference/prompt-engineering/prompt-engineering-a-prompt-engineer.md`

「常に効く原則」に昇華したものは `shared-rules/prompt-engineering/`（`composition-rule.md` / `scaffolding-rule.md` / `improvement-rule.md` / `robustness-rule.md`）にある。まずルールを見て、足りなければこのカタログで手法を探す。

## タスク型 → 手法

| やりたいこと | 候補手法 | 出典 |
|------------|---------|------|
| 追加学習なしで新規タスク | Zero-shot / Few-shot | survey §2.1, report §2.2.1 |
| 多段の推論を正確に | Chain-of-Thought / Least-to-Most / Plan-and-Solve | report §2.2.2–2.2.3 |
| 探索・後戻りが要る難問 | Tree-of-Thoughts / Graph-of-Thoughts | survey §2.2 |
| 抽象化してから解く | Step-Back / Take a Step Back | report §2.2.2.1, survey §2.12 |
| 精度を上げる（多数決） | Self-Consistency / アンサンブル系 | report §2.2.4 |
| 出力の誤りを自己検証 | Self-Refine / Chain-of-Verification / Self-Calibration | report §2.2.5 |
| ハルシネーション低減 | RAG / Chain-of-Note / Chain-of-Verification | survey §2.3, report §4.1.4 |
| 外部ツール・行動を伴う | ReAct / Reflexion / MRKL / PAL | report §4.1 |
| 計算を正確に | Program-of-Thoughts / Program-aided（コード実行に委譲） | survey §2.9 |
| 質問を明確化してから答える | Rephrase and Respond / Self-Ask / Question Clarification | report §2.2.1.3, survey §2.11 |
| LLM を評価者に使う | Role-based Eval / G-EVAL / ChatEval | report §4.2 |
| 既存プロンプトを自動改善 | APE / APO / PE2 / OPRO | report §2.4, PE2 全体 |
| 出力を厳密な型に収める | Template / Output Automater パターン | pattern-catalog §J, §C |
| LLM 主導で要件を聞き出す | Flipped Interaction パターン | pattern-catalog §D |
| 役割視点で出力させる | Persona / Role Prompting | pattern-catalog §E, report §2.2.1.3 |
| トークン/レイテンシ削減 | Chain-of-Draft / Chain-of-Symbol | survey §2.2 |

## 詳細

- **注意点**: これらは「効いた報告がある」手法であり、別のモデル・タスク・データで再現する保証はない（[[robustness-rule]] の姿勢）。単純な手法から試し、必要になってから複雑な足場を足す。
- **単純タスクへの CoT は逆効果になりうる**（report §6.1）。使い分けは [[scaffolding-rule]] を見る。
- 個々の手法の数値・条件・限界は必ず原典要約を参照する。この索引は「どれを検討するか」の入口。

## 参考・関連情報

- ルール: `shared-rules/prompt-engineering/scaffolding-rule.md`, `shared-rules/prompt-engineering/composition-rule.md`, `shared-rules/prompt-engineering/improvement-rule.md`
- 原典要約: `documents/reference/prompt-engineering/`
