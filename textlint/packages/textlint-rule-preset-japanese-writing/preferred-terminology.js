const fs = require("node:fs");
const path = require("node:path");
const YAML = require("yaml");

const dictionaryCache = new Map();
const asciiWordCharacter = /[A-Za-z0-9_-]/;

function loadEntries(dictionaryPath) {
  const resolvedPath = path.resolve(dictionaryPath);
  if (dictionaryCache.has(resolvedPath)) {
    return dictionaryCache.get(resolvedPath);
  }
  const parsed = YAML.parse(fs.readFileSync(resolvedPath, "utf8"));
  const entries = Array.isArray(parsed?.entries) ? parsed.entries : [];
  const normalized = entries
    .filter(
      (entry) =>
        entry?.policy === "translate" &&
        typeof entry.term === "string" &&
        entry.term.length > 0 &&
        Array.isArray(entry.preferred) &&
        entry.preferred.some((candidate) => typeof candidate === "string" && candidate.length > 0)
    )
    .map((entry) => ({
      ...entry,
      preferred: entry.preferred.filter(
        (candidate) => typeof candidate === "string" && candidate.length > 0
      )
    }))
    .sort((left, right) => right.term.length - left.term.length);
  dictionaryCache.set(resolvedPath, normalized);
  return normalized;
}

function hasEnglishWordBoundary(text, start, end, term) {
  const startsWithWordCharacter = asciiWordCharacter.test(term[0]);
  const endsWithWordCharacter = asciiWordCharacter.test(term[term.length - 1]);
  const previous = start > 0 ? text[start - 1] : "";
  const next = end < text.length ? text[end] : "";
  return !(
    (startsWithWordCharacter && asciiWordCharacter.test(previous)) ||
    (endsWithWordCharacter && asciiWordCharacter.test(next))
  );
}

module.exports = function preferredTerminology(context, options = {}) {
  const { Syntax, getSource, locator, report, RuleError } = context;
  if (!options.dictionaryPath) {
    throw new Error("preferred-terminology requires dictionaryPath");
  }
  const entries = loadEntries(options.dictionaryPath);

  function getProseSource(node) {
    const source = getSource(node);
    const prose = Array.from(source, () => " ");

    function copyProse(child) {
      if (child.type === Syntax.Str || (child.type === Syntax.Html && /^\s+$/.test(getSource(child)))) {
        const childSource = getSource(child);
        const offset = child.range[0] - node.range[0];
        for (let index = 0; index < childSource.length; index += 1) {
          prose[offset + index] = childSource[index];
        }
        return;
      }
      for (const grandchild of child.children ?? []) {
        copyProse(grandchild);
      }
    }

    for (const child of node.children ?? []) {
      copyProse(child);
    }
    return prose.join("");
  }

  function checkNode(node) {
    const source = getSource(node);
    const prose = getProseSource(node);
    const normalizedProse = prose.toLocaleLowerCase("en-US");
    const occupied = [];
    for (const entry of entries) {
      const normalizedTerm = entry.term.toLocaleLowerCase("en-US");
      let startIndex = 0;
      while (startIndex < prose.length) {
        const index = normalizedProse.indexOf(normalizedTerm, startIndex);
        if (index === -1) {
          break;
        }
        const endIndex = index + entry.term.length;
        const overlaps = occupied.some(([start, end]) => index < end && endIndex > start);
        if (!overlaps && hasEnglishWordBoundary(prose, index, endIndex, entry.term)) {
          occupied.push([index, endIndex]);
          const candidates = entry.preferred.map((candidate) => `「${candidate}」`).join("または");
          const contextMessage = entry.context ? ` 文脈：${entry.context}．` : "";
          report(
            node,
            new RuleError(
              `英語のまま残っている用語「${source.slice(index, endIndex)}」：推奨表記は${candidates}である．${contextMessage}`,
              { padding: locator.range([index, endIndex]) }
            )
          );
        }
        startIndex = endIndex;
      }
    }
  }

  return {
    [Syntax.Paragraph]: checkNode,
    [Syntax.Header]: checkNode
  };
};
