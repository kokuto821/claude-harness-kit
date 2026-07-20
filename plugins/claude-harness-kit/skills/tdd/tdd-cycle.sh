#!/usr/bin/env bash
# tdd-cycle.sh — TDD サイクル数を決定論的にカウントし、上限到達を通知するガードスクリプト。
#
# tdd スキルがサイクル境界（機能開始時と各 Commit 後）に呼び出す。
# カウントの単一情報源をファイルに持たせることで、モデルの自己申告に依存せず
# サイクル数を確定させる。停止の最終判断はスキルが exit code を尊重して行う
# （真の強制ではなく、決定論的なカウント＋停止シグナルを提供する）。
#
# usage:
#   tdd-cycle.sh <state-file> start   [max-cycles]  # 機能開始時にカウンタを初期化
#   tdd-cycle.sh <state-file> commit  [max-cycles]  # Commit 後にインクリメント。上限到達で exit 1
#   tdd-cycle.sh <state-file> status  [max-cycles]  # 現在のカウントを表示
#
# max-cycles は引数 > 環境変数 TDD_MAX_CYCLES > デフォルト の順で解決する。
set -euo pipefail

# サイクル上限のデフォルト（マジックナンバーを避けるため名前付き定数として定義）。
readonly DEFAULT_MAX_CYCLES=3

usage() {
  echo "usage: tdd-cycle.sh <state-file> <start|commit|status> [max-cycles]" >&2
  exit 2
}

[ "$#" -ge 2 ] || usage

readonly STATE_FILE="$1"
readonly ACTION="$2"
readonly MAX_CYCLES="${3:-${TDD_MAX_CYCLES:-$DEFAULT_MAX_CYCLES}}"

read_count() {
  if [ -f "$STATE_FILE" ]; then
    cat "$STATE_FILE"
  else
    echo 0
  fi
}

case "$ACTION" in
  start)
    echo 0 > "$STATE_FILE"
    echo "TDD cycle counter initialized (max ${MAX_CYCLES})"
    ;;
  status)
    echo "cycle $(read_count)/${MAX_CYCLES}"
    ;;
  commit)
    count=$(read_count)
    count=$((count + 1))
    echo "$count" > "$STATE_FILE"
    if [ "$count" -ge "$MAX_CYCLES" ]; then
      echo "STOP: TDD 上限 ${MAX_CYCLES} サイクル到達 (${count}/${MAX_CYCLES})。これ以上サイクルを回さず、状況を報告して人の判断を仰ぐこと。"
      exit 1
    fi
    echo "cycle ${count}/${MAX_CYCLES} 完了。次サイクルへ進んでよい。"
    ;;
  *)
    usage
    ;;
esac
