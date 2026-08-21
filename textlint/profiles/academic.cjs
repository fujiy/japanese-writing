const {
  commonRules,
  dictionaryPath,
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
    "preset-japanese-writing-local": {
      "discouraged-expressions": {
        severity: "warning",
        dictionaryPath,
        excludeTerms: ["革命的", "ゲームチェンジャー", "可能性を解き放つ", "魔法のように", "究極"],
        excludeTermsForExtensions: [".md", ".markdown", ".txt"]
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
