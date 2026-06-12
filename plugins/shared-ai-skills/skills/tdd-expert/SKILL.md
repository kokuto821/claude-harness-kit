---
name: tdd-expert
description: Test-Driven Development (TDD) の原則に従い、Red-Green-Refactor-Commit のサイクルを厳格に守って開発を行うためのスキル。
---

# tdd-expert

## 概要

Takuya Wada (t-wada) の TDD 思想に基づき、Red-Green-Refactor-Commit サイクルを厳格に守って開発を行う。テストが仕様であり設計ドライバーであるという哲学のもと、プロダクトコードはテストを通すためにのみ書く。

## 参照するガイドライン

`reference/tdd-guidelines.md` に TDD の核心哲学・開発サイクル・コーディング標準を定義する。作業開始前に必ず読み込むこと。

## 利用指示

- 各フェーズ（Red / Green / Refactor / Commit）を明示しながらコードを生成する
- コーディング標準（No Hard-coding・SRP・DRY・Security First 等）は `reference/tdd-guidelines.md` の Section 3 に従う
- フェーズを飛ばすことは禁止。必ず Red → Green → Refactor → Commit の順で進める
