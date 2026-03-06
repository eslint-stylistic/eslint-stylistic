import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './no-whitespace-before-property'

run<RuleOptions, MessageIds>({
  name: 'no-whitespace-before-property',
  rule,
  valid: [
    // #region don't throw error
    `type Foo = import(A)`,
    // #endregion
    `type Foo = A['B']`,
    `type Foo = A.B`,
    `type Foo = import(A).B`,
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/1097
    `type Test = ( typeof arr )[ number ];`,
  ],

  invalid: [
    {
      code: `type Foo = A [B]`,
      output: `type Foo = A[B]`,
      errors: [{ messageId: 'unexpectedWhitespace', data: { propName: 'B' } }],
    },
    {
      code: `type Foo = A .B`,
      output: `type Foo = A.B`,
      errors: [{ messageId: 'unexpectedWhitespace', data: { propName: 'B' } }],
    },
    {
      code: `type Foo = import(A) .B`,
      output: `type Foo = import(A).B`,
      errors: [{ messageId: 'unexpectedWhitespace', data: { propName: 'B' } }],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/1097
    {
      code: `type Test = ( typeof arr ) [ number ];`,
      output: `type Test = ( typeof arr )[ number ];`,
      errors: [{ messageId: 'unexpectedWhitespace', data: { propName: 'number' } }],
    },
  ],
})
