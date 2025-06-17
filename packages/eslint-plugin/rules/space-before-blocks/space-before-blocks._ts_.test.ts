// this rule tests spacing, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './space-before-blocks'

run<RuleOptions, MessageIds>({
  name: 'space-before-blocks',
  rule,
  valid: [
    {
      code: $`
        enum Test{
          KEY1 = 2,
        }
      `,
      options: ['never'],
    },
    {
      code: $`
        interface Test{
          prop1: number;
        }
      `,
      options: ['never'],
    },
    {
      code: $`
        enum Test {
          KEY1 = 2,
        }
      `,
      options: ['always'],
    },
    {
      code: $`
        interface Test {
          prop1: number;
        }
      `,
      options: ['always'],
    },
    {
      code: $`
        enum Test{
          KEY1 = 2,
        }
      `,
      options: [{ classes: 'never' }],
    },
    {
      code: $`
        interface Test{
          prop1: number;
        }
      `,
      options: [{ classes: 'never' }],
    },
    {
      code: $`
        enum Test {
          KEY1 = 2,
        }
      `,
      options: [{ classes: 'always' }],
    },
    {
      code: $`
        interface Test {
          prop1: number;
        }
      `,
      options: [{ classes: 'always' }],
    },
    {
      code: $`
        interface Test{
          prop1: number;
        }
      `,
      options: [{ classes: 'off' }],
    },
    {
      code: $`
        namespace Test{
          type foo = number;
        }
        declare module 'foo'{
          type foo = number;
        }
      `,
      options: ['never'],
    },
    {
      code: $`
        namespace Test {
          type foo = number;
        }
        declare module 'foo' {
          type foo = number;
        }
      `,
      options: ['always'],
    },
    {
      code: $`
        namespace Test{
          type foo = number;
        }
        declare module 'foo'{
          type foo = number;
        }
      `,
      options: [{ classes: 'never' }],
    },
    {
      code: $`
        namespace Test {
          type foo = number;
        }
        declare module 'foo' {
          type foo = number;
        }
      `,
      options: [{ classes: 'always' }],
    },
    {
      code: $`
        namespace Test{
          type foo = number;
        }
        declare module 'foo'{
          type foo = number;
        }
      `,
      options: [{ classes: 'off' }],
    },
  ],
  invalid: [
    {
      code: $`
        enum Test{
          A = 2,
          B = 1,
        }
      `,
      output: $`
        enum Test {
          A = 2,
          B = 1,
        }
      `,
      errors: [
        {
          messageId: 'missingSpace',
        },
      ],
      options: ['always'],
    },
    {
      code: $`
        interface Test{
          prop1: number;
        }
      `,
      output: $`
        interface Test {
          prop1: number;
        }
      `,
      errors: [
        {
          messageId: 'missingSpace',
        },
      ],
      options: ['always'],
    },
    {
      code: $`
        enum Test{
          A = 2,
          B = 1,
        }
      `,
      output: $`
        enum Test {
          A = 2,
          B = 1,
        }
      `,
      errors: [
        {
          messageId: 'missingSpace',
        },
      ],
      options: [{ classes: 'always' }],
    },
    {
      code: $`
        interface Test{
          prop1: number;
        }
      `,
      output: $`
        interface Test {
          prop1: number;
        }
      `,
      errors: [
        {
          messageId: 'missingSpace',
        },
      ],
      options: [{ classes: 'always' }],
    },
    {
      code: $`
        enum Test {
          A = 2,
          B = 1,
        }
      `,
      output: $`
        enum Test{
          A = 2,
          B = 1,
        }
      `,
      errors: [
        {
          messageId: 'unexpectedSpace',
        },
      ],
      options: ['never'],
    },
    {
      code: $`
        interface Test {
          prop1: number;
        }
      `,
      output: $`
        interface Test{
          prop1: number;
        }
      `,
      errors: [
        {
          messageId: 'unexpectedSpace',
        },
      ],
      options: ['never'],
    },
    {
      code: $`
        enum Test {
          A = 2,
          B = 1,
        }
      `,
      output: $`
        enum Test{
          A = 2,
          B = 1,
        }
      `,
      errors: [
        {
          messageId: 'unexpectedSpace',
        },
      ],
      options: [{ classes: 'never' }],
    },
    {
      code: $`
        interface Test {
          prop1: number;
        }
      `,
      output: $`
        interface Test{
          prop1: number;
        }
      `,
      errors: [
        {
          messageId: 'unexpectedSpace',
        },
      ],
      options: [{ classes: 'never' }],
    },
    {
      code: $`
        namespace Test {
          type foo = number;
        }
        declare module 'foo' {
          type foo = number;
        }
      `,
      output: $`
        namespace Test{
          type foo = number;
        }
        declare module 'foo'{
          type foo = number;
        }
      `,
      errors: [
        {
          messageId: 'unexpectedSpace',
        },
        {
          messageId: 'unexpectedSpace',
        },
      ],
      options: ['never'],
    },
    {
      code: $`
        namespace Test{
          type foo = number;
        }
        declare module 'foo'{
          type foo = number;
        }
      `,
      output: $`
        namespace Test {
          type foo = number;
        }
        declare module 'foo' {
          type foo = number;
        }
      `,
      errors: [
        {
          messageId: 'missingSpace',
        },
        {
          messageId: 'missingSpace',
        },
      ],
      options: ['always'],
    },
    {
      code: $`
        namespace Test {
          type foo = number;
        }
        declare module 'foo' {
          type foo = number;
        }
      `,
      output: $`
        namespace Test{
          type foo = number;
        }
        declare module 'foo'{
          type foo = number;
        }
      `,
      errors: [
        {
          messageId: 'unexpectedSpace',
        },
        {
          messageId: 'unexpectedSpace',
        },
      ],
      options: [{ classes: 'never' }],
    },
    {
      code: $`
        namespace Test{
          type foo = number;
        }
        declare module 'foo'{
          type foo = number;
        }
      `,
      output: $`
        namespace Test {
          type foo = number;
        }
        declare module 'foo' {
          type foo = number;
        }
      `,
      errors: [
        {
          messageId: 'missingSpace',
        },
        {
          messageId: 'missingSpace',
        },
      ],
      options: [{ classes: 'always' }],
    },
  ],
})
