#!/usr/bin/env -S node --experimental-strip-types
/**
 * `gh pr merge` の実行を常にブロックする PreToolUse フック。
 *
 * PR のマージは取り消しにくく外部公開される操作のため、issue-driven-rule.md の方針どおり
 * 必ずユーザーがブラウザ上で承認・実行する。AI エージェント側からの実行経路（Bash 経由の
 * `gh pr merge`）をブランチ・状態を問わず常に拒否する。
 *
 * 対象外（意図的に見ない）:
 *
 * - `gh api repos/.../pulls/<番号>/merge` 等、`gh pr merge` を経由しない API 直叩き。
 *   シェルの網羅は原理的に不完全なため、主経路である `gh pr merge` のみを塞ぐ。
 */

const SEGMENT_SEPARATORS = new Set(["&&", "||", ";", "|", "&", "(", ")", "\n"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

/** コマンド文字列をトークン列に分解する。引用符の中身は1トークンにまとまる。 */
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
      // combine && and ||
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

function isGhPrMerge(segment: string[]): boolean {
  const tokens = stripPrefix(segment);
  return tokens.length >= 2 && tokens[0] === "gh" && tokens[1] === "pr" && tokens.slice(2).includes("merge");
}

const DENY_REASON =
  "`gh pr merge` はフックによりブロックされました。\n" + "PR のマージはユーザーがブラウザ上で行ってください。";

function bashDenialReason(command: string): string | null {
  let segments: string[][];
  try {
    segments = splitSegments(tokenize(command));
  } catch {
    return null;
  }

  for (const segment of segments) {
    if (isGhPrMerge(segment)) {
      return DENY_REASON;
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

  if (payload.tool_name !== "Bash") {
    allow();
  }

  const toolInput = payload.tool_input;
  if (!isRecord(toolInput)) {
    allow();
  }

  const command = toolInput.command;
  if (typeof command !== "string" || !command) {
    allow();
  }

  const reason = bashDenialReason(command);
  if (reason) {
    deny(reason);
  }

  allow();
}

main();
