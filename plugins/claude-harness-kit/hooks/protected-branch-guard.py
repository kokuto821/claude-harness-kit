#!/usr/bin/env python3
"""保護ブランチ上での git commit / push をブロックする PreToolUse フック。

Claude Code から実行される Bash コマンドを解析し、現在のブランチが保護対象
（既定: main / master / develop）である場合の commit / push を拒否する。
判定できないケース（JSON 不正・git リポジトリ外・detached HEAD など）は許可する。

保護ブランチは環境変数 CLAUDE_PROTECTED_BRANCHES（スペース区切り）で上書きできる。
"""

import json
import os
import shlex
import subprocess
import sys

DEFAULT_PROTECTED_BRANCHES = ("main", "master", "develop")
BLOCKED_SUBCOMMANDS = ("commit", "push")

# 直後の引数を値として取るグローバルオプション
GIT_GLOBAL_OPTIONS_WITH_VALUE = (
    "-C",
    "-c",
    "--git-dir",
    "--work-tree",
    "--namespace",
    "--exec-path",
)

SEGMENT_SEPARATORS = ("&&", "||", ";", "|", "&", "(", ")", "\n")


def protected_branches():
    raw = os.environ.get("CLAUDE_PROTECTED_BRANCHES", "")
    return tuple(raw.split()) if raw.strip() else DEFAULT_PROTECTED_BRANCHES


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
    """コマンド文字列をトークン列に分解する。引用符の中身は 1 トークンにまとまる。"""
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


def parse_git_invocation(segment):
    """git 呼び出しなら (サブコマンド, 残りの引数, -C の値) を返す。そうでなければ None。"""
    tokens = strip_prefix(segment)
    if not tokens or os.path.basename(tokens[0]) != "git":
        return None

    repo_dir = None
    index = 1
    while index < len(tokens):
        token = tokens[index]
        if token in GIT_GLOBAL_OPTIONS_WITH_VALUE:
            if token == "-C" and index + 1 < len(tokens):
                repo_dir = tokens[index + 1]
            index += 2
        elif token.startswith("-"):
            if token.startswith("-C"):
                repo_dir = token[2:]
            index += 1
        else:
            return token, tokens[index + 1 :], repo_dir
    return None


def current_branch(repo_dir):
    try:
        result = subprocess.run(
            ["git", "-C", repo_dir, "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True,
            text=True,
            timeout=3,
        )
    except (OSError, subprocess.SubprocessError):
        return None
    if result.returncode != 0:
        return None
    branch = result.stdout.strip()
    # detached HEAD は判定対象外
    return branch if branch and branch != "HEAD" else None


def pushed_protected_branch(args, protected):
    """push の引数に保護ブランチ宛ての refspec が含まれていればその名前を返す。"""
    for arg in args:
        if arg.startswith("-"):
            continue
        ref = arg.split(":")[-1]
        ref = ref.rsplit("/", 1)[-1]
        if ref in protected:
            return ref
    return None


def branch_reason(branch, subcommand):
    return (
        f"保護ブランチ `{branch}` 上での `git {subcommand}` はフックによりブロックされました。\n"
        "作業ブランチを切ってから実行してください:\n"
        "  git switch -c <type>/<summary>   # 例: git switch -c feat/add-protected-branch-guard\n"
        f"（保護ブランチ: {', '.join(protected_branches())} / 環境変数 CLAUDE_PROTECTED_BRANCHES で変更可）"
    )


def push_target_reason(target):
    return (
        f"保護ブランチ `{target}` への `git push` はフックによりブロックされました。\n"
        "作業ブランチを push し、Pull Request 経由でマージしてください:\n"
        "  git push -u origin <current-branch>\n"
        f"（保護ブランチ: {', '.join(protected_branches())} / 環境変数 CLAUDE_PROTECTED_BRANCHES で変更可）"
    )


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        allow()

    if payload.get("tool_name") != "Bash":
        allow()

    command = (payload.get("tool_input") or {}).get("command")
    if not command:
        allow()

    try:
        segments = split_segments(tokenize(command))
    except ValueError:
        # 引用符が閉じていない等。解析できない場合は判定しない
        allow()

    cwd = payload.get("cwd") or os.getcwd()
    protected = protected_branches()

    for segment in segments:
        invocation = parse_git_invocation(segment)
        if invocation is None:
            continue
        subcommand, args, repo_dir = invocation
        if subcommand not in BLOCKED_SUBCOMMANDS:
            continue

        repo = os.path.join(cwd, repo_dir) if repo_dir else cwd
        branch = current_branch(repo)
        if branch in protected:
            deny(branch_reason(branch, subcommand))

        if subcommand == "push":
            target = pushed_protected_branch(args, protected)
            if target:
                deny(push_target_reason(target))

    allow()


if __name__ == "__main__":
    main()
