import tsParser from '@typescript-eslint/parser'

import type { RuleTesterClassicOptions, RuleTesterOptions } from 'eslint-vitest-rule-tester'
import { run as _run } from 'eslint-vitest-rule-tester'

export * from 'eslint-vitest-rule-tester'

export interface ExtendedRuleTesterOptions extends RuleTesterClassicOptions, RuleTesterOptions {
  lang?: 'js' | 'ts'
}

export function run(options: ExtendedRuleTesterOptions) {
  return _run({
    recursive: false,
    verifyAfterFix: false,
    ...(options.lang === 'js' ? {} : { parser: tsParser as any }),
    ...options,
  })
}
