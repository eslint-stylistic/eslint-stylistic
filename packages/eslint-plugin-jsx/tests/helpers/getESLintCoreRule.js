'use strict'

const jsRules = require('@stylistic/eslint-plugin-js')

function getESLintCoreRule(ruleId) {
  if (ruleId in jsRules.rules)
    return jsRules.rules[ruleId]
  throw new Error(`Failed to find core rule ${ruleId}, this is an internal bug of @stylistic/eslint-plugin-ts`)
}

module.exports = getESLintCoreRule
