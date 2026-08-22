const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const textlintDir = path.resolve(__dirname, "../../..");
const textlintBin = path.join(textlintDir, "node_modules", ".bin", "textlint");

function lint(fixture) {
  const result = spawnSync(
    textlintBin,
    ["--rule", "@fujiy/ja-review-domain-terms", "--format", "json", path.join(__dirname, fixture)],
    { cwd: textlintDir, encoding: "utf8" }
  );
  assert.equal(result.error, undefined);
  return {
    status: result.status,
    results: JSON.parse(result.stdout)
  };
}

test("文脈語を含まない文章は通過する", () => {
  const result = lint("valid.md");
  assert.equal(result.status, 0);
  assert.equal(result.results[0].messages.length, 0);
});

test("文脈語を検出し，長い語を優先する", () => {
  const result = lint("invalid.md");
  const messages = result.results[0].messages;
  assert.equal(result.status, 1);
  assert.equal(messages.length, 2);
  assert.match(messages[0].message, /文脈確認語「憲法」/);
  assert.match(messages[0].message, /許容文脈/);
  assert.match(messages[0].message, /ありがちな乱用/);
  assert.match(messages[0].message, /書き換えのヒント/);
  assert.match(messages[1].message, /文脈確認語「憲法的」/);
});
