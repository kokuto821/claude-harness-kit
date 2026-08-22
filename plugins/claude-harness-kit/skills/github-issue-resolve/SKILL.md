---
name: github-issue-resolve
description: >
  「issue #12 やって」「このissueを実装して」「issueを片付けて」「issue駆動で進めて」
  と言われたとき、issue 駆動開発の実行フェーズ（対象 issue の選択 → ブランチ作成 →
  実装方針の合意 → 実装 → セルフレビュー → PR 作成 → マージ → issue クローズ）を統括する
  オーケストレーター。実装・レビューの中身は既存の入口スキル（tdd / coding / coding-review 等）
  へ委譲し、本スキルはフェーズ進行と GitHub 操作のみを担う。
  issue を新規に作るのは github-issue-create。
# when_to_use: 既存の GitHub issue を1件選び、実装からマージ・クローズまで一気通貫で進めたいとき
---

# github-issue-resolve

## 概要

issue 駆動開発の**実行フェーズ**を統括する。1件の issue を、ブランチ作成からマージ・issue クローズまで閉じる。実装・レビューの中身は既存の入口スキルへ委譲し、本スキル自身はフェーズの進行と GitHub 操作のみを担う。

## ルール

- issue 化の判断・issue の粒度・ブランチ名・`1 issue = 1 branch = 1 PR` の対応・副作用を伴う GitHub 操作の承認は [[issue-driven-rule]]（`shared-rules/issue-driven-development/issue-driven-rule.md`）に従う。本スキルに基準を再掲しない。
- **作業に取り掛かる前に、対象 issue に紐づくブランチ上にいることを `git branch --show-current` で確認する。** 確認は手順3（PLAN）以降のすべてのフェーズで、着手前に行う。既定ブランチ上、または別 issue のブランチ上だった場合は、手順2に戻ってブランチを切り直してから進む（[[issue-driven-rule]]「必ず issue に紐づくブランチで作業する」）。
- **対象 issue のスコープ外の課題を見つけたら、その場で実装しない。** 軽微でないものは [[issue-driven-rule]] の粒度基準で issue 化を検討し、ユーザーに提案して合意を得る。軽微でついでに直せるものだけ、そのブランチの変更に含める。
- **本スキルは実装コードを書かない**。産出は手順4の委譲先スキルの責任とする。
- セルフレビューと指摘の適用の分離は [[review-independence-rule]]（`rules/harness-engineering/review-independence-rule.md`）に従う。レビューは産出者と別のエージェントが行い、適用は産出者に戻す。修正後の再検証も修正した本人に委ねない。
- コミット単位・コミットメッセージは [[commit-message-simple]]（`skills/commit-message-simple/SKILL.md`）の出力に従う。本スキルで独自に組み立てない。
- **現フェーズ（SELECT / BRANCH / PLAN / IMPLEMENT / REVIEW / COMMIT / PR / MERGE / CLOSE）を常に明示する。** フェーズを飛ばさない。
- **委譲の種別を区別する**: 「スキル起動」＝現行コンテキストでの in-context 実行、「エージェント委譲」＝別コンテキストでの隔離実行。手順4・5の委譲先はいずれも本スキルから in-context 起動し、具象サブエージェントへの分岐は各入口スキル側の責務とする。

## 手順

### 1. SELECT — 対象 issue を確定する

- 番号の指定があれば `gh issue view <番号>`、無ければ `gh issue list` で候補を提示して選んでもらう。
- 本文の「要件」「対応方針」「未確定事項」を読み、**完了条件を自分の言葉で1〜3行に要約して提示する**。
- 未確定事項が残っている／完了条件が読み取れない場合は、ここでユーザーに確認する。推測で埋めて進めない。
- 粒度が大きすぎる場合は [[issue-driven-rule]] の粒度基準に照らし、分割を提案する。

### 2. BRANCH — 作業ブランチを作成する

**このフェーズを飛ばして手順3以降に進まない。** issue に紐づくブランチへ移動する前に、実装方針の検討にもファイルの変更にも着手しない（[[issue-driven-rule]]）。

- `git branch --show-current` と `git status` で、現在のブランチと未コミット変更を確認する。
  - 未コミット変更があれば、退避するか今回の作業に含めるかをユーザーに確認する。
  - 対象 issue のブランチがすでに存在し、その上にいる場合はこのフェーズを完了として次へ進む。
- 既定ブランチを最新化する（`git switch <既定ブランチ>` → `git pull`）。
- ブランチ名を [[issue-driven-rule]] の命名に従って1案提示し、承認を得てから `git switch -c <branch>` を実行する。
- 切り替え後、`git branch --show-current` で意図したブランチ上にいることを確認してから次へ進む。

### 3. PLAN — 実装方針を合意する

- issue の「対応方針」を出発点に、**変更するファイル・追加する成果物・手順1で要約した完了条件との対応**を提示する。
- 多段の判断を含む場合は Plan mode で計画を提示して承認を得る。
- **合意を得るまで実装に入らない。** issue のスコープを超える変更が必要だと判明したら、ここで issue 化を検討し提案する（[[issue-driven-rule]] 粒度基準）。

### 4. IMPLEMENT — 実装する

変更の性質で委譲先を選び、in-context 起動する。

| 対象 | 委譲先 |
|------|--------|
| テストを伴うコード実装 | [[tdd]]（`skills/tdd/SKILL.md`） |
| テストを伴わないコード実装 | [[coding]]（`skills/coding/SKILL.md`） |
| テストコードのみ | [[test-coding]]（`skills/test-coding/SKILL.md`） |
| 新規 UI コンポーネント | [[create-ui-component]]（`skills/create-ui-component/SKILL.md`） |
| スキル・サブエージェントの新規作成 | [[create-skill]]（`skills/create-skill/SKILL.md`） |
| ルール・ドキュメント等の md 資産 | 委譲先スキルは無い。本スキルで編集する |

実装中にスコープ外の課題を見つけた場合は、その場で実装せず上記「ルール」節のスコープ外の扱いに従う。issue 化を提案した場合は、その内容を最終報告に含める。

### 5. REVIEW — セルフレビューする

変更の性質に応じてレビュースキルを in-context 起動する。

| 対象 | 委譲先 |
|------|--------|
| 実装コード・テストコード | [[coding-review]]（`skills/coding-review/SKILL.md`） |
| スキル・サブエージェント・CLAUDE.md 等のステアリング資産 | [[ai-engineering-review]]（`skills/ai-engineering-review/SKILL.md`） |
| UI 実装 | [[ui-review]]（`skills/ui-review/SKILL.md`） |

- 指摘は重大度の高いものから適用する。適用は産出者に戻す（[[review-independence-rule]]）。
- レビューは既定で実施する。ユーザーが軽微な変更でスキップを選んだ場合のみ省略し、**省略した旨を最終報告に残す**。

### 6. COMMIT — コミットして push する

- [[commit-message-simple]] の手順でコミット単位とメッセージを作成し、承認を得る。
- ブランチは手順2で作成済みのため [[branch-and-push]] は起動しない（同スキルはブランチ作成から行うため二重になる）。
- `git add <files>` → `git commit` → `git push -u origin <branch>` を実行する。

### 7. PR — PR を作成する

- リポジトリに PR テンプレート（`.github/pull_request_template.md` など）があれば、その見出し構成に従って本文を埋める。
- 本文に対象 issue へのリンクと `Closes #<番号>` を含める。
- **承認を得てから**実行する。本文は一時ファイルに書き出し `--body-file` で渡す（改行・引用符の事故を避けるため `--body` に直接埋め込まない）。

```bash
gh pr create --title "<タイトル>" --body-file <一時ファイルのパス>
```

- CI があれば結果を確認する。失敗していれば原因を特定し、手順4へ戻る。

### 8. MERGE — マージする

- PR の状態（CI・レビュー・コンフリクトの有無）を確認して提示し、**承認を得てから**マージする。
- マージ方法（squash / merge / rebase）はリポジトリの設定・慣習に従う。判断がつかなければユーザーに確認する。

### 9. CLOSE — issue を閉じて報告する

- `Closes #<番号>` により自動クローズされたかを `gh issue view <番号>` で確認する。閉じていなければ承認を得て `gh issue close <番号>` を実行する。
- **手順1で要約した完了条件と実際の変更を1項目ずつ突き合わせて報告する。** 満たせなかった項目があればクローズせず、残課題として提示して判断を仰ぐ。

## 出力

- **確認フェーズ**: 対象 issue と完了条件の要約 / ブランチ名案 / 実装方針 / コミット計画 / PR タイトル・本文全文 / マージ可否の判断材料
- **完了フェーズ**: 現フェーズ、作成したブランチ名、委譲先スキルと結果、レビュー指摘の適用状況（省略した場合はその旨）、PR の URL、マージ結果、issue のクローズ状態、完了条件の充足状況（未達があれば残課題）、実装中に見つけたスコープ外の課題と issue 化の提案
- **中断時**: 到達したフェーズと残作業を明示する
