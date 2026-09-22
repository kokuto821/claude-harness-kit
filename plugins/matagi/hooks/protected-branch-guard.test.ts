// Run: node --test plugins/matagi/hooks/*.test.ts
//
// TDD Red フェーズ: protected-branch-guard.ts (未実装) に対する失敗するテスト。
// Python 実装（protected-branch-guard.py）の挙動を正として、TypeScript 版が
// 同じ起動契約（stdin JSON -> stdout JSON / exit code）を満たすことを検証する。

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT_PATH = join(
  import.meta.dirname ?? __dirname,
  "protected-branch-guard.ts",
);

type Payload = {
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  cwd?: string;
};

function runHook(payload: Payload) {
  const result = spawnSync("node", [SCRIPT_PATH], {
    input: JSON.stringify(payload),
    encoding: "utf-8",
    env: { ...process.env },
  });
  return result;
}

function parseDenyOutput(stdout: string) {
  const parsed = JSON.parse(stdout);
  return parsed.hookSpecificOutput;
}

function initGitRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "protected-branch-guard-"));
  spawnSync("git", ["init", "-q", "-b", "main"], { cwd: dir });
  spawnSync("git", ["config", "user.email", "test@example.com"], { cwd: dir });
  spawnSync("git", ["config", "user.name", "Test"], { cwd: dir });
  writeFileSync(join(dir, "README.md"), "init\n");
  spawnSync("git", ["add", "."], { cwd: dir });
  spawnSync("git", ["commit", "-q", "-m", "init"], { cwd: dir });
  return dir;
}

function checkoutNewBranch(dir: string, branch: string) {
  spawnSync("git", ["switch", "-c", branch], { cwd: dir });
}

test("protected-branch-guard: denies `git commit` on protected branch (main) via Bash", () => {
  const repo = initGitRepo();
  try {
    writeFileSync(join(repo, "file.txt"), "changed\n");
    spawnSync("git", ["add", "."], { cwd: repo });

    const result = runHook({
      tool_name: "Bash",
      tool_input: { command: "git commit -m 'oops'" },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    const output = parseDenyOutput(result.stdout);
    assert.equal(output.hookEventName, "PreToolUse");
    assert.equal(output.permissionDecision, "deny");
    assert.match(output.permissionDecisionReason, /main/);
    assert.match(output.permissionDecisionReason, /git commit/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: denies `git push` on protected branch (main) via Bash", () => {
  const repo = initGitRepo();
  try {
    const result = runHook({
      tool_name: "Bash",
      tool_input: { command: "git push" },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    const output = parseDenyOutput(result.stdout);
    assert.equal(output.permissionDecision, "deny");
    assert.match(output.permissionDecisionReason, /main/);
    assert.match(output.permissionDecisionReason, /git push/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: denies `git push origin main` from a non-protected current branch", () => {
  const repo = initGitRepo();
  try {
    checkoutNewBranch(repo, "feat/#1_something");

    const result = runHook({
      tool_name: "Bash",
      tool_input: { command: "git push origin main" },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    const output = parseDenyOutput(result.stdout);
    assert.equal(output.permissionDecision, "deny");
    assert.match(output.permissionDecisionReason, /main/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: denies Edit-like tool changing a file on protected branch", () => {
  const repo = initGitRepo();
  try {
    const target = join(repo, "README.md");

    const result = runHook({
      tool_name: "Edit",
      tool_input: { file_path: target },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    const output = parseDenyOutput(result.stdout);
    assert.equal(output.permissionDecision, "deny");
    assert.match(output.permissionDecisionReason, /main/);
    assert.match(output.permissionDecisionReason, /README\.md/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: denies Write tool using notebook_path on protected branch", () => {
  const repo = initGitRepo();
  try {
    const target = join(repo, "notebook.ipynb");

    const result = runHook({
      tool_name: "NotebookEdit",
      tool_input: { notebook_path: target },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    const output = parseDenyOutput(result.stdout);
    assert.equal(output.permissionDecision, "deny");
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: allows editing a .gitignore'd file on protected branch", () => {
  const repo = initGitRepo();
  try {
    writeFileSync(join(repo, ".gitignore"), "ignored.txt\n");
    spawnSync("git", ["add", ".gitignore"], { cwd: repo });
    spawnSync("git", ["commit", "-q", "-m", "add gitignore"], { cwd: repo });
    writeFileSync(join(repo, "ignored.txt"), "scratch\n");

    const result = runHook({
      tool_name: "Edit",
      tool_input: { file_path: join(repo, "ignored.txt") },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "");
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: allows commands outside a git-managed directory", () => {
  const dir = mkdtempSync(join(tmpdir(), "no-git-"));
  try {
    const result = runHook({
      tool_name: "Bash",
      tool_input: { command: "git commit -m 'x'" },
      cwd: dir,
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("protected-branch-guard: allows detached HEAD state", () => {
  const repo = initGitRepo();
  try {
    const head = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: repo,
      encoding: "utf-8",
    }).stdout.trim();
    spawnSync("git", ["checkout", "-q", head], { cwd: repo });

    const result = runHook({
      tool_name: "Bash",
      tool_input: { command: "git commit -m 'x'" },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "");
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: allows git commit/push on a non-protected branch", () => {
  const repo = initGitRepo();
  try {
    checkoutNewBranch(repo, "feat/#2_work");

    const result = runHook({
      tool_name: "Bash",
      tool_input: { command: "git commit -m 'ok'" },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "");
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: respects CLAUDE_PROTECTED_BRANCHES override", () => {
  const repo = initGitRepo();
  try {
    checkoutNewBranch(repo, "release");

    const result = spawnSync("node", [SCRIPT_PATH], {
      input: JSON.stringify({
        tool_name: "Bash",
        tool_input: { command: "git commit -m 'x'" },
        cwd: repo,
      }),
      encoding: "utf-8",
      env: { ...process.env, CLAUDE_PROTECTED_BRANCHES: "release staging" },
    });

    assert.equal(result.status, 0);
    const output = parseDenyOutput(result.stdout);
    assert.equal(output.permissionDecision, "deny");
    assert.match(output.permissionDecisionReason, /release/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("protected-branch-guard: fail-open on invalid JSON input", () => {
  const result = spawnSync("node", [SCRIPT_PATH], {
    input: "{ this is not json",
    encoding: "utf-8",
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "");
});

test("protected-branch-guard: fail-open on unrelated tool", () => {
  const repo = initGitRepo();
  try {
    const result = runHook({
      tool_name: "Read",
      tool_input: { file_path: join(repo, "README.md") },
      cwd: repo,
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), "");
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
