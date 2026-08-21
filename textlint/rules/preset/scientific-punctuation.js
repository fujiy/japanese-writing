module.exports = function scientificPunctuation(context) {
  const { Syntax, getSource, locator, report, RuleError } = context;
  const replacements = new Map([
    ["。", "．"],
    ["、", "，"]
  ]);

  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      for (let index = 0; index < text.length; index += 1) {
        const replacement = replacements.get(text[index]);
        if (!replacement) {
          continue;
        }
        report(
          node,
          new RuleError(`技術文書では「${text[index]}」ではなく「${replacement}」を使います．`, {
            padding: locator.range([index, index + 1])
          })
        );
      }
    }
  };
};
