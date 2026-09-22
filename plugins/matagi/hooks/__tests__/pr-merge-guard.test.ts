// Run: node --test plugins/matagi/hooks/__tests__/*.test.ts
//
// TDD Red フェーズ: pr-merge-guard.ts (未実装) に対する失敗するテスト。
// Python 実装（pr-merge-guard.py）の挙動を正として、TypeScript 版が
// 同じ起動契約（stdin JSON -> stdout JSON / exit code）を満たすことを検証する。

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { runHook as runHookBase, parseDenyOutput, type Payload } from "./helpers/test-helpers.ts";

const SCRIPT_PATH = join(
  import.meta.dirname ?? __dirname,
  "..",
  "pr-merge-guard.ts",
);

function runHook(payload: Payload) {
  return runHookBase(SCRIPT_PATH, payload);
}

test("pr-merge-guard: denies `gh pr merge` via Bash", () => {
  const result = runHook({
    tool_name: "Bash",
    tool_input: { command: "gh pr merge 123" },
  });

  assert.equal(result.status, 0);
  const output = parseDenyOutput(result.stdout);
  assert.equal(output.hookEventName, "PreToolUse");
  assert.equal(output.permissionDecision, "deny");
  assert.match(output.permissionDecisionReason, /gh pr merge/);
});

test("pr-merge-guard: denies `gh pr merge` with flags between subcommands", () => {
  const result = runHook({
    tool_name: "Bash",
    tool_input: { command: "gh pr merge --squash --auto 123" },
  });

  assert.equal(result.status, 0);
  const output = parseDenyOutput(result.stdout);
  assert.equal(output.permissionDecision, "deny");
});

test("pr-merge-guard: denies `gh pr merge` chained after other commands", () => {
  const result = runHook({
    tool_name: "Bash",
    tool_input: { command: "echo hi && gh pr merge 123 --merge" },
  });

  assert.equal(result.status, 0);
  const output = parseDenyOutput(result.stdout);
  assert.equal(output.permissionDecision, "deny");
});

test("pr-merge-guard: allows `gh pr view`", () => {
  const result = runHook({
    tool_name: "Bash",
    tool_input: { command: "gh pr view 123" },
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("pr-merge-guard: allows `gh pr list`", () => {
  const result = runHook({
    tool_name: "Bash",
    tool_input: { command: "gh pr list" },
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("pr-merge-guard: allows `gh api .../merge` (not via gh pr merge)", () => {
  const result = runHook({
    tool_name: "Bash",
    tool_input: {
      command: "gh api repos/foo/bar/pulls/123/merge -X PUT",
    },
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("pr-merge-guard: allows non-Bash tools regardless of input", () => {
  const result = runHook({
    tool_name: "Edit",
    tool_input: { file_path: "/tmp/whatever.txt" },
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("pr-merge-guard: fail-open on invalid JSON input", () => {
  const result = spawnSync("node", [SCRIPT_PATH], {
    input: "not json at all",
    encoding: "utf-8",
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("pr-merge-guard: fail-open when tool_input is missing", () => {
  const result = spawnSync("node", [SCRIPT_PATH], {
    input: JSON.stringify({ tool_name: "Bash" }),
    encoding: "utf-8",
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});
