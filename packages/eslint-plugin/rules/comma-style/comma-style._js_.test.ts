/**
 * @fileoverview Comma style
 * @author Vignesh Anand aka vegetableman
 */

import type { RuleOptions } from './types'
import { $, run } from '#test'
import rule from '.'

run<RuleOptions>({
  name: 'comma-style',
  rule,

  valid: [
    'var foo = 1, bar = 3;',
    'var foo = {\'a\': 1, \'b\': 2};',
    'var foo = [1, 2];',
    'var foo = [, 2];',
    'var foo = [1, ];',
    'var foo = [\'apples\', \n \'oranges\'];',
    'var foo = {\'a\': 1, \n \'b\': 2, \n\'c\': 3};',
    'var foo = {\'a\': 1, \n \'b\': 2, \'c\':\n 3};',
    'var foo = {\'a\': 1, \n \'b\': 2, \'c\': [{\'d\': 1}, \n {\'e\': 2}, \n {\'f\': 3}]};',
    'var foo = [1, \n2, \n3];',
    'function foo(){var a=[1,\n 2]}',
    'function foo(){return {\'a\': 1,\n\'b\': 2}}',
    'var foo = \n1, \nbar = \n2;',
    'var foo = [\n(bar),\nbaz\n];',
    'var foo = [\n(bar\n),\nbaz\n];',
    'var foo = [\n(\nbar\n),\nbaz\n];',
    { code: 'new Foo(a\n,b);', options: ['last', { exceptions: { NewExpression: true } }] },
    { code: 'var foo = [\n(bar\n)\n,baz\n];', options: ['first'] },
    'var foo = \n1, \nbar = [1,\n2,\n3]',
    { code: 'var foo = [\'apples\'\n,\'oranges\'];', options: ['first'] },
    { code: 'var foo = 1, bar = 2;', options: ['first'] },
    { code: 'var foo = 1 \n ,bar = 2;', options: ['first'] },
    { code: 'var foo = {\'a\': 1 \n ,\'b\': 2 \n,\'c\': 3};', options: ['first'] },
    { code: 'var foo = [1 \n ,2 \n, 3];', options: ['first'] },
    { code: 'function foo(){return {\'a\': 1\n,\'b\': 2}}', options: ['first'] },
    { code: 'function foo(){var a=[1\n, 2]}', options: ['first'] },
    { code: 'new Foo(a,\nb);', options: ['first', { exceptions: { NewExpression: true } }] },
    { code: 'f(1\n, 2);', options: ['last', { exceptions: { CallExpression: true } }] },
    { code: 'function foo(a\n, b) { return a + b; }', options: ['last', { exceptions: { FunctionDeclaration: true } }] },
    {
      code: 'var a = \'a\',\no = \'o\';',
      options: ['first', { exceptions: { VariableDeclaration: true } }],
    },
    {
      code: 'var arr = [\'a\',\n\'o\'];',
      options: ['first', { exceptions: { ArrayExpression: true } }],
    },
    {
      code: 'var obj = {a: \'a\',\nb: \'b\'};',
      options: ['first', { exceptions: { ObjectExpression: true } }],
    },
    {
      code: 'var a = \'a\',\no = \'o\',\narr = [1,\n2];',
      options: ['first', { exceptions: { VariableDeclaration: true, ArrayExpression: true } }],
    },
    {
      code: 'var ar ={fst:1,\nsnd: [1,\n2]};',
      options: ['first', { exceptions: { ArrayExpression: true, ObjectExpression: true } }],
    },
    {
      code: 'var a = \'a\',\nar ={fst:1,\nsnd: [1,\n2]};',
      options: ['first', {
        exceptions: {
          ArrayExpression: true,
          ObjectExpression: true,
          VariableDeclaration: true,
        },
      }],
    },
    {
      code: 'const foo = (a\n, b) => { return a + b; }',
      options: ['last', { exceptions: { ArrowFunctionExpression: true } }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'function foo([a\n, b]) { return a + b; }',
      options: ['last', { exceptions: { ArrayPattern: true } }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'const foo = ([a\n, b]) => { return a + b; }',
      options: ['last', { exceptions: { ArrayPattern: true } }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'import { a\n, b } from \'./source\';',
      options: ['last', { exceptions: { ImportDeclaration: true } }],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: 'const foo = function (a\n, b) { return a + b; }',
      options: ['last', { exceptions: { FunctionExpression: true } }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'var {foo\n, bar} = {foo:\'apples\', bar:\'oranges\'};',
      options: ['last', { exceptions: { ObjectPattern: true } }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'var {foo\n, bar} = {foo:\'apples\', bar:\'oranges\'};',
      options: ['first', {
        exceptions: {
          ObjectPattern: true,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'new Foo(a,\nb);',
      options: ['first', {
        exceptions: {
          NewExpression: true,
        },
      }],
    },
    {
      code: 'f(1\n, 2);',
      options: ['last', {
        exceptions: {
          CallExpression: true,
        },
      }],
    },
    {
      code: 'function foo(a\n, b) { return a + b; }',
      options: ['last', {
        exceptions: {
          FunctionDeclaration: true,
        },
      }],
    },
    {
      code: 'const foo = function (a\n, b) { return a + b; }',
      options: ['last', {
        exceptions: {
          FunctionExpression: true,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'function foo([a\n, b]) { return a + b; }',
      options: ['last', {
        exceptions: {
          ArrayPattern: true,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'const foo = (a\n, b) => { return a + b; }',
      options: ['last', {
        exceptions: {
          ArrowFunctionExpression: true,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'const foo = ([a\n, b]) => { return a + b; }',
      options: ['last', {
        exceptions: {
          ArrayPattern: true,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'import { a\n, b } from \'./source\';',
      options: ['last', {
        exceptions: {
          ImportDeclaration: true,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    {
      code: 'var {foo\n, bar} = {foo:\'apples\', bar:\'oranges\'};',
      options: ['last', {
        exceptions: {
          ObjectPattern: true,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'new Foo(a,\nb);',
      options: ['last', {
        exceptions: {
          NewExpression: false,
        },
      }],
    },
    {
      code: 'new Foo(a\n,b);',
      options: ['last', {
        exceptions: {
          NewExpression: true,
        },
      }],
    },
    'var foo = [\n , \n 1, \n 2 \n];',
    {
      code: 'const [\n , \n , \n a, \n b, \n] = arr;',
      options: ['last', {
        exceptions: {
          ArrayPattern: false,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'const [\n ,, \n a, \n b, \n] = arr;',
      options: ['last', {
        exceptions: {
          ArrayPattern: false,
        },
      }],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'const arr = [\n 1 \n , \n ,2 \n]',
      options: ['first'],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      code: 'const arr = [\n ,\'fifi\' \n]',
      options: ['first'],
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    {
      // exception
      code: $`
        import {
          A,
          B
          , C
        } from 'module3' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
        import 'module4' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
      `,
      options: ['last', { exceptions: { ImportDeclaration: true } }],
    },
    {
      // exception
      code: $`
        let a, b, c;
        export {
          a,
          b
          , c
        };
        export {
          A,
          B
          , C
        } from 'module1' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
        export * from 'module2' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
      `,
      options: ['last', { exceptions: { ExportAllDeclaration: true, ExportNamedDeclaration: true } }],
    },
    {
      // exception
      code: $`
        import(
          a,
          b
        );
        import(
          c
          , d
        );
      `,
      options: ['first', { exceptions: { ImportExpression: true } }],
    },
    {
      code: $`
        import(
          a,
        );
        import(
          b, c,
        );
      `,
      options: ['last', { exceptions: { ImportExpression: false } }],
    },
    {
      code: $`
        import(
          a
        ,);
        import(
          b, c
        ,);
      `,
      options: ['first', { exceptions: { ImportExpression: false } }],
    },
    {
      // exception
      code: $`
        const x = (
          a,
          b
          , c
        );
      `,
      options: ['first', { exceptions: { SequenceExpression: true } }],
    },
    {
      // exception
      code: $`
        class MyClass implements
          A,
          B
        , C {
        }
        const a = class implements
          A,
          B
        , C {
        }
      `,
      options: ['first', { exceptions: { ClassDeclaration: true, ClassExpression: true } }],
    },
    {
      // exception
      code: $`
        function f(
          a,
          b
          , c
        )
        type a = (
          a,
          b
          , c
        ) => r
        type a = new (
          a,
          b
          , c
        ) => r
        abstract class Base {
          f(
            a,
            b
            , c
          );
        }
      `,
      options: ['first', {
        exceptions: {
          TSDeclareFunction: true,
          TSFunctionType: true,
          TSConstructorType: true,
          TSEmptyBodyFunctionExpression: true,
        },
      }],
    },
    {
      // exception
      code: $`
        enum MyEnum {
          A,
          B
          , C
        }
      `,
      options: ['first', { exceptions: { TSEnumBody: true } }],
    },
    {
      // exception
      code: $`
        type foo = {
          a: string,
          b: string
          , c: string
        }
      `,
      options: ['first', { exceptions: { TSTypeLiteral: true } }],
    },
    {
      // exception
      code: $`
        type foo = {
          new (
            a,
            b
            , c
          ): any,
          (
            a,
            b
            , c
          ): any,
          [
            a: string,
            b: string
            , c: string
          ]: string,
        
          f(
            a: string,
            b: string
            , c: string
          ): number,
        }
      `,
      options: ['first', {
        exceptions: {
          TSTypeLiteral: true,
          TSCallSignatureDeclaration: true,
          TSConstructSignatureDeclaration: true,
          TSIndexSignature: true,
          TSMethodSignature: true,
        },
      }],
    },
    {
      // exception
      code: $`
        interface Foo extends
          A,
          B
          , C
        {
          a: string,
          b: string
          , c: string
        }
      `,
      options: ['first', { exceptions: { TSInterfaceBody: true, TSInterfaceDeclaration: true } }],
    },
    {
      // exception
      code: $`
        type Foo = [
          "A",
          "B"
          , "C"
        ];
      `,
      options: ['first', { exceptions: { TSTupleType: true } }],
    },
    {
      // exception
      code: $`
        type Foo<
          A,
          B
          , C
        > = Bar<
          A,
          B
          , C
        >;
      `,
      options: ['first', { exceptions: { TSTypeParameterDeclaration: true, TSTypeParameterInstantiation: true } }],
    },
  ],

  invalid: [
    {
      code: 'var foo = { a: 1. //comment \n, b: 2\n}',
      output: 'var foo = { a: 1., //comment \n b: 2\n}',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'var foo = { a: 1. //comment \n //comment1 \n //comment2 \n, b: 2\n}',
      output: 'var foo = { a: 1., //comment \n //comment1 \n //comment2 \n b: 2\n}',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'var foo = 1\n,\nbar = 2;',
      output: 'var foo = 1,\nbar = 2;',
      errors: [{
        messageId: 'unexpectedLineBeforeAndAfterComma',
      }],
    },
    {
      code: 'var foo = 1 //comment\n,\nbar = 2;',
      output: 'var foo = 1, //comment\nbar = 2;',
      errors: [{
        messageId: 'unexpectedLineBeforeAndAfterComma',
      }],
    },
    {
      code: 'var foo = 1 //comment\n, // comment 2\nbar = 2;',
      output: 'var foo = 1, //comment // comment 2\nbar = 2;',
      errors: [{
        messageId: 'unexpectedLineBeforeAndAfterComma',
      }],
    },
    {
      code: 'new Foo(a\n,\nb);',
      output: 'new Foo(a,\nb);',
      errors: [{ messageId: 'unexpectedLineBeforeAndAfterComma' }],
    },
    {
      code: 'var foo = 1\n,bar = 2;',
      output: 'var foo = 1,\nbar = 2;',
      errors: [{
        messageId: 'expectedCommaLast',
        column: 1,
        endColumn: 2,
      }],
    },
    {
      code: 'f([1,2\n,3]);',
      output: 'f([1,2,\n3]);',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'f([1,2\n,]);',
      output: 'f([1,2,\n]);',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'f([,2\n,3]);',
      output: 'f([,2,\n3]);',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'var foo = [\'apples\'\n, \'oranges\'];',
      output: 'var foo = [\'apples\',\n \'oranges\'];',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'var [foo\n, bar] = [\'apples\', \'oranges\'];',
      output: 'var [foo,\n bar] = [\'apples\', \'oranges\'];',
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'f(1\n, 2);',
      output: 'f(1,\n 2);',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'function foo(a\n, b) { return a + b; }',
      output: 'function foo(a,\n b) { return a + b; }',
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'const foo = function (a\n, b) { return a + b; }',
      output: 'const foo = function (a,\n b) { return a + b; }',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'function foo([a\n, b]) { return a + b; }',
      output: 'function foo([a,\n b]) { return a + b; }',
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'const foo = (a\n, b) => { return a + b; }',
      output: 'const foo = (a,\n b) => { return a + b; }',
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'const foo = ([a\n, b]) => { return a + b; }',
      output: 'const foo = ([a,\n b]) => { return a + b; }',
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'import { a\n, b } from \'./source\';',
      output: 'import { a,\n b } from \'./source\';',
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
      },
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'var {foo\n, bar} = {foo:\'apples\', bar:\'oranges\'};',
      output: 'var {foo,\n bar} = {foo:\'apples\', bar:\'oranges\'};',
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        messageId: 'expectedCommaLast',
      }],
    },
    {
      code: 'var foo = 1,\nbar = 2;',
      output: 'var foo = 1\n,bar = 2;',
      options: ['first'],
      errors: [{
        messageId: 'expectedCommaFirst',
        column: 12,
        endColumn: 13,
      }],
    },
    {
      code: 'f([1,\n2,3]);',
      output: 'f([1\n,2,3]);',
      options: ['first'],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var foo = [\'apples\', \n \'oranges\'];',
      output: 'var foo = [\'apples\' \n ,\'oranges\'];',
      options: ['first'],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var foo = {\'a\': 1, \n \'b\': 2\n ,\'c\': 3};',
      output: 'var foo = {\'a\': 1 \n ,\'b\': 2\n ,\'c\': 3};',
      options: ['first'],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var a = \'a\',\no = \'o\',\narr = [1,\n2];',
      output: 'var a = \'a\',\no = \'o\',\narr = [1\n,2];',
      options: ['first', { exceptions: { VariableDeclaration: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var a = \'a\',\nobj = {a: \'a\',\nb: \'b\'};',
      output: 'var a = \'a\',\nobj = {a: \'a\'\n,b: \'b\'};',
      options: ['first', { exceptions: { VariableDeclaration: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var a = \'a\',\nobj = {a: \'a\',\nb: \'b\'};',
      output: 'var a = \'a\'\n,obj = {a: \'a\',\nb: \'b\'};',
      options: ['first', { exceptions: { ObjectExpression: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var a = \'a\',\narr = [1,\n2];',
      output: 'var a = \'a\'\n,arr = [1,\n2];',
      options: ['first', { exceptions: { ArrayExpression: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var ar =[1,\n{a: \'a\',\nb: \'b\'}];',
      output: 'var ar =[1,\n{a: \'a\'\n,b: \'b\'}];',
      options: ['first', { exceptions: { ArrayExpression: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var ar =[1,\n{a: \'a\',\nb: \'b\'}];',
      output: 'var ar =[1\n,{a: \'a\',\nb: \'b\'}];',
      options: ['first', { exceptions: { ObjectExpression: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var ar ={fst:1,\nsnd: [1,\n2]};',
      output: 'var ar ={fst:1,\nsnd: [1\n,2]};',
      options: ['first', { exceptions: { ObjectExpression: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'var ar ={fst:1,\nsnd: [1,\n2]};',
      output: 'var ar ={fst:1\n,snd: [1,\n2]};',
      options: ['first', { exceptions: { ArrayExpression: true } }],
      errors: [{
        messageId: 'expectedCommaFirst',
      }],
    },
    {
      code: 'new Foo(a,\nb);',
      output: 'new Foo(a\n,b);',
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }],
    },
    {
      code: 'var foo = [\n(bar\n)\n,\nbaz\n];',
      output: 'var foo = [\n(bar\n),\nbaz\n];',
      errors: [{
        messageId: 'unexpectedLineBeforeAndAfterComma',
        column: 1,
        endColumn: 2,
      }],
    },
    {
      code: '[(foo),\n,\nbar]',
      output: '[(foo),,\nbar]',
      errors: [{ messageId: 'unexpectedLineBeforeAndAfterComma' }],
    },
    {
      code: 'new Foo(a\n,b);',
      output: 'new Foo(a,\nb);',
      errors: [{ messageId: 'expectedCommaLast' }],
    },
    {
      code: '[\n[foo(3)],\n,\nbar\n];',
      output: '[\n[foo(3)],,\nbar\n];',
      errors: [{ messageId: 'unexpectedLineBeforeAndAfterComma' }],
    },
    {

      // https://github.com/eslint/eslint/issues/10632
      code: '[foo//\n,/*block\ncomment*/];',
      output: '[foo,//\n/*block\ncomment*/];',
      errors: [{ messageId: 'unexpectedLineBeforeAndAfterComma' }],
    },
    {
      code: $`
        import {
          A,
          B
          , C
        } from 'module3' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
        import 'module4' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
      `,
      output: $`
        import {
          A,
          B,
           C
        } from 'module3' with {
          a: 'v',
          b: 'v',
           c: 'v'
        };
        import 'module4' with {
          a: 'v',
          b: 'v',
           c: 'v'
        };
      `,
      errors: [
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
      ],
    },
    {
      code: $`
        import {
          A,
          B
          , C
        } from 'module3' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
        import 'module4' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
      `,
      output: $`
        import {
          A
          ,B
          , C
        } from 'module3' with {
          a: 'v'
          ,b: 'v'
          , c: 'v'
        };
        import 'module4' with {
          a: 'v'
          ,b: 'v'
          , c: 'v'
        };
      `,
      options: ['first'],
      errors: [
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
      ],
    },
    {
      code: $`
        let a, b, c;
        export {
          a,
          b
          , c
        };
        export {
          A,
          B
          , C
        } from 'module1' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
        export * from 'module2' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
      `,
      output: $`
        let a, b, c;
        export {
          a,
          b,
           c
        };
        export {
          A,
          B,
           C
        } from 'module1' with {
          a: 'v',
          b: 'v',
           c: 'v'
        };
        export * from 'module2' with {
          a: 'v',
          b: 'v',
           c: 'v'
        };
      `,
      errors: [
        { messageId: 'expectedCommaLast', line: 5 },
        { messageId: 'expectedCommaLast', line: 10 },
        { messageId: 'expectedCommaLast', line: 14 },
        { messageId: 'expectedCommaLast', line: 19 },
      ],
    },
    {
      code: $`
        let a, b, c;
        export {
          a,
          b
          , c
        };
        export {
          A,
          B
          , C
        } from 'module1' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
        export * from 'module2' with {
          a: 'v',
          b: 'v'
          , c: 'v'
        };
      `,
      output: $`
        let a, b, c;
        export {
          a
          ,b
          , c
        };
        export {
          A
          ,B
          , C
        } from 'module1' with {
          a: 'v'
          ,b: 'v'
          , c: 'v'
        };
        export * from 'module2' with {
          a: 'v'
          ,b: 'v'
          , c: 'v'
        };
      `,
      options: ['first'],
      errors: [
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
      ],
    },
    {
      code: $`
        const x = (
          a,
          b
          , c
        );
      `,
      output: $`
        const x = (
          a,
          b,
           c
        );
      `,
      errors: [{ messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        const x = (
          a,
          b
          , c
        );
      `,
      output: $`
        const x = (
          a
          ,b
          , c
        );
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }],
    },
    {
      code: $`
        import(
          a,
          b
        );
        import(
          c
          , d
        );
      `,
      output: $`
        import(
          a,
          b
        );
        import(
          c,
           d
        );
      `,
      errors: [{ messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        import(
          a,
          b
        );
        import(
          c
          , d
        );
      `,
      output: $`
        import(
          a
          ,b
        );
        import(
          c
          , d
        );
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }],
    },
    {
      code: $`
        class MyClass implements
          A,
          B
        , C {
        }
        const a = class implements
          A,
          B
        , C {
        }
      `,
      output: $`
        class MyClass implements
          A,
          B,
         C {
        }
        const a = class implements
          A,
          B,
         C {
        }
      `,
      errors: [{ messageId: 'expectedCommaLast' }, { messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        class MyClass implements
          A,
          B
        , C {
        }
        const a = class implements
          A,
          B
        , C {
        }
      `,
      output: $`
        class MyClass implements
          A
          ,B
        , C {
        }
        const a = class implements
          A
          ,B
        , C {
        }
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }, { messageId: 'expectedCommaFirst' }],
    },
    {
      code: $`
        function f(
          a,
          b
          , c
        )
        type a = (
          a,
          b
          , c
        ) => r
        type a = new (
          a,
          b
          , c
        ) => r
        abstract class Base {
          f(
            a,
            b
            , c
          );
        }
      `,
      output: $`
        function f(
          a,
          b,
           c
        )
        type a = (
          a,
          b,
           c
        ) => r
        type a = new (
          a,
          b,
           c
        ) => r
        abstract class Base {
          f(
            a,
            b,
             c
          );
        }
      `,
      errors: [
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
      ],
    },
    {
      code: $`
        function f(
          a,
          b
          , c
        )
        type a = (
          a,
          b
          , c
        ) => r
        type a = new (
          a,
          b
          , c
        ) => r
        abstract class Base {
          f(
            a,
            b
            , c
          );
        }
      `,
      output: $`
        function f(
          a
          ,b
          , c
        )
        type a = (
          a
          ,b
          , c
        ) => r
        type a = new (
          a
          ,b
          , c
        ) => r
        abstract class Base {
          f(
            a
            ,b
            , c
          );
        }
      `,
      options: ['first'],
      errors: [
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
      ],
    },
    {
      code: $`
        enum MyEnum {
          A,
          B
          , C
        }
      `,
      output: $`
        enum MyEnum {
          A,
          B,
           C
        }
      `,
      errors: [{ messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        enum MyEnum {
          A,
          B
          , C
        }
      `,
      output: $`
        enum MyEnum {
          A
          ,B
          , C
        }
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }],
    },
    {
      code: $`
        type foo = {
          a: string,
          b: string
          , c: string
        }
      `,
      output: $`
        type foo = {
          a: string,
          b: string,
           c: string
        }
      `,
      errors: [{ messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        type foo = {
          a: string,
          b: string
          , c: string
        }
      `,
      output: $`
        type foo = {
          a: string
          ,b: string
          , c: string
        }
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }],
    },
    {
      code: $`
        type foo = {
          new (
            a,
            b
            , c
          ): any,
          (
            a,
            b
            , c
          ): any,
          [
            a: string,
            b: string
            , c: string
          ]: string,
        
          f(
            a: string,
            b: string
            , c: string
          ): number,
        }
      `,
      output: $`
        type foo = {
          new (
            a,
            b,
             c
          ): any,
          (
            a,
            b,
             c
          ): any,
          [
            a: string,
            b: string,
             c: string
          ]: string,
        
          f(
            a: string,
            b: string,
             c: string
          ): number,
        }
      `,
      errors: [
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
      ],
    },
    {
      code: $`
        type foo = {
          new (
            a,
            b
            , c
          ): any,
          (
            a,
            b
            , c
          ): any,
          [
            a: string,
            b: string
            , c: string
          ]: string,
        
          f(
            a: string,
            b: string
            , c: string
          ): number,
        }
      `,
      output: $`
        type foo = {
          new (
            a
            ,b
            , c
          ): any
          ,(
            a
            ,b
            , c
          ): any
          ,[
            a: string
            ,b: string
            , c: string
          ]: string
        
          ,f(
            a: string
            ,b: string
            , c: string
          ): number
        ,}
      `,
      options: ['first'],
      errors: [
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
      ],
    },
    {
      code: $`
        interface Foo extends
          A,
          B
          , C
        {
          a: string,
          b: string
          , c: string
        }
      `,
      output: $`
        interface Foo extends
          A,
          B,
           C
        {
          a: string,
          b: string,
           c: string
        }
      `,
      errors: [
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
      ],
    },
    {
      code: $`
        interface Foo extends
          A,
          B
          , C
        {
          a: string,
          b: string
          , c: string
        }
      `,
      output: $`
        interface Foo extends
          A
          ,B
          , C
        {
          a: string
          ,b: string
          , c: string
        }
      `,
      options: ['first'],
      errors: [
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
      ],
    },
    {
      code: $`
        type Foo = [
          "A",
          "B"
          , "C"
        ];
      `,
      output: $`
        type Foo = [
          "A",
          "B",
           "C"
        ];
      `,
      errors: [{ messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        type Foo = [
          "A",
          "B"
          , "C"
        ];
      `,
      output: $`
        type Foo = [
          "A"
          ,"B"
          , "C"
        ];
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }],
    },
    {
      code: $`
        type Foo<
          A,
          B
          , C
        > = Bar<
          A,
          B
          , C
        >;
      `,
      output: $`
        type Foo<
          A,
          B,
           C
        > = Bar<
          A,
          B,
           C
        >;
      `,
      errors: [{ messageId: 'expectedCommaLast' }, { messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        type Foo<
          A,
          B
          , C
        > = Bar<
          A,
          B
          , C
        >;
      `,
      output: $`
        type Foo<
          A
          ,B
          , C
        > = Bar<
          A
          ,B
          , C
        >;
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }, { messageId: 'expectedCommaFirst' }],
    },

    {
      code: $`
        import a
          , {Foo} from 'module'
        import b
          , {} from 'module'
        import c,
          {Bar} from 'module'
        import d,
          {} from 'module'
      `,
      output: $`
        import a,
           {Foo} from 'module'
        import b,
           {} from 'module'
        import c,
          {Bar} from 'module'
        import d,
          {} from 'module'
      `,
      options: ['last', { exceptions: { ImportDeclaration: false } }],
      errors: [
        { messageId: 'expectedCommaLast' },
        { messageId: 'expectedCommaLast' },
      ],
    },
    {
      code: $`
        import a
          , {Foo} from 'module'
        import b
          , {} from 'module'
        import c,
          {Bar} from 'module'
        import d,
          {} from 'module'
      `,
      output: $`
        import a
          , {Foo} from 'module'
        import b
          , {} from 'module'
        import c
          ,{Bar} from 'module'
        import d
          ,{} from 'module'
      `,
      options: ['first', { exceptions: { ImportDeclaration: false } }],
      errors: [
        { messageId: 'expectedCommaFirst' },
        { messageId: 'expectedCommaFirst' },
      ],
    },
    {
      code: $`
        const x = {a,b
        ,}
      `,
      output: $`
        const x = {a,b,
        }
      `,
      options: ['last'],
      errors: [
        { messageId: 'expectedCommaLast' },
      ],
    },
    {
      code: $`
        const x = {a,b,
        }
      `,
      output: $`
        const x = {a,b
        ,}
      `,
      options: ['first'],
      errors: [
        { messageId: 'expectedCommaFirst' },
      ],
    },
    {
      code: $`
        const x = [,
          (a),
          (b),
          (c),
        ]
        const y = [
          ,(a)
          ,(b)
          ,(c)
          ,]
      `,
      output: $`
        const x = [,
          (a),
          (b),
          (c),
        ]
        const y = [
          ,(a),
          (b),
          (c),
          ]
      `,
      options: ['last'],
      errors: [{ messageId: 'expectedCommaLast' }, { messageId: 'expectedCommaLast' }, { messageId: 'expectedCommaLast' }],
    },
    {
      code: $`
        const x = [,
          (a),
          (b),
          (c),
        ]
        const y = [
          ,(a)
          ,(b)
          ,(c)
          ,]
      `,
      output: $`
        const x = [,
          (a)
          ,(b)
          ,(c)
        ,]
        const y = [
          ,(a)
          ,(b)
          ,(c)
          ,]
      `,
      options: ['first'],
      errors: [{ messageId: 'expectedCommaFirst' }, { messageId: 'expectedCommaFirst' }, { messageId: 'expectedCommaFirst' }],
    },
  ],
})
