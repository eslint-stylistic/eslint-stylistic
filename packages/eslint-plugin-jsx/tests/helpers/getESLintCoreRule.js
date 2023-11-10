'use strict'

import jsRules from '@stylistic/eslint-plugin-js'

function getESLintCoreRule(ruleId) {
  if (ruleId in jsRules.rules)
    return jsRules.rules[ruleId]
  throw new Error(`Failed to find core rule ${ruleId}, this is an internal bug of @stylistic/eslint-plugin-ts`)
}

export default getESLintCoreRule
