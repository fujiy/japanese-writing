module.exports = {
  rules: {
    "review-domain-terms": require("@fujiy/textlint-rule-ja-review-domain-terms"),
    "review-ai-overstatement": require("@fujiy/textlint-rule-ja-review-ai-overstatement"),
    "preferred-terminology": require("./preferred-terminology.js"),
    "scientific-punctuation": require("./scientific-punctuation.js"),
    "sentence-per-line": require("./sentence-per-line.js")
  },
  rulesConfig: {
    "review-domain-terms": false,
    "review-ai-overstatement": false,
    "preferred-terminology": false,
    "scientific-punctuation": false,
    "sentence-per-line": false
  }
};
