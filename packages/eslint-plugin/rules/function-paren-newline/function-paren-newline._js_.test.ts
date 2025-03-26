/**
 * @fileoverview enforce consistent line breaks inside function parentheses
 * @author Teddy Katz
 */

import type { RuleOptions } from './types'
import { $, run } from '#test'
import tsParser from '@typescript-eslint/parser'
import rule from '.'

const LEFT_MISSING_ERROR = { messageId: 'expectedAfter', type: 'Punctuator' }
const LEFT_UNEXPECTED_ERROR = { messageId: 'unexpectedAfter', type: 'Punctuator' }
const RIGHT_MISSING_ERROR = { messageId: 'expectedBefore', type: 'Punctuator' }
const RIGHT_UNEXPECTED_ERROR = { messageId: 'unexpectedBefore', type: 'Punctuator' }
const EXPECTED_BETWEEN = { messageId: 'expectedBetween', type: 'Identifier' }

run<RuleOptions>({
  name: 'function-paren-newline',
  rule,
  lang: 'js',

  valid: [
    'new new Foo();',

    // multiline option (default)
    'function baz(foo, bar) {}',
    '(function(foo, bar) {});',
    '(function baz(foo, bar) {});',
    '(foo, bar) => {};',
    'foo => {};',
    'baz(foo, bar);',
    'function baz() {}',
    $`
      function baz(
          foo,
          bar
      ) {}
    `,
    $`
      (function(
          foo,
          bar
      ) {});
    `,
    $`
      (function baz(
          foo,
          bar
      ) {});
    `,
    $`
      (
          foo,
          bar
      ) => {};
    `,
    $`
      baz(
          foo,
          bar
      );
    `,
    $`
      baz(\`foo
          bar\`)
    `,
    'new Foo(bar, baz)',
    'new Foo',
    'new (Foo)',

    $`
      (foo)
      (bar)
    `,
    $`
      foo.map(value => {
        return value;
      })
    `,
    {
      code: 'function baz(foo, bar) {}',
      options: ['multiline'],
    },
    {
      code: 'async (foo, bar) => {};',
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (
            foo,
            bar
        ) => {};
      `,
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'async foo => {};',
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'import(source)',
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(source\n  + ext)',
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(source, options)',
    },
    {
      code: 'import(source\n  + ext, options)',
    },

    // multiline-arguments
    {
      code: 'function baz(foo, bar) {}',
      options: ['multiline-arguments'],
    },
    {
      code: 'function baz(foo) {}',
      options: ['multiline-arguments'],
    },
    {
      code: '(function(foo, bar) {});',
      options: ['multiline-arguments'],
    },
    {
      code: '(function(foo) {});',
      options: ['multiline-arguments'],
    },
    {
      code: '(function baz(foo, bar) {});',
      options: ['multiline-arguments'],
    },
    {
      code: '(function baz(foo) {});',
      options: ['multiline-arguments'],
    },
    {
      code: '(foo, bar) => {};',
      options: ['multiline-arguments'],
    },
    {
      code: 'foo => {};',
      options: ['multiline-arguments'],
    },
    {
      code: 'baz(foo, bar);',
      options: ['multiline-arguments'],
    },
    {
      code: 'baz(foo);',
      options: ['multiline-arguments'],
    },
    {
      code: 'function baz() {}',
      options: ['multiline-arguments'],
    },
    {
      code: $`
        function baz(
            foo,
            bar
        ) {}
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        function baz(
            foo
        ) {}
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        (function(
            foo,
            bar
        ) {});
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        (function(
            foo
        ) {});
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        (function baz(
            foo,
            bar
        ) {});
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        (function baz(
            foo
        ) {});
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        (
            foo,
            bar
        ) => {};
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        (
            foo
        ) => {};
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        baz(
            foo,
            bar
        );
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        baz(
            foo
        );
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        baz(\`foo
            bar\`)
      `,
      options: ['multiline-arguments'],
    },
    {
      code: 'new Foo(bar, baz)',
      options: ['multiline-arguments'],
    },
    {
      code: 'new Foo(bar)',
      options: ['multiline-arguments'],
    },
    {
      code: 'new Foo',
      options: ['multiline-arguments'],
    },
    {
      code: 'new (Foo)',
      options: ['multiline-arguments'],
    },
    {
      code: 'async (foo, bar) => {};',
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'async (foo) => {};',
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (
            foo
        ) => {};
      `,
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (
            foo,
            bar
        ) => {};
      `,
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'async foo => {};',
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'import(source)',
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(source\n  + ext)',
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(source, options)',
      options: ['multiline-arguments'],
    },
    {
      code: 'import(source\n  + ext, options)',
      options: ['multiline-arguments'],
    },

    {
      code: $`
        (foo)
        (bar)
      `,
      options: ['multiline-arguments'],
    },
    {
      code: $`
        foo.map(value => {
          return value;
        })
      `,
      options: ['multiline-arguments'],
    },

    // always option
    {
      code: $`
        function baz(
            foo,
            bar
        ) {}
      `,
      options: ['always'],
    },
    {
      code: $`
        (function(
            foo,
            bar
        ) {});
      `,
      options: ['always'],
    },
    {
      code: $`
        (function baz(
            foo,
            bar
        ) {});
      `,
      options: ['always'],
    },
    {
      code: $`
        (
            foo,
            bar
        ) => {};
      `,
      options: ['always'],
    },
    {
      code: $`
        baz(
            foo,
            bar
        );
      `,
      options: ['always'],
    },
    {
      code: $`
        function baz(
        ) {}
      `,
      options: ['always'],
    },
    {
      code: $`
        async (
            foo
        ) => {};
      `,
      options: ['always'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (
            foo,
            bar
        ) => {};
      `,
      options: ['always'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'async foo => {};',
      options: ['always'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'import(\n  source\n)',
      options: ['always'],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(\n  source, options\n)',
      options: ['always'],
    },

    // never option
    {
      code: 'function baz(foo, bar) {}',
      options: ['never'],
    },
    {
      code: '(function(foo, bar) {});',
      options: ['never'],
    },
    {
      code: '(function baz(foo, bar) {});',
      options: ['never'],
    },
    {
      code: '(foo, bar) => {};',
      options: ['never'],
    },
    {
      code: 'baz(foo, bar);',
      options: ['never'],
    },
    {
      code: 'function baz() {}',
      options: ['never'],
    },
    {
      code: 'async (foo, bar) => {};',
      options: ['never'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'async foo => {};',
      options: ['never'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'import(source)',
      options: ['never'],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(source, options)',
      options: ['never'],
    },

    // minItems option
    {
      code: 'function baz(foo, bar) {}',
      options: [{ minItems: 3 }],
    },
    {
      code: $`
        function baz(
            foo, bar, qux
        ) {}
      `,
      options: [{ minItems: 3 }],
    },
    {
      code: $`
        baz(
            foo, bar, qux
        );
      `,
      options: [{ minItems: 3 }],
    },
    {
      code: 'baz(foo, bar);',
      options: [{ minItems: 3 }],
    },
    {
      code: 'async (foo, bar) => {};',
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (
            foo,
            bar,
            baz
        ) => {};
      `,
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'async foo => {};',
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'import(source)',
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(\n  source\n)',
      options: [{ minItems: 1 }],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(source, options)',
      options: [{ minItems: 3 }],
    },
    {
      code: 'import(\n  source, options\n)',
      options: [{ minItems: 2 }],
    },

    // consistent option
    {
      code: 'foo(bar, baz)',
      options: ['consistent'],
    },
    {
      code: $`
        foo(bar,
        baz)
      `,
      options: ['consistent'],
    },
    {
      code: $`
        foo(
            bar, baz
        )
      `,
      options: ['consistent'],
    },
    {
      code: $`
        foo(
            bar,
            baz
        )
      `,
      options: ['consistent'],
    },
    {
      code: 'async (foo, bar) => {};',
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'async foo => {};',
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (foo,
            bar) => {};
      `,
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (
            foo, bar
        ) => {};
      `,
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: $`
        async (
            foo,
            bar
        ) => {};
      `,
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2017 },
    },
    {
      code: 'import(source)',
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'import(source, options)',
      options: ['consistent'],
    },
    {
      code: 'import(\n  source, options\n)',
      options: ['consistent'],
    },

    // https://github.com/eslint/eslint/issues/15091#issuecomment-975605821
    {
      code: $`
        const method6 = (
          abc: number,
          def: () => void,
        ): [
          string,
          () => void
        ] => [\`a\${abc}\`, def];
        method6(3, () => {});
      `,
      options: ['multiline'],
      parser: tsParser,
    },
    {
      code: $`
        function a<A extends Array<any>, T extends (...args: any[]) => any> (
          b: T,
          c: any,
        ): any {}
      `,
      options: ['multiline'],
      parser: tsParser,
    },
    {
      code: $`
        const a = function <A extends Array<any>, T extends (...args: any[]) => any> (
          b: T,
          c: any,
        ): any {}
      `,
      options: ['multiline'],
      parser: tsParser,
    },
    {
      code: $`
        a<Array<any>, (...args: any[]) => any>(
          b,
          c,
        )
      `,
      options: ['multiline'],
      parser: tsParser,
    },
  ],

  invalid: [

    // multiline option (default)
    {
      code: $`
        function baz(foo,
            bar
        ) {}
      `,
      output: $`
        function baz(
        foo,
            bar
        ) {}
      `,
      errors: [LEFT_MISSING_ERROR],
    },
    {
      code: $`
        (function(
            foo,
            bar) {})
      `,
      output: $`
        (function(
            foo,
            bar
        ) {})
      `,
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        (function baz(foo,
            bar) {})
      `,
      output: $`
        (function baz(
        foo,
            bar
        ) {})
      `,
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        baz(
            foo, bar);
      `,
      output: $`
        baz(foo, bar);
      `,
      errors: [LEFT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        (foo, bar
        ) => {};
      `,
      output: $`
        (foo, bar) => {};
      `,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(
            foo, bar
        ) {}
      `,
      output: $`
        function baz(foo, bar) {}
      `,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(
            foo =
            1
        ) {}
      `,
      output: $`
        function baz(foo =
            1) {}
      `,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(
        ) {}
      `,
      output: $`
        function baz() {}
      `,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        new Foo(bar,
            baz);
      `,
      output: $`
        new Foo(
        bar,
            baz
        );
      `,
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        function baz(/* not fixed due to comment */
        foo) {}
      `,
      output: null,
      errors: [LEFT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(foo
        /* not fixed due to comment */) {}
      `,
      output: null,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (
            foo, bar
        ) => {};
      `,
      output: $`
        async (foo, bar) => {};
      `,
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (foo, bar
        ) => {};
      `,
      output: $`
        async (foo, bar) => {};
      `,
      parserOptions: { ecmaVersion: 2017 },
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (foo,
            bar) => {};
      `,
      output: $`
        async (
        foo,
            bar
        ) => {};
      `,
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar) => {};
      `,
      output: $`
        async (
            foo,
            bar
        ) => {};
      `,
      parserOptions: { ecmaVersion: 2017 },
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(\n  source\n)',
      output: 'import(source)',
      parserOptions: { ecmaVersion: 2020 },
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(\n  source, options\n)',
      output: 'import(source, options)',
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },

    // multiline-arguments
    {
      code: $`
        function baz(foo,
            bar
        ) {}
      `,
      output: $`
        function baz(
        foo,
            bar
        ) {}
      `,
      options: ['multiline-arguments'],
      errors: [LEFT_MISSING_ERROR],
    },
    {
      code: $`
        (function(
            foo,
            bar) {})
      `,
      output: $`
        (function(
            foo,
            bar
        ) {})
      `,
      options: ['multiline-arguments'],
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        (function baz(foo,
            bar) {})
      `,
      output: $`
        (function baz(
        foo,
            bar
        ) {})
      `,
      options: ['multiline-arguments'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        baz(
            foo, bar);
      `,
      output: $`
        baz(foo, bar);
      `,
      options: ['multiline-arguments'],
      errors: [LEFT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        (foo, bar
        ) => {};
      `,
      output: $`
        (foo, bar) => {};
      `,
      options: ['multiline-arguments'],
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(
            foo, bar
        ) {}
      `,
      output: $`
        function baz(foo, bar) {}
      `,
      options: ['multiline-arguments'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(
        ) {}
      `,
      output: $`
        function baz() {}
      `,
      options: ['multiline-arguments'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        new Foo(bar,
            baz);
      `,
      output: $`
        new Foo(
        bar,
            baz
        );
      `,
      options: ['multiline-arguments'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        function baz(/* not fixed due to comment */
        foo) {}
      `,
      output: $`
        function baz(/* not fixed due to comment */
        foo
        ) {}
      `,
      options: ['multiline-arguments'],
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        function baz(foo
        /* not fixed due to comment */) {}
      `,
      output: null,
      options: ['multiline-arguments'],
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(
            qwe,
            foo, bar
        ) {}
      `,
      output: $`
        function baz(
            qwe,
            foo, 
        bar
        ) {}
      `,
      options: ['multiline-arguments'],
      errors: [EXPECTED_BETWEEN],
    },
    {
      code: $`
        function baz(
            qwe, foo,
            bar
        ) {}
      `,
      output: $`
        function baz(
            qwe, 
        foo,
            bar
        ) {}
      `,
      options: ['multiline-arguments'],
      errors: [EXPECTED_BETWEEN],
    },
    {
      code: $`
        function baz(qwe, foo,
            bar) {}
      `,
      output: $`
        function baz(
        qwe, 
        foo,
            bar
        ) {}
      `,
      options: ['multiline-arguments'],
      errors: [LEFT_MISSING_ERROR, EXPECTED_BETWEEN, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        baz(
            foo);
      `,
      output: $`
        baz(
            foo
        );
      `,
      options: ['multiline-arguments'],
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        baz(foo
            );
      `,
      output: $`
        baz(foo);
      `,
      options: ['multiline-arguments'],
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (foo, bar
        ) => {};
      `,
      output: $`
        async (foo, bar) => {};
      `,
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (foo,
            bar) => {};
      `,
      output: $`
        async (
        foo,
            bar
        ) => {};
      `,
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar) => {};
      `,
      output: $`
        async (
            foo,
            bar
        ) => {};
      `,
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(source\n)',
      output: 'import(source)',
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2020 },
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(\n  source)',
      output: 'import(\n  source\n)',
      options: ['multiline-arguments'],
      parserOptions: { ecmaVersion: 2020 },
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(source, options\n)',
      output: 'import(source, options)',
      options: ['multiline-arguments'],
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(source,\noptions)',
      output: 'import(\nsource,\noptions\n)',
      options: ['multiline-arguments'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },

    // always option
    {
      code: $`
        function baz(foo,
            bar
        ) {}
      `,
      output: $`
        function baz(
        foo,
            bar
        ) {}
      `,
      options: ['always'],
      errors: [LEFT_MISSING_ERROR],
    },
    {
      code: $`
        (function(
            foo,
            bar) {})
      `,
      output: $`
        (function(
            foo,
            bar
        ) {})
      `,
      options: ['always'],
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        (function baz(foo,
            bar) {})
      `,
      output: $`
        (function baz(
        foo,
            bar
        ) {})
      `,
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: 'function baz(foo, bar) {}',
      output: 'function baz(\nfoo, bar\n) {}',
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: '(function(foo, bar) {});',
      output: '(function(\nfoo, bar\n) {});',
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: '(function baz(foo, bar) {});',
      output: '(function baz(\nfoo, bar\n) {});',
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: '(foo, bar) => {};',
      output: '(\nfoo, bar\n) => {};',
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: 'baz(foo, bar);',
      output: 'baz(\nfoo, bar\n);',
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: 'function baz() {}',
      output: 'function baz(\n) {}',
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        async (foo, bar) => {};
      `,
      output: $`
        async (
        foo, bar
        ) => {};
      `,
      options: ['always'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        async (foo,
            bar) => {};
      `,
      output: $`
        async (
        foo,
            bar
        ) => {};
      `,
      options: ['always'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar) => {};
      `,
      output: $`
        async (
            foo,
            bar
        ) => {};
      `,
      options: ['always'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(source)',
      output: 'import(\nsource\n)',
      options: ['always'],
      parserOptions: { ecmaVersion: 2020 },
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(source, options)',
      output: 'import(\nsource, options\n)',
      options: ['always'],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },

    // never option
    {
      code: $`
        function baz(foo,
            bar
        ) {}
      `,
      output: $`
        function baz(foo,
            bar) {}
      `,
      options: ['never'],
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        (function(
            foo,
            bar) {})
      `,
      output: $`
        (function(foo,
            bar) {})
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        new new C()(
        );
      `,
      output: $`
        new new C()();
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: $`
        function baz(
            foo,
            bar
        ) {}
      `,
      output: $`
        function baz(foo,
            bar) {}
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        (function(
            foo,
            bar
        ) {});
      `,
      output: $`
        (function(foo,
            bar) {});
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        (function baz(
            foo,
            bar
        ) {});
      `,
      output: $`
        (function baz(foo,
            bar) {});
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        (
            foo,
            bar
        ) => {};
      `,
      output: $`
        (foo,
            bar) => {};
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        baz(
            foo,
            bar
        );
      `,
      output: $`
        baz(foo,
            bar);
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        function baz(
        ) {}
      `,
      output: $`
        function baz() {}
      `,
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar
        ) => {};
      `,
      output: $`
        async (foo,
            bar) => {};
      `,
      options: ['never'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar) => {};
      `,
      output: $`
        async (foo,
            bar) => {};
      `,
      options: ['never'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(\n  source\n)',
      output: 'import(source)',
      options: ['never'],
      parserOptions: { ecmaVersion: 2020 },
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(\n  source, options\n)',
      output: 'import(source, options)',
      options: ['never'],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },

    // minItems option
    {
      code: 'function baz(foo, bar, qux) {}',
      output: 'function baz(\nfoo, bar, qux\n) {}',
      options: [{ minItems: 3 }],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        function baz(
            foo, bar
        ) {}
      `,
      output: $`
        function baz(foo, bar) {}
      `,
      options: [{ minItems: 3 }],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'baz(foo, bar, qux);',
      output: 'baz(\nfoo, bar, qux\n);',
      options: [{ minItems: 3 }],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        baz(
            foo,
            bar
        );
      `,
      output: $`
        baz(foo,
            bar);
      `,
      options: [{ minItems: 3 }],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar
        ) => {};
      `,
      output: $`
        async (foo,
            bar) => {};
      `,
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar) => {};
      `,
      output: $`
        async (foo,
            bar) => {};
      `,
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (foo, bar, baz) => {};
      `,
      output: $`
        async (
        foo, bar, baz
        ) => {};
      `,
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2017 },
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(\n  source\n)',
      output: 'import(source)',
      options: [{ minItems: 3 }],
      parserOptions: { ecmaVersion: 2020 },
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(source)',
      output: 'import(\nsource\n)',
      options: [{ minItems: 1 }],
      parserOptions: { ecmaVersion: 2020 },
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(\n  source, options\n)',
      output: 'import(source, options)',
      options: [{ minItems: 3 }],
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(source, options)',
      output: 'import(\nsource, options\n)',
      options: [{ minItems: 2 }],
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
    },

    // consistent option
    {
      code: $`
        foo(
            bar,
            baz)
      `,
      output: $`
        foo(
            bar,
            baz
        )
      `,
      options: ['consistent'],
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        foo(bar,
            baz
        )
      `,
      output: $`
        foo(bar,
            baz)
      `,
      options: ['consistent'],
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: $`
        async (
            foo,
            bar) => {};
      `,
      output: $`
        async (
            foo,
            bar
        ) => {};
      `,
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: $`
        async (foo,
            bar
        ) => {};
      `,
      output: $`
        async (foo,
            bar) => {};
      `,
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2017 },
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(source\n)',
      output: 'import(source)',
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2020 },
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(\n  source)',
      output: 'import(\n  source\n)',
      options: ['consistent'],
      parserOptions: { ecmaVersion: 2020 },
      errors: [RIGHT_MISSING_ERROR],
    },
    {
      code: 'import(source, options\n)',
      output: 'import(source, options)',
      options: ['consistent'],
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: 'import(\n  source, options)',
      output: 'import(\n  source, options\n)',
      options: ['consistent'],
      errors: [RIGHT_MISSING_ERROR],
    },

    // https://github.com/eslint/eslint/issues/15091#issuecomment-975605821
    {
      code: $`
        const method6 = (
          abc: number,
          def: () => void,
        ): [
          string,
          () => void
        ] => [\`a\${abc}\`, def];
        method6(3, () => {});
      `,
      output: $`
        const method6 = (abc: number,
          def: () => void,): [
          string,
          () => void
        ] => [\`a\${abc}\`, def];
        method6(3, () => {});
      `,
      options: ['never'],
      parser: tsParser,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },
  ],
})
