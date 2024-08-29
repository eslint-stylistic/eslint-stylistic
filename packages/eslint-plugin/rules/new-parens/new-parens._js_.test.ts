/**
 * @fileoverview Tests for new-parens rule.
 * @author Ilya Volodin
 */

import tsParser from '@typescript-eslint/parser'
import rule from './new-parens._js_'
import { run } from '#test'

const error = { messageId: 'missing', type: 'NewExpression' }
const neverError = { messageId: 'unnecessary', type: 'NewExpression' }

run({
  name: 'new-parens',
  rule,
  lang: 'js',
  valid: [

    // Default (Always)
    'var a = new Date();',
    'var a = new Date(function() {});',
    'var a = new (Date)();',
    'var a = new ((Date))();',
    'var a = (new Date());',
    'var a = new foo.Bar();',
    'var a = (new Foo()).bar;',
    {
      code: 'new Storage<RootState>(\'state\');',
      parser: tsParser,
    },

    // Explicit Always
    { code: 'var a = new Date();', options: ['always'] },
    { code: 'var a = new foo.Bar();', options: ['always'] },
    { code: 'var a = (new Foo()).bar;', options: ['always'] },

    // Never
    { code: 'var a = new Date;', options: ['never'] },
    { code: 'var a = new Date(function() {});', options: ['never'] },
    { code: 'var a = new (Date);', options: ['never'] },
    { code: 'var a = new ((Date));', options: ['never'] },
    { code: 'var a = (new Date);', options: ['never'] },
    { code: 'var a = new foo.Bar;', options: ['never'] },
    { code: 'var a = (new Foo).bar;', options: ['never'] },
    { code: 'var a = new Person(\'Name\')', options: ['never'] },
    { code: 'var a = new Person(\'Name\', 12)', options: ['never'] },
    { code: 'var a = new ((Person))(\'Name\');', options: ['never'] },
  ],
  invalid: [

    // Default (Always)
    {
      code: 'var a = new Date;',
      output: 'var a = new Date();',
      errors: [error],
    },
    {
      code: 'var a = new Date',
      output: 'var a = new Date()',
      errors: [error],
    },
    {
      code: 'var a = new (Date);',
      output: 'var a = new (Date)();',
      errors: [error],
    },
    {
      code: 'var a = new (Date)',
      output: 'var a = new (Date)()',
      errors: [error],
    },
    {
      code: 'var a = (new Date)',
      output: 'var a = (new Date())',
      errors: [error],
    },
    {

      // This `()` is `CallExpression`'s. This is a call of the result of `new Date`.
      code: 'var a = (new Date)()',
      output: 'var a = (new Date())()',
      errors: [error],
    },
    {
      code: 'var a = new foo.Bar;',
      output: 'var a = new foo.Bar();',
      errors: [error],
    },
    {
      code: 'var a = (new Foo).bar;',
      output: 'var a = (new Foo()).bar;',
      errors: [error],
    },

    // Explicit always
    {
      code: 'var a = new Date;',
      output: 'var a = new Date();',
      options: ['always'],
      errors: [error],
    },
    {
      code: 'var a = new foo.Bar;',
      output: 'var a = new foo.Bar();',
      options: ['always'],
      errors: [error],
    },
    {
      code: 'var a = (new Foo).bar;',
      output: 'var a = (new Foo()).bar;',
      options: ['always'],
      errors: [error],
    },
    {
      code: 'var a = new new Foo()',
      output: 'var a = new new Foo()()',
      options: ['always'],
      errors: [error],
    },

    // Never
    {
      code: 'var a = new Date();',
      output: 'var a = (new Date);',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = new Date()',
      output: 'var a = (new Date)',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = new (Date)();',
      output: 'var a = (new (Date));',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = new (Date)()',
      output: 'var a = (new (Date))',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = (new Date())',
      output: 'var a = ((new Date))',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = (new Date())()',
      output: 'var a = ((new Date))()',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = new foo.Bar();',
      output: 'var a = (new foo.Bar);',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = (new Foo()).bar;',
      output: 'var a = ((new Foo)).bar;',
      options: ['never'],
      errors: [neverError],
    },
    {
      code: 'var a = new new Foo()',
      output: 'var a = new (new Foo)',
      options: ['never'],
      errors: [neverError],
    },
  ],
})
