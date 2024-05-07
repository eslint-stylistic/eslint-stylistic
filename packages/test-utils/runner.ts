import tsParser from '@typescript-eslint/parser'

// eslint-disable-next-line ts/ban-ts-comment, ts/prefer-ts-expect-error
// @ts-ignore
import { run as _run } from '../../../eslint-vitest-rule-tester/src/index'

export * from '../../../eslint-vitest-rule-tester/src/index'

// import { run as _run } from 'esltin-vitest-rule-tester'
// export * from 'esltin-vitest-rule-tester'

export const runCases = (options => _run({
  ...options,
  parser: tsParser as any,
})) as typeof _run
