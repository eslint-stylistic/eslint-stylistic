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
    'async function f(arg: any) { await (arg satisfies Promise<void>); }',
    'async function f(arg: any) { await (arg!); }',
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
    'const x = (a as A) & b;',
    'const x = (a satisfies A) < b;',
    'const x = a == (b as B) & c;',
    'const x = a && (b as B) ? c : d;',
    'const x = a < (b as B);',
    'const x = (a == b) as A;',
    {
      code: $`
        const x = (
          a + b
        ) as A;
      `,
    },
    {
      code: 'const x = a || (b as B);',
      options: ['functions'],
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
    // https://github.com/eslint/eslint/issues/17173
    {
      code: 'const x = (1 satisfies number).toFixed();',
    },

    `type Foo = string & (number | 'bar')`,
    `type Foo = (a extends string ? 'bar' : number)[]`,
    {
      code: `type Foo = boolean | (Bar & Baz)`,
      options: ['all', { nestedBinaryExpressions: false }],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/872
    {
      code: $`
        type TBar = (
            First
            & Second
            & Third
        );
      `,
      options: ['all', { ignoredNodes: ['TSTypeAliasDeclaration[typeAnnotation.type="TSIntersectionType"]'] }],
    },
    `type Foo = (() => string)[]`,
    `type Foo = (new () => string)[]`,
    `type Foo = (keyof T)[]`,
    `type Foo = (keyof T)[K]`,
    `type Foo = (A | B)[K]`,
    `type Foo = (() => void)[K]`,
    `type Foo = typeof x[number]`,
    `type Foo = T[A | B]`,
    `type Foo = (A extends B ? 1 : 2) extends C ? D : E`,
    `type Foo = T extends (A extends B ? 1 : 2) ? D : E`,
    `type Foo = T extends U ? X | Y : V extends W ? 1 : 2`,
    `function f<T extends A | B = A | B>() {}`,
    `type Foo = Map<A, B | C>`,
    'const f = (w: string) => ({ a: 1 })[w] as number',
    'const f = (w: string) => ({ a: 1 })[w] satisfies number',
    'const f = (w: string) => ({ a: 1 })[w]!',
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
      output: 'a<A>(1);',
      errors: [
        { messageId: 'unexpected', column: 3 },
        { messageId: 'unexpected', column: 8 },
      ],
    },
    {
      code: 'a<(A) | number>((1));',
      output: 'a<A | number>(1);',
      errors: [
        { messageId: 'unexpected', column: 3 },
        { messageId: 'unexpected', column: 17 },
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
      code: 'const x = ({} satisfies X)',
      output: 'const x = {} satisfies X',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'const x = (foo!)',
      output: 'const x = foo!',
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
      code: '((foo as Bar)).baz',
      output: '(foo as Bar).baz',
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
    {
      code: 'function foo(x: (number)): (boolean) {}',
      output: 'function foo(x: number): boolean {}',
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    {
      code: $`
        type Foo = ({
          a: <T>(x: T) => any
        })
      `,
      output: $`
        type Foo = {
          a: <T>(x: T) => any
        }
      `,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: $`
        enum Foo {
          A,
          B = ("x"),
        }
      `,
      output: $`
        enum Foo {
          A,
          B = "x",
        }
      `,
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    {
      code: `type Foo = (string & number) | 'bar'`,
      output: `type Foo = string & number | 'bar'`,
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    {
      code: 'type Foo = ((string | number))[]',
      output: 'type Foo = (string | number)[]',
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    {
      code: `type Foo = ((import('x')))[]`,
      output: `type Foo = import('x')[]`,
      recursive: Number.POSITIVE_INFINITY,
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/904
    {
      code: $`
        type Foo = boolean | ((
          & Bar
          & Baz
        ))
      `,
      output: $`
        type Foo = boolean | (
          & Bar
          & Baz
        )
      `,
      options: ['all', { nestedBinaryExpressions: false }],
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    {
      code: $`
        type Foo = boolean | ((Bar & Baz))
      `,
      output: $`
        type Foo = boolean | Bar & Baz
      `,
      recursive: Number.POSITIVE_INFINITY,
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    {
      code: 'f<(number) | string>(1)',
      output: 'f<number | string>(1)',
      errors: [
        { messageId: 'unexpected' },
      ],
    },
    {
      code: '((a as A)) | ((b as B))',
      output: '(a as A) | (b as B)',
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/1314
    {
      code: 'type Foo = (typeof x)[number]',
      output: 'type Foo = typeof x[number]',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'type Foo = (T)[K]',
      output: 'type Foo = T[K]',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'type Foo = ((A | B))[K]',
      output: 'type Foo = (A | B)[K]',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'type Foo = T[(A | B)]',
      output: 'type Foo = T[A | B]',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'type Foo = T extends U ? (X | Y) : (V extends W ? 1 : 2)',
      output: 'type Foo = T extends U ? X | Y : V extends W ? 1 : 2',
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    {
      code: 'function f<T extends (A | B) = (A | B)>() {}',
      output: 'function f<T extends A | B = A | B>() {}',
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    {
      code: 'type Foo = Map<(A), (B | C)>',
      output: 'type Foo = Map<A, B | C>',
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    {
      code: $`
        f<(number)>(1)
      `,
      output: $`
        f<number>(1)
      `,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'const x = (1 as 1) | (1 as 1);',
      output: 'const x = (1 as 1) | 1 as 1;',
      parserOptions: { ecmaFeatures: { jsx: false } },
      errors: [{ messageId: 'unexpected', column: 22 }],
    },
    {
      code: 'const x = 1 | (2 as 2);',
      output: 'const x = 1 | 2 as 2;',
      options: ['all', { nestedBinaryExpressions: false }],
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'const x = (a as A) || b;',
      output: 'const x = a as A || b;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'const x = (a as A) ?? b;',
      output: 'const x = a as A ?? b;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'const x = (a satisfies A) == b;',
      output: 'const x = a satisfies A == b;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'const x = a && (b satisfies B)',
      output: 'const x = a && b satisfies B',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'x ? (1 as 1) : (2 satisfies 2);',
      output: 'x ? 1 as 1 : 2 satisfies 2;',
      errors: [
        { messageId: 'unexpected', column: 5 },
        { messageId: 'unexpected', column: 16 },
      ],
    },
    {
      code: 'x ? (<1>1) : (<2>2);',
      output: 'x ? <1>1 : <2>2;',
      parserOptions: { ecmaFeatures: { jsx: false } },
      errors: [
        { messageId: 'unexpected', column: 5 },
        { messageId: 'unexpected', column: 14 },
      ],
    },
    {
      code: 'const x = { ...(1 as 1), ...(<2>2) };',
      output: 'const x = { ...1 as 1, ...<2>2 };',
      parserOptions: { ecmaFeatures: { jsx: false } },
      errors: [
        { messageId: 'unexpected', column: 16 },
        { messageId: 'unexpected', column: 29 },
      ],
    },
    {
      code: '<A {...(b as B)} {...(c satisfies C)} />',
      output: '<A {...b as B} {...c satisfies C} />',
      errors: [
        { messageId: 'unexpected', column: 8 },
        { messageId: 'unexpected', column: 22 },
      ],
    },
    {
      code: 'const x = (a + b) as A;',
      output: 'const x = a + b as A;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'async function f() { return (await a) satisfies A }',
      output: 'async function f() { return await a satisfies A }',
      errors: [{ messageId: 'unexpected' }],
    },
  ],
})
