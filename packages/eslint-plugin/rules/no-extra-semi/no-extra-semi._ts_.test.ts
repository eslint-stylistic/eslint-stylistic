// this rule tests semis, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './no-extra-semi'

run<RuleOptions, MessageIds>({
  name: 'no-extra-semi',
  rule,
  valid: [
    'with(foo);',

    // Class Property
    {
      code: $`
        export class Foo {
          public foo: number = 0;
          accessor bar: number = 1;
          accessor [baz]: number = 2;
        }
      `,
    },
    {
      code: $`
        export class Foo {
          public foo: number = 0; public bar: number = 1;
          accessor bar: number = 1; accessor [baz]: number = 2;
        }
      `,
    },
  ],
  invalid: [
    {
      code: 'with(foo);;',
      output: 'with(foo);',
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    {
      code: 'with(foo){;}',
      output: 'with(foo){}',
      errors: [
        { messageId: 'unexpected' },
      ],
    },

    // Class Property
    {
      code: $`
        class Foo {
          public foo: number = 0;;
        }
      `,
      output: $`
        class Foo {
          public foo: number = 0;
        }
      `,
      errors: [
        {
          messageId: 'unexpected',
          column: 26,
        },
      ],
    },
    {
      code: $`
        class Foo {
          public foo: number = 0;; public bar: number = 1;;
          public baz: number = 1;;
        }
      `,
      output: $`
        class Foo {
          public foo: number = 0; public bar: number = 1;
          public baz: number = 1;
        }
      `,
      errors: [
        'unexpected',
        'unexpected',
        'unexpected',
      ],
    },

    // accessor property
    {
      code: $`
        class Foo {
          accessor foo: number;; accessor [bar]: number;;
          accessor baz: number;;
        }
      `,
      output: $`
        class Foo {
          accessor foo: number; accessor [bar]: number;
          accessor baz: number;
        }
      `,
      errors: [
        'unexpected',
        'unexpected',
        'unexpected',
      ],
    },

    // abstract prop/method
    {
      code: $`
        class Foo {
          abstract foo: number;; abstract bar: number;;
          abstract baz: number;;
        }
      `,
      output: $`
        class Foo {
          abstract foo: number; abstract bar: number;
          abstract baz: number;
        }
      `,
      errors: [
        'unexpected',
        'unexpected',
        'unexpected',
      ],
    },
    {
      code: $`
        class Foo {
          abstract foo();; abstract bar();;
          abstract baz();;
          abstract foo(): void;; abstract bar(): void;;
          abstract baz(): void;;
        }
      `,
      output: $`
        class Foo {
          abstract foo(); abstract bar();
          abstract baz();
          abstract foo(): void; abstract bar(): void;
          abstract baz(): void;
        }
      `,
      errors: [
        'unexpected',
        'unexpected',
        'unexpected',
        'unexpected',
        'unexpected',
        'unexpected',
      ],
    },
  ],
})
