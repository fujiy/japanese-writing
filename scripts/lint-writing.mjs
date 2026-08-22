#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");
const textlintDir = path.join(skillDir, "textlint");
const textlintBin = path.join(textlintDir, "node_modules", ".bin", "textlint");
const profiles = new Set(["logical", "general", "technical", "academic"]);
const modes = new Set(["draft", "revise", "proofread", "review"]);

function fail(message, exitCode = 2) {
  process.stderr.write(`${message}\n`);
  process.exit(exitCode);
}

const input = process.argv.slice(2);
let profile = "general";
let mode = "revise";
let format = "stylish";
let fix = false;
let cache = false;
const targets = [];

for (let index = 0; index < input.length; index += 1) {
  const argument = input[index];
  if (argument === "--profile") {
    profile = input[++index];
  } else if (argument === "--mode") {
    mode = input[++index];
  } else if (argument === "--format") {
    format = input[++index];
  } else if (argument === "--fix") {
    fix = true;
  } else if (argument === "--cache") {
    cache = true;
  } else if (argument === "--help" || argument === "-h") {
    process.stdout.write(
      "Usage: node scripts/lint-writing.mjs " +
        "[--profile logical|general|technical|academic] " +
        "[--mode draft|revise|proofread|review] [--format name] [--cache] [--fix] file...\n"
    );
    process.exit(0);
  } else if (argument.startsWith("-")) {
    fail(`Unknown option: ${argument}`);
  } else {
    targets.push(argument);
  }
}

if (!profiles.has(profile)) {
  fail(`Unknown profile: ${profile}`);
}
if (!modes.has(mode)) {
  fail(`Unknown mode: ${mode}`);
}
if (targets.length === 0) {
  fail("At least one target file is required.");
}
if (fix && (mode === "proofread" || mode === "review")) {
  fail(`--fix is not allowed in ${mode} mode.`);
}
if (!existsSync(textlintBin)) {
  fail(
    `textlint dependencies are unavailable. Install the locked dependencies in ${textlintDir} before using this optional check.`
  );
}

const textlintArgs = [
  "--config",
  path.join(textlintDir, "profiles", `${profile}.cjs`),
  "--format",
  format
];
if (cache) {
  textlintArgs.push("--cache");
}
if (fix) {
  textlintArgs.push("--fix");
}
textlintArgs.push(...targets);

const result = spawnSync(textlintBin, textlintArgs, {
  cwd: process.cwd(),
  stdio: "inherit"
});

if (result.error) {
  fail(result.error.message);
}
process.exit(result.status ?? 2);
