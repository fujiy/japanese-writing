const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const dictionaryCache = new Map();

function loadEntries(dictionaryPath) {
  const resolvedPath = path.resolve(dictionaryPath);
  if (dictionaryCache.has(resolvedPath)) {
    return dictionaryCache.get(resolvedPath);
  }
  const parsed = YAML.parse(fs.readFileSync(resolvedPath, "utf8"));
  const entries = Array.isArray(parsed?.entries) ? parsed.entries : [];
  const normalized = entries
    .filter((entry) => typeof entry?.term === "string" && entry.term.length > 0)
    .sort((left, right) => right.term.length - left.term.length);
  dictionaryCache.set(resolvedPath, normalized);
  return normalized;
}

module.exports = function discouragedExpressions(context, options = {}) {
  const { Syntax, getFilePath, getSource, locator, report, RuleError } = context;
  if (!options.dictionaryPath) {
    throw new Error("discouraged-expressions requires dictionaryPath");
  }
  const fileExtension = path.extname(getFilePath?.() ?? "").toLowerCase();
  const exclusionExtensions = Array.isArray(options.excludeTermsForExtensions)
    ? options.excludeTermsForExtensions
    : [];
  const shouldExclude = exclusionExtensions.includes(fileExtension);
  const excludedTerms = new Set(
    shouldExclude && Array.isArray(options.excludeTerms) ? options.excludeTerms : []
  );
  const entries = loadEntries(options.dictionaryPath).filter((entry) => !excludedTerms.has(entry.term));

  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      const occupied = [];
      for (const entry of entries) {
        let startIndex = 0;
        while (startIndex < text.length) {
          const index = text.indexOf(entry.term, startIndex);
          if (index === -1) {
            break;
          }
          const endIndex = index + entry.term.length;
          const overlaps = occupied.some(([start, end]) => index < end && endIndex > start);
          if (!overlaps) {
            occupied.push([index, endIndex]);
            const label = entry.policy === "forbid" ? "原則使用しない表現" : "文脈の確認が必要な語";
            const detail = entry.message ? ` ${entry.message}` : "";
            report(
              node,
              new RuleError(`${label}「${entry.term}」：${detail}`, {
                padding: locator.range([index, endIndex])
              })
            );
          }
          startIndex = endIndex;
        }
      }
    }
  };
};
