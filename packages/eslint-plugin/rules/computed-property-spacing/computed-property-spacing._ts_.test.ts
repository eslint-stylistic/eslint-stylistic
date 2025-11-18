import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './computed-property-spacing'

run<RuleOptions, MessageIds>({
  name: 'computed-property-spacing',
  rule,
  valid: [
    {
      code: 'class A { [ a ](){} accessor [ b ] }',
      options: ['never', { enforceForClassMembers: false }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class A { accessor [ b ]; }',
      options: ['never', { enforceForClassMembers: false }],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class A { accessor [b]; }',
      options: ['always', { enforceForClassMembers: false }],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'A = class { accessor [b] = 1 }',
      options: ['never', { enforceForClassMembers: true }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class A { accessor [b] = 1 }',
      options: ['never', { enforceForClassMembers: true }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: $`
        A = class {
          accessor [
            b
          ] = 1
        }
      `,
      options: ['never', { enforceForClassMembers: true }],
      parserOptions: { ecmaVersion: 6 },
    },
    `type Foo = A[B]`,
  ],

  invalid: [
    {
      code: `class A { accessor [a] = 0 }`,
      output: `class A { accessor [ a ] = 0 }`,
      options: ['always', { enforceForClassMembers: true }],
      errors: [
        { messageId: 'missingSpaceAfter', column: 20, endColumn: 21 },
        { messageId: 'missingSpaceBefore', column: 22, endColumn: 23 },
      ],
    },
    {
      code: `type Foo = A[ B ]`,
      output: `type Foo = A[B]`,
      errors: [
        { messageId: 'unexpectedSpaceAfter', data: { tokenValue: '[' } },
        { messageId: 'unexpectedSpaceBefore', data: { tokenValue: ']' } },
      ],
    },
    {
      code: `type Foo = A[B]`,
      output: `type Foo = A[ B ]`,
      options: ['always'],
      errors: [
        { messageId: 'missingSpaceAfter', data: { tokenValue: '[' } },
        { messageId: 'missingSpaceBefore', data: { tokenValue: ']' } },
      ],
    },
  ],
})
