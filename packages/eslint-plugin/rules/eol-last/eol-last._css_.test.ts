import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './eol-last'

run<RuleOptions, MessageIds>({
  lang: 'css',
  name: 'eol-last',
  rule,

  valid: [
    '',
    '\n',
    'a {}\n',
    'a {}\n\n',
    'a {}\n   \n',

    '\r\n',
    'a {}\r\n',
    'a {}\r\n\r\n',
    'a {}\r\n   \r\n',

    { code: 'a {}', options: ['never'] },
    { code: 'a {}\ndiv {}', options: ['never'] },
    { code: 'a {}\r\ndiv {}', options: ['never'] },
  ],

  invalid: [
    {
      code: 'a {}',
      output: 'a {}\n',
      errors: [{
        messageId: 'missing',
        line: 1,
        column: 5,
      }],
    },
    {
      code: 'a {}\n   ',
      output: 'a {}\n   \n',
      errors: [{
        messageId: 'missing',
        line: 2,
        column: 4,
      }],
    },
    {
      code: 'a {}\n',
      output: 'a {}',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        line: 1,
        column: 5,
        endLine: 2,
        endColumn: 1,
      }],
    },
    {
      code: 'a {}\r\n',
      output: 'a {}',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        line: 1,
        column: 5,
        endLine: 2,
        endColumn: 1,
      }],
    },
    {
      code: 'a {}\r\n\r\n',
      output: 'a {}',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        line: 2,
        column: 1,
        endLine: 3,
        endColumn: 1,
      }],
    },
    {
      code: 'a {}\ndiv {}\n',
      output: 'a {}\ndiv {}',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        line: 2,
        column: 7,
        endLine: 3,
        endColumn: 1,
      }],
    },
    {
      code: 'a {}\r\ndiv {}\r\n',
      output: 'a {}\r\ndiv {}',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        line: 2,
        column: 7,
        endLine: 3,
        endColumn: 1,
      }],
    },
    {
      code: 'a {}\n\n',
      output: 'a {}',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        line: 2,
        column: 1,
        endLine: 3,
        endColumn: 1,
      }],
    },
  ],
})
