module.exports = {
  rules: {
    "discouraged-expressions": require("./discouraged-expressions.js"),
    "scientific-punctuation": require("./scientific-punctuation.js"),
    "sentence-per-line": require("./sentence-per-line.js")
  },
  rulesConfig: {
    "discouraged-expressions": false,
    "scientific-punctuation": false,
    "sentence-per-line": false
  }
};
