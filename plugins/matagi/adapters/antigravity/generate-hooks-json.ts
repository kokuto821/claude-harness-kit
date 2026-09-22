/**
 * Claude Code 向け plugin.json の `hooks` フィールドを Google Antigravity 向け hooks.json に変換するスクリプト。
 *
 * command 文字列（既存 hooks/*.ts への参照）はそのまま維持し、hooks/*.ts 本体には手を加えない。
 * 実行方法: node --experimental-strip-types generate-hooks-json.ts [出力先パス]
 */

import { join } from "node:path";
import { readClaudePluginJson, writeManifest } from "./shared.ts";

const DEFAULT_OUTPUT_PATH = join(import.meta.dirname, "dist/hooks.json");

type ClaudeHookCommand = {
  type: string;
  command: string;
  timeout?: number;
};

type ClaudeHookMatcher = {
  matcher: string;
  hooks: ClaudeHookCommand[];
};

type ClaudePluginManifest = {
  hooks?: Record<string, ClaudeHookMatcher[]>;
};

// Antigravity hooks.json のフィールド名・イベント名は実機未検証、要実機確認
type AntigravityHookEntry = {
  event: string;
  matcher: string;
  command: string;
};

type AntigravityHooksManifest = {
  hooks: AntigravityHookEntry[];
};

const toAntigravityHooks = (source: ClaudePluginManifest): AntigravityHooksManifest => {
  const entries: AntigravityHookEntry[] = [];
  for (const [event, matchers] of Object.entries(source.hooks ?? {})) {
    for (const { matcher, hooks } of matchers) {
      for (const hook of hooks) {
        entries.push({ event, matcher, command: hook.command });
      }
    }
  }
  return { hooks: entries };
};

const main = () => {
  const outputPath = process.argv[2] || DEFAULT_OUTPUT_PATH;

  const source = readClaudePluginJson<ClaudePluginManifest>();
  const manifest = toAntigravityHooks(source);

  writeManifest(outputPath, manifest, "Antigravity hooks.json");
};

main();
