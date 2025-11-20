/**
 * @fileoverview Tests for new-parens rule.
 * @author Ilya Volodin
 */

import type { InvalidTestCaseBase, TestCaseError, ValidTestCaseBase } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import tsParser from '@typescript-eslint/parser'
import rule from './new-parens'

const error: TestCaseError<MessageIds> = { messageId: 'missing' }
const neverError: TestCaseError<MessageIds> = { messageId: 'unnecessary' }

function makeAnonClassesTests<T extends 'pass' | 'fail'>(mode: T): (T extends 'pass' ? ValidTestCaseBase<RuleOptions> : InvalidTestCaseBase<RuleOptions, MessageIds>)[] {
  type TestCase = InvalidTestCaseBase<RuleOptions, MessageIds>
  const withParens = [
    'var a = new class extends Base {}();',
    'var a = new class {}();',
    'var a = new class Derived extends Base {}();',
  ]
  const withParensTs = [
    'var a = new class Derived extends Base implements IFoo {}() as OtherType;',
  ]
  const withoutParens = [
    'var a = new class extends Base {};',
    'var a = new class {};',
    'var a = new class Derived extends Base {};',
  ]
  const withoutParensTs = [
    'var a = new class Derived extends Base implements IFoo {} as OtherType;',
  ]
  const ret: TestCase[] = []
  let makeWithParensCases = (code: string, extraOpts: Partial<TestCase> = {}) => {
    extraOpts.code = code
    if (mode === 'fail') {
      extraOpts.errors = [error]
    }
    ret.push(
      {
        code,
        options: ['always', { overrides: { anonymousClasses: 'always' } }],
        ...extraOpts,
      },
      {
        code,
        options: ['never', { overrides: { anonymousClasses: 'always' } }],
        ...extraOpts,
      },
      {
        code,
        ...extraOpts,
      },
    )
  }
  let makeWithoutParensCases = (code: string, extraOpts: Partial<TestCase> = {}) => {
    if (mode === 'fail') {
      extraOpts.errors = [neverError]
    }
    ret.push(
      {
        code,
        options: ['always', { overrides: { anonymousClasses: 'never' } }],
        ...extraOpts,
      },
      {
        code,
        options: ['never', { overrides: { anonymousClasses: 'never' } }],
        ...extraOpts,
      },
      {
        code,
        options: ['never'],
        ...extraOpts,
      },
    )
  }
  if (mode === 'fail') {
    [makeWithParensCases, makeWithoutParensCases] = [makeWithoutParensCases, makeWithParensCases]
  }
  for (const code of withParens) {
    makeWithParensCases(code)
  }
  for (const code of withParensTs) {
    makeWithParensCases(code, { parser: tsParser })
  }
  for (const code of withoutParens) {
    makeWithoutParensCases(code)
  }
  for (const code of withoutParensTs) {
    makeWithoutParensCases(code, { parser: tsParser })
  }
  return ret as any[]
}

run<RuleOptions, MessageIds>({
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
    // anonymousClasses tests
    ...makeAnonClassesTests('pass'),
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

    ...makeAnonClassesTests('fail'),
  ],
})
