const {
  commonRules,
  filters,
  plugins,
  terminologyPath
} = require("../config-shared.cjs");

module.exports = {
  filters,
  plugins,
  rules: {
    ...commonRules,
    "@fujiy/preset-japanese-writing": {
      "review-domain-terms": {
        severity: "warning"
      },
      "review-ai-overstatement": {
        severity: "warning"
      },
      "preferred-terminology": {
        severity: "warning",
        dictionaryPath: terminologyPath
      },
      "scientific-punctuation": false,
      "sentence-per-line": false
    }
  }
};
