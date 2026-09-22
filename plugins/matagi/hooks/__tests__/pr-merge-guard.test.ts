// Run: node --test plugins/matagi/hooks/__tests__/*.test.ts
//
// TDD Red フェーズ: pr-merge-guard.ts (未実装) に対する失敗するテスト。
// Python 実装（pr-merge-guard.py）の挙動を正として、TypeScript 版が
// 同じ起動契約（stdin JSON -> stdout JSON / exit code）を満たすことを検証する。

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { runHook as runHookBase, parseDenyOutput, type Payload } from "./helpers/hookTestHelpers.ts";

const SCRIPT_PATH = join(
  import.meta.dirname ?? __dirname,
  "..",
  "pr-merge-guard.ts",
);

function runHook(payload: Payload) {
  return runHookBase(SCRIPT_PATH, payload);
}

test("Bash経由の`gh pr merge`を拒否する", () => {
  // Arrange
  const payload: Payload = {
    tool_name: "Bash",
    tool_input: { command: "gh pr merge 123" },
  };

  // Act
  const result = runHook(payload);

  // Assert
  assert.equal(result.status, 0);
  const output = parseDenyOutput(result.stdout);
  assert.equal(output.hookEventName, "PreToolUse");
  assert.equal(output.permissionDecision, "deny");
  assert.match(output.permissionDecisionReason, /gh pr merge/);
});

test("サブコマンドの間にフラグが挟まる`gh pr merge`を拒否する", () => {
  // Arrange
  const payload: Payload = {
    tool_name: "Bash",
    tool_input: { command: "gh pr merge --squash --auto 123" },
  };

  // Act
  const result = runHook(payload);

  // Assert
  assert.equal(result.status, 0);
  const output = parseDenyOutput(result.stdout);
  assert.equal(output.permissionDecision, "deny");
});

test("他コマンドに連結された`gh pr merge`を拒否する", () => {
  // Arrange
  const payload: Payload = {
    tool_name: "Bash",
    tool_input: { command: "echo hi && gh pr merge 123 --merge" },
  };

  // Act
  const result = runHook(payload);

  // Assert
  assert.equal(result.status, 0);
  const output = parseDenyOutput(result.stdout);
  assert.equal(output.permissionDecision, "deny");
});

test("`gh pr view`は許可する", () => {
  // Arrange
  const payload: Payload = {
    tool_name: "Bash",
    tool_input: { command: "gh pr view 123" },
  };

  // Act
  const result = runHook(payload);

  // Assert
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("`gh pr list`は許可する", () => {
  // Arrange
  const payload: Payload = {
    tool_name: "Bash",
    tool_input: { command: "gh pr list" },
  };

  // Act
  const result = runHook(payload);

  // Assert
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("`gh pr merge`を経由しない`gh api .../merge`は許可する", () => {
  // Arrange
  const payload: Payload = {
    tool_name: "Bash",
    tool_input: {
      command: "gh api repos/foo/bar/pulls/123/merge -X PUT",
    },
  };

  // Act
  const result = runHook(payload);

  // Assert
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("Bash以外のツールは入力内容によらず許可する", () => {
  // Arrange
  const payload: Payload = {
    tool_name: "Edit",
    tool_input: { file_path: "/tmp/whatever.txt" },
  };

  // Act
  const result = runHook(payload);

  // Assert
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("不正なJSON入力に対してfail-openする", () => {
  // Arrange (入力自体が不正なJSON文字列)

  // Act
  const result = spawnSync("node", [SCRIPT_PATH], {
    input: "not json at all",
    encoding: "utf-8",
  });

  // Assert
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("tool_inputが欠落している場合にfail-openする", () => {
  // Arrange
  const payload = { tool_name: "Bash" };

  // Act
  const result = spawnSync("node", [SCRIPT_PATH], {
    input: JSON.stringify(payload),
    encoding: "utf-8",
  });

  // Assert
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});
