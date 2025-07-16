/**
 * @fileoverview Operator linebreak rule tests
 * @author Benoît Zugmeyer
 */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './operator-linebreak'

run<RuleOptions, MessageIds>({
  name: 'operator-linebreak',
  rule,

  valid: [
    '1 + 1',
    '1 + 1 + 1',
    '1 +\n1',
    '1 + (1 +\n1)',
    'f(1 +\n1)',
    '1 || 1',
    '1 || \n1',
    'a += 1',
    'var a;',
    'var o = \nsomething',
    'o = \nsomething',
    '\'a\\\n\' +\n \'c\'',
    '\'a\' +\n \'b\\\n\'',
    '(a\n) + b',
    'answer = everything \n?  42 \n:  foo;',
    { code: 'answer = everything ?\n  42 :\n  foo;', options: ['after'] },

    { code: 'a ? 1 + 1\n:2', options: [null, { overrides: { '?': 'after' } }] },
    { code: 'a ?\n1 +\n 1\n:2', options: [null, { overrides: { '?': 'after' } }] },
    { code: 'o = 1 \n+ 1 - foo', options: [null, { overrides: { '+': 'before' } }] },

    { code: '1\n+ 1', options: ['before'] },
    { code: '1 + 1\n+ 1', options: ['before'] },
    { code: 'f(1\n+ 1)', options: ['before'] },
    { code: '1 \n|| 1', options: ['before'] },
    { code: 'a += 1', options: ['before'] },
    { code: 'answer = everything \n?  42 \n:  foo;', options: ['before'] },

    { code: '1 + 1', options: ['none'] },
    { code: '1 + 1 + 1', options: ['none'] },
    { code: '1 || 1', options: ['none'] },
    { code: 'a += 1', options: ['none'] },
    { code: 'var a;', options: ['none'] },
    { code: '\n1 + 1', options: ['none'] },
    { code: '1 + 1\n', options: ['none'] },
    { code: 'answer = everything ? 42 : foo;', options: ['none'] },
    { code: '(a\n) + (\nb)', options: ['none'] },
    { code: 'answer = everything \n?\n 42 : foo;', options: [null, { overrides: { '?': 'ignore' } }] },
    { code: 'answer = everything ? 42 \n:\n foo;', options: [null, { overrides: { ':': 'ignore' } }] },

    {
      code: 'a \n &&= b',
      options: ['after', { overrides: { '&&=': 'ignore' } }],
      parserOptions: { ecmaVersion: 2021 },
    },
    {
      code: 'a ??= \n b',
      options: ['before', { overrides: { '??=': 'ignore' } }],
      parserOptions: { ecmaVersion: 2021 },
    },
    {
      code: 'a ||= \n b',
      options: ['after', { overrides: { '=': 'before' } }],
      parserOptions: { ecmaVersion: 2021 },
    },
    {
      code: 'a \n &&= b',
      options: ['before', { overrides: { '&=': 'after' } }],
      parserOptions: { ecmaVersion: 2021 },
    },
    {
      code: 'a \n ||= b',
      options: ['before', { overrides: { '|=': 'after' } }],
      parserOptions: { ecmaVersion: 2021 },
    },
    {
      code: 'a &&= \n b',
      options: ['after', { overrides: { '&&': 'before' } }],
      parserOptions: { ecmaVersion: 2021 },
    },
    {
      code: 'a ||= \n b',
      options: ['after', { overrides: { '||': 'before' } }],
      parserOptions: { ecmaVersion: 2021 },
    },
    {
      code: 'a ??= \n b',
      options: ['after', { overrides: { '??': 'before' } }],
      parserOptions: { ecmaVersion: 2021 },
    },

    // class fields
    {
      code: 'class C { foo =\n0 }',
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { foo\n= 0 }',
      options: ['before'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { [foo\n]= 0 }',
      options: ['before'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { [foo]\n= 0 }',
      options: ['before'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { [foo\n]\n= 0 }',
      options: ['before'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { [foo\n]= 0 }',
      options: ['after'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { [foo\n]=\n0 }',
      options: ['after'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { [foo\n]= 0 }',
      options: ['none'],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { foo\n=\n0 }',
      options: ['none', { overrides: { '=': 'ignore' } }],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { accessor foo =\n0 }',
    },
    {
      code: 'class C { accessor foo\n= 0 }',
      options: ['before'],
    },
    {
      code: 'class C { accessor [foo\n]= 0 }',
      options: ['before'],
    },
    {
      code: 'class C { accessor [foo]\n= 0 }',
      options: ['before'],
    },
    {
      code: 'class C { accessor [foo\n]\n= 0 }',
      options: ['before'],
    },
    {
      code: 'class C { accessor [foo\n]= 0 }',
      options: ['after'],
    },
    {
      code: 'class C { accessor [foo\n]=\n0 }',
      options: ['after'],
    },
    {
      code: 'class C { accessor [foo\n]= 0 }',
      options: ['none'],
    },
    {
      code: 'class C { accessor foo\n=\n0 }',
      options: ['none', { overrides: { '=': 'ignore' } }],
    },
    // TSImportEqualsDeclaration
    {
      code: $`
        import F1
          = A;
        import F2
          = A.B.C;
        import F3
          = require('mod');
        import F1 = A;
        import F2 = A.B.C;
        import F3 = require('mod');
      `,
      options: ['before'],
    },
    {
      code: $`
        import F1 =
          A;
        import F2 =
          A.B.C;
        import F3 =
          require('mod');
        import F1 = A;
        import F2 = A.B.C;
        import F3 = require('mod');
      `,
      options: ['after'],
    },
    {
      code: $`
        import F1 = A;
        import F2 = A.B.C;
        import F3 = require('mod');
      `,
      options: ['none'],
    },
    // TSTypeAliasDeclaration
    {
      code: $`
        type A
          = string;
        type A = string;
      `,
      options: ['before'],
    },
    {
      code: $`
        type A =
          string;
        type A = string;
      `,
      options: ['after'],
    },
    {
      code: $`
        type A = string;
      `,
      options: ['none'],
    },
    // TSConditionalType
    {
      code: $`
        type A = Foo extends Bar
          ? true
          : false;
        type A = Foo extends Bar ? true : false;
      `,
      options: ['before'],
    },
    {
      code: $`
        type A = Foo extends Bar ?
          true :
          false;
        type A = Foo extends Bar ? true : false;
      `,
      options: ['after'],
    },
    {
      code: $`
        type A = Foo extends Bar ? true : false;
      `,
      options: ['none'],
    },
    // TSIntersectionType
    {
      code: $`
        type A = Foo
          & Bar
          & {};
        type A = Foo & {};
      `,
      options: ['before'],
    },
    {
      code: $`
        type A = Foo &
          Bar &
          {};
        type A = Foo & {};
      `,
      options: ['after'],
    },
    {
      code: $`
        type A = Foo & {};
      `,
      options: ['none'],
    },
    // TSUnionType
    {
      code: $`
        type A = Foo
          | Bar
          | {};
        type A = Foo | {};
      `,
      options: ['before'],
    },
    {
      code: $`
        type A = Foo |
          Bar |
          {};
        type A = Foo | {};
      `,
      options: ['after'],
    },
    {
      code: $`
        type A = Foo | {};
      `,
      options: ['none'],
    },
    // TSTypeParameter
    {
      code: $`
        type Foo<T
          = number> = {
          a: T;
        };
        type Foo<T = number> = {
          a: T;
        };
      `,
      options: ['before'],
    },
    {
      code: $`
        type Foo<T =
          number> = {
          a: T;
        };
        type Foo<T = number> = {
          a: T;
        };
      `,
      options: ['after'],
    },
    {
      code: $`
        type Foo<T = number> = {
          a: T;
        };
      `,
      options: ['none'],
    },
    // TSEnumMember
    {
      code: $`
        enum Foo {
          A,
          B = 2,
          C
            = 4,
        }
      `,
      options: ['before'],
    },
    {
      code: $`
        enum Foo {
          A,
          B = 2,
          C =
            4,
        }
      `,
      options: ['after'],
    },
    {
      code: $`
        enum Foo {
          A,
          B = 2,
        }
      `,
      options: ['none'],
    },
  ],

  invalid: [
    {
      code: '1\n+ 1',
      output: '1 +\n1',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: '1 + 2 \n + 3',
      output: '1 + 2 + \n 3',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 3,
      }],
    },
    {
      code: '1\n+\n1',
      output: '1+\n1',
      errors: [{
        messageId: 'badLinebreak',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: '1 + (1\n+ 1)',
      output: '1 + (1 +\n1)',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'f(1\n+ 1);',
      output: 'f(1 +\n1);',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: '1 \n || 1',
      output: '1 || \n 1',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '||' },
        type: 'LogicalExpression',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 4,
      }],
    },
    {
      code: 'a\n += 1',
      output: 'a +=\n 1',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '+=' },
        type: 'AssignmentExpression',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 4,
      }],
    },
    {
      code: 'var a\n = 1',
      output: 'var a =\n 1',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '=' },
        type: 'VariableDeclarator',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 3,
      }],
    },
    {
      code: '(b)\n*\n(c)',
      output: '(b)*\n(c)',
      errors: [{
        messageId: 'badLinebreak',
        data: { operator: '*' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'answer = everything ?\n  42 :\n  foo;',
      output: 'answer = everything\n  ? 42\n  : foo;',
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '?' },
        type: 'ConditionalExpression',
        line: 1,
        column: 21,
        endLine: 1,
        endColumn: 22,
      }, {
        messageId: 'operatorAtBeginning',
        data: { operator: ':' },
        type: 'ConditionalExpression',
        line: 2,
        column: 6,
        endLine: 2,
        endColumn: 7,
      }],
    },

    {
      code: 'answer = everything \n?  42 \n:  foo;',
      output: 'answer = everything  ? \n42  : \nfoo;',
      options: ['after'],
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '?' },
        type: 'ConditionalExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }, {
        messageId: 'operatorAtEnd',
        data: { operator: ':' },
        type: 'ConditionalExpression',
        line: 3,
        column: 1,
        endLine: 3,
        endColumn: 2,
      }],
    },

    {
      code: '1 +\n1',
      output: '1\n+ 1',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 4,
      }],
    },
    {
      code: 'f(1 +\n1);',
      output: 'f(1\n+ 1);',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 6,
      }],
    },
    {
      code: '1 || \n 1',
      output: '1 \n || 1',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '||' },
        type: 'LogicalExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 5,
      }],
    },
    {
      code: 'a += \n1',
      output: 'a \n+= 1',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '+=' },
        type: 'AssignmentExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 5,
      }],
    },
    {
      code: 'var a = \n1',
      output: 'var a \n= 1',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '=' },
        type: 'VariableDeclarator',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 8,
      }],
    },
    {
      code: 'answer = everything ?\n  42 :\n  foo;',
      output: 'answer = everything\n  ? 42\n  : foo;',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '?' },
        type: 'ConditionalExpression',
        line: 1,
        column: 21,
        endLine: 1,
        endColumn: 22,
      }, {
        messageId: 'operatorAtBeginning',
        data: { operator: ':' },
        type: 'ConditionalExpression',
        line: 2,
        column: 6,
        endLine: 2,
        endColumn: 7,
      }],
    },

    {
      code: '1 +\n1',
      output: '1 +1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 4,
      }],
    },
    {
      code: '1\n+1',
      output: '1+1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'f(1 +\n1);',
      output: 'f(1 +1);',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 6,
      }],
    },
    {
      code: 'f(1\n+ 1);',
      output: 'f(1+ 1);',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: '1 || \n 1',
      output: '1 ||  1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '||' },
        type: 'LogicalExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 5,
      }],
    },
    {
      code: '1 \n || 1',
      output: '1  || 1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '||' },
        type: 'LogicalExpression',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 4,
      }],
    },
    {
      code: 'a += \n1',
      output: 'a += 1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '+=' },
        type: 'AssignmentExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 5,
      }],
    },
    {
      code: 'a \n+= 1',
      output: 'a += 1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '+=' },
        type: 'AssignmentExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 3,
      }],
    },
    {
      code: 'var a = \n1',
      output: 'var a = 1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '=' },
        type: 'VariableDeclarator',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 8,
      }],
    },
    {
      code: 'var a \n = 1',
      output: 'var a  = 1',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '=' },
        type: 'VariableDeclarator',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 3,
      }],
    },
    {
      code: 'answer = everything ?\n  42 \n:  foo;',
      output: 'answer = everything ?  42 :  foo;',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '?' },
        type: 'ConditionalExpression',
        line: 1,
        column: 21,
        endLine: 1,
        endColumn: 22,
      }, {
        messageId: 'noLinebreak',
        data: { operator: ':' },
        type: 'ConditionalExpression',
        line: 3,
        column: 1,
        endLine: 3,
        endColumn: 2,
      }],
    },
    {
      code: 'answer = everything\n?\n42 + 43\n:\nfoo;',
      output: 'answer = everything?42 + 43:foo;',
      options: ['none'],
      errors: [{
        messageId: 'badLinebreak',
        data: { operator: '?' },
        type: 'ConditionalExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }, {
        messageId: 'badLinebreak',
        data: { operator: ':' },
        type: 'ConditionalExpression',
        line: 4,
        column: 1,
        endLine: 4,
        endColumn: 2,
      }],
    },
    {
      code: 'a = b \n  >>> \n c;',
      output: 'a = b   >>> \n c;',
      errors: [{
        messageId: 'badLinebreak',
        data: { operator: '>>>' },
        type: 'BinaryExpression',
        line: 2,
        column: 3,
        endLine: 2,
        endColumn: 6,
      }],
    },
    {
      code: 'foo +=\n42;\nbar -=\n12\n+ 5;',
      output: 'foo +=42;\nbar -=\n12\n+ 5;',
      options: ['after', { overrides: { '+=': 'none', '+': 'before' } }],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '+=' },
        type: 'AssignmentExpression',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 7,
      }],
    },
    {
      code: 'answer = everything\n?\n42\n:\nfoo;',
      output: 'answer = everything\n?\n42\n:foo;',
      options: ['after', { overrides: { '?': 'ignore', ':': 'before' } }],
      errors: [{
        messageId: 'badLinebreak',
        data: { operator: ':' },
        type: 'ConditionalExpression',
        line: 4,
        column: 1,
        endLine: 4,
        endColumn: 2,
      }],
    },
    {

      // Insert an additional space to avoid changing the operator to ++ or --.
      code: 'foo+\n+bar',
      output: 'foo\n+ +bar',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 1,
        column: 4,
        endLine: 1,
        endColumn: 5,
      }],
    },
    {
      code: 'foo //comment\n&& bar',
      output: 'foo && //comment\nbar',
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '&&' },
        type: 'LogicalExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 3,
      }],
    },
    {
      code: 'foo//comment\n+\nbar',
      output: null,
      errors: [{
        messageId: 'badLinebreak',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'foo\n+//comment\nbar',
      output: null,
      options: ['before'],
      errors: [{
        messageId: 'badLinebreak',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'foo /* a */ \n+ /* b */ bar',
      output: null, // Not fixed because there is a comment on both sides
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'foo /* a */ +\n /* b */ bar',
      output: null, // Not fixed because there is a comment on both sides
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '+' },
        type: 'BinaryExpression',
        line: 1,
        column: 13,
        endLine: 1,
        endColumn: 14,
      }],
    },
    {
      code: 'foo ??\n bar',
      output: 'foo\n ?? bar',
      options: ['after', { overrides: { '??': 'before' } }],
      parserOptions: { ecmaVersion: 2020 },
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '??' },
      }],
    },

    {
      code: 'a \n  &&= b',
      output: 'a &&= \n  b',
      options: ['after'],
      parserOptions: { ecmaVersion: 2021 },
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '&&=' },
        type: 'AssignmentExpression',
        line: 2,
        column: 3,
        endLine: 2,
        endColumn: 6,
      }],
    },
    {
      code: 'a ||=\n b',
      output: 'a\n ||= b',
      options: ['before'],
      parserOptions: { ecmaVersion: 2021 },
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '||=' },
        type: 'AssignmentExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 6,
      }],
    },
    {
      code: 'a  ??=\n b',
      output: 'a  ??= b',
      options: ['none'],
      parserOptions: { ecmaVersion: 2021 },
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '??=' },
        type: 'AssignmentExpression',
        line: 1,
        column: 4,
        endLine: 1,
        endColumn: 7,
      }],
    },
    {
      code: 'a \n  &&= b',
      output: 'a   &&= b',
      options: ['before', { overrides: { '&&=': 'none' } }],
      parserOptions: { ecmaVersion: 2021 },
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '&&=' },
        type: 'AssignmentExpression',
        line: 2,
        column: 3,
        endLine: 2,
        endColumn: 6,
      }],
    },
    {
      code: 'a ||=\nb',
      output: 'a\n||= b',
      options: ['after', { overrides: { '||=': 'before' } }],
      parserOptions: { ecmaVersion: 2021 },
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '||=' },
        type: 'AssignmentExpression',
        line: 1,
        column: 3,
        endLine: 1,
        endColumn: 6,
      }],
    },
    {
      code: 'a\n??=b',
      output: 'a??=\nb',
      options: ['none', { overrides: { '??=': 'after' } }],
      parserOptions: { ecmaVersion: 2021 },
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '??=' },
        type: 'AssignmentExpression',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 4,
      }],
    },

    // class fields
    {
      code: 'class C { a\n= 0; }',
      output: 'class C { a =\n0; }',
      options: ['after'],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '=' },
        type: 'PropertyDefinition',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'class C { a =\n0; }',
      output: 'class C { a\n= 0; }',
      options: ['before'],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '=' },
        type: 'PropertyDefinition',
        line: 1,
        column: 13,
        endLine: 1,
        endColumn: 14,
      }],
    },
    {
      code: 'class C { a =\n0; }',
      output: 'class C { a =0; }',
      options: ['none'],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '=' },
        type: 'PropertyDefinition',
        line: 1,
        column: 13,
        endLine: 1,
        endColumn: 14,
      }],
    },
    {
      code: 'class C { [a]\n= 0; }',
      output: 'class C { [a] =\n0; }',
      options: ['after'],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '=' },
        type: 'PropertyDefinition',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'class C { [a] =\n0; }',
      output: 'class C { [a]\n= 0; }',
      options: ['before'],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '=' },
        type: 'PropertyDefinition',
        line: 1,
        column: 15,
        endLine: 1,
        endColumn: 16,
      }],
    },
    {
      code: 'class C { [a]\n =0; }',
      output: 'class C { [a] =0; }',
      options: ['none'],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '=' },
        type: 'PropertyDefinition',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 3,
      }],
    },
    {
      code: 'class C { accessor a\n= 0; }',
      output: 'class C { accessor a =\n0; }',
      options: ['after'],
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '=' },
        type: 'AccessorProperty',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'class C { accessor a =\n0; }',
      output: 'class C { accessor a\n= 0; }',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '=' },
        type: 'AccessorProperty',
        line: 1,
        column: 22,
        endLine: 1,
        endColumn: 23,
      }],
    },
    {
      code: 'class C { accessor a =\n0; }',
      output: 'class C { accessor a =0; }',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '=' },
        type: 'AccessorProperty',
        line: 1,
        column: 22,
        endLine: 1,
        endColumn: 23,
      }],
    },
    {
      code: 'class C { accessor [a]\n= 0; }',
      output: 'class C { accessor [a] =\n0; }',
      options: ['after'],
      errors: [{
        messageId: 'operatorAtEnd',
        data: { operator: '=' },
        type: 'AccessorProperty',
        line: 2,
        column: 1,
        endLine: 2,
        endColumn: 2,
      }],
    },
    {
      code: 'class C { accessor [a] =\n0; }',
      output: 'class C { accessor [a]\n= 0; }',
      options: ['before'],
      errors: [{
        messageId: 'operatorAtBeginning',
        data: { operator: '=' },
        type: 'AccessorProperty',
        line: 1,
        column: 24,
        endLine: 1,
        endColumn: 25,
      }],
    },
    {
      code: 'class C { accessor [a]\n =0; }',
      output: 'class C { accessor [a] =0; }',
      options: ['none'],
      errors: [{
        messageId: 'noLinebreak',
        data: { operator: '=' },
        type: 'AccessorProperty',
        line: 2,
        column: 2,
        endLine: 2,
        endColumn: 3,
      }],
    },
    // TSImportEqualsDeclaration
    {
      code: $`
        import F1 =
          A;
        import F2 =
          A.B.C;
        import F3 =
          require('mod');
      `,
      output: $`
        import F1
          = A;
        import F2
          = A.B.C;
        import F3
          = require('mod');
      `,
      options: ['before'],
      errors: [
        { messageId: 'operatorAtBeginning' },
        { messageId: 'operatorAtBeginning' },
        { messageId: 'operatorAtBeginning' },
      ],
    },
    {
      code: $`
        import F1
          = A;
        import F2
          = A.B.C;
        import F3
          = require('mod');
      `,
      output: $`
        import F1 =
          A;
        import F2 =
          A.B.C;
        import F3 =
          require('mod');
      `,
      options: ['after'],
      errors: [
        { messageId: 'operatorAtEnd' },
        { messageId: 'operatorAtEnd' },
        { messageId: 'operatorAtEnd' },
      ],
    },
    {
      code: $`
        import F1
          = A;
        import F2 =
          A.B.C;
        import F3
          = require('mod');
      `,
      output: $`
        import F1  = A;
        import F2 =  A.B.C;
        import F3  = require('mod');
      `,
      options: ['none'],
      errors: [
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
      ],
    },
    // TSTypeAliasDeclaration
    {
      code: $`
        type A =
          string;
      `,
      output: $`
        type A
          = string;
      `,
      options: ['before'],
      errors: [
        { messageId: 'operatorAtBeginning' },
      ],
    },
    {
      code: $`
        type A
          = string;
      `,
      output: $`
        type A =
          string;
      `,
      errors: [
        { messageId: 'operatorAtEnd' },
      ],
      options: ['after'],
    },
    {
      code: $`
        type A
          = string;
        type A =
          string;
      `,
      output: $`
        type A  = string;
        type A =  string;
      `,
      errors: [
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
      ],
      options: ['none'],
    },
    // TSConditionalType
    {
      code: $`
        type A = Foo extends Bar ?
          true :
          false;
      `,
      output: $`
        type A = Foo extends Bar
          ? true
          : false;
      `,
      errors: [
        { messageId: 'operatorAtBeginning' },
        { messageId: 'operatorAtBeginning' },
      ],
      options: ['before'],
    },
    {
      code: $`
        type A = Foo extends Bar
          ? true
          : false;
      `,
      output: $`
        type A = Foo extends Bar ?
          true :
          false;
      `,
      errors: [
        { messageId: 'operatorAtEnd' },
        { messageId: 'operatorAtEnd' },
      ],
      options: ['after'],
    },
    {
      code: $`
        type A = Foo extends Bar ?
          true :
          false;
      `,
      output: $`
        type A = Foo extends Bar ?  true :  false;
      `,
      errors: [
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
      ],
      options: ['none'],
    },
    // TSIntersectionType
    {
      code: $`
        type A = Foo &
          Bar &
          {};
      `,
      output: $`
        type A = Foo
          & Bar
          & {};
      `,
      options: ['before'],
      errors: [
        { messageId: 'operatorAtBeginning' },
        { messageId: 'operatorAtBeginning' },
      ],
    },
    {
      code: $`
        type A = Foo
          & Bar
          & {};
      `,
      output: $`
        type A = Foo &
          Bar &
          {};
      `,
      options: ['after'],
      errors: [
        { messageId: 'operatorAtEnd' },
        { messageId: 'operatorAtEnd' },
      ],
    },
    {
      code: $`
        type A = Foo &
          Bar
          & {};
      `,
      output: $`
        type A = Foo &  Bar  & {};
      `,
      options: ['none'],
      errors: [
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
      ],
    },
    // TSUnionType
    {
      code: $`
        type A = Foo |
          Bar |
          {};
      `,
      output: $`
        type A = Foo
          | Bar
          | {};
      `,
      options: ['before'],
      errors: [
        { messageId: 'operatorAtBeginning' },
        { messageId: 'operatorAtBeginning' },
      ],
    },
    {
      code: $`
        type A = Foo
          | Bar
          | {};
      `,
      output: $`
        type A = Foo |
          Bar |
          {};
      `,
      options: ['after'],
      errors: [
        { messageId: 'operatorAtEnd' },
        { messageId: 'operatorAtEnd' },
      ],
    },
    {
      code: $`
        type A = Foo |
          Bar
          | {};
      `,
      output: $`
        type A = Foo |  Bar  | {};
      `,
      options: ['none'],
      errors: [
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
      ],
    },
    // TSTypeParameter
    {
      code: $`
        type Foo<T =
          number> = {
          a: T;
        };
      `,
      output: $`
        type Foo<T
          = number> = {
          a: T;
        };
      `,
      options: ['before'],
      errors: [
        { messageId: 'operatorAtBeginning' },
      ],
    },
    {
      code: $`
        type Foo<T
          = number> = {
          a: T;
        };
      `,
      output: $`
        type Foo<T =
          number> = {
          a: T;
        };
      `,
      options: ['after'],
      errors: [
        { messageId: 'operatorAtEnd' },
      ],
    },
    {
      code: $`
        type Foo<T
          = number> = {
          a: T;
        };
        type Foo<T =
          number> = {
          a: T;
        };
      `,
      output: $`
        type Foo<T  = number> = {
          a: T;
        };
        type Foo<T =  number> = {
          a: T;
        };
      `,
      options: ['none'],
      errors: [
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
      ],
    },
    // TSEnumMember
    {
      code: $`
        enum Foo {
          A,
          B = 2,
          C =
            4,
        }
      `,
      output: $`
        enum Foo {
          A,
          B = 2,
          C
            = 4,
        }
      `,
      options: ['before'],
      errors: [
        { messageId: 'operatorAtBeginning' },
      ],
    },
    {
      code: $`
        enum Foo {
          A,
          B = 2,
          C
            = 4,
        }
      `,
      output: $`
        enum Foo {
          A,
          B = 2,
          C =
            4,
        }
      `,
      errors: [
        { messageId: 'operatorAtEnd' },
      ],
      options: ['after'],
    },
    {
      code: $`
        enum Foo {
          A,
          B = 2,
          C
            = 4,
          D =
            6,
        }
      `,
      output: $`
        enum Foo {
          A,
          B = 2,
          C    = 4,
          D =    6,
        }
      `,
      errors: [
        { messageId: 'noLinebreak' },
        { messageId: 'noLinebreak' },
      ],
      options: ['none'],
    },
  ],
})
