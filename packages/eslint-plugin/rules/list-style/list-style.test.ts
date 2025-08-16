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
    'const foo = (a, b) => {\n\n}',
    'const foo = (a, b): {a:b} => {\n\n}',
    'interface Foo { a: 1, b: 2 }',
    'interface Foo {\na: 1\nb: 2\n}',
    'a\n.filter(items => {\n\n})',
    'new Foo(a, b)',
    'new Foo(\na,\nb\n)',
    'function foo<T = {\na: 1,\nb: 2\n}>(a, b) {}',
    'foo(() =>\nbar())',
    'foo(() =>\nbar()\n)',
    `call<{\nfoo: 'bar'\n}>('')`,
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
    },
    {
      code: $`
        const a = {foo: "bar", 
        bar: 2
        }
      `,
      output: $`
        const a = {foo: "bar", bar: 2}
      `,
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
    },
    {
      code: $`
        const a = [1, 
        2, 3
        ]
      `,
      output: $`
        const a = [1, 2, 3]
      `,
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
    },
    {
      code: $`
        import { foo, 
        bar } from "foo"
      `,
      output: $`
        import { foo, bar } from "foo"
      `,
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
    },
    {
      description: 'Add delimiter to avoid syntax error, (interface)',
      code: 'interface Foo {a: 1\nb: 2\n}',
      output: 'interface Foo {a: 1,b: 2,}',
    },
    {
      description: 'Delimiter already exists',
      code: 'interface Foo {a: 1;\nb: 2,\nc: 3}',
      output: 'interface Foo {a: 1;b: 2,c: 3}',
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
        export interface Foo {        a: 1,  b: Pick<Bar, 'baz'>,  c: 3,}
      `,
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
    },
    {
      description: 'Add delimiter to avoid syntax error, (type)',
      code: 'type Foo = {a: 1\nb: 2\n}',
      output: 'type Foo = {a: 1,b: 2,}',
    },
    'type Foo = [1,2,\n3]',
    'new Foo(1,2,\n3)',
    'new Foo(\n1,2,\n3)',
    'foo(\n()=>bar(),\n()=>\nbaz())',
    'foo(()=>bar(),\n()=>\nbaz())',
    'foo<X,\nY>(1, 2)',
    'foo<\nX,Y>(\n1, 2)',
    'function foo<\nX,Y>() {}',
    'const {a,\nb\n} = c',
    'const [\na,b] = c',
    'foo(([\na,b]) => {})',
    {
      description: 'CRLF',
      code: 'const a = {foo: "bar", \r\nbar: 2\r\n}',
      output: 'const a = {foo: "bar", bar: 2}',
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
    },
    {
      code: $`
        interface foo {a:1
        }
      `,
      output: $`
        interface foo {a:1}
      `,
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
    },
    {
      code: $`
        type foo = {a:1
        }
      `,
      output: $`
        type foo = {a:1}
      `,
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
    },
    {
      code: $`
        type foo = [1
        ]
      `,
      output: $`
        type foo = [1]
      `,
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
    },
    {
      code: $`
        const foo = {a:1
        }
      `,
      output: $`
        const foo = {a:1}
      `,
    },
    {
      code: $`
        function foo(a
        ){}
      `,
      output: $`
        function foo(a){}
      `,
    },
    {
      code: $`
        function foo(
        a){}
      `,
      output: $`
        function foo(
        a
        ){}
      `,
    },
  ],
})
