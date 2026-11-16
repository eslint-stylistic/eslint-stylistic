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
    {
      code: 'interface Foo {\n  a: string;\n}\nenum Bar {\n  A,\n}',
      options: ['1tbs'],
    },
    {
      code: 'interface Foo {\n  a: string;\n}\nenum Bar {\n  A,\n}',
      options: ['stroustrup'],
    },
    {
      code: $`
        interface Foo
        {
          a: string;
        }
        const enum Bar
        {
          A,
        }
        declare enum Empty
        {
        }
      `,
      options: ['allman'],
    },
    {
      code: 'interface Foo { a: string }\nenum Bar { A }',
      options: ['1tbs', { allowSingleLine: true }],
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
    // #1193: interface and enum bodies follow the style too.
    {
      code: 'interface Foo {\n  a: string;\n}\nenum Bar {\n  A,\n}',
      output: 'interface Foo \n{\n  a: string;\n}\nenum Bar \n{\n  A,\n}',
      options: ['allman'],
      errors: [{ messageId: 'sameLineOpen' }, { messageId: 'sameLineOpen' }],
    },
    {
      code: 'interface Foo\n{\n  a: string;\n}\nenum Bar\n{\n  A,\n}',
      output: 'interface Foo {\n  a: string;\n}\nenum Bar {\n  A,\n}',
      errors: [{ messageId: 'nextLineOpen' }, { messageId: 'nextLineOpen' }],
    },
    {
      code: 'interface Foo { a: string;\n}\nenum Bar { A,\n  B }',
      output: 'interface Foo {\n a: string;\n}\nenum Bar {\n A,\n  B \n}',
      errors: [
        { messageId: 'blockSameLine' },
        { messageId: 'blockSameLine' },
        { messageId: 'singleLineClose' },
      ],
    },
  ],
})
