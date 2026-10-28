import type { InvalidTestCase, ValidTestCase } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './quote-props'

const conciseMethods = [
  {
    code: 'const x = { foo<T>(value: T): T { return value } }',
    output: 'const x = { "foo"<T>(value: T): T { return value } }',
    options: ['always', { ignoreConciseMethods: false }],
    errors: [{ messageId: 'unquotedPropertyFound' }],
  },
  {
    code: 'const x = { "foo"(value: number): number { return value } }',
    output: 'const x = { foo(value: number): number { return value } }',
    options: ['as-needed', { ignoreConciseMethods: false }],
    errors: [{ messageId: 'unnecessarilyQuotedProperty' }],
  },
  {
    code: 'const x = { foo(): void {}, "bar": 0 }',
    output: 'const x = { "foo"(): void {}, "bar": 0 }',
    options: ['consistent', { ignoreConciseMethods: false }],
    errors: [{ messageId: 'inconsistentlyQuotedProperty' }],
  },
  {
    code: 'const x = { "foo-bar"(): void {}, bar(): void {} }',
    output: 'const x = { "foo-bar"(): void {}, "bar"(): void {} }',
    options: ['consistent-as-needed', { ignoreConciseMethods: false }],
    errors: [{ messageId: 'inconsistentlyQuotedProperty' }],
  },
  {
    code: 'const x = { "foo"(): void {}, "bar"(): void {} }',
    output: 'const x = { foo(): void {}, bar(): void {} }',
    options: ['consistent-as-needed', { ignoreConciseMethods: false }],
    errors: [{ messageId: 'redundantQuoting' }, { messageId: 'redundantQuoting' }],
  },
] satisfies InvalidTestCase<RuleOptions, MessageIds>[]

run<RuleOptions, MessageIds>({
  name: 'quote-props',
  rule,
  valid: [
    // The shared runner does not re-lint fixed output by default.
    ...conciseMethods.map(({ output, options }) => ({ code: output, options })),
    'const x = { foo(): void {} }',
    { code: 'const x = { foo(): void {} }', options: ['always', { ignoreConciseMethods: true }] },
    { code: 'type x = { "foo"(): void }; interface y { "bar"(): void }', options: ['as-needed', { ignoreConciseMethods: false }] },
    ...(['always', 'as-needed', 'consistent', 'consistent-as-needed'] as const).map<ValidTestCase<RuleOptions>>(mode => ({
      code: 'type x = { foo(): void }; interface y { bar(): void }; class C { foo(): void {} "bar"(): void {} }',
      options: [mode, { ignoreConciseMethods: false }],
    })),
    'type x = { "a": 1, b(): void, "c"(): void }',
    'interface x { "a": 1, b(): void, "c"(): void }',
    'enum x { "a" }',

    { code: 'type x = { a: 1, "b-b": 1 }', options: ['as-needed'] },
    { code: 'interface x { a: 1, "b-b": 1 }', options: ['as-needed'] },
    { code: 'enum x { a = 1, "b-b" = 2 }', options: ['as-needed'] },

    { code: 'type x = { "a": 1, "b-b": 1 }', options: ['consistent-as-needed'] },
    { code: 'interface x { "a": 1, "b-b": 1 }', options: ['consistent-as-needed'] },
    { code: 'enum x { "a" = 1, "b-b" = 2 }', options: ['consistent-as-needed'] },
  ],
  invalid: [
    ...conciseMethods,
    {
      code: 'type x = { a: 1 }',
      output: 'type x = { "a": 1 }',
      errors: [{ messageId: 'unquotedPropertyFound' }],
    },
    {
      code: 'interface x { a: 1 }',
      output: 'interface x { "a": 1 }',
      errors: [{ messageId: 'unquotedPropertyFound' }],
    },
    {
      code: 'enum x { a = 1 }',
      output: 'enum x { "a" = 1 }',
      errors: [{ messageId: 'unquotedPropertyFound' }],
    },

    {
      code: 'type x = { "a": 1 }',
      output: 'type x = { a: 1 }',
      options: ['as-needed'],
      errors: [{ messageId: 'unnecessarilyQuotedProperty' }],
    },
    {
      code: 'interface x { "a": 1, "b-b": 1 }',
      output: 'interface x { a: 1, "b-b": 1 }',
      options: ['as-needed'],
      errors: [{ messageId: 'unnecessarilyQuotedProperty' }],
    },
    {
      code: 'enum x { "a" = 1, "b-b" = 2 }',
      output: 'enum x { a = 1, "b-b" = 2 }',
      options: ['as-needed'],
      errors: [{ messageId: 'unnecessarilyQuotedProperty' }],
    },

    {
      code: 'type x = { a: 1, "b-b": 1 }',
      output: 'type x = { "a": 1, "b-b": 1 }',
      options: ['consistent-as-needed'],
      errors: [{ messageId: 'inconsistentlyQuotedProperty' }],
    },
    {
      code: 'interface x { a: 1, "b-b": 1 }',
      output: 'interface x { "a": 1, "b-b": 1 }',
      options: ['consistent-as-needed'],
      errors: [{ messageId: 'inconsistentlyQuotedProperty' }],
    },
    {
      code: 'enum x { a = 1, "b-b" = 2 }',
      output: 'enum x { "a" = 1, "b-b" = 2 }',
      options: ['consistent-as-needed'],
      errors: [{ messageId: 'inconsistentlyQuotedProperty' }],
    },
  ],
})
