---
name: skill-name
description: >
  何をするスキルか。ユーザーが自然に言う言葉（トリガー語）を先頭に入れる。
  description + when_to_use の合計は 1,536 文字で切られるので要点を先頭に。
# when_to_use: 追加のトリガー例や発動条件（任意）
# allowed-tools: Read, Grep, Bash(git *)（任意）
# disable-model-invocation: true  # 副作用ありのタスク型を手動起動のみにしたい場合
---

# スキルタイトル

## 概要
（1〜2行。何をするスキルか）

## ルール

<!--
このスキルが従う規約・判断基準・禁止事項は、ここに直接書かず参照する。
- 他スキルにも効く / 不変のガイドライン → rules/<topic>/ に切り出して [[name]] で参照
- このスキル固有だが長い → skills/<name>/reference/ に切り出して参照
- 短いスキル固有の判断 → 手順内にインライン可
判断基準は shared-rules/rule-externalization/externalization-rule.md に従う。
ルールが無いスキルなら、この節ごと削除してよい。
-->

- 〇〇は [[xxx-rule]] (`rules/<topic>/xxx-rule.md`) に従う。
- △△は [[yyy-rule]] (`rules/<topic>/yyy-rule.md`) に従う。

## 手順
1. ...
2. ...

## 出力
（Claude がユーザーに返す内容の形式）
