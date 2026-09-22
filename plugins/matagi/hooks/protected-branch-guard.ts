#!/usr/bin/env -S node --experimental-strip-types
/**
 * 保護ブランチ上での git commit / push とファイル変更をブロックする PreToolUse フック。
 *
 * 現在のブランチが保護対象（既定: main / master / develop）である場合に、以下を拒否する。
 *
 * - Bash: `git commit` / `git push`（保護ブランチ宛ての push を含む）
 * - Edit / Write / NotebookEdit 等の編集系ツール: git 追跡対象になりうるファイルの変更
 *
 * 判定できないケース（JSON 不正・git リポジトリ外・detached HEAD など）は許可する。
 *
 * 対象外（意図的に見ない）:
 *
 * - git 管理外のパス（スクラッチパッド等）、`.gitignore` 済みのパス、`.git` 配下
 * - **Bash 経由のファイル書き込み**（`sed -i` / リダイレクト / `tee` 等）。シェルの網羅は
 *   原理的に不完全なため追わない。変更が保護ブランチへ着地することは commit / push の
 *   拒否で防ぐ。
 *
 * 保護ブランチは環境変数 CLAUDE_PROTECTED_BRANCHES（スペース区切り）で上書きできる。
 */

import { spawnSync } from "node:child_process";
import { dirname, join, sep, isAbsolute } from "node:path";
import { existsSync, statSync, realpathSync } from "node:fs";

const DEFAULT_PROTECTED_BRANCHES = ["main", "master", "develop"];
const BLOCKED_SUBCOMMANDS = new Set(["commit", "push"]);

// 編集系ツールの判定。Read 等の読み取り系を巻き込まないよう、名前に含まれる語で判定する
const EDIT_TOOL_MARKERS = ["Edit", "Write"];
// 編集先パスを保持する tool_input のキー（先に見つかったものを使う）
const EDIT_TOOL_PATH_KEYS = ["file_path", "notebook_path"];

const BRANCH_EXAMPLE =
  "  git switch -c <type>/#<番号>_<summary>   # 例: git switch -c feat/#12_issue-driven-workflow";

// 直後の引数を値として取るグローバルオプション
const GIT_GLOBAL_OPTIONS_WITH_VALUE = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path"]);

const SEGMENT_SEPARATORS = new Set(["&&", "||", ";", "|", "&", "(", ")", "\n"]);

function protectedBranches(): string[] {
  const raw = process.env.CLAUDE_PROTECTED_BRANCHES || "";
  return raw.trim() ? raw.split(/\s+/).filter(Boolean) : DEFAULT_PROTECTED_BRANCHES;
}

function allow(): never {
  process.exit(0);
}

function deny(reason: string): never {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }) + "\n",
  );
  process.exit(0);
}

/** git を実行する。呼び出し元の GIT_* は引き継がない（パスから見た実リポジトリを判定するため）。 */
function runGit(args: string[], cwd: string) {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith("GIT_") && value !== undefined) {
      env[key] = value;
    }
  }
  try {
    return spawnSync("git", ["-C", cwd, ...args], {
      encoding: "utf-8",
      timeout: 3000,
      env,
    });
  } catch {
    return null;
  }
}

/** directory が git ワークツリー内ならブランチ名を返す。管理外・detached HEAD は null。 */
function currentBranch(directory: string): string | null {
  const result = runGit(["rev-parse", "--show-toplevel", "--abbrev-ref", "HEAD"], directory);
  if (result === null || result.status !== 0) {
    return null;
  }
  const lines = (result.stdout || "").split("\n");
  if (lines.length < 2) {
    return null;
  }
  const branch = lines[1].trim();
  return branch && branch !== "HEAD" ? branch : null;
}

/** path が .gitignore 済みなら true。判定できなければ false（＝ガード対象のまま）。 */
function isIgnored(path: string, directory: string): boolean {
  const result = runGit(["check-ignore", "-q", "--", path], directory);
  return result !== null && result.status === 0;
}

/** path の親をたどり、実在する最初のディレクトリを返す（未作成の階層に対応）。 */
function existingDirectory(path: string): string | null {
  let directory = dirname(path) || sep;
  while (!existsSync(directory) || !statSync(directory).isDirectory()) {
    const parent = dirname(directory);
    if (parent === directory) {
      return null;
    }
    directory = parent;
  }
  return directory;
}

/** コマンド文字列をトークン列に分解する。引用符の中身は 1 トークンにまとまる。 */
function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let hasToken = false;

  const punctuation = new Set(["&", "|", ";", "(", ")", "\n"]);

  const flush = () => {
    if (hasToken) {
      tokens.push(current);
      current = "";
      hasToken = false;
    }
  };

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];

    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      } else {
        current += ch;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      } else if (ch === "\\" && i + 1 < command.length && '"\\$`'.includes(command[i + 1])) {
        current += command[i + 1];
        i++;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      hasToken = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      hasToken = true;
      continue;
    }
    if (ch === "\\" && i + 1 < command.length) {
      current += command[i + 1];
      hasToken = true;
      i++;
      continue;
    }

    if (ch === "#") {
      flush();
      while (i < command.length && command[i] !== "\n") {
        i++;
      }
      i--;
      continue;
    }

    if (/\s/.test(ch)) {
      flush();
      continue;
    }

    if (punctuation.has(ch)) {
      flush();
      if ((ch === "&" || ch === "|") && command[i + 1] === ch) {
        tokens.push(ch + ch);
        i++;
      } else {
        tokens.push(ch);
      }
      continue;
    }

    current += ch;
    hasToken = true;
  }
  flush();

  if (inSingle || inDouble) {
    throw new Error("unterminated quote");
  }

  return tokens;
}

/** `&&` や `;` などの区切りでトークン列をコマンド単位に分ける。 */
function splitSegments(tokens: string[]): string[][] {
  const segments: string[][] = [[]];
  for (const token of tokens) {
    if (SEGMENT_SEPARATORS.has(token)) {
      segments.push([]);
    } else {
      segments[segments.length - 1].push(token);
    }
  }
  return segments.filter((segment) => segment.length > 0);
}

/** 先頭の環境変数代入と sudo を読み飛ばす。 */
function stripPrefix(segment: string[]): string[] {
  let index = 0;
  const isIdentifier = (s: string) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
  while (index < segment.length) {
    const token = segment[index];
    if (token === "sudo") {
      index += 1;
    } else if (token.includes("=") && isIdentifier(token.split("=", 1)[0])) {
      index += 1;
    } else {
      break;
    }
  }
  return segment.slice(index);
}

type GitInvocation = { subcommand: string; args: string[]; repoDir: string | null };

/** git 呼び出しなら { サブコマンド, 残りの引数, -C の値 } を返す。そうでなければ null。 */
function parseGitInvocation(segment: string[]): GitInvocation | null {
  const tokens = stripPrefix(segment);
  if (tokens.length === 0) {
    return null;
  }
  const base = tokens[0].split("/").pop();
  if (base !== "git") {
    return null;
  }

  let repoDir: string | null = null;
  let index = 1;
  while (index < tokens.length) {
    const token = tokens[index];
    if (GIT_GLOBAL_OPTIONS_WITH_VALUE.has(token)) {
      if (token === "-C" && index + 1 < tokens.length) {
        repoDir = tokens[index + 1];
      }
      index += 2;
    } else if (token.startsWith("-")) {
      if (token.startsWith("-C")) {
        repoDir = token.slice(2);
      }
      index += 1;
    } else {
      return { subcommand: token, args: tokens.slice(index + 1), repoDir };
    }
  }
  return null;
}

/** push の引数に保護ブランチ宛ての refspec が含まれていればその名前を返す。 */
function pushedProtectedBranch(args: string[], protected_: string[]): string | null {
  for (const arg of args) {
    if (arg.startsWith("-")) {
      continue;
    }
    let ref = arg.split(":").pop()!;
    ref = ref.split("/").pop()!;
    if (protected_.includes(ref)) {
      return ref;
    }
  }
  return null;
}

function protectedFooter(): string {
  return `（保護ブランチ: ${protectedBranches().join(", ")} / 環境変数 CLAUDE_PROTECTED_BRANCHES で変更可）`;
}

function branchReason(branch: string, subcommand: string): string {
  return (
    `保護ブランチ \`${branch}\` 上での \`git ${subcommand}\` はフックによりブロックされました。\n` +
    "作業ブランチを切ってから実行してください:\n" +
    `${BRANCH_EXAMPLE}\n` +
    `${protectedFooter()}`
  );
}

function pushTargetReason(target: string): string {
  return (
    `保護ブランチ \`${target}\` への \`git push\` はフックによりブロックされました。\n` +
    "作業ブランチを push し、Pull Request 経由でマージしてください:\n" +
    "  git push -u origin <current-branch>\n" +
    `${protectedFooter()}`
  );
}

function editReason(branch: string, path: string): string {
  return (
    `保護ブランチ \`${branch}\` 上でのファイル変更（\`${path}\`）はフックによりブロックされました。\n` +
    "issue に紐づく作業ブランチへ移動してから編集してください:\n" +
    `${BRANCH_EXAMPLE}\n` +
    `${protectedFooter()}`
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEditTool(toolName: unknown): boolean {
  return typeof toolName === "string" && EDIT_TOOL_MARKERS.some((marker) => toolName.includes(marker));
}

function editTarget(toolInput: Record<string, unknown>): string | null {
  for (const key of EDIT_TOOL_PATH_KEYS) {
    const value = toolInput[key];
    if (typeof value === "string" && value) {
      return value;
    }
  }
  return null;
}

/** 保護ブランチ上の追跡対象ファイルへの変更なら拒否理由を返す。問題なければ null。 */
function editDenialReason(toolInput: Record<string, unknown>, cwd: string, protected_: string[]): string | null {
  const path = editTarget(toolInput);
  if (path === null) {
    return null;
  }

  // シンボリックリンク経由でワークツリー内へ着弾する経路を塞ぐため実体パスで判定する
  const joined = isAbsolute(path) ? path : join(cwd, path);
  const target = realpathNonStrict(joined);

  const directory = existingDirectory(target);
  if (directory === null) {
    return null;
  }

  const branch = currentBranch(directory);
  if (branch === null || !protected_.includes(branch)) {
    return null;
  }
  if (isIgnored(target, directory)) {
    return null;
  }
  return editReason(branch, path);
}

/** os.path.realpath 相当（存在しないパスでもエラーにせず可能な限り解決する）。 */
function realpathNonStrict(path: string): string {
  try {
    return realpathSync(path);
  } catch {
    const dir = dirname(path);
    if (dir === path) {
      return path;
    }
    return join(realpathNonStrict(dir), path.slice(dir.length + 1) || "");
  }
}

/** 保護ブランチ上の git commit / push なら拒否理由を返す。問題なければ null。 */
function bashDenialReason(command: string, cwd: string, protected_: string[]): string | null {
  let segments: string[][];
  try {
    segments = splitSegments(tokenize(command));
  } catch {
    return null;
  }

  for (const segment of segments) {
    const invocation = parseGitInvocation(segment);
    if (invocation === null) {
      continue;
    }
    const { subcommand, args, repoDir } = invocation;
    if (!BLOCKED_SUBCOMMANDS.has(subcommand)) {
      continue;
    }

    const repo = repoDir ? join(cwd, repoDir) : cwd;
    const branch = currentBranch(repo);
    if (branch !== null && protected_.includes(branch)) {
      return branchReason(branch, subcommand);
    }

    if (subcommand === "push") {
      const target = pushedProtectedBranch(args, protected_);
      if (target) {
        return pushTargetReason(target);
      }
    }
  }
  return null;
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}

async function main() {
  const input = await readStdin();

  let payload: unknown;
  try {
    payload = JSON.parse(input);
  } catch {
    allow();
  }

  if (!isRecord(payload)) {
    allow();
  }

  const toolInput = payload.tool_input;
  if (!isRecord(toolInput)) {
    allow();
  }

  const toolName = payload.tool_name;
  const cwd: string = typeof payload.cwd === "string" && payload.cwd ? payload.cwd : process.cwd();
  const protected_ = protectedBranches();

  let reason: string | null;
  if (isEditTool(toolName)) {
    reason = editDenialReason(toolInput, cwd, protected_);
  } else if (toolName === "Bash") {
    const command = toolInput.command;
    reason = typeof command === "string" && command ? bashDenialReason(command, cwd, protected_) : null;
  } else {
    reason = null;
  }

  if (reason) {
    deny(reason);
  }
  allow();
}

main();
