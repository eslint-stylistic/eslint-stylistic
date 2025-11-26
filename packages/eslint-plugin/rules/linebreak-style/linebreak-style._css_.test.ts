import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './linebreak-style'

run<RuleOptions, MessageIds>({
  lang: 'css',
  name: 'linebreak-style',
  rule,

  valid: [
    'a {}\n div {}\n\n span {\n /* do stuff */ \n }\n',
    {
      code: 'a {}\n div {}\n\n span {\n /* do stuff */ \n }\n',
      options: ['unix'],
    },
    {
      code: 'a {}\r\n div {}\r\n\r\n span {\r\n /* do stuff */ \r\n }\r\n',
      options: ['windows'],
    },
    {
      code: 'a {}',
      options: ['unix'],
    },
    {
      code: 'a {}',
      options: ['windows'],
    },
  ],

  invalid: [
    {
      code: 'a {}\r\n',
      output: 'a {}\n',
      errors: [{
        line: 1,
        column: 5,
        endLine: 2,
        endColumn: 1,
        messageId: 'expectedLF',
      }],
    },
    {
      code: 'a {}\r\n',
      output: 'a {}\n',
      options: ['unix'],
      errors: [{
        line: 1,
        column: 5,
        endLine: 2,
        endColumn: 1,
        messageId: 'expectedLF',
      }],
    },
    {
      code: 'a {}\n',
      output: 'a {}\r\n',
      options: ['windows'],
      errors: [{
        line: 1,
        column: 5,
        endLine: 2,
        endColumn: 1,
        messageId: 'expectedCRLF',
      }],
    },
    {
      code: 'a {}\n div {}\n\n span {\r\n /* do stuff */ \n }\r\n',
      output: 'a {}\n div {}\n\n span {\n /* do stuff */ \n }\n',
      errors: [{
        line: 4,
        column: 8,
        endLine: 5,
        endColumn: 1,
        messageId: 'expectedLF',
      }, {
        line: 6,
        column: 3,
        endLine: 7,
        endColumn: 1,
        messageId: 'expectedLF',
      }],
    },
    {
      code: 'a {}\r\n div {}\r\n\n span {\r\n\n /* do stuff */ \n }\r\n',
      output: 'a {}\r\n div {}\r\n\r\n span {\r\n\r\n /* do stuff */ \r\n }\r\n',
      options: ['windows'],
      errors: [{
        line: 3,
        column: 1,
        endLine: 4,
        endColumn: 1,
        messageId: 'expectedCRLF',
      }, {
        line: 5,
        column: 1,
        endLine: 6,
        endColumn: 1,
        messageId: 'expectedCRLF',
      }, {
        line: 6,
        column: 17,
        endLine: 7,
        endColumn: 1,
        messageId: 'expectedCRLF',
      }],
    },
    {
      code: '\r\n',
      output: '\n',
      options: ['unix'],
      errors: [{
        line: 1,
        column: 1,
        endLine: 2,
        endColumn: 1,
        messageId: 'expectedLF',
      }],
    },
    {
      code: '\n',
      output: '\r\n',
      options: ['windows'],
      errors: [{
        line: 1,
        column: 1,
        endLine: 2,
        endColumn: 1,
        messageId: 'expectedCRLF',
      }],
    },
  ],
})
