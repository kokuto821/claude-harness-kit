#!/usr/bin/env python3
"""保護ブランチ上での git commit / push とファイル変更をブロックする PreToolUse フック。

現在のブランチが保護対象（既定: main / master / develop）である場合に、以下を拒否する。

- Bash: `git commit` / `git push`（保護ブランチ宛ての push を含む）
- Edit / Write / NotebookEdit 等の編集系ツール: git 追跡対象になりうるファイルの変更

判定できないケース（JSON 不正・git リポジトリ外・detached HEAD など）は許可する。

対象外（意図的に見ない）:

- git 管理外のパス（スクラッチパッド等）、`.gitignore` 済みのパス、`.git` 配下
- **Bash 経由のファイル書き込み**（`sed -i` / リダイレクト / `tee` 等）。シェルの網羅は
  原理的に不完全なため追わない。変更が保護ブランチへ着地することは commit / push の
  拒否で防ぐ。

保護ブランチは環境変数 CLAUDE_PROTECTED_BRANCHES（スペース区切り）で上書きできる。
"""

import json
import os
import shlex
import subprocess
import sys

DEFAULT_PROTECTED_BRANCHES = ("main", "master", "develop")
BLOCKED_SUBCOMMANDS = ("commit", "push")

# 編集系ツールの判定。Read 等の読み取り系を巻き込まないよう、名前に含まれる語で判定する
EDIT_TOOL_MARKERS = ("Edit", "Write")
# 編集先パスを保持する tool_input のキー（先に見つかったものを使う）
EDIT_TOOL_PATH_KEYS = ("file_path", "notebook_path")

BRANCH_EXAMPLE = "  git switch -c <type>/issue<番号>-<summary>   # 例: git switch -c feat/issue12-issue-driven-workflow"

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


def run_git(args, cwd):
    """git を実行する。呼び出し元の GIT_* は引き継がない（パスから見た実リポジトリを判定するため）。"""
    env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
    try:
        return subprocess.run(
            ["git", "-C", cwd, *args],
            capture_output=True,
            text=True,
            timeout=3,
            env=env,
        )
    except (OSError, subprocess.SubprocessError):
        return None


def current_branch(directory):
    """directory が git ワークツリー内ならブランチ名を返す。管理外・detached HEAD は None。"""
    result = run_git(["rev-parse", "--show-toplevel", "--abbrev-ref", "HEAD"], directory)
    if result is None or result.returncode != 0:
        return None
    lines = result.stdout.splitlines()
    if len(lines) < 2:
        return None
    branch = lines[1].strip()
    return branch if branch and branch != "HEAD" else None


def is_ignored(path, directory):
    """path が .gitignore 済みなら True。判定できなければ False（＝ガード対象のまま）。"""
    result = run_git(["check-ignore", "-q", "--", path], directory)
    return result is not None and result.returncode == 0


def existing_directory(path):
    """path の親をたどり、実在する最初のディレクトリを返す（未作成の階層に対応）。"""
    directory = os.path.dirname(path) or os.sep
    while not os.path.isdir(directory):
        parent = os.path.dirname(directory)
        if parent == directory:
            return None
        directory = parent
    return directory


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


def protected_footer():
    return f"（保護ブランチ: {', '.join(protected_branches())} / 環境変数 CLAUDE_PROTECTED_BRANCHES で変更可）"


def branch_reason(branch, subcommand):
    return (
        f"保護ブランチ `{branch}` 上での `git {subcommand}` はフックによりブロックされました。\n"
        "作業ブランチを切ってから実行してください:\n"
        f"{BRANCH_EXAMPLE}\n"
        f"{protected_footer()}"
    )


def push_target_reason(target):
    return (
        f"保護ブランチ `{target}` への `git push` はフックによりブロックされました。\n"
        "作業ブランチを push し、Pull Request 経由でマージしてください:\n"
        "  git push -u origin <current-branch>\n"
        f"{protected_footer()}"
    )


def edit_reason(branch, path):
    return (
        f"保護ブランチ `{branch}` 上でのファイル変更（`{path}`）はフックによりブロックされました。\n"
        "issue に紐づく作業ブランチへ移動してから編集してください:\n"
        f"{BRANCH_EXAMPLE}\n"
        f"{protected_footer()}"
    )


def is_edit_tool(tool_name):
    return isinstance(tool_name, str) and any(marker in tool_name for marker in EDIT_TOOL_MARKERS)


def edit_target(tool_input):
    for key in EDIT_TOOL_PATH_KEYS:
        value = tool_input.get(key)
        if isinstance(value, str) and value:
            return value
    return None


def edit_denial_reason(tool_input, cwd, protected):
    """保護ブランチ上の追跡対象ファイルへの変更なら拒否理由を返す。問題なければ None。"""
    path = edit_target(tool_input)
    if path is None:
        return None

    # シンボリックリンク経由でワークツリー内へ着弾する経路を塞ぐため実体パスで判定する
    target = os.path.realpath(os.path.join(cwd, path))
    directory = existing_directory(target)
    if directory is None:
        return None

    branch = current_branch(directory)
    if branch not in protected:
        return None
    if is_ignored(target, directory):
        return None
    return edit_reason(branch, path)


def bash_denial_reason(command, cwd, protected):
    """保護ブランチ上の git commit / push なら拒否理由を返す。問題なければ None。"""
    try:
        segments = split_segments(tokenize(command))
    except ValueError:
        # 引用符が閉じていない等。解析できない場合は判定しない
        return None

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
            return branch_reason(branch, subcommand)

        if subcommand == "push":
            target = pushed_protected_branch(args, protected)
            if target:
                return push_target_reason(target)
    return None


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        allow()

    tool_input = payload.get("tool_input")
    if not isinstance(tool_input, dict):
        allow()

    tool_name = payload.get("tool_name")
    cwd = payload.get("cwd") or os.getcwd()
    protected = protected_branches()

    if is_edit_tool(tool_name):
        reason = edit_denial_reason(tool_input, cwd, protected)
    elif tool_name == "Bash":
        command = tool_input.get("command")
        reason = bash_denial_reason(command, cwd, protected) if isinstance(command, str) and command else None
    else:
        reason = None

    if reason:
        deny(reason)
    allow()


if __name__ == "__main__":
    main()
