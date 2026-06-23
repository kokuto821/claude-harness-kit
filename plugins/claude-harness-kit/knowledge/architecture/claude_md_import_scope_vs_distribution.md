# CLAUDE.md の @import スコープと配布の落とし穴

**作成日**: 2026-06-24
**カテゴリ**: architecture
**タグ**: [#claude-md, #import, #plugin, #distribution, #skill]

## 概要

「ある振る舞いを毎回必ず適用したい」場合に repo-root の `CLAUDE.md` から `@import` で常時ロードする設計は、**このリポジトリで作業しているセッション限定**でしか効かない。`CLAUDE.md` の `@import` はそのファイルが読まれる文脈でのみ解決され、repo-root の `CLAUDE.md` はマーケットプレイスプラグインの配布物（`plugins/claude-harness-kit/`）には含まれないため、プラグイン利用者の環境では発火しない。配布物に効かせたい常時的な振る舞いは `@import` ではなく **スキル化**する方が確実。

## 詳細

### 背景

回答スタイル（辛口・容赦なく正直なアドバイザー）を「毎回参照される」ようにしたい、という要望から、当初は次の構成を採った。

- `rules/response-style/response-rule.md` に本文を置く
- repo-root `CLAUDE.md` に `@plugins/claude-harness-kit/rules/response-style/response-rule.md` を記述し常時ロード

### 落とし穴

1. **スコープ**: `@import` は「その `CLAUDE.md` が読まれたとき」だけ解決される。効くのは repo 内で作業しているセッションに限られる。
2. **配布**: このリポジトリはマーケットプレイスプラグインとして配布され、利用者環境に渡るのは `plugins/claude-harness-kit/` 配下のみ。repo-root の `CLAUDE.md` は渡らないので、利用者環境では `@import` が存在せず発火しない。
3. **ノイズ**: 常時適用は、事実確認や単純な実装依頼といった「そのトーンが不要な場面」にも一律に乗り、ノイズになる。

### 結論・対処

- 配布物（プラグイン）に効かせたい／オンデマンドで意図的に切り替えたいトーン・モード系の振る舞いは、`@import` 常時ロードではなく **スキル化**する。スキルは `plugins/.../skills/` 配下にあり配布物に含まれ、`/skill-name` で利用者環境でも起動できる。
- ただしスキルは opt-in。「ユーザーが自己正当化しているまさにその瞬間」のような、本人が呼び忘れる場面では自動発火しない構造的な穴がある。常時性が本当に要る要件かを見極めた上で選ぶ。
- 本リポジトリでは最終的に `response-style` ルール＋`@import` を撤回し、`strict-mode` スキルへ置き換えた。

## 参考・関連情報

- 関連スキル: `strict-mode`
- ルール外部化の判断: [[skill_rule_externalization_pattern]]
- ハーネス制御の媒体選択: `rules/harness-control/harness-rule.md`
