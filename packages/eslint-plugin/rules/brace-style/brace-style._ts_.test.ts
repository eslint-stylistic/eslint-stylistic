// this rule tests the position of braces, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './brace-style'

run<RuleOptions, MessageIds>({
  name: 'brace-style',
  rule,
  valid: [
    {
      code: $`
        with (foo) {
          bar();
        }
      `,
    },
    {
      code: 'with (foo) {  bar(); }',
      options: ['1tbs', { allowSingleLine: true }],
    },
    {
      code: $`
        module "Foo" {
        }
      `,
      options: ['1tbs'],
    },
    {
      code: $`
        module "Foo" {
        }
      `,
      options: ['stroustrup'],
    },
    {
      code: $`
        module "Foo"
        {
        }
      `,
      options: ['allman'],
    },
    {
      code: $`
        namespace Foo {
        }
      `,
      options: ['1tbs'],
    },
    {
      code: $`
        namespace Foo {
        }
      `,
      options: ['stroustrup'],
    },
    {
      code: $`
        namespace Foo
        {
        }
      `,
      options: ['allman'],
    },
  ],

  invalid: [
    {
      code: 'with (foo) \n { \n bar(); }',
      output: 'with (foo) { \n bar(); \n}',
      errors: [{ messageId: 'nextLineOpen' }, { messageId: 'singleLineClose' }],
    },

    // allowSingleLine: true
    {
      code: 'with (foo) { bar(); \n }',
      output: 'with (foo) {\n bar(); \n }',
      options: ['1tbs', { allowSingleLine: true }],
      errors: [{ messageId: 'blockSameLine' }],
    },
    {
      code: $`
        module "Foo"
        {
        }
      `,
      output: $`
        module "Foo" {
        }
      `,
      errors: [{ messageId: 'nextLineOpen' }],
    },
    {
      code: $`
        module "Foo"
        {
        }
      `,
      output: $`
        module "Foo" {
        }
      `,
      options: ['stroustrup'],
      errors: [{ messageId: 'nextLineOpen' }],
    },
    {
      code: 'module "Foo" { \n }',
      output: 'module "Foo" \n{ \n }',
      options: ['allman'],
      errors: [{ messageId: 'sameLineOpen' }],
    },
    {
      code: $`
        namespace Foo
        {
        }
      `,
      output: $`
        namespace Foo {
        }
      `,
      errors: [{ messageId: 'nextLineOpen' }],
    },
    {
      code: $`
        namespace Foo
        {
        }
      `,
      output: $`
        namespace Foo {
        }
      `,
      options: ['stroustrup'],
      errors: [{ messageId: 'nextLineOpen' }],
    },
    {
      code: 'namespace Foo { \n }',
      output: 'namespace Foo \n{ \n }',
      options: ['allman'],
      errors: [{ messageId: 'sameLineOpen' }],
    },
  ],
})
