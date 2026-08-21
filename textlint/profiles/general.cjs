const { commonRules, filters, plugins } = require("../config-shared.cjs");

module.exports = {
  filters,
  plugins,
  rules: {
    ...commonRules
  }
};
