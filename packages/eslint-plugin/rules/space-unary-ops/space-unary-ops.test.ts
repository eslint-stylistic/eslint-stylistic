/**
 * @fileoverview This rule should require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './space-unary-ops'

run<RuleOptions, MessageIds>({
  name: 'space-unary-ops',
  rule,
  lang: 'js',

  valid: [
    {
      code: '++this.a',
      options: [{ words: true }],
    },
    {
      code: '--this.a',
      options: [{ words: true }],
    },
    {
      code: 'this.a++',
      options: [{ words: true }],
    },
    {
      code: 'this.a--',
      options: [{ words: true }],
    },
    'foo .bar++',
    {
      code: 'foo.bar --',
      options: [{ nonwords: true }],
    },

    {
      code: 'delete foo.bar',
      options: [{ words: true }],
    },
    {
      code: 'delete foo["bar"]',
      options: [{ words: true }],
    },
    {
      code: 'delete foo.bar',
      options: [{ words: false }],
    },
    {
      code: 'delete(foo.bar)',
      options: [{ words: false }],
    },

    {
      code: 'new Foo',
      options: [{ words: true }],
    },
    {
      code: 'new Foo()',
      options: [{ words: true }],
    },
    {
      code: 'new [foo][0]',
      options: [{ words: true }],
    },
    {
      code: 'new[foo][0]',
      options: [{ words: false }],
    },

    {
      code: 'typeof foo',
      options: [{ words: true }],
    },
    {
      code: 'typeof{foo:true}',
      options: [{ words: false }],
    },
    {
      code: 'typeof {foo:true}',
      options: [{ words: true }],
    },
    {
      code: 'typeof (foo)',
      options: [{ words: true }],
    },
    {
      code: 'typeof(foo)',
      options: [{ words: false }],
    },
    {
      code: 'typeof!foo',
      options: [{ words: false }],
    },

    {
      code: 'void 0',
      options: [{ words: true }],
    },
    {
      code: '(void 0)',
      options: [{ words: true }],
    },
    {
      code: '(void (0))',
      options: [{ words: true }],
    },
    {
      code: 'void foo',
      options: [{ words: true }],
    },
    {
      code: 'void foo',
      options: [{ words: false }],
    },
    {
      code: 'void(foo)',
      options: [{ words: false }],
    },

    {
      code: '-1',
      options: [{ nonwords: false }],
    },
    {
      code: '!foo',
      options: [{ nonwords: false }],
    },
    {
      code: '!!foo',
      options: [{ nonwords: false }],
    },
    {
      code: 'foo++',
      options: [{ nonwords: false }],
    },
    {
      code: 'foo ++',
      options: [{ nonwords: true }],
    },
    {
      code: '++foo',
      options: [{ nonwords: false }],
    },
    {
      code: '++ foo',
      options: [{ nonwords: true }],
    },
    {
      code: 'function *foo () { yield (0) }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo() { yield +1 }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo() { yield* 0 }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo() { yield * 0 }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo() { (yield)*0 }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo() { (yield) * 0 }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo() { yield*0 }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo() { yield *0 }',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'foo++',
      options: [{ nonwords: true, overrides: { '++': false } }],
    },
    {
      code: 'foo++',
      options: [{ nonwords: false, overrides: { '++': false } }],
    },
    {
      code: '++foo',
      options: [{ nonwords: true, overrides: { '++': false } }],
    },
    {
      code: '++foo',
      options: [{ nonwords: false, overrides: { '++': false } }],
    },
    {
      code: '!foo',
      options: [{ nonwords: true, overrides: { '!': false } }],
    },
    {
      code: '!foo',
      options: [{ nonwords: false, overrides: { '!': false } }],
    },
    {
      code: 'new foo',
      options: [{ words: true, overrides: { new: false } }],
    },
    {
      code: 'new foo',
      options: [{ words: false, overrides: { new: false } }],
    },
    {
      code: 'function *foo () { yield(0) }',
      options: [{ words: true, overrides: { yield: false } }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'function *foo () { yield(0) }',
      options: [{ words: false, overrides: { yield: false } }],
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'class C { #x; *foo(bar) { yield#x in bar; } }',
      options: [{ words: false }],
      parserOptions: { ecmaVersion: 2022 },
    },
  ],

  invalid: [
    {
      code: 'delete(foo.bar)',
      output: 'delete (foo.bar)',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'delete' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'delete(foo["bar"]);',
      output: 'delete (foo["bar"]);',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'delete' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'delete (foo.bar)',
      output: 'delete(foo.bar)',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'delete' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'new(Foo)',
      output: 'new (Foo)',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'new' },
        type: 'NewExpression',
      }],
    },
    {
      code: 'new (Foo)',
      output: 'new(Foo)',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'new' },
        type: 'NewExpression',
      }],
    },
    {
      code: 'new(Foo())',
      output: 'new (Foo())',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'new' },
        type: 'NewExpression',
      }],
    },
    {
      code: 'new [foo][0]',
      output: 'new[foo][0]',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'new' },
        type: 'NewExpression',
      }],
    },

    {
      code: 'typeof(foo)',
      output: 'typeof (foo)',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'typeof' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'typeof (foo)',
      output: 'typeof(foo)',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'typeof' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'typeof[foo]',
      output: 'typeof [foo]',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'typeof' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'typeof [foo]',
      output: 'typeof[foo]',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'typeof' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'typeof{foo:true}',
      output: 'typeof {foo:true}',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'typeof' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'typeof {foo:true}',
      output: 'typeof{foo:true}',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'typeof' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'typeof!foo',
      output: 'typeof !foo',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'typeof' },
        type: 'UnaryExpression',
      }],
    },

    {
      code: 'void(0);',
      output: 'void (0);',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'void' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'void(foo);',
      output: 'void (foo);',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'void' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'void[foo];',
      output: 'void [foo];',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'void' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'void{a:0};',
      output: 'void {a:0};',
      options: [{ words: true }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'void' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'void (foo)',
      output: 'void(foo)',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'void' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: 'void [foo]',
      output: 'void[foo]',
      options: [{ words: false }],
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'void' },
        type: 'UnaryExpression',
      }],
    },

    {
      code: '! foo',
      output: '!foo',
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '!' },
      }],
    },
    {
      code: '!foo',
      output: '! foo',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'operator',
        data: { operator: '!' },
      }],
    },

    {
      code: '!! foo',
      output: '!!foo',
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '!' },
        type: 'UnaryExpression',
        line: 1,
        column: 2,
      }],
    },
    {
      code: '!!foo',
      output: '!! foo',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'operator',
        data: { operator: '!' },
        type: 'UnaryExpression',
        line: 1,
        column: 2,
      }],
    },

    {
      code: '- 1',
      output: '-1',
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '-' },
        type: 'UnaryExpression',
      }],
    },
    {
      code: '-1',
      output: '- 1',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'operator',
        data: { operator: '-' },
        type: 'UnaryExpression',
      }],
    },

    {
      code: 'foo++',
      output: 'foo ++',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'beforeUnaryExpressions',
        data: { token: '++' },
      }],
    },
    {
      code: 'foo ++',
      output: 'foo++',
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedBefore',
        data: { operator: '++' },
      }],
    },
    {
      code: '++ foo',
      output: '++foo',
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '++' },
      }],
    },
    {
      code: '++foo',
      output: '++ foo',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'operator',
        data: { operator: '++' },
      }],
    },
    {
      code: 'foo .bar++',
      output: 'foo .bar ++',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'beforeUnaryExpressions',
        data: { token: '++' },
      }],
    },
    {
      code: 'foo.bar --',
      output: 'foo.bar--',
      errors: [{
        messageId: 'unexpectedBefore',
        data: { operator: '--' },
      }],
    },
    {
      code: '+ +foo',
      output: null,
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '+' },
      }],
    },
    {
      code: '+ ++foo',
      output: null,
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '+' },
      }],
    },
    {
      code: '- -foo',
      output: null,
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '-' },
      }],
    },
    {
      code: '- --foo',
      output: null,
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '-' },
      }],
    },
    {
      code: '+ -foo',
      output: '+-foo',
      options: [{ nonwords: false }],
      errors: [{
        messageId: 'unexpectedAfter',
        data: { operator: '+' },
      }],
    },
    {
      code: 'function *foo() { yield(0) }',
      output: 'function *foo() { yield (0) }',
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'yield' },
        type: 'YieldExpression',
        line: 1,
        column: 19,
      }],
    },
    {
      code: 'function *foo() { yield (0) }',
      output: 'function *foo() { yield(0) }',
      options: [{ words: false }],
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'yield' },
        type: 'YieldExpression',
        line: 1,
        column: 19,
      }],
    },
    {
      code: 'function *foo() { yield+0 }',
      output: 'function *foo() { yield +0 }',
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'yield' },
        type: 'YieldExpression',
        line: 1,
        column: 19,
      }],
    },
    {
      code: 'foo++',
      output: 'foo ++',
      options: [{ nonwords: true, overrides: { '++': true } }],
      errors: [{
        messageId: 'beforeUnaryExpressions',
        data: { token: '++' },
      }],
    },
    {
      code: 'foo++',
      output: 'foo ++',
      options: [{ nonwords: false, overrides: { '++': true } }],
      errors: [{
        messageId: 'beforeUnaryExpressions',
        data: { token: '++' },
      }],
    },
    {
      code: '++foo',
      output: '++ foo',
      options: [{ nonwords: true, overrides: { '++': true } }],
      errors: [{
        messageId: 'operator',
        data: { operator: '++' },
      }],
    },
    {
      code: '++foo',
      output: '++ foo',
      options: [{ nonwords: false, overrides: { '++': true } }],
      errors: [{
        messageId: 'operator',
        data: { operator: '++' },
      }],
    },
    {
      code: '!foo',
      output: '! foo',
      options: [{ nonwords: true, overrides: { '!': true } }],
      errors: [{
        messageId: 'operator',
        data: { operator: '!' },
      }],
    },
    {
      code: '!foo',
      output: '! foo',
      options: [{ nonwords: false, overrides: { '!': true } }],
      errors: [{
        messageId: 'operator',
        data: { operator: '!' },
      }],
    },
    {
      code: 'new(Foo)',
      output: 'new (Foo)',
      options: [{ words: true, overrides: { new: true } }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'new' },
      }],
    },
    {
      code: 'new(Foo)',
      output: 'new (Foo)',
      options: [{ words: false, overrides: { new: true } }],
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'new' },
      }],
    },
    {
      code: 'function *foo() { yield(0) }',
      output: 'function *foo() { yield (0) }',
      options: [{ words: true, overrides: { yield: true } }],
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'yield' },
        type: 'YieldExpression',
        line: 1,
        column: 19,
      }],
    },
    {
      code: 'function *foo() { yield(0) }',
      output: 'function *foo() { yield (0) }',
      options: [{ words: false, overrides: { yield: true } }],
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        messageId: 'wordOperator',
        data: { word: 'yield' },
        type: 'YieldExpression',
        line: 1,
        column: 19,
      }],
    },

    {
      code: 'class C { #x; *foo(bar) { yield #x in bar; } }',
      output: 'class C { #x; *foo(bar) { yield#x in bar; } }',
      options: [{ words: false }],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{
        messageId: 'unexpectedAfterWord',
        data: { word: 'yield' },
        type: 'YieldExpression',
        line: 1,
        column: 27,
      }],
    },
  ],
})
