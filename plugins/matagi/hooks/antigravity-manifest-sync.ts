#!/usr/bin/env -S node --experimental-strip-types
/**
 * PostToolUse フック: plugins/matagi/.claude-plugin/plugin.json への変更を検知したとき、
 * 作業リポジトリ直下に Antigravity 用ワークスペース（.agents/plugins/matagi/）が
 * 存在する場合のみ、Antigravity 用アダプタ（plugin.json / hooks.json）を再生成する。
 *
 * ブロック判定は行わない（常に正常終了する）。
 */

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

export const TARGET_RELATIVE_PATH = "plugins/matagi/.claude-plugin/plugin.json";
export const ANTIGRAVITY_DIR_RELATIVE_PATH = ".agents/plugins/matagi";

type SyncPayload = Record<string, unknown>;

type SyncDeps = {
  existsSync: (path: string) => boolean;
  spawnSync: (command: string, args?: string[]) => unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const editTargetPath = (toolInput: unknown): string | null => {
  if (!isRecord(toolInput)) {
    return null;
  }
  const path = toolInput.file_path;
  return typeof path === "string" && path ? path : null;
};

const isTargetFile = (filePath: string, cwd: string): boolean => {
  return filePath === join(cwd, TARGET_RELATIVE_PATH);
};

export const syncAntigravityManifest = (payload: SyncPayload, deps: SyncDeps): void => {
  const cwd = typeof payload["cwd"] === "string" && payload["cwd"] ? (payload["cwd"] as string) : process.cwd();
  const filePath = editTargetPath(payload["tool_input"]);

  if (filePath === null || !isTargetFile(filePath, cwd)) {
    return;
  }

  const antigravityDir = join(cwd, ANTIGRAVITY_DIR_RELATIVE_PATH);
  if (!deps.existsSync(antigravityDir)) {
    return;
  }

  deps.spawnSync("node", [
    "--experimental-strip-types",
    "plugins/matagi/adapters/antigravity/generate-plugin-json.ts",
    ANTIGRAVITY_DIR_RELATIVE_PATH,
  ]);
  deps.spawnSync("node", [
    "--experimental-strip-types",
    "plugins/matagi/adapters/antigravity/generate-hooks-json.ts",
    ANTIGRAVITY_DIR_RELATIVE_PATH,
  ]);
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
    process.exit(0);
  }

  if (isRecord(payload)) {
    syncAntigravityManifest(payload, { existsSync, spawnSync });
  }

  process.exit(0);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
