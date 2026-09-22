/**
 * Claude Code 向け plugin.json を Google Antigravity 向け plugin.json に変換するスクリプト。
 *
 * Antigravity の plugin.json は必須 `name`（`^[a-zA-Z0-9-_]+$`）、任意 `description`、
 * 任意 `$schema` のみを持ち、`hooks` フィールドは持たない（hooks は hooks.json で別管理）。
 * 実行方法: node --experimental-strip-types generate-plugin-json.ts [出力先パス]
 */

import { join } from "node:path";
import { readClaudePluginJson, writeManifest } from "./shared.ts";

const DEFAULT_OUTPUT_PATH = join(import.meta.dirname, "dist/plugin.json");

type ClaudePluginManifest = {
  name: string;
  description?: string;
};

type AntigravityPluginManifest = {
  name: string;
  description?: string;
};

const toAntigravityManifest = (source: ClaudePluginManifest): AntigravityPluginManifest => {
  const manifest: AntigravityPluginManifest = { name: source.name };
  if (source.description !== undefined) {
    manifest.description = source.description;
  }
  return manifest;
};

const main = () => {
  const outputPath = process.argv[2] || DEFAULT_OUTPUT_PATH;

  const source = readClaudePluginJson<ClaudePluginManifest>();
  const manifest = toAntigravityManifest(source);

  writeManifest(outputPath, manifest, "Antigravity plugin.json");
};

main();
