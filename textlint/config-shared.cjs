const path = require("node:path");

const terminologyPath = path.resolve(__dirname, "../references/terminology.yml");
const engineeringPrhPath = path.resolve(
  __dirname,
  "node_modules/textlint-rule-preset-ja-engineering-paper/src/dict/prh-rules.yml"
);

const filters = {
  comments: true
};

const plugins = {
  latex2e: true
};

const commonRules = {
  "ja-space-between-half-and-full-width": {
    severity: "warning",
    space: "never"
  },
  "preset-japanese": {
    "max-ten": false,
    "no-doubled-conjunctive-particle-ga": false,
    "no-doubled-conjunction": false,
    "no-double-negative-ja": {
      severity: "warning"
    },
    "no-doubled-joshi": false,
    "sentence-length": false,
    "no-dropping-the-ra": {
      severity: "warning"
    },
    "no-mix-dearu-desumasu": false,
    "no-nfd": true,
    "no-invalid-control-character": true,
    "no-zero-width-spaces": true,
    "no-kangxi-radicals": true
  },
  "@textlint-ja/preset-ai-writing": {
    "no-ai-list-formatting": {
      severity: "info"
    },
    "no-ai-hype-expressions": {
      severity: "warning"
    },
    "no-ai-emphasis-patterns": {
      severity: "info"
    },
    "no-ai-colon-continuation": {
      severity: "info"
    },
    "ai-tech-writing-guideline": false
  },
  "@fujiy/preset-japanese-writing": {
    "review-domain-terms": {
      severity: "warning"
    },
    "review-ai-overstatement": {
      severity: "warning"
    },
    "preferred-terminology": false,
    "scientific-punctuation": false,
    "sentence-per-line": false
  }
};

const technicalPreset = {
  "sentence-length": false,
  "max-comma": false,
  "max-ten": false,
  "max-kanji-continuous-len": false,
  "arabic-kanji-numbers": {
    severity: "warning"
  },
  "no-mix-dearu-desumasu": {
    severity: "warning",
    preferInHeader: "",
    preferInBody: "である",
    preferInList: "である",
    strict: false
  },
  "ja-no-mixed-period": false,
  "no-double-negative-ja": false,
  "no-dropping-the-ra": false,
  "no-doubled-conjunctive-particle-ga": {
    severity: "info"
  },
  "no-doubled-conjunction": {
    severity: "info"
  },
  "no-doubled-joshi": false,
  "no-nfd": false,
  "no-invalid-control-character": false,
  "no-zero-width-spaces": false,
  "no-exclamation-question-mark": {
    severity: "info"
  },
  "no-hankaku-kana": true,
  "ja-no-weak-phrase": {
    severity: "info"
  },
  "ja-no-successive-word": true,
  "ja-no-abusage": {
    severity: "warning"
  },
  "ja-no-redundant-expression": {
    severity: "info"
  },
  "ja-unnatural-alphabet": true,
  "no-unmatched-pair": true
};

module.exports = {
  commonRules,
  engineeringPrhPath,
  filters,
  plugins,
  terminologyPath,
  technicalPreset
};
