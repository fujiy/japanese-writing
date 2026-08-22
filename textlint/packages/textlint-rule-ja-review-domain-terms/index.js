const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const defaultDictionaryPath = path.join(__dirname, "dictionary.yml");
const dictionaryCache = new Map();

function requireString(entry, field, dictionaryPath) {
  const value = entry?.[field];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${dictionaryPath}: ${entry?.term ?? "entry"}.${field} is required`);
  }
  return value;
}

function optionalString(entry, field) {
  const value = entry?.[field];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function loadEntries(dictionaryPath) {
  const resolvedPath = path.resolve(dictionaryPath);
  if (dictionaryCache.has(resolvedPath)) {
    return dictionaryCache.get(resolvedPath);
  }

  const parsed = YAML.parse(fs.readFileSync(resolvedPath, "utf8"));
  if (parsed?.version !== 1 || !Array.isArray(parsed.entries)) {
    throw new Error(`${resolvedPath}: version: 1 and entries are required`);
  }

  const entries = parsed.entries
    .map((entry) => {
      if (typeof entry?.term !== "string" || entry.term.length === 0) {
        throw new Error(`${resolvedPath}: each entry requires a non-empty term`);
      }
      return {
        term: entry.term,
        allowedContext: requireString(entry, "allowed_context", resolvedPath),
        commonMisuse: optionalString(entry, "common_misuse"),
        rewriteHint: optionalString(entry, "rewrite_hint")
      };
    })
    .sort((left, right) => right.term.length - left.term.length);

  dictionaryCache.set(resolvedPath, entries);
  return entries;
}

module.exports = function reviewDomainTerms(context, options = {}) {
  const { Syntax, getSource, locator, report, RuleError } = context;
  const entries = loadEntries(options.dictionaryPath ?? defaultDictionaryPath);

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
            const rewriteHint = entry.rewriteHint
              ? `書き換えのヒント：${entry.rewriteHint}`
              : "";
            report(
              node,
              new RuleError(
                `専門分野外での乱用が疑われる語「${entry.term}」：許容文脈：${entry.allowedContext}` +
                  `${rewriteHint}`,
                { padding: locator.range([index, endIndex]) }
              )
            );
          }
          startIndex = endIndex;
        }
      }
    }
  };
};
