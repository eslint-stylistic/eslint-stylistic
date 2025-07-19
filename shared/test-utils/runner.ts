import type { RuleTesterInitOptions, TestCasesOptions } from 'eslint-vitest-rule-tester'
import tsParser from '@typescript-eslint/parser'
import { run as _run } from 'eslint-vitest-rule-tester'
import jsonParser from 'jsonc-eslint-parser'

export * from 'eslint-vitest-rule-tester'

export { unindent as $ } from 'eslint-vitest-rule-tester'

export interface ExtendedRuleTesterOptions<RuleOptions = any, MessageIds extends string = string> extends RuleTesterInitOptions, TestCasesOptions<RuleOptions, MessageIds> {
  lang?: 'js' | 'ts' | 'json'
}

export function run<RuleOptions = any, MessageIds extends string = string>(options: ExtendedRuleTesterOptions<RuleOptions, MessageIds>) {
  return _run<RuleOptions, MessageIds>({
    recursive: false,
    verifyAfterFix: false,
    ...(
      options.lang === 'js'
        ? {}
        : options.lang === 'ts'
          ? { parser: tsParser }
          : { parser: jsonParser }
    ),
    ...options,
  })
}
