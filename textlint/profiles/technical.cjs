const {
  commonRules,
  dictionaryPath,
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
