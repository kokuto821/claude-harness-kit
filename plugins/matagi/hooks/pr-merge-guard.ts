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

import { tokenize, splitSegments, stripPrefix } from "./command-parser.ts";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const allow = (): never => {
  process.exit(0);
};

const deny = (reason: string): never => {
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
};

const isGhPrMerge = (segment: string[]): boolean => {
  const tokens = stripPrefix(segment);
  return tokens.length >= 2 && tokens[0] === "gh" && tokens[1] === "pr" && tokens.slice(2).includes("merge");
};

const DENY_REASON =
  "`gh pr merge` はフックによりブロックされました。\n" + "PR のマージはユーザーがブラウザ上で行ってください。";

const bashDenialReason = (command: string): string | null => {
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
};

const readStdin = (): Promise<string> => {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
};

const main = async () => {
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
};

main();
