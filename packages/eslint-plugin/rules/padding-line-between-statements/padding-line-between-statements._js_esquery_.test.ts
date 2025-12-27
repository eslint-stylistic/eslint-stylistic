/**
 * @fileoverview Tests for padding-line-between-statements rule.
 * @author Toru Nagashima
 */

import type { InvalidTestCase, ValidTestCase } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './padding-line-between-statements'

run<RuleOptions, MessageIds>({
  name: 'padding-line-between-statements',
  rule,
  lang: 'js',
  valid: [
    // ----------------------------------------------------------------------
    // wildcard
    // ----------------------------------------------------------------------

    {
      code: 'if(a){}\n\n;[].map(b)',
      options: [
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
        { blankLine: 'never', prev: 'EmptyStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // cjs-export
    // ----------------------------------------------------------------------

    {
      code: 'module.exports=1',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"]', next: '*' },
      ],
    },
    {
      code: 'module.exports=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"]', next: '*' },
      ],
    },
    {
      code: 'module.exports.foo=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"]', next: '*' },
      ],
    },
    {
      code: 'exports.foo=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"]', next: '*' },
      ],
    },
    {
      code: 'm.exports=1\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"]', next: '*' },
      ],
    },
    {
      code: 'module.foo=1\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"]', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // cjs-import
    // ----------------------------------------------------------------------

    {
      code: 'foo=require("foo")\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[declarations.0.init.type="CallExpression"][declarations.0.init.callee.name="require"]', next: '*' },
      ],
    },
    {
      code: 'const foo=a.require("foo")\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[declarations.0.init.type="CallExpression"][declarations.0.init.callee.name="require"]', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // directive
    // ----------------------------------------------------------------------

    {
      code: '"use strict"\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: 'function foo(){"use strict"\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: '(function foo(){"use strict"\n\nfoo()})',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: '(()=>{"use strict"\n\nfoo()})',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: '\'use strict\'\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: 'foo("use strict")\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: '`use strict`\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: '("use strict")\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: '\'use \'+\'strict\'\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: 'foo()\n"use strict"\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },
    {
      code: '{"use strict"\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // block
    // ----------------------------------------------------------------------

    {
      code: '{}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BlockStatement', next: '*' },
      ],
    },
    {
      code: '{\n}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BlockStatement', next: '*' },
      ],
    },
    {
      code: '{\nfoo()\n}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BlockStatement', next: '*' },
      ],
    },
    {
      code: 'if(a){}\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BlockStatement', next: '*' },
      ],
    },
    {
      code: 'a={}\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BlockStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // empty
    // ----------------------------------------------------------------------

    {
      code: ';\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'EmptyStatement', next: '*' },
      ],
    },
    {
      code: '1;\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'EmptyStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // expression
    // ----------------------------------------------------------------------

    {
      code: 'foo()\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },
    {
      code: 'a=b+c\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },
    {
      code: 'var a=1\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },
    {
      code: '\'use strict\'\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // break
    // ----------------------------------------------------------------------

    {
      code: 'A:{break A\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BreakStatement', next: '*' },
      ],
    },
    {
      code: 'while(a){break\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BreakStatement', next: '*' },
      ],
    },
    {
      code: 'switch(a){case 0:break\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BreakStatement', next: '*' },
      ],
    },
    {
      code: 'switch(a){case 0:break\ncase 1:break}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BreakStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // case
    // ----------------------------------------------------------------------

    {
      code: 'switch(a){case 0:\nfoo()\n\ncase 1:\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'SwitchCase[test!=null]', next: '*' },
      ],
    },
    {
      code: 'switch(a){case 0:\nfoo()\n\ndefault:\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'SwitchCase[test!=null]', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // class
    // ----------------------------------------------------------------------

    {
      code: 'class A{}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ClassDeclaration', next: '*' },
      ],
    },
    {
      code: 'var A = class{}\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ClassDeclaration', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // const
    // ----------------------------------------------------------------------

    {
      code: 'const a=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[kind="const"]', next: '*' },
      ],
    },
    {
      code: 'let a=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // continue
    // ----------------------------------------------------------------------

    {
      code: 'while(a){continue\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ContinueStatement', next: '*' },
      ],
    },
    {
      code: 'while(a){break\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'BreakStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // debugger
    // ----------------------------------------------------------------------

    {
      code: 'debugger\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'DebuggerStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // default
    // ----------------------------------------------------------------------

    {
      code: 'switch(a){default:\nfoo()\n\ncase 0:\nfoo()\ncase 1:}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: ':matches(SwitchCase[test=null], ExportDefaultDeclaration)', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // do
    // ----------------------------------------------------------------------

    {
      code: 'do;while(a)\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'DoWhileStatement', next: '*' },
      ],
    },
    {
      code: 'while(a);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'WhileStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // export
    // ----------------------------------------------------------------------

    {
      code: 'export default 1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export let a=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExportNamedDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'var a = 0; export {a}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExportNamedDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'exports.foo=1\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExportNamedDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'module.exports={}\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExportNamedDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/pull/257
    {
      code: 'var a = 0; export * from "foo"\nbar()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ExportNamedDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },

    // ----------------------------------------------------------------------
    // for
    // ----------------------------------------------------------------------

    {
      code: 'for(;;);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ForStatement', next: '*' },
      ],
    },
    {
      code: 'for(a in b);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ForInStatement', next: '*' },
      ],
    },
    {
      code: 'for(a of b);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ForOfStatement', next: '*' },
      ],
    },
    {
      code: 'while(a);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'WhileStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // function
    // ----------------------------------------------------------------------

    {
      code: 'function foo(){}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'FunctionDeclaration', next: '*' },
      ],
    },
    {
      code: 'var foo=function(){}\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'FunctionDeclaration', next: '*' },
      ],
    },
    {
      code: 'async function foo(){}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'FunctionDeclaration', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // if
    // ----------------------------------------------------------------------

    {
      code: 'if(a);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
      ],
    },
    {
      code: 'if(a);else;\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
      ],
    },
    {
      code: 'if(a);else if(b);else;\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
      ],
    },
    {
      code: 'for(;;);\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // iife
    // ----------------------------------------------------------------------

    {
      code: '(function(){\n})()\n\nvar a = 2;',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },
    {
      code: '+(function(){\n})()\n\nvar a = 2;',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },
    {
      code: '(function(){\n})()\nvar a = 2;',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },
    {
      code: '+(function(){\n})()\nvar a = 2;',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
    },
    {
      code: '(1, 2, 3, function(){\n})()\n\nvar a = 2;',
      options: [{ blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' }],
    },

    // ----------------------------------------------------------------------
    // import
    // ----------------------------------------------------------------------

    {
      code: 'import \'a\'\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import a from \'a\'\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import * as a from \'a\'\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import {a} from \'a\'\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'const a=require(\'a\')\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },

    // ----------------------------------------------------------------------
    // let
    // ----------------------------------------------------------------------

    {
      code: 'let a=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: '*' },
      ],
    },
    {
      code: 'var a=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[kind="var"]', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // return
    // ----------------------------------------------------------------------

    {
      code: 'function foo(){return\n\nfoo()}',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ReturnStatement', next: '*' },
      ],
    },
    {
      code: 'throw a\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ReturnStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // switch
    // ----------------------------------------------------------------------

    {
      code: 'switch(a){}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'SwitchStatement', next: '*' },
      ],
    },
    {
      code: 'if(a){}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // throw
    // ----------------------------------------------------------------------

    {
      code: 'throw a\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'ThrowStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // try
    // ----------------------------------------------------------------------

    {
      code: 'try{}catch(e){}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'TryStatement', next: '*' },
      ],
    },
    {
      code: 'try{}finally{}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'TryStatement', next: '*' },
      ],
    },
    {
      code: 'try{}catch(e){}finally{}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'TryStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // using
    // ----------------------------------------------------------------------

    ...['using', 'await using'].flatMap<ValidTestCase<RuleOptions>>(usingType => [
      {
        code: `${usingType} a=1\n\nfoo()`,
        options: [
          { blankLine: 'never', prev: '*', next: '*' },
          { blankLine: 'always', prev: ':matches(VariableDeclaration[kind="using"], VariableDeclaration[kind="await using"])', next: '*' },
        ],
      },
    ]),

    // ----------------------------------------------------------------------
    // var
    // ----------------------------------------------------------------------

    {
      code: 'var a=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[kind="var"]', next: '*' },
      ],
    },
    {
      code: 'const a=1\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'VariableDeclaration[kind="var"]', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // while
    // ----------------------------------------------------------------------

    {
      code: 'while(a);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'WhileStatement', next: '*' },
      ],
    },
    {
      code: 'do;while(a)\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'WhileStatement', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // with
    // ----------------------------------------------------------------------

    {
      code: 'with(a);\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'WithStatement', next: '*' },
      ],
      parserOptions: { sourceType: 'script' },
    },

    // ----------------------------------------------------------------------
    // Tests from newline-after-var
    // ----------------------------------------------------------------------

    // should skip rule entirely
    {
      code: 'console.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'console.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should ignore a `var` with no following token
    {
      code: 'var greet = \'hello\';',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow no line break in "never" mode
    {
      code: 'var greet = \'hello\';console.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow no blank line in "never" mode
    {
      code: 'var greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow one blank line in "always" mode
    {
      code: 'var greet = \'hello\';\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow two or more blank lines in "always" mode
    {
      code: 'var greet = \'hello\';\n\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n\n\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow trailing whitespace after the `var`
    {
      code: 'var greet = \'hello\';    \n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';    \nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow inline comments after the `var`
    {
      code: 'var greet = \'hello\'; // inline comment\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\'; // inline comment\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow a comment on the next line in "never" mode
    {
      code: 'var greet = \'hello\';\n// next-line comment\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n/* block comment\nblock comment */\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow comments on the next line followed by a blank in "always" mode
    {
      code: 'var greet = \'hello\';\n// next-line comment\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n/* block comment\nblock comment */\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n// next-line comment\n// second-line comment\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow comments on the next line followed by no blank in "never" mode
    {
      code: 'var greet = \'hello\';\n// next-line comment\n// second-line comment\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow another `var` statement to follow without blank line
    {
      code: 'var greet = \'hello\';var name = \'world\';console.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\nvar name = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\nvar name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should allow a comment directly between `var` statements
    {
      code: 'var greet = \'hello\';\n// inline comment\nvar name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n/* block comment\nblock comment */\nvar name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n// inline comment\nvar name = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\';\n/* block comment\nblock comment */\nvar name = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle single `var` statement with multiple declarations
    {
      code: 'var greet = \'hello\', name = \'world\';console.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\', name = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\', name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle single `var` statement with multi-line declaration
    {
      code: 'var greet = \'hello\',\nname = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\',\nname = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\', // inline comment\nname = \'world\'; // inline comment\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\', // inline comment\nname = \'world\'; // inline comment\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\',\nname = \'world\';\n// next-line comment\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var greet = \'hello\',\nname = \'world\';\n/* block comment\nblock comment */\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle ES6 `let` block binding
    {
      code: 'let greet = \'hello\';\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'let greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle ES6 `const` block binding
    {
      code: 'const greet = \'hello\';\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'const greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle a mix of `var`, `let`, or `const`
    {
      code: 'let greet = \'hello\';\nvar name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'const greet = \'hello\';\nvar name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'let greet = \'hello\';\nconst name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle a mix of `var` or `let` inside for variations
    {
      code: 'for(let a = 1; a < 1; a++){\n break;\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'for(var a = 1; a < 1; a++){\n break;\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'for(let a = 1; a < 1; a++){\n break;\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'for(var a = 1; a < 1; a++){\n break;\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'for(let a in obj){\n break;\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'for(var a in obj){\n break;\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'for(let a in obj){\n break;\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'for(var a in obj){\n break;\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle export specifiers
    {
      code: 'export let a = 1;\nexport let b = 2;',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export let a = 1;\nexport let b = 2;',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export var a = 1;\nexport var b = 2;',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export var a = 1;\nexport var b = 2;',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export const a = 1;\nexport const b = 2;',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export const a = 1;\nexport const b = 2;',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },

    // should allow no blank line at end of block
    {
      code: 'function example() {\nvar greet = \'hello\'\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'function example() {\nvar greet = \'hello\'\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'function example() {\nvar greet = \'hello\';\nconsole.log(greet);\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var f = function() {\nvar greet = \'hello\'\n};',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var f = function() {\nvar greet = \'hello\'\n};',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'var f = function() {\nvar greet = \'hello\';\nconsole.log(greet);\n};',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: '() => {\nvar greet = \'hello\';\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: '() => {\nvar greet = \'hello\';\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: '() => {\nvar greet = \'hello\';\nconsole.log(greet);\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: '{\nvar foo;\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: '{\nvar foo;\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'if(true) {\nvar foo;\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'if(true) {\nvar foo;\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'switch(a) {\ncase 0:\nvar foo;\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'switch(a) {\ncase 0:\nvar foo;\n}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // should handle one/no blank before case.
    {
      code: 'switch(a) {\ncase 0:\nvar foo;\n\ncase 1:}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'switch(a) {\ncase 0:\nvar foo;\ncase 1:}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // https://github.com/eslint/eslint/issues/6834
    {
      code: $`
        var a = 1
        
        ;(b || c).doSomething()
      `,
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: $`
        var a = 1
        ;(b || c).doSomething()
      `,
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: $`
        var a = 1
        ;
        (b || c).doSomething();
      `,
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    {
      code: 'switch(a) {\ncase 0:\nvar foo;\n\ncase 1:}',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: 'switch(a) {\ncase 0:\nvar foo;\ncase 1:}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },
    {
      code: $`
        var a = 1
        
        ;
        (b || c).doSomething();
      `,
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
    },

    // ----------------------------------------------------------------------
    // Tests from newline-before-return
    // ----------------------------------------------------------------------

    {
      code: 'function a() {\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nvar b;\n\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) { return; }\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) {\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) {\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) {\nreturn;\n}\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) {\n\nreturn;\n}\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (!b) {\nreturn;\n} else {\nreturn b;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (!b) {\nreturn;\n} else {\n\nreturn b;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n\nreturn a;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) return b;\nelse if (c) return c;\nelse return d;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\nreturn d;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nwhile (b) return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n while (b) \nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n while (b) { return; }\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n while (b) {\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n while (b) {\nc();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\ndo return;\nwhile (b);\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'returnReturnStatement' },
      ],
    },
    {
      code: 'function a() {\ndo \nreturn;\nwhile (b);\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\ndo { return; } while (b);\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\ndo { return; }\nwhile (b);\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\ndo {\nreturn;\n} while (b);\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (var b; b < c; b++) return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (var b; b < c; b++)\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (var b; b < c; b++) {\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b in c)\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b in c) { return; }\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b in c) {\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b of c) return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b of c)\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b of c) {\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nswitch (b) {\ncase \'b\': return;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nswitch (b) {\ncase \'b\':\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nswitch (b) {\ncase \'b\': {\nreturn;\n}\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n//comment\nreturn b;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n{\n//comment\n}\n\nreturn\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nvar b = {\n//comment\n};\n\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {/*multi-line\ncomment*/return b;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n/*comment\ncomment*/\n//comment\nreturn b;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n/*comment\ncomment*/\n//comment\nif (b) return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\n/*comment\ncomment*/\n//comment\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) { //comment\nreturn;\n}\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) { return; } //comment\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
    },
    {
      code: 'return;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
    },
    {
      code: 'var a;\n\nreturn;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
    },
    {
      code: '// comment\nreturn;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
    },
    {
      code: '/* comment */\nreturn;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
    },
    {
      code: '/* multi-line\ncomment */\nreturn;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
    },

    // ----------------------------------------------------------------------
    // From JSCS disallowPaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'var a = 2;\nmodule.exports = a;',
      options: [
        { blankLine: 'never', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
    },
    {
      code: 'module.exports = 2;',
      options: [
        { blankLine: 'never', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
    },
    {
      code: 'var a = 2;\n// foo\nmodule.exports = a;',
      options: [
        { blankLine: 'never', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
    },

    /**
     * TODO: May it need an option to ignore blank lines followed by comments?
     * {
     *     code: "var a = 2;\n\n// foo\nmodule.exports = a;",
     *     options: [
     *         { blankLine: "never", prev: "*", next: "cjs-export" }
     *     ]
     * },
     */
    {
      code: 'var a = 2;\n\nfoo.exports = a;',
      options: [
        { blankLine: 'never', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
    },
    {
      code: 'var a = 2;\n\nmodule.foo = a;',
      options: [
        { blankLine: 'never', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
    },
    {
      code: 'var a = 2;\n\nfoo = a;',
      options: [
        { blankLine: 'never', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
    },

    // ----------------------------------------------------------------------
    // From JSCS requirePaddingNewLinesAfterBlocks
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-after-blocks.js
    // ----------------------------------------------------------------------

    {
      code: '{}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true){}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true){}\n',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true){}\n\nvar a = 2;',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true){}\n\n\nvar a = 2;',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true){\nif(true) {}\n}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'var a = {\nfoo: function() {\n},\n\nbar: function() {\n}}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: '(function(){\n})()\n\nvar a = 2;',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true) {\n}\nelse\n{\n}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true) {\n} else {\n var a = 2; }',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'if(true) {\n}\nelse if(true)\n{\n}\nelse {\n}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'do{\n}\nwhile(true)',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'try{\n}\ncatch(e) {}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'try{\n}\nfinally {}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'try{\n}\ncatch(e) {\n}\nfinally {\n}',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: '[].map(function() {})\n.filter(function(){})',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'func(\n2,\n3,\nfunction() {\n}\n)',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: '[\n2,\n3,\nfunction() {\n}\n]',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'a(res => {\n})\n.b();',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
    },
    {
      code: 'var foo = (\n<div\nref={function() {\n}}\n>\nfoo\n</div>\n);',
      options: [
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    {
      code: 'var i = 0;\nwhile (i < 100) {\nif(i % 2 === 0) {continue;}\n++i;\n}',
      options: [
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
      ],
    },
    {
      code: 'var i = 0;\nwhile (i < 100) {\nif(i % 2 === 0) {if(i === 4) {continue;}}\n++i;\n}',
      options: [
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // From JSCS requirePaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'module.exports = 2;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"' },
      ],
    },
    {
      code: 'var a = 2;\n\nmodule.exports = a;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"' },
      ],
    },
    {
      code: 'var a = 2;\nfoo.exports = a;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"' },
      ],
    },
    {
      code: 'var a = 2;\nmodule.foo = a;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="foo"' },
      ],
    },
    {
      code: 'if (true) {\nmodule.exports = a;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"' },
      ],
    },

    // ----------------------------------------------------------------------
    // From JSCS requirePaddingNewlinesBeforeKeywords
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-keywords.js
    // ----------------------------------------------------------------------

    {
      code: 'function x() { return; }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
    },
    {
      code: 'if (true) {} else if (false) {}',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
    },
    {
      code: 'function x() { var a = true; do { a = !a; } while (a); }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
    },
    {
      code: 'function x() { if (true) return; }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
    },

    // class static blocks
    {
      code: 'class C {\n static {\n let x;\n\n foo();\n }\n }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n }\n }',
      options: [
        { blankLine: 'never', prev: 'VariableDeclaration[kind="let"]', next: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n\n const y = 1;\n }\n }',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n const y = 1;\n }\n }',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n\n const y = 1;\n const z = 1;\n }\n }',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n const y = 1;\n const z = 1;\n }\n }',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C {\n static {\n let a = 0;\n let b =0;\n\n bar();\n }\n }',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { static { let x; { let y; } let z; } }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { method() { let x; } static { let y; } }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { static { let y; } method() { let x; } }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { static { let x; } static { let y; } }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'let x; class C { static { let y; } }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { static { let x; } } let y;',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { static { let x; } }',
      options: [
        { blankLine: 'always', prev: 'ClassDeclaration', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: 'class C { static { \'use strict\'; let x; } }', // 'use strict'; is "expression", because class static blocks don't have directives
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
    },
  ],
  invalid: [
    // ----------------------------------------------------------------------
    // cjs-export
    // ----------------------------------------------------------------------

    {
      code: 'module.exports=1\n\nfoo()',
      output: 'module.exports=1\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"]', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'module.exports=1\nfoo()',
      output: 'module.exports=1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'module.exports.foo=1\nfoo()',
      output: 'module.exports.foo=1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'module.exports[foo]=1\nfoo()',
      output: 'module.exports[foo]=1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'exports.foo=1\nfoo()',
      output: 'exports.foo=1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"][expression.left.property.name="foo"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'exports[foo]=1\nfoo()',
      output: 'exports[foo]=1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"][expression.left.property.name="foo"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // cjs-import
    // ----------------------------------------------------------------------

    {
      code: 'const foo=require("foo")\n\nfoo()',
      output: 'const foo=require("foo")\nfoo()',
      options: [
        { blankLine: 'never', prev: ':matches(VariableDeclaration[declarations.0.init.type="CallExpression"][declarations.0.init.callee.name="require"], VariableDeclaration[declarations.0.init.type="MemberExpression"][declarations.0.init.object.type="CallExpression"][declarations.0.init.object.callee.name="require"])', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'const foo=require("foo")\nfoo()',
      output: 'const foo=require("foo")\n\nfoo()',
      options: [
        { blankLine: 'always', prev: ':matches(VariableDeclaration[declarations.0.init.type="CallExpression"][declarations.0.init.callee.name="require"], VariableDeclaration[declarations.0.init.type="MemberExpression"][declarations.0.init.object.type="CallExpression"][declarations.0.init.object.callee.name="require"])', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'const foo=require("foo").Foo\nfoo()',
      output: 'const foo=require("foo").Foo\n\nfoo()',
      options: [
        { blankLine: 'always', prev: ':matches(VariableDeclaration[declarations.0.init.type="CallExpression"][declarations.0.init.callee.name="require"], VariableDeclaration[declarations.0.init.type="MemberExpression"][declarations.0.init.object.type="CallExpression"][declarations.0.init.object.callee.name="require"])', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'const foo=require("foo")[a]\nfoo()',
      output: 'const foo=require("foo")[a]\n\nfoo()',
      options: [
        { blankLine: 'always', prev: ':matches(VariableDeclaration[declarations.0.init.type="CallExpression"][declarations.0.init.callee.name="require"], VariableDeclaration[declarations.0.init.type="MemberExpression"][declarations.0.init.object.type="CallExpression"][declarations.0.init.object.callee.name="require"])', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/53
    {
      code: $`
        const path = require('node:path');
        module.exports = {};
      `,
      output: $`
        const path = require('node:path');
        
        module.exports = {};
      `,
      options: [{ blankLine: 'always', prev: ':matches(VariableDeclaration[declarations.0.init.type="CallExpression"][declarations.0.init.callee.name="require"], VariableDeclaration[declarations.0.init.type="MemberExpression"][declarations.0.init.object.type="CallExpression"][declarations.0.init.object.callee.name="require"])', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // directive
    // ----------------------------------------------------------------------

    {
      code: '"use strict"\n\nfoo()',
      output: '"use strict"\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: '"use strict"\nfoo()',
      output: '"use strict"\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: '\'use strict\'\nfoo()',
      output: '\'use strict\'\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: '\'use asm\'\nfoo()',
      output: '\'use asm\'\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement[expression.type="Literal"][expression.value=/^use\\s+/]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // block
    // ----------------------------------------------------------------------

    {
      code: '{}\n\nfoo()',
      output: '{}\nfoo()',
      options: [
        { blankLine: 'never', prev: 'BlockStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: '{}\nfoo()',
      output: '{}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'BlockStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // empty
    // ----------------------------------------------------------------------

    {
      code: ';\n\nfoo()',
      output: ';\nfoo()',
      options: [
        { blankLine: 'never', prev: 'EmptyStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: ';\nfoo()',
      output: ';\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'EmptyStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // expression
    // ----------------------------------------------------------------------

    {
      code: 'foo()\n\nfoo()',
      output: 'foo()\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'foo()\nfoo()',
      output: 'foo()\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // break
    // ----------------------------------------------------------------------

    {
      code: 'while(a){break\n\nfoo()}',
      output: 'while(a){break\nfoo()}',
      options: [
        { blankLine: 'never', prev: 'BreakStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'switch(a){case 0:break\n\nfoo()}',
      output: 'switch(a){case 0:break\nfoo()}',
      options: [
        { blankLine: 'never', prev: 'BreakStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'while(a){break\nfoo()}',
      output: 'while(a){break\n\nfoo()}',
      options: [
        { blankLine: 'always', prev: 'BreakStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'switch(a){case 0:break\nfoo()}',
      output: 'switch(a){case 0:break\n\nfoo()}',
      options: [
        { blankLine: 'always', prev: 'BreakStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // case
    // ----------------------------------------------------------------------

    {
      code: 'switch(a){case 0:\nfoo()\n\ndefault:}',
      output: 'switch(a){case 0:\nfoo()\ndefault:}',
      options: [
        { blankLine: 'never', prev: 'SwitchCase[test!=null]', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'switch(a){case 0:\nfoo()\ndefault:}',
      output: 'switch(a){case 0:\nfoo()\n\ndefault:}',
      options: [
        { blankLine: 'always', prev: 'SwitchCase[test!=null]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // class
    // ----------------------------------------------------------------------

    {
      code: 'class A{}\n\nfoo()',
      output: 'class A{}\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ClassDeclaration', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'class A{}\nfoo()',
      output: 'class A{}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ClassDeclaration', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // const
    // ----------------------------------------------------------------------

    {
      code: 'const a=1\n\nfoo()',
      output: 'const a=1\nfoo()',
      options: [
        { blankLine: 'never', prev: 'VariableDeclaration[kind="const"]', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'const a=1\nfoo()',
      output: 'const a=1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="const"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // continue
    // ----------------------------------------------------------------------

    {
      code: 'while(a){continue\n\nfoo()}',
      output: 'while(a){continue\nfoo()}',
      options: [
        { blankLine: 'never', prev: 'ContinueStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'while(a){continue\nfoo()}',
      output: 'while(a){continue\n\nfoo()}',
      options: [
        { blankLine: 'always', prev: 'ContinueStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // debugger
    // ----------------------------------------------------------------------

    {
      code: 'debugger\n\nfoo()',
      output: 'debugger\nfoo()',
      options: [
        { blankLine: 'never', prev: 'DebuggerStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'debugger\nfoo()',
      output: 'debugger\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'DebuggerStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // default
    // ----------------------------------------------------------------------

    {
      code: 'switch(a){default:\nfoo()\n\ncase 0:}',
      output: 'switch(a){default:\nfoo()\ncase 0:}',
      options: [
        { blankLine: 'never', prev: ':matches(SwitchCase[test=null], ExportDefaultDeclaration)', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'switch(a){default:\nfoo()\ncase 0:}',
      output: 'switch(a){default:\nfoo()\n\ncase 0:}',
      options: [
        { blankLine: 'always', prev: ':matches(SwitchCase[test=null], ExportDefaultDeclaration)', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // do
    // ----------------------------------------------------------------------

    {
      code: 'do;while(a)\n\nfoo()',
      output: 'do;while(a)\nfoo()',
      options: [
        { blankLine: 'never', prev: 'DoWhileStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'do;while(a)\nfoo()',
      output: 'do;while(a)\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'DoWhileStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // export
    // ----------------------------------------------------------------------

    {
      code: 'export default 1\n\nfoo()',
      output: 'export default 1\nfoo()',
      options: [
        { blankLine: 'never', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'export let a=1\n\nfoo()',
      output: 'export let a=1\nfoo()',
      options: [
        { blankLine: 'never', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var a = 0;export {a}\n\nfoo()',
      output: 'var a = 0;export {a}\nfoo()',
      options: [
        { blankLine: 'never', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'export default 1\nfoo()',
      output: 'export default 1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'export let a=1\nfoo()',
      output: 'export let a=1\n\nfoo()',
      options: [
        { blankLine: 'always', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var a = 0;export {a}\nfoo()',
      output: 'var a = 0;export {a}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/pull/257
    {
      code: 'var a = 0;export * from "foo"\nbar()',
      output: 'var a = 0;export * from "foo"\n\nbar()',
      options: [
        { blankLine: 'always', prev: ':matches(ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration)', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // for
    // ----------------------------------------------------------------------

    {
      code: 'for(;;);\n\nfoo()',
      output: 'for(;;);\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ForStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'for(a in b);\n\nfoo()',
      output: 'for(a in b);\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ForInStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'for(a of b);\n\nfoo()',
      output: 'for(a of b);\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ForOfStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'for(;;);\nfoo()',
      output: 'for(;;);\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ForStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'for(a in b);\nfoo()',
      output: 'for(a in b);\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ForInStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'for(a of b);\nfoo()',
      output: 'for(a of b);\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ForOfStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // function
    // ----------------------------------------------------------------------

    {
      code: 'function foo(){}\n\nfoo()',
      output: 'function foo(){}\nfoo()',
      options: [
        { blankLine: 'never', prev: 'FunctionDeclaration', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'function foo(){}\nfoo()',
      output: 'function foo(){}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'FunctionDeclaration', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'async function foo(){}\nfoo()',
      output: 'async function foo(){}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'FunctionDeclaration', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // if
    // ----------------------------------------------------------------------

    {
      code: 'if(a);\n\nfoo()',
      output: 'if(a);\nfoo()',
      options: [
        { blankLine: 'never', prev: 'IfStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'if(a);else;\n\nfoo()',
      output: 'if(a);else;\nfoo()',
      options: [
        { blankLine: 'never', prev: 'IfStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'if(a);\nfoo()',
      output: 'if(a);\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'if(a);else;\nfoo()',
      output: 'if(a);else;\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'IfStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // iife
    // ----------------------------------------------------------------------

    {
      code: '(function(){\n})()\n\nvar a = 2;',
      output: '(function(){\n})()\nvar a = 2;',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: '+(function(){\n})()\n\nvar a = 2;',
      output: '+(function(){\n})()\nvar a = 2;',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: '(function(){\n})()\nvar a = 2;',
      output: '(function(){\n})()\n\nvar a = 2;',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: '+(function(){\n})()\nvar a = 2;',
      output: '+(function(){\n})()\n\nvar a = 2;',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // Optional chaining
    {
      code: '(function(){\n})?.()\nvar a = 2;',
      output: '(function(){\n})?.()\n\nvar a = 2;',
      options: [{ blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' }],
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'void (function(){\n})?.()\nvar a = 2;',
      output: 'void (function(){\n})?.()\n\nvar a = 2;',
      options: [{ blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' }],
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // Sequenced function
    {
      code: '(1,2,3,function(){\n})()\nvar a = 2;',
      output: '(1,2,3,function(){\n})()\n\nvar a = 2;',
      options: [{ blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // import
    // ----------------------------------------------------------------------

    {
      code: 'import a from \'a\'\n\nfoo()',
      output: 'import a from \'a\'\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'import * as a from \'a\'\n\nfoo()',
      output: 'import * as a from \'a\'\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'import {a} from \'a\'\n\nfoo()',
      output: 'import {a} from \'a\'\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'import a from \'a\'\nfoo()',
      output: 'import a from \'a\'\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'import * as a from \'a\'\nfoo()',
      output: 'import * as a from \'a\'\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'import {a} from \'a\'\nfoo()',
      output: 'import {a} from \'a\'\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ImportDeclaration', next: '*' },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // let
    // ----------------------------------------------------------------------

    {
      code: 'let a\n\nfoo()',
      output: 'let a\nfoo()',
      options: [
        { blankLine: 'never', prev: 'VariableDeclaration[kind="let"]', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'let a\nfoo()',
      output: 'let a\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // return
    // ----------------------------------------------------------------------

    {
      code: 'function foo(){return\n\nfoo()}',
      output: 'function foo(){return\nfoo()}',
      options: [
        { blankLine: 'never', prev: 'ReturnStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'function foo(){return\nfoo()}',
      output: 'function foo(){return\n\nfoo()}',
      options: [
        { blankLine: 'always', prev: 'ReturnStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // switch
    // ----------------------------------------------------------------------

    {
      code: 'switch(a){}\n\nfoo()',
      output: 'switch(a){}\nfoo()',
      options: [
        { blankLine: 'never', prev: 'SwitchStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'switch(a){}\nfoo()',
      output: 'switch(a){}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'SwitchStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // throw
    // ----------------------------------------------------------------------

    {
      code: 'throw a\n\nfoo()',
      output: 'throw a\nfoo()',
      options: [
        { blankLine: 'never', prev: 'ThrowStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'throw a\nfoo()',
      output: 'throw a\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'ThrowStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // try
    // ----------------------------------------------------------------------

    {
      code: 'try{}catch(e){}\n\nfoo()',
      output: 'try{}catch(e){}\nfoo()',
      options: [
        { blankLine: 'never', prev: 'TryStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'try{}finally{}\n\nfoo()',
      output: 'try{}finally{}\nfoo()',
      options: [
        { blankLine: 'never', prev: 'TryStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'try{}catch(e){}finally{}\n\nfoo()',
      output: 'try{}catch(e){}finally{}\nfoo()',
      options: [
        { blankLine: 'never', prev: 'TryStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'try{}catch(e){}\nfoo()',
      output: 'try{}catch(e){}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'TryStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'try{}finally{}\nfoo()',
      output: 'try{}finally{}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'TryStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'try{}catch(e){}finally{}\nfoo()',
      output: 'try{}catch(e){}finally{}\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'TryStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // using
    // ----------------------------------------------------------------------

    ...['using', 'await using'].flatMap<InvalidTestCase<RuleOptions, MessageIds>>(usingType => [
      {
        code: `${usingType} a = x\n\nfoo()`,
        output: `${usingType} a = x\nfoo()`,
        options: [{ blankLine: 'never', prev: ':matches(VariableDeclaration[kind="using"], VariableDeclaration[kind="await using"])', next: '*' }],
        errors: [{ messageId: 'unexpectedBlankLine' }],
      },
      {
        code: `${usingType} a = x\nfoo()`,
        output: `${usingType} a = x\n\nfoo()`,
        options: [{ blankLine: 'always', prev: ':matches(VariableDeclaration[kind="using"], VariableDeclaration[kind="await using"])', next: '*' }],
        errors: [{ messageId: 'expectedBlankLine' }],
      },
    ]),

    // ----------------------------------------------------------------------
    // var
    // ----------------------------------------------------------------------

    {
      code: 'var a\n\nfoo()',
      output: 'var a\nfoo()',
      options: [
        { blankLine: 'never', prev: 'VariableDeclaration[kind="var"]', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var a\nfoo()',
      output: 'var a\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="var"]', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // while
    // ----------------------------------------------------------------------

    {
      code: 'while(a);\n\nfoo()',
      output: 'while(a);\nfoo()',
      options: [
        { blankLine: 'never', prev: 'WhileStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'while(a);\nfoo()',
      output: 'while(a);\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'WhileStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // with
    // ----------------------------------------------------------------------

    {
      code: 'with(a);\n\nfoo()',
      output: 'with(a);\nfoo()',
      options: [
        { blankLine: 'never', prev: 'WithStatement', next: '*' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
      parserOptions: { sourceType: 'script' },
    },
    {
      code: 'with(a);\nfoo()',
      output: 'with(a);\n\nfoo()',
      options: [
        { blankLine: 'always', prev: 'WithStatement', next: '*' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
      parserOptions: { sourceType: 'script' },
    },

    // ----------------------------------------------------------------------
    // Tests from newline-after-var
    // ----------------------------------------------------------------------

    // should disallow no line break in "always" mode
    {
      code: 'var greet = \'hello\';console.log(greet);',
      output: 'var greet = \'hello\';\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';var name = \'world\';console.log(greet, name);',
      output: 'var greet = \'hello\';var name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\', name = \'world\';console.log(greet, name);',
      output: 'var greet = \'hello\', name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // should disallow no blank line in "always" mode
    {
      code: 'var greet = \'hello\';\nconsole.log(greet);',
      output: 'var greet = \'hello\';\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';    \nconsole.log(greet);',
      output: 'var greet = \'hello\';\n    \nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\'; // inline comment\nconsole.log(greet);',
      output: 'var greet = \'hello\'; // inline comment\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';\nvar name = \'world\';\nconsole.log(greet, name);',
      output: 'var greet = \'hello\';\nvar name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\', name = \'world\';\nconsole.log(greet, name);',
      output: 'var greet = \'hello\', name = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\',\nname = \'world\';\nconsole.log(greet, name);',
      output: 'var greet = \'hello\',\nname = \'world\';\n\nconsole.log(greet, name);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'let greet = \'hello\';\nconsole.log(greet);',
      output: 'let greet = \'hello\';\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'const greet = \'hello\';\nconsole.log(greet);',
      output: 'const greet = \'hello\';\n\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function example() {\nvar greet = \'hello\';\nconsole.log(greet);\n}',
      output: 'function example() {\nvar greet = \'hello\';\n\nconsole.log(greet);\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var f = function() {\nvar greet = \'hello\';\nconsole.log(greet);\n};',
      output: 'var f = function() {\nvar greet = \'hello\';\n\nconsole.log(greet);\n};',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: '() => {\nvar greet = \'hello\';\nconsole.log(greet);\n}',
      output: '() => {\nvar greet = \'hello\';\n\nconsole.log(greet);\n}',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // should disallow blank lines in "never" mode
    {
      code: 'var greet = \'hello\';\n\nconsole.log(greet);',
      output: 'var greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';\n\n\nconsole.log(greet);',
      output: 'var greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';\n\n\n\nconsole.log(greet);',
      output: 'var greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';    \n\nconsole.log(greet);',
      output: 'var greet = \'hello\';    \nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\'; // inline comment\n\nconsole.log(greet);',
      output: 'var greet = \'hello\'; // inline comment\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';\nvar name = \'world\';\n\nconsole.log(greet, name);',
      output: 'var greet = \'hello\';\nvar name = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\', name = \'world\';\n\nconsole.log(greet, name);',
      output: 'var greet = \'hello\', name = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\',\nname = \'world\';\n\nconsole.log(greet, name);',
      output: 'var greet = \'hello\',\nname = \'world\';\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\', // inline comment\nname = \'world\'; // inline comment\n\nconsole.log(greet, name);',
      output: 'var greet = \'hello\', // inline comment\nname = \'world\'; // inline comment\nconsole.log(greet, name);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'let greet = \'hello\';\n\nconsole.log(greet);',
      output: 'let greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'const greet = \'hello\';\n\nconsole.log(greet);',
      output: 'const greet = \'hello\';\nconsole.log(greet);',
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },

    // should disallow a comment on the next line that's not in turn followed by a blank in "always" mode
    {
      code: 'var greet = \'hello\';\n// next-line comment\nconsole.log(greet);',
      output: 'var greet = \'hello\';\n\n// next-line comment\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';\n/* block comment\nblock comment */\nconsole.log(greet);',
      output: 'var greet = \'hello\';\n\n/* block comment\nblock comment */\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\',\nname = \'world\';\n// next-line comment\nconsole.log(greet);',
      output: 'var greet = \'hello\',\nname = \'world\';\n\n// next-line comment\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\',\nname = \'world\';\n/* block comment\nblock comment */\nconsole.log(greet);',
      output: 'var greet = \'hello\',\nname = \'world\';\n\n/* block comment\nblock comment */\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';\n// next-line comment\n// second-line comment\nconsole.log(greet);',
      output: 'var greet = \'hello\';\n\n// next-line comment\n// second-line comment\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var greet = \'hello\';\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);',
      output: 'var greet = \'hello\';\n\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // https://github.com/eslint/eslint/issues/6834
    {
      code: $`
        var a = 1
        ;(b || c).doSomething()
      `,
      output: $`
        var a = 1
        
        ;(b || c).doSomething()
      `,
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: $`
        var a = 1
        
        ;(b || c).doSomething()
      `,
      output: $`
        var a = 1
        ;(b || c).doSomething()
      `,
      options: [
        { blankLine: 'never', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // Tests from newline-before-return
    // ----------------------------------------------------------------------

    {
      code: 'function a() {\nvar b; return;\n}',
      output: 'function a() {\nvar b;\n\n return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b;\nreturn;\n}',
      output: 'function a() {\nvar b;\n\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\nreturn d;\n}\n}',
      output: 'function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne(); return d;\n}\n}',
      output: 'function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\n return d;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\n while (b) {\nc();\nreturn;\n}\n}',
      output: 'function a() {\n while (b) {\nc();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\ndo {\nc();\nreturn;\n} while (b);\n}',
      output: 'function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nfor (var b; b < c; b++) {\nc();\nreturn;\n}\n}',
      output: 'function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nfor (b in c) {\nd();\nreturn;\n}\n}',
      output: 'function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nfor (b of c) {\nd();\nreturn;\n}\n}',
      output: 'function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nif (b) {\nc();\n}\n//comment\nreturn b;\n}',
      output: 'function a() {\nif (b) {\nc();\n}\n\n//comment\nreturn b;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\n/*comment\ncomment*/\nif (b) {\nc();\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n/*multi-line\ncomment*/\nreturn e;\n}',
      output: 'function a() {\n/*comment\ncomment*/\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }, { messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nif (b) { return; } //comment\nreturn c;\n}',
      output: 'function a() {\nif (b) { return; } //comment\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nif (b) { return; } /*multi-line\ncomment*/\nreturn c;\n}',
      output: 'function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nif (b) { return; }\n/*multi-line\ncomment*/ return c;\n}',
      output: 'function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nif (b) { return; } /*multi-line\ncomment*/ return c;\n}',
      output: 'function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\n return c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var a;\nreturn;',
      output: 'var a;\n\nreturn;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'var a; return;',
      output: 'var a;\n\n return;',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      parserOptions: { ecmaFeatures: { globalReturn: true }, sourceType: 'script' },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\n{\n//comment\n}\nreturn\n}',
      output: 'function a() {\n{\n//comment\n}\n\nreturn\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\n{\n//comment\n} return\n}',
      output: 'function a() {\n{\n//comment\n}\n\n return\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\nreturn c;\n}',
      output: 'function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\nreturn;\n}\n}',
      output: 'function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b; /*multi-line\ncomment*/\nreturn c;\n}',
      output: 'function a() {\nvar b; /*multi-line\ncomment*/\n\nreturn c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b;\n/*multi-line\ncomment*/ return c;\n}',
      output: 'function a() {\nvar b;\n\n/*multi-line\ncomment*/ return c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b; /*multi-line\ncomment*/ return c;\n}',
      output: 'function a() {\nvar b; /*multi-line\ncomment*/\n\n return c;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b;\n//comment\nreturn;\n}',
      output: 'function a() {\nvar b;\n\n//comment\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b; //comment\nreturn;\n}',
      output: 'function a() {\nvar b; //comment\n\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b;\n/* comment */ return;\n}',
      output: 'function a() {\nvar b;\n\n/* comment */ return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b;\n//comment\n/* comment */ return;\n}',
      output: 'function a() {\nvar b;\n\n//comment\n/* comment */ return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b; /* comment */ return;\n}',
      output: 'function a() {\nvar b; /* comment */\n\n return;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b; /* comment */\nreturn;\n}',
      output: 'function a() {\nvar b; /* comment */\n\nreturn;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b;\nreturn; //comment\n}',
      output: 'function a() {\nvar b;\n\nreturn; //comment\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function a() {\nvar b; return; //comment\n}',
      output: 'function a() {\nvar b;\n\n return; //comment\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'ReturnStatement' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // From JSCS disallowPaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'var a = 2;\n\nmodule.exports = a;',
      output: 'var a = 2;\nmodule.exports = a;',
      options: [
        { blankLine: 'never', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // From JSCS disallowPaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-keywords.js
    // ----------------------------------------------------------------------

    {
      code: 'function x() { var a;\n\nreturn; }',
      output: 'function x() { var a;\nreturn; }',
      options: [
        { blankLine: 'never', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'function x() { var a = true;\n\nif (a) { a = !a; }; }',
      output: 'function x() { var a = true;\nif (a) { a = !a; }; }',
      options: [
        { blankLine: 'never', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'function x() { var a = true;\n\nfor (var i = 0; i < 10; i++) { a = !a; }; }',
      output: 'function x() { var a = true;\nfor (var i = 0; i < 10; i++) { a = !a; }; }',
      options: [
        { blankLine: 'never', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement'] },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'function x() { var y = true;\n\nswitch ("Oranges") { case "Oranges": y = !y;\n\nbreak;\n\ncase "Apples": y = !y;\n\nbreak; default: y = !y; } }',
      output: 'function x() { var y = true;\nswitch ("Oranges") { case "Oranges": y = !y;\nbreak;\ncase "Apples": y = !y;\nbreak; default: y = !y; } }',
      options: [
        { blankLine: 'never', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement'] },
      ],
      errors: [
        { messageId: 'unexpectedBlankLine' },
        { messageId: 'unexpectedBlankLine' },
        { messageId: 'unexpectedBlankLine' },
        { messageId: 'unexpectedBlankLine' },
      ],
    },
    {
      code: 'function x() {try { var a;\n\nthrow 0; } catch (e) { var b = 0;\n\nthrow e; } }',
      output: 'function x() {try { var a;\nthrow 0; } catch (e) { var b = 0;\nthrow e; } }',
      options: [
        { blankLine: 'never', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement'] },
      ],
      errors: [
        { messageId: 'unexpectedBlankLine' },
        { messageId: 'unexpectedBlankLine' },
      ],
    },
    {
      code: 'function x(a) { var b = 0;\n\nif (!a) { return false; };\n\nfor (var i = 0; i < b; i++) { if (!a[i]) return false; }\n\nreturn true; }',
      output: 'function x(a) { var b = 0;\nif (!a) { return false; };\nfor (var i = 0; i < b; i++) { if (!a[i]) return false; }\nreturn true; }',
      options: [
        { blankLine: 'never', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement'] },
      ],
      errors: [
        { messageId: 'unexpectedBlankLine' },
        { messageId: 'unexpectedBlankLine' },
        { messageId: 'unexpectedBlankLine' },
      ],
    },

    // ----------------------------------------------------------------------
    // From JSCS requirePaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'var a = 2;\nmodule.exports = a;',
      output: 'var a = 2;\n\nmodule.exports = a;',
      options: [
        { blankLine: 'always', prev: '*', next: ':matches(ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="module"][expression.left.property.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.name="exports"], ExpressionStatement[expression.type="AssignmentExpression"][expression.left.object.type="MemberExpression"][expression.left.object.object.name="module"][expression.left.object.property.name="exports"])' },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // From JSCS requirePaddingNewlinesBeforeKeywords
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-keywords.js
    // ----------------------------------------------------------------------

    {
      code: 'function x() { var a; return; }',
      output: 'function x() { var a;\n\n return; }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function x() { var a = true; for (var i = 0; i < 10; i++) { a = !a; }; }',
      output: 'function x() { var a = true;\n\n for (var i = 0; i < 10; i++) { a = !a; }; }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function x() { var y = true; switch ("Oranges") { case "Oranges": y = !y; break; case "Apples": y = !y; break; default: y = !y; } }',
      output: 'function x() { var y = true;\n\n switch ("Oranges") { case "Oranges": y = !y;\n\n break;\n\n case "Apples": y = !y;\n\n break;\n\n default: y = !y; } }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
      errors: [
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
      ],
    },
    {
      code: 'function x() { var a = true; while (!a) { a = !a; }; }',
      output: 'function x() { var a = true;\n\n while (!a) { a = !a; }; }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function x() {try { var a; throw 0; } catch (e) { var b = 0; throw e; } }',
      output: 'function x() {try { var a;\n\n throw 0; } catch (e) { var b = 0;\n\n throw e; } }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
      errors: [
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
      ],
    },
    {
      code: 'function x(a) { var b = 0; if (!a) { return false; }; for (var i = 0; i < b; i++) { if (!a[i]) return false; } return true; }',
      output: 'function x(a) { var b = 0;\n\n if (!a) { return false; };\n\n for (var i = 0; i < b; i++) { if (!a[i]) return false; }\n\n return true; }',
      options: [
        { blankLine: 'always', prev: '*', next: ['IfStatement', ':matches(ForStatement, ForInStatement, ForOfStatement)', 'ReturnStatement', 'SwitchStatement', 'SwitchCase[test!=null]', 'BreakStatement', 'ThrowStatement', 'WhileStatement', ':matches(SwitchCase[test=null], ExportDefaultDeclaration)'] },
      ],
      errors: [
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
      ],
    },

    // class static blocks
    {
      code: 'class C {\n static {\n let x;\n foo();\n }\n }',
      output: 'class C {\n static {\n let x;\n\n foo();\n }\n }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'class C {\n static {\n let x;\n\n foo();\n }\n }',
      output: 'class C {\n static {\n let x;\n foo();\n }\n }',
      options: [
        { blankLine: 'never', prev: 'VariableDeclaration[kind="let"]', next: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n const y = 1;\n }\n }',
      output: 'class C {\n static {\n let x;\n foo();\n\n const y = 1;\n }\n }',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n\n const y = 1;\n }\n }',
      output: 'class C {\n static {\n let x;\n foo();\n const y = 1;\n }\n }',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n const y = 1;\n const z = 1;\n }\n }',
      output: 'class C {\n static {\n let x;\n foo();\n\n const y = 1;\n const z = 1;\n }\n }',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'class C {\n static {\n let x;\n foo();\n\n const y = 1;\n const z = 1;\n }\n }',
      output: 'class C {\n static {\n let x;\n foo();\n const y = 1;\n const z = 1;\n }\n }',
      options: [
        { blankLine: 'never', prev: 'ExpressionStatement:not([expression.type="Literal"][expression.value=/^use\\s+/])', next: 'VariableDeclaration[kind="const"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'class C {\n static {\n let a = 0;\n bar();\n }\n }',
      output: 'class C {\n static {\n let a = 0;\n\n bar();\n }\n }',
      options: [
        { blankLine: 'always', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: '*' },
        { blankLine: 'any', prev: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'], next: ['VariableDeclaration[kind="const"]', 'VariableDeclaration[kind="let"]', 'VariableDeclaration[kind="var"]'] },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'class C { static { let x; { let y; let z; } let q; } }',
      output: 'class C { static { let x; { let y;\n\n let z; } let q; } }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'class C { static { { let x; } let y; let z; } }',
      output: 'class C { static { { let x; } let y;\n\n let z; } }',
      options: [
        { blankLine: 'always', prev: 'VariableDeclaration[kind="let"]', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'class C { static { let x; } } let y;',
      output: 'class C { static { let x; } }\n\n let y;',
      options: [
        { blankLine: 'always', prev: 'ClassDeclaration', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'class C { static { \'use strict\'; let x; } }', // 'use strict'; is "expression", because class static blocks don't have directives
      output: 'class C { static { \'use strict\';\n\n let x; } }',
      options: [
        { blankLine: 'always', prev: 'ExpressionStatement', next: 'VariableDeclaration[kind="let"]' },
      ],
      parserOptions: { ecmaVersion: 2022 },
      errors: [{ messageId: 'expectedBlankLine' }],
    },
  ],
})
