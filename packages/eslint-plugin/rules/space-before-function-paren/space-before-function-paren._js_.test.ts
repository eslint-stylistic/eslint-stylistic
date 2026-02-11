/**
 * @fileoverview Tests for space-before-function-paren.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

import type { MessageIds, RuleOptions } from './types'
import { $, run, skipBabel } from '#test'
import { languageOptionsForBabelFlow } from '#test/parsers-flow'
import rule from './space-before-function-paren'

run<RuleOptions, MessageIds>({
  name: 'space-before-function-paren',
  rule,
  lang: 'js',
  valid: [
    'function foo () {}',
    'var foo = function () {}',
    'var bar = function foo () {}',
    'var bar = function foo/**/ () {}',
    'var bar = function foo /**/() {}',
    'var bar = function foo/**/\n() {}',
    'var bar = function foo\n/**/() {}',
    'var bar = function foo//\n() {}',
    'var obj = { get foo () {}, set foo (val) {} };',
    {
      code: 'var obj = { foo () {} };',
      parserOptions: { ecmaVersion: 6 },
    },
    { code: 'function* foo () {}', parserOptions: { ecmaVersion: 6 } },
    { code: 'var foo = function *() {};', parserOptions: { ecmaVersion: 6 } },

    { code: 'function foo() {}', options: ['never'] },
    { code: 'var foo = function() {}', options: ['never'] },
    { code: 'var foo = function/**/() {}', options: ['never'] },
    { code: 'var foo = function/* */() {}', options: ['never'] },
    { code: 'var foo = function/* *//*  */() {}', options: ['never'] },
    { code: 'var bar = function foo() {}', options: ['never'] },
    { code: 'var obj = { get foo() {}, set foo(val) {} };', options: ['never'] },
    {
      code: 'var obj = { foo() {} };',
      options: ['never'],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function* foo() {}',
      options: ['never'],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var foo = function*() {};',
      options: ['never'],
      parserOptions: { ecmaVersion: 6 },
    },

    {
      code: $`
        function foo() {}
        var bar = function () {}
        function* baz() {}
        var bat = function*() {};
        var obj = { get foo() {}, set foo(val) {}, bar() {} };
      `,
      options: [{ named: 'never', anonymous: 'always' }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: $`
        function foo () {}
        var bar = function() {}
        function* baz () {}
        var bat = function* () {};
        var obj = { get foo () {}, set foo (val) {}, bar () {} };
      `,
      options: [{ named: 'always', anonymous: 'never' }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class Foo { constructor() {} *method() {} }',
      options: [{ named: 'never', anonymous: 'always' }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class Foo { constructor () {} *method () {} }',
      options: [{ named: 'always', anonymous: 'never' }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'var foo = function() {}',
      options: [{ named: 'always', anonymous: 'ignore' }],
    },
    {
      code: 'var foo = function () {}',
      options: [{ named: 'always', anonymous: 'ignore' }],
    },
    {
      code: 'var bar = function foo() {}',
      options: [{ named: 'ignore', anonymous: 'always' }],
    },
    {
      code: 'var bar = function foo () {}',
      options: [{ named: 'ignore', anonymous: 'always' }],
    },

    // Async arrow functions
    { code: '() => 1', parserOptions: { ecmaVersion: 6 } },
    { code: 'async a => a', parserOptions: { ecmaVersion: 8 } },
    { code: 'async a => a', options: [{ asyncArrow: 'always' }], parserOptions: { ecmaVersion: 8 } },
    { code: 'async a => a', options: [{ asyncArrow: 'never' }], parserOptions: { ecmaVersion: 8 } },
    { code: 'async () => 1', options: [{ asyncArrow: 'always' }], parserOptions: { ecmaVersion: 8 } },
    { code: 'async() => 1', options: [{ asyncArrow: 'never' }], parserOptions: { ecmaVersion: 8 } },
    { code: 'async () => 1', options: [{ asyncArrow: 'ignore' }], parserOptions: { ecmaVersion: 8 } },
    { code: 'async() => 1', options: [{ asyncArrow: 'ignore' }], parserOptions: { ecmaVersion: 8 } },
    { code: 'async () => 1', parserOptions: { ecmaVersion: 8 } },
    { code: 'async () => 1', options: ['always'], parserOptions: { ecmaVersion: 8 } },
    { code: 'async() => 1', options: ['never'], parserOptions: { ecmaVersion: 8 } },

    // Catch clause
    { code: 'try {} catch (e) {}' },
    { code: 'try {} catch (e) {}', options: ['always'] },
    { code: 'try {} catch(e) {}', options: ['never'] },
    { code: 'try {} catch (e) {}', options: [{ catch: 'always' }] },
    { code: 'try {} catch(e) {}', options: [{ catch: 'never' }] },
    { code: 'try {} catch (e) {}', options: [{ catch: 'ignore' }] },
    { code: 'try {} catch(e) {}', options: [{ catch: 'ignore' }] },
  ],

  invalid: [
    {
      code: 'function foo() {}',
      output: 'function foo () {}',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 13,
          endColumn: 14,
        },
      ],
    },
    {
      code: 'function foo/* */() {}',
      output: 'function foo /* */() {}',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 18,
          endColumn: 19,
        },
      ],
    },
    {
      code: 'var foo = function() {}',
      output: 'var foo = function () {}',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 19,
        },
      ],
    },
    {
      code: 'var bar = function foo() {}',
      output: 'var bar = function foo () {}',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 23,
        },
      ],
    },
    {
      code: 'var obj = { get foo() {}, set foo(val) {} };',
      output: 'var obj = { get foo () {}, set foo (val) {} };',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 20,
        },
        {
          messageId: 'missingSpace',
          line: 1,
          column: 34,
        },
      ],
    },
    {
      code: 'var obj = { foo() {} };',
      output: 'var obj = { foo () {} };',
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 16,
        },
      ],
    },
    {
      code: 'function* foo() {}',
      output: 'function* foo () {}',
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 14,
        },
      ],
    },

    {
      code: 'function foo () {}',
      output: 'function foo() {}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
          endColumn: 14,
        },
      ],
    },
    {
      code: 'function foo /* */ () {}',
      output: 'function foo/* */() {}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: 'function foo/* block comment */ () {}',
      output: 'function foo/* block comment */() {}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: 'function foo/* 1 */ /* 2 */ \n /* 3 */\n/* 4 */ () {}',
      output: 'function foo/* 1 *//* 2 *//* 3 *//* 4 */() {}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: 'function foo  () {}',
      output: 'function foo() {}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
          endColumn: 15,
        },
      ],
    },
    {
      code: 'function foo//\n() {}',
      output: null,
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
          endLine: 2,
          endColumn: 1,
        },
      ],
    },
    {
      code: 'function foo // line comment \n () {}',
      output: null,
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: 'function foo\n//\n() {}',
      output: null,
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: 'var foo = function () {}',
      output: 'var foo = function() {}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 19,
          endColumn: 20,
        },
      ],
    },
    {
      code: 'var bar = function foo () {}',
      output: 'var bar = function foo() {}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 23,
        },
      ],
    },
    {
      code: 'var obj = { get foo () {}, set foo (val) {} };',
      output: 'var obj = { get foo() {}, set foo(val) {} };',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 20,
        },
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 35,
        },
      ],
    },
    {
      code: 'var obj = { foo () {} };',
      output: 'var obj = { foo() {} };',
      options: ['never'],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 16,
        },
      ],
    },
    {
      code: 'function* foo () {}',
      output: 'function* foo() {}',
      options: ['never'],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 14,
        },
      ],
    },

    {
      code: $`
        function foo () {}
        var bar = function() {}
        var obj = { get foo () {}, set foo (val) {}, bar () {} };
      `,
      output: $`
        function foo() {}
        var bar = function () {}
        var obj = { get foo() {}, set foo(val) {}, bar() {} };
      `,
      options: [{ named: 'never', anonymous: 'always' }],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 13,
        },
        {
          messageId: 'missingSpace',
          line: 2,
          column: 19,
        },
        {
          messageId: 'unexpectedSpace',
          line: 3,
          column: 20,
        },
        {
          messageId: 'unexpectedSpace',
          line: 3,
          column: 35,
        },
        {
          messageId: 'unexpectedSpace',
          line: 3,
          column: 49,
        },
      ],
    },
    {
      code: 'class Foo { constructor () {} *method () {} }',
      output: 'class Foo { constructor() {} *method() {} }',
      options: [{ named: 'never', anonymous: 'always' }],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 24,
        },
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 38,
        },
      ],
    },
    {
      code: 'var foo = { bar () {} }',
      output: 'var foo = { bar() {} }',
      options: [{ named: 'never', anonymous: 'always' }],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 16,
        },
      ],
    },
    {
      code: $`
        function foo() {}
        var bar = function () {}
        var obj = { get foo() {}, set foo(val) {}, bar() {} };
      `,
      output: $`
        function foo () {}
        var bar = function() {}
        var obj = { get foo () {}, set foo (val) {}, bar () {} };
      `,
      options: [{ named: 'always', anonymous: 'never' }],
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 13,
        },
        {
          messageId: 'unexpectedSpace',
          line: 2,
          column: 19,
        },
        {
          messageId: 'missingSpace',
          line: 3,
          column: 20,
        },
        {
          messageId: 'missingSpace',
          line: 3,
          column: 34,
        },
        {
          messageId: 'missingSpace',
          line: 3,
          column: 47,
        },
      ],
    },
    {
      code: 'var foo = function() {}',
      output: 'var foo = function () {}',
      options: [{ named: 'ignore', anonymous: 'always' }],
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 19,
        },
      ],
    },
    {
      code: 'var foo = function () {}',
      output: 'var foo = function() {}',
      options: [{ named: 'ignore', anonymous: 'never' }],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 19,
        },
      ],
    },
    {
      code: 'var bar = function foo() {}',
      output: 'var bar = function foo () {}',
      options: [{ named: 'always', anonymous: 'ignore' }],
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 23,
        },
      ],
    },
    {
      code: 'var bar = function foo () {}',
      output: 'var bar = function foo() {}',
      options: [{ named: 'never', anonymous: 'ignore' }],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 23,
        },
      ],
    },

    // Async arrow functions
    {
      code: 'async() => 1',
      output: 'async () => 1',
      options: [{ asyncArrow: 'always' }],
      parserOptions: { ecmaVersion: 8 },
      errors: [{ message: 'Missing space before function parentheses.' }],
    },
    {
      code: 'async () => 1',
      output: 'async() => 1',
      options: [{ asyncArrow: 'never' }],
      parserOptions: { ecmaVersion: 8 },
      errors: [{ message: 'Unexpected space before function parentheses.' }],
    },
    {
      code: 'async() => 1',
      output: 'async () => 1',
      parserOptions: { ecmaVersion: 8 },
      errors: [{ messageId: 'missingSpace' }],
    },
    {
      code: 'async() => 1',
      output: 'async () => 1',
      options: ['always'],
      parserOptions: { ecmaVersion: 8 },
      errors: [{ messageId: 'missingSpace' }],
    },
    {
      code: 'async () => 1',
      output: 'async() => 1',
      options: ['never'],
      parserOptions: { ecmaVersion: 8 },
      errors: [{ messageId: 'unexpectedSpace' }],
    },

    // Catch clause
    {
      code: 'try {} catch(e) {}',
      output: 'try {} catch (e) {}',
      errors: [{ messageId: 'missingSpace' }],
    },
    {
      code: 'try {} catch(e) {}',
      output: 'try {} catch (e) {}',
      options: ['always'],
      errors: [{ messageId: 'missingSpace' }],
    },
    {
      code: 'try {} catch (e) {}',
      output: 'try {} catch(e) {}',
      options: ['never'],
      errors: [{ messageId: 'unexpectedSpace' }],
    },
    {
      code: 'try {} catch(e) {}',
      output: 'try {} catch (e) {}',
      options: [{ catch: 'always' }],
      errors: [{ messageId: 'missingSpace' }],
    },
    {
      code: 'try {} catch (e) {}',
      output: 'try {} catch(e) {}',
      options: [{ catch: 'never' }],
      errors: [{ messageId: 'unexpectedSpace' }],
    },
  ],
})

if (!skipBabel) {
  run({
    name: 'space-before-function-paren_babel',
    valid: [
      {
        code: 'type TransformFunction = (el: ASTElement, code: string) => string;',
        languageOptions: languageOptionsForBabelFlow,
      },
    ],
    invalid: [],
  })
}
