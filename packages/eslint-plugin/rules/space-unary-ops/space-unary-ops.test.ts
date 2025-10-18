/**
 * @fileoverview This rule should require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './space-unary-ops'

run<RuleOptions, MessageIds>({
  name: 'space-unary-ops',
  rule,

  valid: [
    {
      code: 'foo.bar --',
      options: [{ nonwords: true }],
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
      code: $`
        a!.b!.c
        !a.b.c
      `,
      options: [{ nonwords: false }],
    },
    {
      code: $`
        a !.b !.c
        ! a.b.c
      `,
      options: [{ nonwords: true }],
    },
  ],

  invalid: [

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
        messageId: 'requireAfter',
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
        line: 1,
        column: 2,
      }],
    },
    {
      code: '!!foo',
      output: '!! foo',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'requireAfter',
        data: { operator: '!' },
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
      }],
    },
    {
      code: '-1',
      output: '- 1',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'requireAfter',
        data: { operator: '-' },
      }],
    },

    {
      code: 'foo++',
      output: 'foo ++',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'requireBefore',
        data: { operator: '++' },
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
        messageId: 'requireAfter',
        data: { operator: '++' },
      }],
    },
    {
      code: 'foo .bar++',
      output: 'foo .bar ++',
      options: [{ nonwords: true }],
      errors: [{
        messageId: 'requireBefore',
        data: { operator: '++' },
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
      code: 'foo++',
      output: 'foo ++',
      options: [{ nonwords: true, overrides: { '++': true } }],
      errors: [{
        messageId: 'requireBefore',
        data: { operator: '++' },
      }],
    },
    {
      code: 'foo++',
      output: 'foo ++',
      options: [{ nonwords: false, overrides: { '++': true } }],
      errors: [{
        messageId: 'requireBefore',
        data: { operator: '++' },
      }],
    },
    {
      code: '++foo',
      output: '++ foo',
      options: [{ nonwords: true, overrides: { '++': true } }],
      errors: [{
        messageId: 'requireAfter',
        data: { operator: '++' },
      }],
    },
    {
      code: '++foo',
      output: '++ foo',
      options: [{ nonwords: false, overrides: { '++': true } }],
      errors: [{
        messageId: 'requireAfter',
        data: { operator: '++' },
      }],
    },
    {
      code: '!foo',
      output: '! foo',
      options: [{ nonwords: true, overrides: { '!': true } }],
      errors: [{
        messageId: 'requireAfter',
        data: { operator: '!' },
      }],
    },
    {
      code: '!foo',
      output: '! foo',
      options: [{ nonwords: false, overrides: { '!': true } }],
      errors: [{
        messageId: 'requireAfter',
        data: { operator: '!' },
      }],
    },
    {
      code: 'const w = func()!',
      output: 'const w = func() !',
      options: [{ nonwords: false, overrides: { '!': true } }],
      errors: [
        { messageId: 'requireBefore', data: { operator: '!' } },
      ],
    },
    {
      code: 'a  !  .b  !  .c',
      output: 'a!  .b!  .c',
      options: [{ nonwords: false }],
      errors: [
        { messageId: 'unexpectedBefore', data: { operator: '!' } },
        { messageId: 'unexpectedBefore', data: { operator: '!' } },
      ],
    },
  ],
})
