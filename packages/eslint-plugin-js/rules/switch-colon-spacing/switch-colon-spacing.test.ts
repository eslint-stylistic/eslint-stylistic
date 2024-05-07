/**
 * @fileoverview Tests for switch-colon-spacing rule.
 * @author Toru Nagashima
 */

import rule from './switch-colon-spacing'
import { runCases } from '#test'

const expectedBeforeError = { messageId: 'expectedBefore' }
const expectedAfterError = { messageId: 'expectedAfter' }
const unexpectedBeforeError = { messageId: 'unexpectedBefore' }
const unexpectedAfterError = { messageId: 'unexpectedAfter' }

runCases({
  name: 'switch-colon-spacing',
  rule,
  valid: [
    'switch(a){}',
    '({foo:1,bar : 2});',
    'A:foo(); B : foo();',
    'switch(a){case 0: break;}',
    'switch(a){case 0:}',
    'switch(a){case 0\n:\nbreak;}',
    'switch(a){default: break;}',
    'switch(a){default:}',
    'switch(a){default\n:\nbreak;}',
    { code: 'switch(a){case 0:break;}', options: [{ before: false, after: false }] },
    { code: 'switch(a){case 0:}', options: [{ before: false, after: false }] },
    { code: 'switch(a){case 0\n:\nbreak;}', options: [{ before: false, after: false }] },
    { code: 'switch(a){default:break;}', options: [{ before: false, after: false }] },
    { code: 'switch(a){default:}', options: [{ before: false, after: false }] },
    { code: 'switch(a){default\n:\nbreak;}', options: [{ before: false, after: false }] },
    { code: 'switch(a){case 0: break;}', options: [{ before: false, after: true }] },
    { code: 'switch(a){case 0:}', options: [{ before: false, after: true }] },
    { code: 'switch(a){case 0\n:\nbreak;}', options: [{ before: false, after: true }] },
    { code: 'switch(a){default: break;}', options: [{ before: false, after: true }] },
    { code: 'switch(a){default:}', options: [{ before: false, after: true }] },
    { code: 'switch(a){default\n:\nbreak;}', options: [{ before: false, after: true }] },
    { code: 'switch(a){case 0 :break;}', options: [{ before: true, after: false }] },
    { code: 'switch(a){case 0 :}', options: [{ before: true, after: false }] },
    { code: 'switch(a){case 0\n:\nbreak;}', options: [{ before: true, after: false }] },
    { code: 'switch(a){default :break;}', options: [{ before: true, after: false }] },
    { code: 'switch(a){default :}', options: [{ before: true, after: false }] },
    { code: 'switch(a){default\n:\nbreak;}', options: [{ before: true, after: false }] },
    { code: 'switch(a){case 0 : break;}', options: [{ before: true, after: true }] },
    { code: 'switch(a){case 0 :}', options: [{ before: true, after: true }] },
    { code: 'switch(a){case 0\n:\nbreak;}', options: [{ before: true, after: true }] },
    { code: 'switch(a){default : break;}', options: [{ before: true, after: true }] },
    { code: 'switch(a){default :}', options: [{ before: true, after: true }] },
    { code: 'switch(a){default\n:\nbreak;}', options: [{ before: true, after: true }] },
  ],
  invalid: [
    {
      code: 'switch(a){case 0 :break;}',
      output: 'switch(a){case 0: break;}',
      errors: [
        unexpectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){default :break;}',
      output: 'switch(a){default: break;}',
      errors: [
        unexpectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){case 0 : break;}',
      output: 'switch(a){case 0:break;}',
      options: [{ before: false, after: false }],
      errors: [
        unexpectedBeforeError,
        unexpectedAfterError,
      ],
    },
    {
      code: 'switch(a){default : break;}',
      output: 'switch(a){default:break;}',
      options: [{ before: false, after: false }],
      errors: [
        unexpectedBeforeError,
        unexpectedAfterError,
      ],
    },
    {
      code: 'switch(a){case 0 :break;}',
      output: 'switch(a){case 0: break;}',
      options: [{ before: false, after: true }],
      errors: [
        unexpectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){default :break;}',
      output: 'switch(a){default: break;}',
      options: [{ before: false, after: true }],
      errors: [
        unexpectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){case 0: break;}',
      output: 'switch(a){case 0 :break;}',
      options: [{ before: true, after: false }],
      errors: [
        expectedBeforeError,
        unexpectedAfterError,
      ],
    },
    {
      code: 'switch(a){default: break;}',
      output: 'switch(a){default :break;}',
      options: [{ before: true, after: false }],
      errors: [
        expectedBeforeError,
        unexpectedAfterError,
      ],
    },
    {
      code: 'switch(a){case 0:break;}',
      output: 'switch(a){case 0 : break;}',
      options: [{ before: true, after: true }],
      errors: [
        expectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){default:break;}',
      output: 'switch(a){default : break;}',
      options: [{ before: true, after: true }],
      errors: [
        expectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){case 0 /**/ :break;}',
      output: 'switch(a){case 0 /**/ : break;}',
      errors: [
        unexpectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){case 0 :/**/break;}',
      output: 'switch(a){case 0:/**/break;}',
      errors: [
        unexpectedBeforeError,
        expectedAfterError,
      ],
    },
    {
      code: 'switch(a){case (0) :break;}',
      output: 'switch(a){case (0): break;}',
      errors: [
        unexpectedBeforeError,
        expectedAfterError,
      ],
    },
  ],
})
