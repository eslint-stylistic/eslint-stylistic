import rule from './quote-props'
import { run } from '#test'

run({
  name: 'quote-props',
  rule,
  valid: [
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
