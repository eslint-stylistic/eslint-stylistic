/**
 * @fileoverview Tests for yield-star-spacing rule.
 * @author Bryan Smith
 */

import type { TestCaseError } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from '.'

const missingBeforeError: TestCaseError<MessageIds> = { messageId: 'missingBefore', type: 'Punctuator' }
const missingAfterError: TestCaseError<MessageIds> = { messageId: 'missingAfter', type: 'Punctuator' }
const unexpectedBeforeError: TestCaseError<MessageIds> = { messageId: 'unexpectedBefore', type: 'Punctuator' }
const unexpectedAfterError: TestCaseError<MessageIds> = { messageId: 'unexpectedAfter', type: 'Punctuator' }

run<RuleOptions, MessageIds>({
  name: 'yield-star-spacing',
  rule,

  valid: [

    // default (after)
    'function *foo(){ yield foo; }',
    'function *foo(){ yield* foo; }',

    // after
    {
      code: 'function *foo(){ yield foo; }',
      options: ['after'],
    },
    {
      code: 'function *foo(){ yield* foo; }',
      options: ['after'],
    },
    {
      code: 'function *foo(){ yield* foo(); }',
      options: ['after'],
    },
    {
      code: 'function *foo(){ yield* 0 }',
      options: ['after'],
    },
    {
      code: 'function *foo(){ yield* []; }',
      options: ['after'],
    },
    {
      code: 'function *foo(){ var result = yield* foo(); }',
      options: ['after'],
    },
    {
      code: 'function *foo(){ var result = yield* (foo()); }',
      options: ['after'],
    },

    // before
    {
      code: 'function *foo(){ yield foo; }',
      options: ['before'],
    },
    {
      code: 'function *foo(){ yield *foo; }',
      options: ['before'],
    },
    {
      code: 'function *foo(){ yield *foo(); }',
      options: ['before'],
    },
    {
      code: 'function *foo(){ yield *0 }',
      options: ['before'],
    },
    {
      code: 'function *foo(){ yield *[]; }',
      options: ['before'],
    },
    {
      code: 'function *foo(){ var result = yield *foo(); }',
      options: ['before'],
    },

    // both
    {
      code: 'function *foo(){ yield foo; }',
      options: ['both'],
    },
    {
      code: 'function *foo(){ yield * foo; }',
      options: ['both'],
    },
    {
      code: 'function *foo(){ yield * foo(); }',
      options: ['both'],
    },
    {
      code: 'function *foo(){ yield * 0 }',
      options: ['both'],
    },
    {
      code: 'function *foo(){ yield * []; }',
      options: ['both'],
    },
    {
      code: 'function *foo(){ var result = yield * foo(); }',
      options: ['both'],
    },

    // neither
    {
      code: 'function *foo(){ yield foo; }',
      options: ['neither'],
    },
    {
      code: 'function *foo(){ yield*foo; }',
      options: ['neither'],
    },
    {
      code: 'function *foo(){ yield*foo(); }',
      options: ['neither'],
    },
    {
      code: 'function *foo(){ yield*0 }',
      options: ['neither'],
    },
    {
      code: 'function *foo(){ yield*[]; }',
      options: ['neither'],
    },
    {
      code: 'function *foo(){ var result = yield*foo(); }',
      options: ['neither'],
    },

    // object option
    {
      code: 'function *foo(){ yield* foo; }',
      options: [{ before: false, after: true }],
    },
    {
      code: 'function *foo(){ yield *foo; }',
      options: [{ before: true, after: false }],
    },
    {
      code: 'function *foo(){ yield * foo; }',
      options: [{ before: true, after: true }],
    },
    {
      code: 'function *foo(){ yield*foo; }',
      options: [{ before: false, after: false }],
    },
  ],

  invalid: [

    // default (after)
    {
      code: 'function *foo(){ yield *foo1; }',
      output: 'function *foo(){ yield* foo1; }',
      errors: [unexpectedBeforeError, missingAfterError],
    },

    // after
    {
      code: 'function *foo(){ yield *foo1; }',
      output: 'function *foo(){ yield* foo1; }',
      options: ['after'],
      errors: [unexpectedBeforeError, missingAfterError],
    },
    {
      code: 'function *foo(){ yield * foo; }',
      output: 'function *foo(){ yield* foo; }',
      options: ['after'],
      errors: [unexpectedBeforeError],
    },
    {
      code: 'function *foo(){ yield*foo2; }',
      output: 'function *foo(){ yield* foo2; }',
      options: ['after'],
      errors: [missingAfterError],
    },

    // before
    {
      code: 'function *foo(){ yield* foo; }',
      output: 'function *foo(){ yield *foo; }',
      options: ['before'],
      errors: [missingBeforeError, unexpectedAfterError],
    },
    {
      code: 'function *foo(){ yield * foo; }',
      output: 'function *foo(){ yield *foo; }',
      options: ['before'],
      errors: [unexpectedAfterError],
    },
    {
      code: 'function *foo(){ yield*foo; }',
      output: 'function *foo(){ yield *foo; }',
      options: ['before'],
      errors: [missingBeforeError],
    },

    // both
    {
      code: 'function *foo(){ yield* foo; }',
      output: 'function *foo(){ yield * foo; }',
      options: ['both'],
      errors: [missingBeforeError],
    },
    {
      code: 'function *foo(){ yield *foo3; }',
      output: 'function *foo(){ yield * foo3; }',
      options: ['both'],
      errors: [missingAfterError],
    },
    {
      code: 'function *foo(){ yield*foo4; }',
      output: 'function *foo(){ yield * foo4; }',
      options: ['both'],
      errors: [missingBeforeError, missingAfterError],
    },

    // neither
    {
      code: 'function *foo(){ yield* foo; }',
      output: 'function *foo(){ yield*foo; }',
      options: ['neither'],
      errors: [unexpectedAfterError],
    },
    {
      code: 'function *foo(){ yield *foo; }',
      output: 'function *foo(){ yield*foo; }',
      options: ['neither'],
      errors: [unexpectedBeforeError],
    },
    {
      code: 'function *foo(){ yield * foo; }',
      output: 'function *foo(){ yield*foo; }',
      options: ['neither'],
      errors: [unexpectedBeforeError, unexpectedAfterError],
    },

    // object option
    {
      code: 'function *foo(){ yield*foo; }',
      output: 'function *foo(){ yield* foo; }',
      options: [{ before: false, after: true }],
      errors: [missingAfterError],
    },
    {
      code: 'function *foo(){ yield * foo; }',
      output: 'function *foo(){ yield *foo; }',
      options: [{ before: true, after: false }],
      errors: [unexpectedAfterError],
    },
    {
      code: 'function *foo(){ yield*foo; }',
      output: 'function *foo(){ yield * foo; }',
      options: [{ before: true, after: true }],
      errors: [missingBeforeError, missingAfterError],
    },
    {
      code: 'function *foo(){ yield * foo; }',
      output: 'function *foo(){ yield*foo; }',
      options: [{ before: false, after: false }],
      errors: [unexpectedBeforeError, unexpectedAfterError],
    },
  ],

})
