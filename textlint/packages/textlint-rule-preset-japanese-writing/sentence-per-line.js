module.exports = function sentencePerLine(context) {
  const { Syntax, getSource, locator, report, RuleError } = context;

  return {
    [Syntax.Paragraph](node) {
      const text = getSource(node);
      const pattern = /[．。](?![」』）\]】〕〉》])(?!\r?\n|$)/g;
      for (const match of text.matchAll(pattern)) {
        const index = match.index ?? 0;
        report(
          node,
          new RuleError("MarkdownおよびTeXでは，一文ごとに改行します．", {
            padding: locator.range([index, index + match[0].length])
          })
        );
      }
    }
  };
};
