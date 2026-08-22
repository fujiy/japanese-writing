const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const textlintDir = path.resolve(__dirname, "../../..");
const textlintBin = path.join(textlintDir, "node_modules", ".bin", "textlint");

function lint(fixture) {
  const result = spawnSync(
    textlintBin,
    ["--rule", "@fujiy/ja-review-ai-overstatement", "--format", "json", path.join(__dirname, fixture)],
    { cwd: textlintDir, encoding: "utf8" }
  );
  assert.equal(result.error, undefined);
  return {
    status: result.status,
    results: JSON.parse(result.stdout)
  };
}

test("強調表現を含まない文章は通過する", () => {
  const result = lint("valid.md");
  assert.equal(result.status, 0);
  assert.equal(result.results[0].messages.length, 0);
});

test("AI生成文で多用されやすい強調表現を簡潔に報告する", () => {
  const result = lint("invalid.md");
  const messages = result.results[0].messages;
  assert.equal(result.status, 1);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].message, "AI生成文で多用されやすい強調表現「不可欠」を確認する．");
  assert.equal(messages[1].message, "AI生成文で多用されやすい強調表現「正面から」を確認する．");
});
