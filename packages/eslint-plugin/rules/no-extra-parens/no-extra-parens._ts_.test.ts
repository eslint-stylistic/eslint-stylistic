// this rule tests extra parens, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './no-extra-parens'

run<RuleOptions, MessageIds>({
  name: 'no-extra-parens',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: [
    'async function f(arg: any) { await (arg as Promise<void>); }',
    'async function f(arg: Promise<any>) { await arg; }',
    '(0).toString();',
    '(function(){}) ? a() : b();',
    'a<import(\'\')>(1);',
    'new a<import(\'\')>(1);',
    'a<A>(1);',
    {
      code: '(++(<A>a))(b); ((c as C)++)(d);',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = (1 as 1) | (1 as 1);',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = (<1>1) | (<1>1);',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = (1 as 1) | 2;',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = (1 as 1) + 2 + 2;',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = 1 + 1 + (2 as 2);',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = 1 | (2 as 2);',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = (<1>1) | 2;',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const x = 1 | (<2>2);',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 't.true((me.get as SinonStub).calledWithExactly(\'/foo\', other));',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 't.true((<SinonStub>me.get).calledWithExactly(\'/foo\', other));',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: '(requestInit.headers as Headers).get(\'Cookie\');',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: '(<Headers> requestInit.headers).get(\'Cookie\');',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    { code: 'class Foo {}', parserOptions: { ecmaFeatures: { jsx: false } } },
    {
      code: 'class Foo extends (Bar as any) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    {
      code: 'const foo = class extends (Bar as any) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
    },

    { code: '[a as b];', options: ['all', { nestedBinaryExpressions: false }] },
    {
      code: '() => (1 as 1);',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'x = a as b;',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = (1 as 1) | 2;',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = 1 | (2 as 2);',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = await (foo as Promise<void>);',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const res2 = (fn as foo)();',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: '(x as boolean) ? 1 : 0;',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'x ? (1 as 1) : 2;',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'x ? 1 : (2 as 2);',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'while (foo as boolean) {};',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'do {} while (foo as boolean);',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (let i of ([] as Foo)) {}',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (let i in ({} as Foo)) {}',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for ((1 as 1);;) {}',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (;(1 as 1);) {}',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (;;(1 as 1)) {}',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'if (1 as 1) {}',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = (1 as 1).toString();',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'new (1 as 1)();',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = { ...(1 as 1), ...{} };',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'throw (1 as 1);',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    { code: 'throw 1;', options: ['all', { nestedBinaryExpressions: false }] },
    {
      code: 'const x = !(1 as 1);',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'function *x() { yield (1 as 1); yield 1; }',
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'switch (foo) { case 1: case (2 as 2): break; default: break; }',
      options: ['all', { nestedBinaryExpressions: false }],
    },

    {
      code: '[<b>a];',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: '() => (<1>1);',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'x = <b>a;',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = (<1>1) | 2;',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = 1 | (<2>2);',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = await (<Promise<void>>foo);',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const res2 = (<foo>fn)();',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: '(<boolean>x) ? 1 : 0;',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'x ? (<1>1) : 2;',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'x ? 1 : (<2>2);',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'while (<boolean>foo) {};',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'do {} while (<boolean>foo);',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (let i of (<Foo>[])) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (let i in (<Foo>{})) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for ((<1>1);;) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (;(<1>1);) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'for (;;(<1>1)) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'if (<1>1) {}',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = (<1>1).toString();',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'new (<1>1)();',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = { ...(<1>1), ...{} };',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'throw (<1>1);',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'throw 1;',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'const x = !(<1>1);',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'function *x() { yield (<1>1); yield 1; }',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },
    {
      code: 'switch (foo) { case 1: case (<2>2): break; default: break; }',
      parserOptions: { ecmaFeatures: { jsx: false } },
      options: ['all', { nestedBinaryExpressions: false }],
    },

    {
      code: $`
        declare const f: <T>(x: T) => any
      `,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    {
      code: $`
        f<(number | string)[]>(['a', 1])
      `,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    {
      code: $`
        f<(number)>(1)
      `,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    {
      code: $`
        f<(number) | string>(1)
      `,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // https://github.com/eslint/eslint/issues/17173
    {
      code: 'const x = (1 satisfies number).toFixed();',
    },
  ],

  invalid: [
    {
      code: 'a<import(\'\')>((1));',
      output: 'a<import(\'\')>(1);',
      errors: [
        {
          messageId: 'unexpected',
          column: 15,
        },
      ],
    },
    {
      code: 'new a<import(\'\')>((1));',
      output: 'new a<import(\'\')>(1);',
      errors: [
        {
          messageId: 'unexpected',
          column: 19,
        },
      ],
    },
    {
      code: 'a<(A)>((1));',
      output: 'a<(A)>(1);',
      errors: [
        {
          messageId: 'unexpected',
          column: 8,
        },
      ],
    },
    {
      code: 'a<(A) | number>((1));',
      output: 'a<(A) | number>(1);',
      errors: [
        {
          messageId: 'unexpected',
          column: 17,
        },
      ],
    },
    {
      code: 'async function f(arg: Promise<any>) { await (arg); }',
      output: 'async function f(arg: Promise<any>) { await arg; }',
      errors: [
        {
          messageId: 'unexpected',
          column: 45,
        },
      ],
    },
    {
      code: 'async function f(arg: any) { await ((arg as Promise<void>)); }',
      output: 'async function f(arg: any) { await (arg as Promise<void>); }',
      errors: [
        {
          messageId: 'unexpected',
          column: 37,
        },
      ],
    },
    {
      code: 'class Foo extends ((Bar as any)) {}',
      output: 'class Foo extends (Bar as any) {}',
      errors: [
        {
          messageId: 'unexpected',
          column: 20,
        },
      ],
    },
    {
      code: 'const foo = class extends ((Bar as any)) {}',
      output: 'const foo = class extends (Bar as any) {}',
      errors: [
        {
          messageId: 'unexpected',
          column: 28,
        },
      ],
    },

    {
      code: 'const x = (a as string)',
      output: 'const x = a as string',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
      options: ['all'],
    },
    {
      code: 'const x = a[(b as string)]',
      output: 'const x = a[b as string]',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'const x = [(b as string)]',
      output: 'const x = [b as string]',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'const x: (string) = ""',
      output: 'const x: string = ""',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'class A{ accessor [((foo))] = 1 }',
      output: 'class A{ accessor [(foo)] = 1 }',
      errors: [{ messageId: 'unexpected' }],
    },
  ],
})
