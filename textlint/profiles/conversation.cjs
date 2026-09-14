const {
  commonRules,
  filters,
  plugins
} = require("../config-shared.cjs");

module.exports = {
  filters,
  plugins,
  rules: {
    ...commonRules,
    "ja-untranslated-english": {
      severity: "warning",
      profile: "general"
    },
    "@fujiy/preset-japanese-writing": {
      "review-domain-terms": {
        severity: "warning"
      },
      "review-ai-overstatement": {
        severity: "warning"
      },
      "scientific-punctuation": false,
      "sentence-per-line": false
    }
  }
};
