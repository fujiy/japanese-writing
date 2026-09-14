const {
  commonRules,
  engineeringPrhPath,
  filters,
  plugins,
  technicalPreset
} = require("../config-shared.cjs");

module.exports = {
  filters,
  plugins,
  rules: {
    ...commonRules,
    "preset-ja-technical-writing": technicalPreset,
    "preset-ja-engineering-paper": {
      "ja-hiragana-fukushi": {
        severity: "warning"
      },
      "ja-hiragana-keishikimeishi": {
        severity: "warning"
      },
      "ja-hiragana-hojodoushi": {
        severity: "warning"
      },
      "no-synonyms": {
        severity: "info"
      },
      prh: {
        severity: "warning",
        rulePaths: [engineeringPrhPath]
      },
      "unify-kuten-and-touten": false,
      "use-si-units": {
        severity: "info"
      }
    },
    "ja-untranslated-english": {
      severity: "warning",
      profile: "academic"
    },
    "@fujiy/preset-japanese-writing": {
      "review-domain-terms": {
        severity: "warning"
      },
      "review-ai-overstatement": {
        severity: "warning"
      },
      "scientific-punctuation": {
        severity: "warning"
      },
      "sentence-per-line": {
        severity: "info"
      }
    }
  }
};
