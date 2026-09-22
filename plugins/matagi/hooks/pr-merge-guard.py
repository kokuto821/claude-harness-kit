#!/usr/bin/env python3
"""`gh pr merge` の実行を常にブロックする PreToolUse フック。

PR のマージは取り消しにくく外部公開される操作のため、issue-driven-rule.md の方針どおり
必ずユーザーがブラウザ上で承認・実行する。AI エージェント側からの実行経路（Bash 経由の
`gh pr merge`）をブランチ・状態を問わず常に拒否する。

対象外（意図的に見ない）:

- `gh api repos/.../pulls/<番号>/merge` 等、`gh pr merge` を経由しない API 直叩き。
  シェルの網羅は原理的に不完全なため、主経路である `gh pr merge` のみを塞ぐ。
"""

import json
import shlex
import sys

SEGMENT_SEPARATORS = ("&&", "||", ";", "|", "&", "(", ")", "\n")


def allow():
    sys.exit(0)


def deny(reason):
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": reason,
                }
            },
            ensure_ascii=False,
        )
    )
    sys.exit(0)


def tokenize(command):
    """コマンド文字列をトークン列に分解する。引用符の中身は1トークンにまとまる。"""
    lexer = shlex.shlex(command, posix=True, punctuation_chars=True)
    lexer.whitespace_split = True
    return list(lexer)


def split_segments(tokens):
    """`&&` や `;` などの区切りでトークン列をコマンド単位に分ける。"""
    segments = [[]]
    for token in tokens:
        if token in SEGMENT_SEPARATORS:
            segments.append([])
        else:
            segments[-1].append(token)
    return [segment for segment in segments if segment]


def strip_prefix(segment):
    """先頭の環境変数代入と sudo を読み飛ばす。"""
    index = 0
    while index < len(segment):
        token = segment[index]
        if token == "sudo":
            index += 1
        elif "=" in token and token.split("=", 1)[0].isidentifier():
            index += 1
        else:
            break
    return segment[index:]


def is_gh_pr_merge(segment):
    tokens = strip_prefix(segment)
    return len(tokens) >= 2 and tokens[0] == "gh" and tokens[1] == "pr" and "merge" in tokens[2:]


DENY_REASON = (
    "`gh pr merge` はフックによりブロックされました。\n"
    "PR のマージはユーザーがブラウザ上で行ってください。"
)


def bash_denial_reason(command):
    try:
        segments = split_segments(tokenize(command))
    except ValueError:
        return None

    for segment in segments:
        if is_gh_pr_merge(segment):
            return DENY_REASON
    return None


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        allow()

    if payload.get("tool_name") != "Bash":
        allow()

    tool_input = payload.get("tool_input")
    if not isinstance(tool_input, dict):
        allow()

    command = tool_input.get("command")
    if not isinstance(command, str) or not command:
        allow()

    reason = bash_denial_reason(command)
    if reason:
        deny(reason)

    allow()


if __name__ == "__main__":
    main()
