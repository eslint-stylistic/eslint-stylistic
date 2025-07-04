// this rule tests the semis, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { InvalidTestCase, ValidTestCase } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './semi'

run<RuleOptions, MessageIds>({
  name: 'semi',
  rule,
  valid: [
    ...[
      // https://github.com/typescript-eslint/typescript-eslint/issues/366
      'export = Foo;',
      'import f = require("f");',
      'type Foo = {};',
      'class C { accessor foo; } ',
      'class C { accessor [foo]; } ',
      // https://github.com/typescript-eslint/typescript-eslint/issues/409
      $`
        class Class {
            prop: string;
        }
      `,
      $`
        abstract class AbsClass {
            abstract prop: string;
            abstract meth(): string;
        }
      `,
      $`
        class PanCamera extends FreeCamera {
          public invertY: boolean = false;
        }
      `,
      // https://github.com/typescript-eslint/typescript-eslint/issues/123
      'export default interface test {}',
      `declare function declareFn(): string;`,
    ].reduce<ValidTestCase<RuleOptions>[]>((acc, code) => {
      acc.push({
        code,
        options: ['always'],
      })
      acc.push({
        code: code.replace(/;/g, ''),
        options: ['never'],
      })

      return acc
    }, []),
  ],
  invalid: [
    {
      code: $`
        class A {
          method(): void
          method(arg?: any): void {
        
          }
        }
      `,
      output: $`
        class A {
          method(): void;
          method(arg?: any): void {
        
          }
        }
      `,
      options: ['always'],
      errors: [{ messageId: 'missingSemi' }],
    },
    {
      code: $`
        class A {
          method(): void;
          method(arg?: any): void {
        
          }
        }
      `,
      output: $`
        class A {
          method(): void
          method(arg?: any): void {
        
          }
        }
      `,
      options: ['never'],
      errors: [{ messageId: 'extraSemi' }],
    },
    {
      code: $`
        import a from "a"
        (function() {
            // ...
        })()
      `,
      output: $`
        import a from "a";
        (function() {
            // ...
        })()
      `,
      options: ['never', { beforeStatementContinuationChars: 'always' }],
      errors: [{ messageId: 'missingSemi' }],
    },
    {
      code: $`
        import a from "a"
        ;(function() {
            // ...
        })()
      `,
      output: $`
        import a from "a"
        (function() {
            // ...
        })()
      `,
      options: [
        'never',
        { beforeStatementContinuationChars: 'never' },
      ],
      errors: [{ messageId: 'extraSemi' }],
    },

    ...[
      {
        code: $`
          declare function declareFn(): string;
        `,
        errors: [
          {
            line: 1,
          },
        ],
      },

      // https://github.com/typescript-eslint/typescript-eslint/issues/366
      {
        code: 'export = Foo;',
        errors: [
          {
            line: 1,
          },
        ],
      },
      {
        code: 'import f = require("f");',
        errors: [
          {
            line: 1,
          },
        ],
      },
      {
        code: 'type Foo = {};',
        errors: [
          {
            line: 1,
          },
        ],
      },

      // https://github.com/typescript-eslint/typescript-eslint/issues/409
      {
        code: $`
          class Class {
              prop: string;
          }
        `,
        errors: [
          {
            line: 2,
          },
        ],
      },
      {
        code: $`
          abstract class AbsClass {
              abstract prop: string;
              abstract meth(): string;
          }
        `,
        errors: [
          {
            line: 2,
          },
          {
            line: 3,
          },
        ],
      },
      {
        code: $`
          class PanCamera extends FreeCamera {
            public invertY: boolean = false;
          }
        `,
        output: $`
          class PanCamera extends FreeCamera {
            public invertY: boolean = false
          }
        `,
        errors: [
          {
            line: 2,
          },
        ],
      },
      {
        code: $`
          class C {
            accessor foo;
            accessor [bar];
          }
        `,
        errors: [{ line: 2 }, { line: 3 }],
      },
      {
        code: $`
          class C {
            accessor foo;
            accessor [bar];
          }
        `,
        errors: [{ line: 2 }, { line: 3 }],
      },
    ].reduce<InvalidTestCase<RuleOptions, MessageIds>[]>((acc, test) => {
      acc.push({
        code: test.code.replace(/;/g, ''),
        output: test.code,
        options: ['always'],
        errors: test.errors.map(e => ({
          ...e,
          messageId: 'missingSemi',
        })),
      })
      acc.push({
        code: test.code,
        output: test.output ?? test.code.replace(/;/g, ''),
        options: ['never'],
        errors: test.errors.map(e => ({
          ...e,
          messageId: 'extraSemi',
        })),
      })
      return acc
    }, []),
  ],
})
