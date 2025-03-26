/**
 * @fileoverview Tests for arrow-parens
 * @author Jxck
 */

import type { RuleOptions } from './types'
import { $, run } from '#test'
import { languageOptionsForBabelFlow } from '#test/parsers-flow'
import rule from '.'

const type = 'ArrowFunctionExpression'

run<RuleOptions>({
  name: 'arrow-parens',
  rule,
  valid: [
    // "always" (by default)
    '() => {}',
    '(a) => {}',
    '(a) => a',
    '(a) => {\n}',
    'a.then((foo) => {});',
    'a.then((foo) => { if (true) {}; });',
    'const f = (/* */a) => a + a;',
    'const f = (a/** */) => a + a;',
    'const f = (a//\n) => a + a;',
    'const f = (//\na) => a + a;',
    'const f = (/*\n */a//\n) => a + a;',
    'const f = (/** @type {number} */a/**hello*/) => a + a;',
    { code: 'a.then(async (foo) => { if (true) {}; });', parserOptions: { ecmaVersion: 8 } },

    // "always" (explicit)
    { code: '() => {}', options: ['always'] },
    { code: '(a) => {}', options: ['always'] },
    { code: '(a) => a', options: ['always'] },
    { code: '(a) => {\n}', options: ['always'] },
    { code: 'a.then((foo) => {});', options: ['always'] },
    { code: 'a.then((foo) => { if (true) {}; });', options: ['always'] },
    { code: 'a.then(async (foo) => { if (true) {}; });', options: ['always'], parserOptions: { ecmaVersion: 8 } },
    { code: '(a: T) => a', options: ['always'], languageOptions: languageOptionsForBabelFlow },
    { code: '(a): T => a', options: ['always'], languageOptions: languageOptionsForBabelFlow },

    // "as-needed"
    { code: '() => {}', options: ['as-needed'] },
    { code: 'a => {}', options: ['as-needed'] },
    { code: 'a => a', options: ['as-needed'] },
    { code: 'a => (a)', options: ['as-needed'] },
    { code: '(a => a)', options: ['as-needed'] },
    { code: '((a => a))', options: ['as-needed'] },
    { code: '([a, b]) => {}', options: ['as-needed'] },
    { code: '({ a, b }) => {}', options: ['as-needed'] },
    { code: '(a = 10) => {}', options: ['as-needed'] },
    { code: '(...a) => a[0]', options: ['as-needed'] },
    { code: '(a, b) => {}', options: ['as-needed'] },
    { code: 'async a => a', options: ['as-needed'], parserOptions: { ecmaVersion: 8 } },
    { code: 'async ([a, b]) => {}', options: ['as-needed'], parserOptions: { ecmaVersion: 8 } },
    { code: 'async (a, b) => {}', options: ['as-needed'], parserOptions: { ecmaVersion: 8 } },
    { code: '(a: T) => a', options: ['as-needed'], languageOptions: languageOptionsForBabelFlow },
    { code: '(a?) => a', options: ['as-needed'], languageOptions: languageOptionsForBabelFlow },
    { code: '(a): T => a', options: ['as-needed'], languageOptions: languageOptionsForBabelFlow },

    // "as-needed", { "requireForBlockBody": true }
    { code: '() => {}', options: ['as-needed', { requireForBlockBody: true }] },
    { code: 'a => a', options: ['as-needed', { requireForBlockBody: true }] },
    { code: 'a => (a)', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '(a => a)', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '((a => a))', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '([a, b]) => {}', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '([a, b]) => a', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '({ a, b }) => {}', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '({ a, b }) => a + b', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '(a = 10) => {}', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '(...a) => a[0]', options: ['as-needed', { requireForBlockBody: true }] },
    { code: '(a, b) => {}', options: ['as-needed', { requireForBlockBody: true }] },
    { code: 'a => ({})', options: ['as-needed', { requireForBlockBody: true }] },
    { code: 'async a => ({})', options: ['as-needed', { requireForBlockBody: true }], parserOptions: { ecmaVersion: 8 } },
    { code: 'async a => a', options: ['as-needed', { requireForBlockBody: true }], parserOptions: { ecmaVersion: 8 } },
    { code: '(a: T) => a', options: ['as-needed', { requireForBlockBody: true }], languageOptions: languageOptionsForBabelFlow },
    { code: '(a): T => a', options: ['as-needed', { requireForBlockBody: true }], languageOptions: languageOptionsForBabelFlow },
    {
      code: 'const f = (/** @type {number} */a/**hello*/) => a + a;',
      options: ['as-needed'],
    },
    {
      code: 'const f = (/* */a) => a + a;',
      options: ['as-needed'],
    },
    {
      code: 'const f = (a/** */) => a + a;',
      options: ['as-needed'],
    },
    {
      code: 'const f = (a//\n) => a + a;',
      options: ['as-needed'],
    },
    {
      code: 'const f = (//\na) => a + a;',
      options: ['as-needed'],
    },
    {
      code: 'const f = (/*\n */a//\n) => a + a;',
      options: ['as-needed'],
    },
    {
      code: 'var foo = (a,/**/) => b;',
      parserOptions: { ecmaVersion: 2017 },
      options: ['as-needed'],
    },
    {
      code: 'var foo = (a , /**/) => b;',
      parserOptions: { ecmaVersion: 2017 },
      options: ['as-needed'],
    },
    {
      code: 'var foo = (a\n,\n/**/) => b;',
      parserOptions: { ecmaVersion: 2017 },
      options: ['as-needed'],
    },
    {
      code: 'var foo = (a,//\n) => b;',
      parserOptions: { ecmaVersion: 2017 },
      options: ['as-needed'],
    },
    {
      code: 'const i = (a/**/,) => a + a;',
      parserOptions: { ecmaVersion: 2017 },
      options: ['as-needed'],
    },
    {
      code: 'const i = (a \n /**/,) => a + a;',
      parserOptions: { ecmaVersion: 2017 },
      options: ['as-needed'],
    },
    {
      code: 'var bar = ({/*comment here*/a}) => a',
      options: ['as-needed'],
    },
    {
      code: 'var bar = (/*comment here*/{a}) => a',
      options: ['as-needed'],
    },

    // generics
    {
      code: '<T>(a) => b',
      options: ['always'],
    },
    {
      code: '<T>(a) => b',
      options: ['as-needed'],
    },
    {
      code: '<T>(a) => b',
      options: ['as-needed', { requireForBlockBody: true }],
    },
    {
      code: 'async <T>(a) => b',
      options: ['always'],
    },
    {
      code: 'async <T>(a) => b',
      options: ['as-needed'],
    },
    {
      code: 'async <T>(a) => b',
      options: ['as-needed', { requireForBlockBody: true }],
    },
    {
      code: '<T>() => b',
      options: ['always'],
    },
    {
      code: '<T>() => b',
      options: ['as-needed'],
    },
    {
      code: '<T>() => b',
      options: ['as-needed', { requireForBlockBody: true }],
    },
    {
      code: '<T extends A>(a) => b',
      options: ['always'],
    },
    {
      code: '<T extends A>(a) => b',
      options: ['as-needed'],
    },
    {
      code: '<T extends A>(a) => b',
      options: ['as-needed', { requireForBlockBody: true }],
    },
    {
      code: '<T extends (A | B) & C>(a) => b',
      options: ['always'],
    },
    {
      code: '<T extends (A | B) & C>(a) => b',
      options: ['as-needed'],
    },
    {
      code: '<T extends (A | B) & C>(a) => b',
      options: ['as-needed', { requireForBlockBody: true }],
    },
  ],
  invalid: [
    // "always" (by default)
    {
      code: 'a => {}',
      output: '(a) => {}',
      errors: [{
        line: 1,
        column: 1,
        endColumn: 2,
        messageId: 'expectedParens',
        type,
      }],
    },
    {
      code: 'a => a',
      output: '(a) => a',
      errors: [{
        line: 1,
        column: 1,
        endColumn: 2,
        messageId: 'expectedParens',
        type,
      }],
    },
    {
      code: 'a => {\n}',
      output: '(a) => {\n}',
      errors: [{
        line: 1,
        column: 1,
        endColumn: 2,
        messageId: 'expectedParens',
        type,
      }],
    },
    {
      code: 'a.then(foo => {});',
      output: 'a.then((foo) => {});',
      errors: [{
        line: 1,
        column: 8,
        endColumn: 11,
        messageId: 'expectedParens',
        type,
      }],
    },
    {
      code: 'a.then(foo => a);',
      output: 'a.then((foo) => a);',
      errors: [{
        line: 1,
        column: 8,
        endColumn: 11,
        messageId: 'expectedParens',
        type,
      }],
    },
    {
      code: 'a(foo => { if (true) {}; });',
      output: 'a((foo) => { if (true) {}; });',
      errors: [{
        line: 1,
        column: 3,
        endColumn: 6,
        messageId: 'expectedParens',
        type,
      }],
    },
    {
      code: 'a(async foo => { if (true) {}; });',
      output: 'a(async (foo) => { if (true) {}; });',
      parserOptions: { ecmaVersion: 8 },
      errors: [{
        line: 1,
        column: 9,
        endColumn: 12,
        messageId: 'expectedParens',
        type,
      }],
    },

    // "as-needed"
    {
      code: '(a) => a',
      output: 'a => a',
      options: ['as-needed'],
      errors: [{
        line: 1,
        column: 2,
        endColumn: 3,
        messageId: 'unexpectedParens',
        type,
      }],
    },
    {
      code: '(  a  ) => b',
      output: 'a => b',
      options: ['as-needed'],
      errors: [{
        line: 1,
        column: 4,
        endColumn: 5,
        messageId: 'unexpectedParens',
        type,
      }],
    },
    {
      code: '(\na\n) => b',
      output: 'a => b',
      options: ['as-needed'],
      errors: [{
        line: 2,
        column: 1,
        endColumn: 2,
        messageId: 'unexpectedParens',
        type,
      }],
    },
    {
      code: '(a,) => a',
      output: 'a => a',
      options: ['as-needed'],
      parserOptions: { ecmaVersion: 8 },
      errors: [{
        line: 1,
        column: 2,
        endColumn: 3,
        messageId: 'unexpectedParens',
        type,
      }],
    },
    {
      code: 'async (a) => a',
      output: 'async a => a',
      options: ['as-needed'],
      parserOptions: { ecmaVersion: 8 },
      errors: [{
        line: 1,
        column: 8,
        endColumn: 9,
        messageId: 'unexpectedParens',
        type,
      }],
    },
    {
      code: 'async(a) => a',
      output: 'async a => a',
      options: ['as-needed'],
      parserOptions: { ecmaVersion: 8 },
      errors: [{
        line: 1,
        column: 7,
        endColumn: 8,
        messageId: 'unexpectedParens',
        type,
      }],
    },
    {
      code: 'typeof((a) => {})',
      output: 'typeof(a => {})',
      options: ['as-needed'],
      errors: [{
        line: 1,
        column: 9,
        endColumn: 10,
        messageId: 'unexpectedParens',
        type,
      }],
    },
    {
      code: 'function *f() { yield(a) => a; }',
      output: 'function *f() { yield a => a; }',
      options: ['as-needed'],
      errors: [{
        line: 1,
        column: 23,
        endColumn: 24,
        messageId: 'unexpectedParens',
        type,
      }],
    },

    // "as-needed", { "requireForBlockBody": true }
    {
      code: 'a => {}',
      output: '(a) => {}',
      options: ['as-needed', { requireForBlockBody: true }],
      errors: [{
        line: 1,
        column: 1,
        endColumn: 2,
        messageId: 'expectedParensBlock',
        type,
      }],
    },
    {
      code: '(a) => a',
      output: 'a => a',
      options: ['as-needed', { requireForBlockBody: true }],
      errors: [{
        line: 1,
        column: 2,
        endColumn: 3,
        messageId: 'unexpectedParensInline',
        type,
      }],
    },
    {
      code: 'async a => {}',
      output: 'async (a) => {}',
      options: ['as-needed', { requireForBlockBody: true }],
      parserOptions: { ecmaVersion: 8 },
      errors: [{
        line: 1,
        column: 7,
        endColumn: 8,
        messageId: 'expectedParensBlock',
        type,
      }],
    },
    {
      code: 'async (a) => a',
      output: 'async a => a',
      options: ['as-needed', { requireForBlockBody: true }],
      parserOptions: { ecmaVersion: 8 },
      errors: [{
        line: 1,
        column: 8,
        endColumn: 9,
        messageId: 'unexpectedParensInline',
        type,
      }],
    },
    {
      code: 'async(a) => a',
      output: 'async a => a',
      options: ['as-needed', { requireForBlockBody: true }],
      parserOptions: { ecmaVersion: 8 },
      errors: [{
        line: 1,
        column: 7,
        endColumn: 8,
        messageId: 'unexpectedParensInline',
        type,
      }],
    },
    {
      code: 'const f = /** @type {number} */(a)/**hello*/ => a + a;',
      options: ['as-needed'],
      output: 'const f = /** @type {number} */a/**hello*/ => a + a;',
      errors: [{
        line: 1,
        column: 33,
        type,
        messageId: 'unexpectedParens',
        endLine: 1,
        endColumn: 34,
      }],
    },
    {
      code: 'const f = //\n(a) => a + a;',
      output: 'const f = //\na => a + a;',
      options: ['as-needed'],
      errors: [{
        line: 2,
        column: 2,
        type,
        messageId: 'unexpectedParens',
        endLine: 2,
        endColumn: 3,
      }],
    },
    {
      code: 'var foo = /**/ a => b;',
      output: 'var foo = /**/ (a) => b;',
      errors: [{
        line: 1,
        column: 16,
        type: 'ArrowFunctionExpression',
        messageId: 'expectedParens',
        endLine: 1,
        endColumn: 17,
      }],
    },
    {
      code: 'var bar = a /**/ =>  b;',
      output: 'var bar = (a) /**/ =>  b;',
      errors: [{
        line: 1,
        column: 11,
        type: 'ArrowFunctionExpression',
        messageId: 'expectedParens',
        endLine: 1,
        endColumn: 12,
      }],
    },
    {
      code: $`
        const foo = a => {};
        
        // comment between 'a' and an unrelated closing paren
        
        bar();
      `,
      output: $`
        const foo = (a) => {};
        
        // comment between 'a' and an unrelated closing paren
        
        bar();
      `,
      errors: [{
        line: 1,
        column: 13,
        type: 'ArrowFunctionExpression',
        messageId: 'expectedParens',
        endLine: 1,
        endColumn: 14,
      }],
    },
  ],
})
