---
name: tdd
description: >
  「TDDで進めて」「テスト駆動で実装して」「Red-Green-Refactorで」と言われたとき、
  TDD の Red→Green→Refactor→Commit サイクルを統括するオーケストレーター。
  各フェーズを既存の産出者・レビュアーへ委譲し、フェーズ進行をメインで可視化する。
  フロントエンドは具象エージェントへ委譲、バックエンド（未定義）はフロー統括のみ行い
  コード詳細には関与しない。改善の適用はレビュー独立性に従い産出者が担う。
# when_to_use: 単一機能を TDD の1サイクル（Red→Green→Refactor→Commit）で実装・駆動したいとき
---

# tdd

## 概要

TDD の **Red→Green→Refactor→Commit** サイクルを統括するオーケストレーター。`tdd-rule` を
唯一の根拠に、各フェーズを適切な産出者・レビュアーへ委譲する。**フロントエンドは具象エージェントへ
委譲**し、**バックエンド（具象エージェント未定義）はフロー統括のみ**を行いコード詳細には関与しない。
フェーズを飛ばさず、現フェーズ（RED/GREEN/REFACTOR/COMMIT）を常に明示する。指摘の適用は
レビュー独立性に従い産出者が担う。

## ルール

- サイクル（Red-Green-Refactor-Commit）とコーディング標準は [[tdd-rule]]（`rules/coding-conventions/tdd-rule.md`）に従う。フェーズを飛ばさず、現フェーズを明示する。
- レビューと修正適用の分離は [[review-independence-rule]] に従う。Refactor のレビューも産出者とは別エージェントが行い、適用は産出者に戻す。
- 各フェーズの委譲は **単一フェーズにスコープを絞って** 渡す。`frontend-tester` は説明上 Green（最小実装）まで書けるため、Red 委譲時は「失敗するテストのみ・実装は書かない」と明示してフェーズのドリフトを防ぐ。
- 規約の具体値は再掲せず、上記ルールを唯一の正として参照する（[[externalization-rule]]）。

## 手順

1. **対象ドメインを判定** — frontend / backend / その他。以降の各フェーズで委譲先を切り替える。
2. **Red — 失敗するテストを書く**
   - frontend → `frontend-tester` エージェントに「失敗するテストのみ」を委譲（`test-rule` 準拠、実装は書かせない）。テストが RED であることを確認する。
   - backend → フロー統括のみ。RED フェーズを宣言し、`tdd-rule` に沿って失敗テストを先に書くよう促す。コード詳細・委譲先には関与しない。
3. **Green — テストを通す最小実装**
   - frontend → `frontend-coding` スキルでテストを通す最小限の実装を行う。余分な機能を足さない。全テストが GREEN になることを確認する。
   - backend → フロー統括のみ。
4. **Refactor — レビュー主導の改善（緑を保つ）**
   - frontend → コードは `frontend-code-reviewer`、テストは `frontend-test-reviewer` に差分レビューを委譲（指摘のみ）。指摘を受け、産出者（`frontend-coding` / `frontend-tester`）が **全テスト緑を維持したまま** 適用する。
   - backend → フロー統括のみ。
5. **Commit — チェックポイントを記録**
   - 全テストが緑であることを最終確認（緑確認はテスト実行で担保。[[review-independence-rule]]: 再検証も産出本人に委ねない）→ `git add` → 意味ある単一作業単位でコミットする。
6. 次のサイクルへ進む。

## 出力

- 現フェーズ（RED/GREEN/REFACTOR/COMMIT）の明示、各フェーズの委譲先と結果、テストの緑/赤状態、コミット単位。
- backend の場合は「フロー統括のみ・コード詳細不関与」を明記し、フェーズ進行の骨子だけを返す。
