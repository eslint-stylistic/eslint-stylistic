/**
 * @fileoverview Tests for eol-last rule.
 * @author Nodeca Team <https://github.com/nodeca>
 */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './eol-last'

run<RuleOptions, MessageIds>({
  name: 'eol-last',
  rule,

  valid: [
    '',
    '\n',
    'var a = 123;\n',
    'var a = 123;\n\n',
    'var a = 123;\n   \n',

    '\r\n',
    'var a = 123;\r\n',
    'var a = 123;\r\n\r\n',
    'var a = 123;\r\n   \r\n',

    { code: 'var a = 123;', options: ['never'] },
    { code: 'var a = 123;\nvar b = 456;', options: ['never'] },
    { code: 'var a = 123;\r\nvar b = 456;', options: ['never'] },

    // Deprecated: `"unix"` parameter
    { code: '', options: ['unix'] },
    { code: '\n', options: ['unix'] },
    { code: 'var a = 123;\n', options: ['unix'] },
    { code: 'var a = 123;\n\n', options: ['unix'] },
    { code: 'var a = 123;\n   \n', options: ['unix'] },

    // Deprecated: `"windows"` parameter
    { code: '', options: ['windows'] },
    { code: '\n', options: ['windows'] },
    { code: '\r\n', options: ['windows'] },
    { code: 'var a = 123;\r\n', options: ['windows'] },
    { code: 'var a = 123;\r\n\r\n', options: ['windows'] },
    { code: 'var a = 123;\r\n   \r\n', options: ['windows'] },
  ],

  invalid: [
    {
      code: 'var a = 123;',
      output: 'var a = 123;\n',
      errors: [{
        messageId: 'missing',
        type: 'Program',
        line: 1,
        column: 13,
      }],
    },
    {
      code: 'var a = 123;\n   ',
      output: 'var a = 123;\n   \n',
      errors: [{
        messageId: 'missing',
        type: 'Program',
        line: 2,
        column: 4,
      }],
    },
    {
      code: 'var a = 123;\n',
      output: 'var a = 123;',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        type: 'Program',
        line: 1,
        column: 13,
        endLine: 2,
        endColumn: 1,
      }],
    },
    {
      code: 'var a = 123;\r\n',
      output: 'var a = 123;',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        type: 'Program',
        line: 1,
        column: 13,
        endLine: 2,
        endColumn: 1,
      }],
    },
    {
      code: 'var a = 123;\r\n\r\n',
      output: 'var a = 123;',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        type: 'Program',
        line: 2,
        column: 1,
        endLine: 3,
        endColumn: 1,
      }],
    },
    {
      code: 'var a = 123;\nvar b = 456;\n',
      output: 'var a = 123;\nvar b = 456;',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        type: 'Program',
        line: 2,
        column: 13,
        endLine: 3,
        endColumn: 1,
      }],
    },
    {
      code: 'var a = 123;\r\nvar b = 456;\r\n',
      output: 'var a = 123;\r\nvar b = 456;',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        type: 'Program',
        line: 2,
        column: 13,
        endLine: 3,
        endColumn: 1,
      }],
    },
    {
      code: 'var a = 123;\n\n',
      output: 'var a = 123;',
      options: ['never'],
      errors: [{
        messageId: 'unexpected',
        type: 'Program',
        line: 2,
        column: 1,
        endLine: 3,
        endColumn: 1,
      }],
    },

    // Deprecated: `"unix"` parameter
    {
      code: 'var a = 123;',
      output: 'var a = 123;\n',
      options: ['unix'],
      errors: [{
        messageId: 'missing',
        type: 'Program',
        line: 1,
        column: 13,
      }],
    },
    {
      code: 'var a = 123;\n   ',
      output: 'var a = 123;\n   \n',
      options: ['unix'],
      errors: [{
        messageId: 'missing',
        type: 'Program',
        line: 2,
        column: 4,

      }],
    },

    // Deprecated: `"windows"` parameter
    {
      code: 'var a = 123;',
      output: 'var a = 123;\r\n',
      options: ['windows'],
      errors: [{
        messageId: 'missing',
        type: 'Program',
        line: 1,
        column: 13,
      }],
    },
    {
      code: 'var a = 123;\r\n   ',
      output: 'var a = 123;\r\n   \r\n',
      options: ['windows'],
      errors: [{
        messageId: 'missing',
        type: 'Program',
        line: 2,
        column: 4,
      }],
    },
  ],
})
