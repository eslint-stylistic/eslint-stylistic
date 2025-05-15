/**
 * @fileoverview Tests for no-tabs rule
 * @author Gyandeep Singh
 */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from '.'

run<RuleOptions, MessageIds>({
  name: 'no-tabs',
  rule,
  valid: [
    'function test(){\n}',
    {
      code: $`
        function test(){
          //   sdfdsf 
        }
      `,
    },
    {
      code: '\tdoSomething();',
      options: [{ allowIndentationTabs: true }],
    },
    {
      code: '\t// comment',
      options: [{ allowIndentationTabs: true }],
    },
  ],
  invalid: [
    {
      code: 'function test(){\t}',
      output: 'function test(){    }',
      options: [{ tabSize: 4 }],
      errors: [{
        messageId: 'unexpectedTab',
        line: 1,
        column: 17,
        endLine: 1,
        endColumn: 18,
      }],
    },
    {
      code: 'function test(){\t}',
      output: 'function test(){\t}',
      options: [{ tabSize: false }],
      errors: [{
        messageId: 'unexpectedTab',
        line: 1,
        column: 17,
        endLine: 1,
        endColumn: 18,
      }],
    },
    {
      code: '/** \t comment test */',
      output: '/**      comment test */',
      options: [{ tabSize: 4 }],
      errors: [{
        messageId: 'unexpectedTab',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 6,
      }],
    },
    {
      code: $`
        function test(){
          //\tsdfdsf
        }
      `,
      output: $`
        function test(){
          //    sdfdsf
        }
      `,
      options: [{ tabSize: 4 }],
      errors: [{
        messageId: 'unexpectedTab',
        line: 2,
        column: 5,
        endLine: 2,
        endColumn: 6,
      }],
    },
    {
      code: $`
        function\ttest(){
          //sdfdsf
        }
      `,
      output: $`
        function    test(){
          //sdfdsf
        }
      `,
      options: [{ tabSize: 4 }],
      errors: [{
        messageId: 'unexpectedTab',
        line: 1,
        column: 9,
        endLine: 1,
        endColumn: 10,
      }],
    },
    {
      code: $`
        function test(){
          //\tsdfdsf
        \t}
      `,
      output: $`
        function test(){
          //    sdfdsf
            }
      `,
      options: [{ tabSize: 4 }],
      errors: [
        {
          messageId: 'unexpectedTab',
          line: 2,
          column: 5,
          endLine: 2,
          endColumn: 6,
        },
        {
          messageId: 'unexpectedTab',
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 2,
        },
      ],
    },
    {
      code: '\t// Comment with leading tab \t and inline tab',
      output: '\t// Comment with leading tab      and inline tab',
      options: [{ allowIndentationTabs: true, tabSize: 4 }],
      errors: [{
        messageId: 'unexpectedTab',
        line: 1,
        column: 30,
        endLine: 1,
        endColumn: 31,
      }],
    },
    {
      code: '\t\ta =\t\t\tb +\tc\t\t;\t\t',
      output: '    a =      b +  c    ;    ',
      options: [{ tabSize: 2 }],
      errors: [
        {
          messageId: 'unexpectedTab',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 3,
        },
        {
          messageId: 'unexpectedTab',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 9,
        },
        {
          messageId: 'unexpectedTab',
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 13,
        },
        {
          messageId: 'unexpectedTab',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 16,
        },
        {
          messageId: 'unexpectedTab',
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
  ],
})
