import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './list-style'

run<RuleOptions, MessageIds>({
  name: 'list-style',
  rule,
  lang: 'ts',
  valid: [
    'const a = { foo: "bar", bar: 2 }',
    'const a = {\nfoo: "bar",\nbar: 2\n}',
    'const a = [1, 2, 3]',
    'const a = [\n1,\n2,\n3\n]',
    'import { foo, bar } from "foo"',
    'import {\nfoo,\nbar\n} from "foo"',
    'const a = [`\n\n`, `\n\n`]',
    'log(a, b)',
    'log(\na,\nb\n)',
    'function foo(a, b) {}',
    'function foo(\na,\nb\n) {}',
    'const foo = function (a, b) {}',
    'const foo = function (\na,\nb\n) {}',
    'const foo = (a, b) => {\n\n}',
    'const foo = (a, b): { a:b } => {\n\n}',
    'interface Foo { a: 1, b: 2 }',
    'interface Foo {\na: 1\nb: 2\n}',
    'enum Foo { A, B }',
    'enum Foo {\nA,\nB\n}',
    'a\n.filter(items => {\n\n})',
    'new Foo(a, b)',
    'new Foo(\na,\nb\n)',
    'function foo<T = {\na: 1,\nb: 2\n}>(a, b) {}',
    'foo(() =>\nbar())',
    `call<{\nfoo: 'bar'\n}>('')`,
    'const { a } = foo;',
    'const [, a] = foo;',
    'const [a,] = foo;',
    'const [, a,] = foo;',
    $`
      export { name, version } from 'package.json' with {
        type: 'json'
        }
    `,
    'export * from "foo" with { type: "json" }',

    {
      code: $`
        const foo = [1]
        const bar = [
          1, 
          2,
        ];
      `,
      options: [{ singleLine: { maxItems: 1 } }],
    },
    {
      code: $`
        const foo = [1, 2];
        const bar = { a: 1, b: 2 };
        const foo = [
          1,
          2,
        ];
        const bar = {
          a: 1,
          b: 2,
        };
      `,
      options: [{ multiLine: { minItems: 2 } }],
    },
    // overrides
    {
      code: $`
        import { name, version } from 'package.json' with {type: 'json'}
      `,
      options: [{
        overrides: {
          '{}': {
            singleLine: { spacing: 'always' },
          },
          'ImportAttributes': {
            singleLine: { spacing: 'never' },
          },
        },
      }],
    },
    $`
      (Object.keys(options) as KeysOptions[])
      .forEach((key) => {
        if (options[key] === false)
          delete listenser[key]
      })
    `,
    // https://github.com/antfu/eslint-plugin-antfu/issues/11
    `function fn({ foo, bar }: {\nfoo: 'foo'\nbar: 'bar'\n}) {}`,
    // https://github.com/antfu/eslint-plugin-antfu/issues/15
    $`
      export const getTodoList = request.post<
        Params,
        ResponseData,
      >('/api/todo-list')
    `,
    $`
      bar(
        foo => foo
          ? ''
          : ''
      )
    `,
    $`
      bar(
        (ruleName, foo) => foo
          ? ''
          : ''
      )
    `,
    // https://github.com/antfu/eslint-plugin-antfu/issues/19
    $`
      const a = [
        (1),
        (2)
      ];
    `,
    `const a = [(1), (2)];`,
    // https://github.com/antfu/eslint-plugin-antfu/issues/27
    $`
      this.foobar(
        (x),
        y,
        z
      )
    `,
    $`
      foobar(
        (x),
        y,
        z
      )
    `,
    $`
      foobar<A>(
        (x),
        y,
        z
      )
    `,
    // https://github.com/antfu/eslint-plugin-antfu/issues/22
    $`
      import Icon, {
        MailOutlined,
        NumberOutlined,
        QuestionCircleOutlined,
        QuestionOutlined,
        UserOutlined,
      } from '@ant-design/icons';
    `,
    $`
      const fix = a => (
        call(
          a
        )
      )
    `,
    $`
      run({
        valid: [
          /* comment */
        ],
        invalid: [
          // comment
        ]
      })
    `,
  ],
  invalid: [
    {
      code: $`
        const a = {
        foo: "bar", bar: 2 }
      `,
      output: $`
        const a = {
        foo: "bar", 
        bar: 2 
        }
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 12 },
        { messageId: 'shouldWrap', line: 2, column: 19 },
      ],
    },
    {
      code: $`
        const a = {foo: "bar", 
        bar: 2
        }
      `,
      output: $`
        const a = {foo: "bar",bar: 2}
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 23 },
        { messageId: 'shouldNotWrap', line: 2, column: 7 },
      ],
    },
    {
      code: $`
        const a = [
        1, 2, 3]
      `,
      output: $`
        const a = [
        1, 
        2, 
        3
        ]
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 6 },
        { messageId: 'shouldWrap', line: 2, column: 8 },
      ],
    },
    {
      code: $`
        const a = [1, 
        2, 3
        ]
      `,
      output: $`
        const a = [1,2, 3]
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 14 },
        { messageId: 'shouldNotWrap', line: 2, column: 5 },
      ],
    },
    {
      code: $`
        import {
        foo, bar } from "foo"
      `,
      output: $`
        import {
        foo, 
        bar 
        } from "foo"
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 5 },
        { messageId: 'shouldWrap', line: 2, column: 9 },
      ],
    },
    {
      code: $`
        import { foo, 
        bar } from "foo"
      `,
      output: $`
        import { foo,bar } from "foo"
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 14 },
      ],
    },
    {
      code: $`
        log(
        a, b)
      `,
      output: $`
        log(
        a, 
        b
        )
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 5 },
      ],
    },
    {
      code: $`
        function foo(a, b
        ){}
      `,
      output: 'function foo(a, b){}',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 18 },
      ],
    },
    {
      code: $`
        function foo(
        a, b) {}
      `,
      output: $`
        function foo(
        a, 
        b
        ) {}
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 5 },
      ],
    },
    {
      code: $`
        const foo = (
        a, b) => {}
      `,
      output: $`
        const foo = (
        a, 
        b
        ) => {}
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 5 },
      ],
    },
    {
      code: $`
        const foo = (
        a, b): {
        a:b} => {}
      `,
      output: $`
        const foo = (
        a, 
        b
        ): {
        a:b
        } => {}
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 5 },
        { messageId: 'shouldWrap', line: 3, column: 4 },
      ],
    },
    {
      code: $`
        const foo = (
        a, b): {a:b} => {}
      `,
      output: $`
        const foo = (
        a, 
        b
        ): {a:b} => {}
      `,
      options: [{
        overrides: {
          '{}': {
            singleLine: { spacing: 'never' },
          },
        },
      }],
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 5 },
      ],
    },
    {
      code: $`
        interface Foo {
        a: 1,b: 2
        }
      `,
      output: $`
        interface Foo {
        a: 1,
        b: 2
        }
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 6 },
      ],
    },
    {
      description: 'Add delimiter to avoid syntax error, (interface)',
      code: $`
        interface Foo {a: 1
        b: 2
        }
      `,
      output: 'interface Foo {a: 1,b: 2,}',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 20 },
        { messageId: 'shouldNotWrap', line: 2, column: 5 },
      ],
    },
    {
      description: 'Delimiter already exists',
      code: $`
        interface Foo {a: 1;
        b: 2,
        c: 3}
      `,
      output: 'interface Foo {a: 1;b: 2,c: 3}',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 21 },
        { messageId: 'shouldNotWrap', line: 2, column: 6 },
      ],
    },
    {
      description: 'Delimiter in the middle',
      code: $`
        export interface Foo {        a: 1
          b: Pick<Bar, 'baz'>
          c: 3
        }
      `,
      output: $`
        export interface Foo {        a: 1,b: Pick<Bar, 'baz'>,c: 3,}
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 35 },
        { messageId: 'shouldNotWrap', line: 2, column: 22 },
        { messageId: 'shouldNotWrap', line: 3, column: 7 },
      ],
    },
    {
      code: $`
        type Foo = {
        a: 1,b: 2
        }
      `,
      output: $`
        type Foo = {
        a: 1,
        b: 2
        }
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 6 },
      ],
    },
    {
      description: 'Add delimiter to avoid syntax error, (type)',
      code: $`
        type Foo = {a: 1
        b: 2
        }
      `,
      output: 'type Foo = {a: 1,b: 2,}',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 17 },
        { messageId: 'shouldNotWrap', line: 2, column: 5 },
      ],
    },
    {
      code: $`
        type foo = [
        1]
      `,
      output: $`
        type foo = [
        1
        ]
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 2 },
      ],
    },
    {
      code: $`
        type Foo = [1,2,
        3]
      `,
      output: 'type Foo = [1,2,3]',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 17 },
      ],
    },
    {
      code: 'type Foo = [ 1, 2, 3 ]',
      output: 'type Foo = [1, 2, 3]',
      errors: [
        { messageId: 'shouldNotSpacing', line: 1, column: 13 },
        { messageId: 'shouldNotSpacing', line: 1, column: 21 },
      ],
    },
    {
      code: $`
        new Foo(1,2,
        3)
      `,
      output: 'new Foo(1,2,3)',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 13 },
      ],
    },
    {
      code: $`
        new Foo(
        1,2,
        3)
      `,
      output: $`
        new Foo(
        1,
        2,
        3
        )
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 3, column: 2 },
      ],
    },
    {
      code: $`
        foo(
        ()=>bar(),
        ()=>
        baz())
      `,
      output: $`
        foo(
        ()=>bar(),
        ()=>
        baz()
        )
      `,
      errors: [
        { messageId: 'shouldWrap', line: 4, column: 6 },
      ],
    },
    {
      code: $`
        foo(()=>bar(),
        ()=>
        baz())
      `,
      output: $`
        foo(()=>bar(),()=>
        baz())
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 15 },
      ],
    },
    {
      code: $`
        foo<X,
        Y>(1, 2)
      `,
      output: 'foo<X,Y>(1, 2)',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 7 },
      ],
    },
    {
      code: $`
        foo<
        X,Y>(
        1, 2)
      `,
      output: $`
        foo<
        X,
        Y
        >(
        1, 
        2
        )
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 4 },
        { messageId: 'shouldWrap', line: 3, column: 3 },
        { messageId: 'shouldWrap', line: 3, column: 5 },
      ],
    },
    {
      code: $`
        function foo<
        X,Y>() {}
      `,
      output: $`
        function foo<
        X,
        Y
        >() {}
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 4 },
      ],
    },
    {
      code: $`
        const {a,
        b
        } = c
      `,
      output: $`
        const {a,b} = c
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 10 },
        { messageId: 'shouldNotWrap', line: 2, column: 2 },
      ],
    },
    {
      code: 'const {a,b} = c',
      output: 'const { a,b } = c',
      errors: [
        { messageId: 'shouldSpacing', line: 1, column: 8 },
        { messageId: 'shouldSpacing', line: 1, column: 11 },
      ],
    },
    {
      code: $`
        const [
          a,b] = c
      `,
      output: $`
        const [
          a,
        b
        ] = c
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 5 },
        { messageId: 'shouldWrap', line: 2, column: 6 },
      ],
    },
    {
      code: $`
        const [,
        ] = foo
      `,
      output: $`
        const [,] = foo
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 9 },
      ],
    },
    {
      code: $`
        foo(([
        a,b]) => {})
      `,
      output: $`
        foo(([
        a,
        b
        ]) => {})
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 3 },
        { messageId: 'shouldWrap', line: 2, column: 4 },
      ],
    },
    {
      description: 'CRLF',
      code: 'const a = {foo: "bar", \r\nbar: 2\r\n}',
      output: 'const a = {foo: "bar",bar: 2}',
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 23 },
        { messageId: 'shouldNotWrap', line: 2, column: 7 },
      ],
    },
    // https://github.com/antfu/eslint-plugin-antfu/issues/18
    {
      code: $`
        export default antfu({
        },
        {
          foo: 'bar'
        }
          // some comment
          // hello
        )
      `,
      output: $`
        export default antfu({
        },{
          foo: 'bar'
        }
          // some comment
          // hello
        )
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 2, column: 3 },
        { messageId: 'shouldNotWrap', line: 5, column: 2 },
      ],
    },
    // https://github.com/antfu/eslint-plugin-antfu/issues/18
    {
      code: $`
        export default antfu({
        },
        // some comment
        {
          foo: 'bar'
        },
        {
        }
          // hello
        )
      `,
      output: $`
        export default antfu({
        },
        // some comment
        {
          foo: 'bar'
        },{
        }
          // hello
        )
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 2, column: 3 },
        { messageId: 'shouldNotWrap', line: 6, column: 3 },
        { messageId: 'shouldNotWrap', line: 8, column: 2 },
      ],
    },
    {
      description: 'Check for function arguments in type',
      code: $`
        interface Foo {
          bar: (
            foo: string, bar: {
              bar: string, baz: string }) => void
        }
      `,
      output: $`
        interface Foo {
          bar: (
            foo: string, 
        bar: {
              bar: string, 
        baz: string 
        }
        ) => void
        }
      `,
      errors: [
        { messageId: 'shouldWrap', line: 3, column: 17 },
        { messageId: 'shouldWrap', line: 4, column: 19 },
        { messageId: 'shouldWrap', line: 4, column: 31 },
        { messageId: 'shouldWrap', line: 4, column: 33 },
      ],
    },
    {
      code: $`
        interface foo {
        a:1}
      `,
      output: $`
        interface foo {
        a:1
        }
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 4 },
      ],
    },
    {
      code: $`
        interface foo {a:1
        }
      `,
      output: $`
        interface foo {a:1}
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 19 },
      ],
    },
    {
      code: $`
        type foo = {
        a:1}
      `,
      output: $`
        type foo = {
        a:1
        }
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 4 },
      ],
    },
    {
      code: $`
        type foo = {a:1
        }
      `,
      output: $`
        type foo = {a:1}
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 16 },
      ],
    },
    {
      code: $`
        const foo = [
        1]
      `,
      output: $`
        const foo = [
        1
        ]
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 2 },
      ],
    },
    {
      code: $`
        const foo = {
        a:1}
      `,
      output: $`
        const foo = {
        a:1
        }
      `,
      errors: [
        { messageId: 'shouldWrap', line: 2, column: 4 },
      ],
    },
    {
      code: $`
        function foo< T >( a: number, b: string ): void
      `,
      output: $`
        function foo<T>(a: number, b: string): void
      `,
      errors: [
        { messageId: 'shouldNotSpacing', line: 1, column: 14 },
        { messageId: 'shouldNotSpacing', line: 1, column: 16 },
        { messageId: 'shouldNotSpacing', line: 1, column: 19 },
        { messageId: 'shouldNotSpacing', line: 1, column: 40 },
      ],
    },
    {
      code: $`
        export { name, version} from 'package.json' with {
          type: 'json'}
      `,
      output: $`
        export { name, version } from 'package.json' with {
          type: 'json'
        }
      `,
      errors: [
        { messageId: 'shouldSpacing', line: 1, column: 23 },
        { messageId: 'shouldWrap', line: 2, column: 15 },
      ],
    },
    {
      code: $`
        const foo = [1, 2];
        const bar = { a: 1, b: 2 };
      `,
      output: $`
        const foo = [
        1, 
        2
        ];
        const bar = { 
        a: 1, 
        b: 2 
        };
      `,
      options: [{ singleLine: { maxItems: 1 } }],
      errors: [
        { messageId: 'shouldWrap', line: 1, column: 14 },
        { messageId: 'shouldWrap', line: 1, column: 16 },
        { messageId: 'shouldWrap', line: 1, column: 18 },
        { messageId: 'shouldWrap', line: 2, column: 14 },
        { messageId: 'shouldWrap', line: 2, column: 20 },
        { messageId: 'shouldWrap', line: 2, column: 25 },
      ],
    },
    {
      code: $`
        const foo = [
        1, 
        2
        ];
        const bar = { 
        a: 1, 
        b: 2 
        };
      `,
      output: $`
        const foo = [1,2];
        const bar = {a: 1,b: 2};
      `,
      options: [{ multiLine: { minItems: 3 } }],
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 14 },
        { messageId: 'shouldNotWrap', line: 2, column: 3 },
        { messageId: 'shouldNotWrap', line: 3, column: 2 },
        { messageId: 'shouldNotWrap', line: 5, column: 14 },
        { messageId: 'shouldNotWrap', line: 6, column: 6 },
        { messageId: 'shouldNotWrap', line: 7, column: 5 },
      ],
    },
    {
      description: 'Trailing semi',
      code: $`
        foo(a,
        )
      `,
      output: $`
        foo(a,)
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 7 },
      ],
    },
    {
      description: 'indent by tab',
      code: `const foo = [1,\n\t2,\n\t3];`,
      output: `const foo = [1,2,3];`,
      errors: [
        { messageId: 'shouldNotWrap', line: 1, column: 16 },
        { messageId: 'shouldNotWrap', line: 2, column: 4 },
      ],
    },
  ],
})
