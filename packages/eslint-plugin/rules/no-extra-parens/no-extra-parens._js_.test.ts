/**
 * @fileoverview Disallow parenthesising higher precedence subexpressions.
 * @author Michael Ficarra
 */

import type { InvalidTestCase } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './no-extra-parens'

/**
 * Create error message object for failure cases
 * @param code source code
 * @param output fixed source code
 * @param line line number
 * @param config rule configuration
 * @returns result object
 * @private
 */
function invalid(code: string, output: string | null, line?: number | null, config?: any): InvalidTestCase<RuleOptions, MessageIds> {
  return {
    code,
    output,
    parserOptions: config && config.parserOptions || {},
    errors: [
      {
        messageId: 'unexpected',
        ...(line && { line }),
      },
    ],
    options: config && config.options || [],
  }
}

run<RuleOptions, MessageIds>({
  name: 'no-extra-parens',
  rule,
  lang: 'js',
  parserOptions: {
    sourceType: 'script',
    ecmaFeatures: {
      jsx: true,
    },
  },
  valid: [
    // all precedence boundaries
    'foo',
    'a = b, c = d',
    'a = b ? c : d',
    'a = (b, c)',
    'a || b ? c = d : e = f',
    '(a = b) ? (c, d) : (e, f)',
    'a && b || c && d',
    '(a ? b : c) || (d ? e : f)',
    'a | b && c | d',
    '(a || b) && (c || d)',
    'a ^ b | c ^ d',
    '(a && b) | (c && d)',
    'a & b ^ c & d',
    '(a | b) ^ (c | d)',
    'a == b & c != d',
    '(a ^ b) & (c ^ d)',
    'a < b === c in d',
    '(a & b) !== (c & d)',
    'a << b >= c >>> d',
    '(a == b) instanceof (c != d)',
    'a + b << c - d',
    '(a <= b) >> (c > d)',
    'a * b + c / d',
    '(a << b) - (c >> d)',
    '+a % !b',
    '(a + b) * (c - d)',
    '-void+delete~typeof!a',
    '!(a * b); typeof (a / b); +(a % b); delete (a * b); ~(a / b); void (a % b); -(a * b)',
    'a(b = c, (d, e))',
    '(++a)(b); (c++)(d);',
    'new (A())',
    'new (foo.Baz().foo)',
    'new (foo.baz.bar().foo.baz)',
    'new ({}.baz.bar.foo().baz)',
    'new (doSomething().baz.bar().foo)',
    'new ([][0].baz.foo().bar.foo)',
    'new (foo\n.baz\n.bar()\n.foo.baz)',
    'new A()()',
    '(new A)()',
    '(new (Foo || Bar))()',
    '(new new foo())()',
    'new (new A)()',
    'new (new a.b)()',
    'new (new new foo())(bar)',
    '(new foo).bar',
    '(new foo)[bar]',
    '(new foo).bar.baz',
    '(new foo.bar).baz',
    '(new foo).bar()',
    '(new foo.bar).baz()',
    'new (new foo).bar',
    'new (new foo.bar).baz',
    '(new new foo()).baz',
    '(2 + 3) ** 4',
    '2 ** (2 + 3)',
    'new (import(source))',
    'import((s,t))',

    // same precedence
    'a, b, c',
    'a = b = c',
    'a ? b ? c : d : e',
    'a ? b : c ? d : e',
    'a || b || c',
    'a || (b || c)',
    'a && b && c',
    'a && (b && c)',
    'a | b | c',
    'a | (b | c)',
    'a ^ b ^ c',
    'a ^ (b ^ c)',
    'a & b & c',
    'a & (b & c)',
    'a == b == c',
    'a == (b == c)',
    'a < b < c',
    'a < (b < c)',
    'a << b << c',
    'a << (b << c)',
    'a + b + c',
    'a + (b + c)',
    'a * b * c',
    'a * (b * c)',
    '!!a; typeof +b; void -c; ~delete d;',
    'a(b)',
    'a(b)(c)',
    'a((b, c))',
    'new new A',
    '2 ** 3 ** 4',
    '(2 ** 3) ** 4',

    // constructs that contain expressions
    'if(a);',
    'with(a){}',
    'switch(a){ case 0: break; }',
    'function a(){ return b; }',
    'var a = () => { return b; }',
    'throw a;',
    'while(a);',
    'do; while(a);',
    'for(;;);',
    'for(a in b);',
    'for(a in b, c);',
    'for(a of b);',
    'for (a of (b, c));',
    'var a = (b, c);',
    '[]',
    '[a, b]',
    '!{a}',
    '!{a: 0, b: 1}',
    '!{[a]:0}',
    '!{[(a, b)]:0}',
    '!{a, ...b}',
    'const {a} = {}',
    'const {a:b} = {}',
    'const {a:b=1} = {}',
    'const {[a]:b} = {}',
    'const {[a]:b=1} = {}',
    'const {[(a, b)]:c} = {}',
    'const {a, ...b} = {}',
    'class foo {}',
    'class foo { constructor(){} a(){} get b(){} set b(bar){} get c(){} set d(baz){} static e(){} }',
    'class foo { [a](){} get [b](){} set [b](bar){} get [c](){} set [d](baz){} static [e](){} }',
    'class foo { [(a,b)](){} }',
    'class foo { a(){} [b](){} c(){} [(d,e)](){} }',
    'class foo { [(a,b)](){} c(){} [d](){} e(){} }',
    'const foo = class { constructor(){} a(){} get b(){} set b(bar){} get c(){} set d(baz){} static e(){} }',
    'class foo { x; }',
    'class foo { static x; }',
    'class foo { x = 1; }',
    'class foo { static x = 1; }',
    'class foo { #x; }',
    'class foo { static #x; }',
    'class foo { static #x = 1; }',
    'class foo { #x(){} get #y() {} set #y(value) {} static #z(){} static get #q() {} static set #q(value) {} }',
    'const foo  = class { #x(){} get #y() {} set #y(value) {} static #z(){} static get #q() {} static set #q(value) {} }',
    'class foo { [(x, y)]; }',
    'class foo { static [(x, y)]; }',
    'class foo { [(x, y)] = 1; }',
    'class foo { static [(x, y)] = 1; }',
    'class foo { x = (y, z); }',
    'class foo { static x = (y, z); }',
    'class foo { #x = (y, z); }',
    'class foo { static #x = (y, z); }',
    'class foo { [(1, 2)] = (3, 4) }',
    'const foo = class { [(1, 2)] = (3, 4) }',

    // ExpressionStatement restricted productions
    '({});',
    '(function(){});',
    '(let[a] = b);',
    '(function*(){});',
    '(class{});',

    // special cases
    '(0).a',
    '(123).a',
    '(08).a',
    '(09).a',
    '(018).a',
    '(012934).a',
    '(5_000).a',
    '(5_000_00).a',
    '(function(){ }())',
    '({a: function(){}}.a());',
    '({a:0}.a ? b : c)',

    // RegExp literal is allowed to have parens (#1589)
    'var isA = (/^a$/).test(\'a\');',
    'var regex = (/^a$/);',
    'function a(){ return (/^a$/); }',
    'function a(){ return (/^a$/).test(\'a\'); }',
    'var isA = ((/^a$/)).test(\'a\');',

    // IIFE is allowed to have parens in any position (#655)
    'var foo = (function() { return bar(); }())',
    'var o = { foo: (function() { return bar(); }()) };',
    'o.foo = (function(){ return bar(); }());',
    '(function(){ return bar(); }()), (function(){ return bar(); }())',

    // IIFE is allowed to have outer parens (#1004)
    'var foo = (function() { return bar(); })()',
    'var o = { foo: (function() { return bar(); })() };',
    'o.foo = (function(){ return bar(); })();',
    '(function(){ return bar(); })(), (function(){ return bar(); })()',
    'function foo() { return (function(){}()); }',

    // parens are required around yield
    'var foo = (function*() { if ((yield foo()) + 1) { return; } }())',

    // arrow functions have the precedence of an assignment expression
    '(() => 0)()',
    '(_ => 0)()',
    '_ => 0, _ => 1',
    'a = () => b = 0',
    '0 ? _ => 0 : _ => 0',
    '(_ => 0) || (_ => 0)',

    // Object literals as arrow function bodies need parentheses
    'x => ({foo: 1})',

    // Exponentiation operator `**`
    '1 + 2 ** 3',
    '1 - 2 ** 3',
    '2 ** -3',
    '(-2) ** 3',
    '(+2) ** 3',
    '+ (2 ** 3)',

    // https://github.com/eslint/eslint/issues/5789
    'a => ({b: c}[d])',
    'a => ({b: c}.d())',
    'a => ({b: c}.d.e)',

    // "functions" enables reports for function nodes only
    { code: '(0)', options: ['functions'] },
    { code: '((0))', options: ['functions'] },
    { code: 'a + (b * c)', options: ['functions'] },
    { code: 'a + ((b * c))', options: ['functions'] },
    { code: '(a)(b)', options: ['functions'] },
    { code: '((a))(b)', options: ['functions'] },
    { code: 'a, (b = c)', options: ['functions'] },
    { code: 'a, ((b = c))', options: ['functions'] },
    { code: 'for(a in (0));', options: ['functions'] },
    { code: 'for(a in ((0)));', options: ['functions'] },
    { code: 'var a = (b = c)', options: ['functions'] },
    { code: 'var a = ((b = c))', options: ['functions'] },
    { code: '_ => (a = 0)', options: ['functions'] },
    { code: '_ => ((a = 0))', options: ['functions'] },

    // ["all", { conditionalAssign: false }] enables extra parens around conditional assignments
    { code: 'while ((foo = bar())) {}', options: ['all', { conditionalAssign: false }] },
    { code: 'if ((foo = bar())) {}', options: ['all', { conditionalAssign: false }] },
    { code: 'do; while ((foo = bar()))', options: ['all', { conditionalAssign: false }] },
    { code: 'for (;(a = b););', options: ['all', { conditionalAssign: false }] },
    { code: 'var a = ((b = c)) ? foo : bar;', options: ['all', { conditionalAssign: false }] },
    { code: 'while (((foo = bar()))) {}', options: ['all', { conditionalAssign: false }] },
    { code: 'var a = (((b = c))) ? foo : bar;', options: ['all', { conditionalAssign: false }] },

    // ["all", { ternaryOperandBinaryExpressions: false }] enables extra parens around conditional ternary
    { code: '(a && b) ? foo : bar', options: ['all', { ternaryOperandBinaryExpressions: false }] },
    { code: '(a - b > a) ? foo : bar', options: ['all', { ternaryOperandBinaryExpressions: false }] },
    { code: 'foo ? (bar || baz) : qux', options: ['all', { ternaryOperandBinaryExpressions: false }] },
    { code: 'foo ? bar : (baz || qux)', options: ['all', { ternaryOperandBinaryExpressions: false }] },
    { code: '(a, b) ? (c, d) : (e, f)', options: ['all', { ternaryOperandBinaryExpressions: false }] },
    { code: '(a = b) ? c : d', options: ['all', { ternaryOperandBinaryExpressions: false }] },

    // ["all", { nestedBinaryExpressions: false }] enables extra parens around conditional assignments
    { code: 'a + (b * c)', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '(a * b) + c', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '(a * b) / c', options: ['all', { nestedBinaryExpressions: false }] },
    { code: 'a || (b && c)', options: ['all', { nestedBinaryExpressions: false }] },
    { code: 'a + ((b * c))', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '((a * b)) + c', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '((a * b)) / c', options: ['all', { nestedBinaryExpressions: false }] },
    { code: 'a || ((b && c))', options: ['all', { nestedBinaryExpressions: false }] },

    // ["all", { returnAssign: false }] enables extra parens around expressions returned by return statements
    { code: 'function a(b) { return b || c; }', options: ['all', { returnAssign: false }] },
    { code: 'function a(b) { return; }', options: ['all', { returnAssign: false }] },
    { code: 'function a(b) { return (b = 1); }', options: ['all', { returnAssign: false }] },
    { code: 'function a(b) { return (b = c) || (b = d); }', options: ['all', { returnAssign: false }] },
    { code: 'function a(b) { return c ? (d = b) : (e = b); }', options: ['all', { returnAssign: false }] },
    { code: 'b => b || c;', options: ['all', { returnAssign: false }] },
    { code: 'b => (b = 1);', options: ['all', { returnAssign: false }] },
    { code: 'b => (b = c) || (b = d);', options: ['all', { returnAssign: false }] },
    { code: 'b => c ? (d = b) : (e = b);', options: ['all', { returnAssign: false }] },
    { code: 'b => { return b || c };', options: ['all', { returnAssign: false }] },
    { code: 'b => { return (b = 1) };', options: ['all', { returnAssign: false }] },
    { code: 'b => { return (b = c) || (b = d) };', options: ['all', { returnAssign: false }] },
    { code: 'b => { return c ? (d = b) : (e = b) };', options: ['all', { returnAssign: false }] },
    { code: 'function a(b) { return ((b = 1)); }', options: ['all', { returnAssign: false }] },
    { code: 'b => ((b = 1));', options: ['all', { returnAssign: false }] },

    // https://github.com/eslint/eslint/issues/3653
    '(function(){}).foo(), 1, 2;',
    '(function(){}).foo++;',
    '(function(){}).foo() || bar;',
    '(function(){}).foo() + 1;',
    '(function(){}).foo() ? bar : baz;',
    '(function(){}).foo.bar();',
    '(function(){}.foo());',
    '(function(){}.foo.bar);',

    '(class{}).foo(), 1, 2;',
    '(class{}).foo++;',
    '(class{}).foo() || bar;',
    '(class{}).foo() + 1;',
    '(class{}).foo() ? bar : baz;',
    '(class{}).foo.bar();',
    '(class{}.foo());',
    '(class{}.foo.bar);',

    // https://github.com/eslint/eslint/issues/4608
    'function *a() { yield b; }',
    'function *a() { yield yield; }',
    'function *a() { yield b, c; }',
    'function *a() { yield (b, c); }',
    'function *a() { yield b + c; }',
    'function *a() { (yield b) + c; }',

    // https://github.com/eslint-stylistic/eslint-stylistic/pull/738
    $`
      function a() {
        return (
          a % b == 0
        )
      }
    `,

    // https://github.com/eslint/eslint/issues/4229
    $`
      function a() {
          return (
              b
          );
      }
    `,
    $`
      function a() {
          return (
              <JSX />
          );
      }
    `,
    $`
      function a() {
          return (
              <></>
          );
      }
    `,
    $`
      throw (
          a
      );
    `,
    $`
      function *a() {
          yield (
              b
          );
      }
    `,

    // linebreaks before postfix update operators are not allowed
    '(a\n)++',
    '(a\n)--',
    '(a\n\n)++',
    '(a.b\n)--',
    '(a\n.b\n)++',
    '(a[\nb\n]\n)--',
    '(a[b]\n\n)++',

    // async/await
    'async function a() { await (a + b) }',
    'async function a() { await (a + await b) }',
    'async function a() { (await a)() }',
    'async function a() { new (await a) }',
    'async function a() { await (a ** b) }',
    'async function a() { (await a) ** b }',

    { code: '(foo instanceof bar) instanceof baz', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '(foo in bar) in baz', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '(foo + bar) + baz', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '(foo && bar) && baz', options: ['all', { nestedBinaryExpressions: false }] },
    { code: 'foo instanceof (bar instanceof baz)', options: ['all', { nestedBinaryExpressions: false }] },
    { code: 'foo in (bar in baz)', options: ['all', { nestedBinaryExpressions: false }] },
    { code: 'foo + (bar + baz)', options: ['all', { nestedBinaryExpressions: false }] },
    { code: 'foo && (bar && baz)', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '((foo instanceof bar)) instanceof baz', options: ['all', { nestedBinaryExpressions: false }] },
    { code: '((foo in bar)) in baz', options: ['all', { nestedBinaryExpressions: false }] },

    // https://github.com/eslint/eslint/issues/9019
    '(async function() {});',
    '(async function () { }());',

    // ["all", { ignoreJSX: "all" }]
    {
      code: 'const Component = (<div />)',
      options: ['all', { ignoreJSX: 'all' }],
    },
    {
      code: $`
        const Component = (
            <div
                prop={true}
            />
        )
      `,
      options: ['all', { ignoreJSX: 'all' }],
    },
    { code: 'const Component = ((<div />))', options: ['all', { ignoreJSX: 'all' }] },
    {
      code: [
        'const Component = (<>',
        '  <p />',
        '</>);',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'all' }],
    },
    {
      code: [
        'const Component = ((<>',
        '  <p />',
        '</>));',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'all' }],
    },
    {
      code: [
        'const Component = (<div>',
        '  <p />',
        '</div>);',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'all' }],
    },
    {
      code: [
        'const Component = (',
        '  <div />',
        ');',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'all' }],
    },
    {
      code: [
        'const Component =',
        '  (<div />)',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'all' }],
    },

    // ["all", { ignoreJSX: "single-line" }]
    {
      code: 'const Component = (<div />);',
      options: ['all', { ignoreJSX: 'single-line' }],
    },
    {
      code: 'const Component = ((<div />));',
      options: ['all', { ignoreJSX: 'single-line' }],
    },
    {
      code: 'const Component = (<div><p /></div>)',
      options: ['all', { ignoreJSX: 'single-line' }],
    },
    {
      code: $`
        const Component = (
          <div />
        );
      `,
      options: ['all', { ignoreJSX: 'single-line' }],
    },
    {
      code: [
        'const Component =',
        '(<div />)',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'single-line' }],
    },

    // ["all", { ignoreJSX: "multi-line" }]
    {
      code: [
        'const Component = (',
        '<div>',
        '  <p />',
        '</div>',
        ');',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'multi-line' }],
    },
    {
      code: [
        'const Component = ((',
        '<div>',
        '  <p />',
        '</div>',
        '));',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'multi-line' }],
    },
    {
      code: [
        'const Component = (<div>',
        '  <p />',
        '</div>);',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'multi-line' }],
    },
    {
      code: [
        'const Component =',
        '(<div>',
        '  <p />',
        '</div>);',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'multi-line' }],
    },
    {
      code: [
        'const Component = (<div',
        '  prop={true}',
        '/>)',
      ].join('\n'),
      options: ['all', { ignoreJSX: 'multi-line' }],
    },

    // ["all", { enforceForArrowConditionals: false }]
    {
      code: 'var a = b => 1 ? 2 : 3',
      options: ['all', { enforceForArrowConditionals: false }],
    },
    {
      code: 'var a = b => (1 ? 2 : 3)',
      options: ['all', { enforceForArrowConditionals: false }],
    },
    {
      code: 'var a = (b) => (1 ? 2 : 3)',
      options: ['all', { enforceForArrowConditionals: false }],
    },
    {
      code: 'var a = (b) => ((1 ? 2 : 3))',
      options: ['all', { enforceForArrowConditionals: false }],
    },
    {
      code: 'var a = b => (1 ? 2 : 3)',
      options: ['all', { ignoredNodes: ['ArrowFunctionExpression[body.type=ConditionalExpression]'] }],
    },
    {
      code: 'var a = (b) => (1 ? 2 : 3)',
      options: ['all', { ignoredNodes: ['ArrowFunctionExpression[body.type=ConditionalExpression]'] }],
    },
    {
      code: 'var a = (b) => ((1 ? 2 : 3))',
      options: ['all', { ignoredNodes: ['ArrowFunctionExpression[body.type=ConditionalExpression]'] }],
    },

    // ["all", { enforceForSequenceExpressions: false }]
    { code: '(a, b)', options: ['all', { enforceForSequenceExpressions: false }] },
    { code: '((a, b))', options: ['all', { enforceForSequenceExpressions: false }] },
    { code: '(foo(), bar());', options: ['all', { enforceForSequenceExpressions: false }] },
    { code: '((foo(), bar()));', options: ['all', { enforceForSequenceExpressions: false }] },
    { code: 'if((a, b)){}', options: ['all', { enforceForSequenceExpressions: false }] },
    { code: 'if(((a, b))){}', options: ['all', { enforceForSequenceExpressions: false }] },
    { code: 'while ((val = foo(), val < 10));', options: ['all', { enforceForSequenceExpressions: false }] },

    // ["all", { enforceForNewInMemberExpressions: false }]
    { code: '(new foo()).bar', options: ['all', { enforceForNewInMemberExpressions: false }] },
    { code: '(new foo())[bar]', options: ['all', { enforceForNewInMemberExpressions: false }] },
    { code: '(new foo()).bar()', options: ['all', { enforceForNewInMemberExpressions: false }] },
    { code: '(new foo(bar)).baz', options: ['all', { enforceForNewInMemberExpressions: false }] },
    { code: '(new foo.bar()).baz', options: ['all', { enforceForNewInMemberExpressions: false }] },
    { code: '(new foo.bar()).baz()', options: ['all', { enforceForNewInMemberExpressions: false }] },
    { code: '((new foo.bar())).baz()', options: ['all', { enforceForNewInMemberExpressions: false }] },
    { code: '(new foo()).bar', options: ['all', { ignoredNodes: ['MemberExpression[object.type=NewExpression]'] }] },
    { code: '(new foo())[bar]', options: ['all', { ignoredNodes: ['MemberExpression[object.type=NewExpression]'] }] },
    { code: '(new foo()).bar()', options: ['all', { ignoredNodes: ['MemberExpression[object.type=NewExpression]'] }] },
    { code: '(new foo(bar)).baz', options: ['all', { ignoredNodes: ['MemberExpression[object.type=NewExpression]'] }] },
    { code: '(new foo.bar()).baz', options: ['all', { ignoredNodes: ['MemberExpression[object.type=NewExpression]'] }] },
    { code: '(new foo.bar()).baz()', options: ['all', { ignoredNodes: ['MemberExpression[object.type=NewExpression]'] }] },
    { code: '((new foo.bar())).baz()', options: ['all', { ignoredNodes: ['MemberExpression[object.type=NewExpression]'] }] },

    // ["all", { enforceForFunctionPrototypeMethods: false }]
    { code: 'var foo = (function(){}).call()', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = (function(){}).apply()', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = (function(){}.call())', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = (function(){}.apply())', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = (function(){}).call(arg)', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = (function(){}.apply(arg))', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = (function(){}[\'call\']())', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = (function(){})[`apply`]()', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = ((function(){})).call()', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = ((function(){}).apply())', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = ((function(){}.call()))', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = ((((function(){})).apply()))', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'foo((function(){}).call().bar)', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'foo = (function(){}).call()()', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'foo = (function(){}.call())()', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = { bar: (function(){}.call()) }', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'var foo = { [(function(){}.call())]: bar  }', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'if((function(){}).call()){}', options: ['all', { enforceForFunctionPrototypeMethods: false }] },
    { code: 'while((function(){}.apply())){}', options: ['all', { enforceForFunctionPrototypeMethods: false }] },

    'let a = [ ...b ]',
    'let a = { ...b }',
    {
      code: 'let a = { ...b }',
      parserOptions: { ecmaVersion: 2018 },
    },
    'let a = [ ...(b, c) ]',
    'let a = { ...(b, c) }',
    {
      code: 'let a = { ...(b, c) }',
      parserOptions: { ecmaVersion: 2018 },
    },
    'var [x = (1, foo)] = bar',
    'class A extends B {}',
    'const A = class extends B {}',
    'class A extends (B=C) {}',
    'const A = class extends (B=C) {}',
    'class A extends (++foo) {}',
    '() => ({ foo: 1 })',
    '() => ({ foo: 1 }).foo',
    '() => ({ foo: 1 }.foo().bar).baz.qux()',
    '() => ({ foo: 1 }.foo().bar + baz)',
    {
      code: 'export default (a, b)',
      parserOptions: { sourceType: 'module' },
    },
    {
      code: 'export default (function(){}).foo',
      parserOptions: { sourceType: 'module' },
    },
    {
      code: 'export default (class{}).foo',
      parserOptions: { sourceType: 'module' },
    },
    '({}).hasOwnProperty.call(foo, bar)',
    '({}) ? foo() : bar()',
    '({}) + foo',
    '(function(){}) + foo',
    '(let)\nfoo',
    '(let[foo]) = 1', // setting the 'foo' property of the 'let' variable to 1
    {
      code: '((function(){}).foo.bar)();',
      options: ['functions'],
    },
    {
      code: '((function(){}).foo)();',
      options: ['functions'],
    },
    '(let)[foo]',

    // ForStatement#init expression cannot start with `let[`. It would be parsed as a `let` declaration with array pattern, or a syntax error.
    'for ((let[a]);;);',
    'for ((let)[a];;);',
    'for ((let[a] = 1);;);',
    'for ((let[a]) = 1;;);',
    'for ((let)[a] = 1;;);',
    'for ((let[a, b] = foo);;);',
    'for ((let[a].b = 1);;);',
    'for ((let[a].b) = 1;;);',
    'for ((let[a]).b = 1;;);',
    'for ((let)[a].b = 1;;);',
    'for ((let[a])();;);',
    'for ((let)[a]();;);',
    'for ((let[a]) + b;;);',

    // ForInStatement#left expression cannot start with `let[`. It would be parsed as a `let` declaration with array pattern, or a syntax error.
    'for ((let[foo]) in bar);',
    'for ((let)[foo] in bar);',
    'for ((let[foo].bar) in baz);',
    'for ((let[foo]).bar in baz);',
    'for ((let)[foo].bar in baz);',

    // ForOfStatement#left expression cannot start with `let`. It's explicitly forbidden by the specification.
    'for ((let) of foo);',
    'for ((let).foo of bar);',
    'for ((let.foo) of bar);',
    'for ((let[foo]) of bar);',
    'for ((let)[foo] of bar);',
    'for ((let.foo.bar) of baz);',
    'for ((let.foo).bar of baz);',
    'for ((let).foo.bar of baz);',
    'for ((let[foo].bar) of baz);',
    'for ((let[foo]).bar of baz);',
    'for ((let)[foo].bar of baz);',
    'for ((let)().foo of bar);',
    'for ((let()).foo of bar);',
    'for ((let().foo) of bar);',

    // https://github.com/eslint/eslint/issues/11706 (also in invalid[])
    'for (let a = (b in c); ;);',
    'for (let a = (b && c in d); ;);',
    'for (let a = (b in c && d); ;);',
    'for (let a = (b => b in c); ;);',
    'for (let a = b => (b in c); ;);',
    'for (let a = (b in c in d); ;);',
    'for (let a = (b in c), d = (e in f); ;);',
    'for (let a = (b => c => b in c); ;);',
    'for (let a = (b && c && d in e); ;);',
    'for (let a = b && (c in d); ;);',
    'for (let a = (b in c) && (d in e); ;);',
    'for ((a in b); ;);',
    'for (a = (b in c); ;);',
    'for ((a in b && c in d && e in f); ;);',
    'for (let a = [] && (b in c); ;);',
    'for (let a = (b in [c]); ;);',
    'for (let a = b => (c in d); ;);',
    'for (let a = (b in c) ? d : e; ;);',
    'for (let a = (b in c ? d : e); ;);',
    'for (let a = b ? c : (d in e); ;);',
    'for (let a = (b in c), d = () => { for ((e in f);;); for ((g in h);;); }; ;); for((i in j); ;);',

    // https://github.com/eslint/eslint/issues/11706 regression tests (also in invalid[])
    'for (let a = b; a; a); a; a;',
    'for (a; a; a); a; a;',
    'for (; a; a); a; a;',
    'for (let a = (b && c) === d; ;);',

    'new (a()).b.c;',
    'new (a().b).c;',
    'new (a().b.c);',
    'new (a().b().d);',
    'new a().b().d;',
    'new (a(b()).c)',
    'new (a.b()).c',

    // Nullish coalescing
    { code: 'var v = (a ?? b) || c', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = a ?? (b || c)', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (a ?? b) && c', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = a ?? (b && c)', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (a || b) ?? c', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = a || (b ?? c)', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (a && b) ?? c', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = a && (b ?? c)', parserOptions: { ecmaVersion: 2020 } },

    // Optional chaining
    { code: 'var v = (obj?.aaa).bbb', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (obj?.aaa)()', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = new (obj?.aaa)()', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = new (obj?.aaa)', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (obj?.aaa)`template`', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (obj?.()).bbb', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (obj?.())()', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = new (obj?.())()', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = new (obj?.())', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var v = (obj?.())`template`', parserOptions: { ecmaVersion: 2020 } },
    { code: '(obj?.aaa).bbb = 0', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var foo = (function(){})?.()', parserOptions: { ecmaVersion: 2020 } },
    { code: 'var foo = (function(){}?.())', parserOptions: { ecmaVersion: 2020 } },
    {
      code: 'var foo = (function(){})?.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: 'var foo = (function(){}?.call())',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      parserOptions: { ecmaVersion: 2020 },
    },
    {
      code: '(0).toString();',
      options: ['functions'],
    },
    {
      code: '(Object.prototype.toString.call())',
      options: ['functions'],
    },
    {
      code: '({}.toString.call());',
      options: ['functions'],
    },
    {
      code: '(function(){} ? a() : b());',
      options: ['functions'],
    },
    {
      code: '(/^a$/).test(x);',
      options: ['functions'],
    },
    {
      code: 'a = (b * c);',
      options: ['functions'],
    },
    {
      code: '(a * b) + c;',
      options: ['functions'],
    },
    {
      code: 'typeof (a);',
      options: ['functions'],
    },

    'const span = /**@type {HTMLSpanElement}*/(event.currentTarget);',
    'if (/** @type {Compiler | MultiCompiler} */(options).hooks) console.log(\'good\');',
    $`
      validate(/** @type {Schema} */ (schema), options, {
          name: "Dev Server",
          baseDataPath: "options",
      });
    `,
    $`
      if (condition) {
          /** @type {ServerOptions} */
          (options.server.options).requestCert = false;
      }
    `,

    // "allowParensAfterCommentPattern" option
    {
      code: 'const net = ipaddr.parseCIDR(/* any-string */ (cidr));',
      options: ['all', { allowParensAfterCommentPattern: 'any-string' }],
    },

    '(a ? b : c) ? d : e',
    {
      code: 'a ? (b ? c : d) : e',
      options: ['all', { nestedConditionalExpressions: false }],
    },
    {
      code: 'a ? b : (c ? d : e)',
      options: ['all', { nestedConditionalExpressions: false }],
    },

    // https://github.com/eslint/eslint/issues/16850
    '(a) = function () {};',
    '(a) = () => {};',
    '(a) = class {};',
    '(a) ??= function () {};',
    '(a) &&= class extends SuperClass {};',
    '(a) ||= async () => {}',
    {
      code: '((a)) = function () {};',
      options: ['functions'],
    },

    {
      code: $`
        const x = [
          ...a ? [1, 2, 3] : [],
          ...(a ? [1, 2, 3] : []),
        ]
      `,
      options: ['all', { allowNodesInSpreadElement: { ConditionalExpression: true } }],
    },
    {
      code: $`
        const x = [
          ...a ? [1, 2, 3] : [],
          ...(a ? [1, 2, 3] : []),
        ]
      `,
      options: ['all', { ignoredNodes: ['SpreadElement[argument.type=ConditionalExpression]'] }],
    },
    {
      code: $`
        const x = [
          ...b ?? c,
          ...(b ?? c),
        ]
      `,
      options: ['all', { allowNodesInSpreadElement: { LogicalExpression: true } }],
    },
    {
      code: $`
        const x = [
          ...b ?? c,
          ...(b ?? c),
        ]
      `,
      options: ['all', { ignoredNodes: ['SpreadElement[argument.type=LogicalExpression]'] }],
    },
    {
      code: $`
        const fruits = {
          ...isSummer && { watermelon: 30 },
          ...(isSummer && { watermelon: 30 }),
        };
      `,
      options: ['all', { allowNodesInSpreadElement: { LogicalExpression: true } }],
    },
    {
      code: $`
        const fruits = {
          ...isSummer && { watermelon: 30 },
          ...(isSummer && { watermelon: 30 }),
        };
      `,
      options: ['all', { ignoredNodes: ['SpreadElement[argument.type=LogicalExpression]'] }],
    },
    {
      code: $`
        async function example() {
          const promiseArray = Promise.resolve([1, 2, 3]);
          console.log(...(await promiseArray));
        }
      `,
      options: ['all', { allowNodesInSpreadElement: { AwaitExpression: true } }],
    },
    {
      code: $`
        async function example() {
          const promiseArray = Promise.resolve([1, 2, 3]);
          console.log(...(await promiseArray));
        }
      `,
      options: ['all', { ignoredNodes: ['SpreadElement[argument.type=AwaitExpression]'] }],
    },
    {
      code: $`
        const x = [
          ...a ? [1, 2, 3] : [],
          ...(a ? [1, 2, 3] : []),
        ]
        
        const fruits = {
          ...isSummer && { watermelon: 30 },
          ...(isSummer && { watermelon: 30 }),
        };
      `,
      options: ['all', { allowNodesInSpreadElement: { LogicalExpression: true, ConditionalExpression: true } }],
    },
    {
      code: $`
        const x = [
          ...a ? [1, 2, 3] : [],
          ...(a ? [1, 2, 3] : []),
        ]
        
        const fruits = {
          ...isSummer && { watermelon: 30 },
          ...(isSummer && { watermelon: 30 }),
        };
      `,
      options: ['all', { ignoredNodes: ['SpreadElement'] }],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/872
    {
      code: $`
        const conditionStatement = (
          condition1 &&
          condition2 &&
          condition3
        );
      `,
      options: ['all', { ignoredNodes: ['VariableDeclarator[init.type="LogicalExpression"]'] }],
    },
    {
      code: $`
        const joinedText = (
          dataFromQuery
            .filter((item) => item.isActive)
            .map((item) => item.name)
            .join("")
        );
      `,
      options: ['all', { ignoredNodes: ['VariableDeclarator[init]'] }],
    },
  ],

  invalid: [
    invalid('(0)', '0'),
    invalid('(  0  )', '  0  '),
    invalid('if((0));', 'if(0);'),
    invalid('if(( 0 ));', 'if( 0 );'),
    invalid('with((0)){}', 'with(0){}'),
    invalid('switch((0)){}', 'switch(0){}'),
    invalid('switch(0){ case (1): break; }', 'switch(0){ case 1: break; }'),
    invalid('for((0);;);', 'for(0;;);'),
    invalid('for(;(0););', 'for(;0;);'),
    invalid('for(;;(0));', 'for(;;0);'),
    invalid('throw(0)', 'throw 0'),
    invalid('while((0));', 'while(0);'),
    invalid('do; while((0))', 'do; while(0)'),
    invalid('for(a in (0));', 'for(a in 0);'),
    invalid('for(a of (0));', 'for(a of 0);', 1),
    invalid('const foo = {[(a)]:1}', 'const foo = {[a]:1}', 1),
    invalid('const foo = {[(a=b)]:1}', 'const foo = {[a=b]:1}', 1),
    invalid('const foo = {*[(Symbol.iterator)]() {}}', 'const foo = {*[Symbol.iterator]() {}}', 1),
    invalid('const foo = { get [(a)]() {}}', 'const foo = { get [a]() {}}', 1),
    invalid('const foo = {[(a+b)]:c, d}', 'const foo = {[a+b]:c, d}', 1),
    invalid('const foo = {a, [(b+c)]:d, e}', 'const foo = {a, [b+c]:d, e}', 1),
    invalid('const foo = {[(a+b)]:c, d:e}', 'const foo = {[a+b]:c, d:e}', 1),
    invalid('const foo = {a:b, [(c+d)]:e, f:g}', 'const foo = {a:b, [c+d]:e, f:g}', 1),
    invalid('const foo = {[(a+b)]:c, [d]:e}', 'const foo = {[a+b]:c, [d]:e}', 1),
    invalid('const foo = {[a]:b, [(c+d)]:e, [f]:g}', 'const foo = {[a]:b, [c+d]:e, [f]:g}', 1),
    invalid('const foo = {[(a+b)]:c, [(d,e)]:f}', 'const foo = {[a+b]:c, [(d,e)]:f}', 1),
    invalid('const foo = {[(a,b)]:c, [(d+e)]:f, [(g,h)]:e}', 'const foo = {[(a,b)]:c, [d+e]:f, [(g,h)]:e}', 1),
    invalid('const foo = {a, b:c, [(d+e)]:f, [(g,h)]:i, [j]:k}', 'const foo = {a, b:c, [d+e]:f, [(g,h)]:i, [j]:k}', 1),
    invalid('const foo = {[a+(b*c)]:d}', 'const foo = {[a+b*c]:d}', 1),
    invalid('const foo = {[(a, (b+c))]:d}', 'const foo = {[(a, b+c)]:d}', 1),
    invalid('const {[(a)]:b} = {}', 'const {[a]:b} = {}', 1),
    invalid('const {[(a=b)]:c=1} = {}', 'const {[a=b]:c=1} = {}', 1),
    invalid('const {[(a+b)]:c, d} = {}', 'const {[a+b]:c, d} = {}', 1),
    invalid('const {a, [(b+c)]:d, e} = {}', 'const {a, [b+c]:d, e} = {}', 1),
    invalid('const {[(a+b)]:c, d:e} = {}', 'const {[a+b]:c, d:e} = {}', 1),
    invalid('const {a:b, [(c+d)]:e, f:g} = {}', 'const {a:b, [c+d]:e, f:g} = {}', 1),
    invalid('const {[(a+b)]:c, [d]:e} = {}', 'const {[a+b]:c, [d]:e} = {}', 1),
    invalid('const {[a]:b, [(c+d)]:e, [f]:g} = {}', 'const {[a]:b, [c+d]:e, [f]:g} = {}', 1),
    invalid('const {[(a+b)]:c, [(d,e)]:f} = {}', 'const {[a+b]:c, [(d,e)]:f} = {}', 1),
    invalid('const {[(a,b)]:c, [(d+e)]:f, [(g,h)]:e} = {}', 'const {[(a,b)]:c, [d+e]:f, [(g,h)]:e} = {}', 1),
    invalid('const {a, b:c, [(d+e)]:f, [(g,h)]:i, [j]:k} = {}', 'const {a, b:c, [d+e]:f, [(g,h)]:i, [j]:k} = {}', 1),
    invalid('const {[a+(b*c)]:d} = {}', 'const {[a+b*c]:d} = {}', 1),
    invalid('const {[(a, (b+c))]:d} = {}', 'const {[(a, b+c)]:d} = {}', 1),
    invalid('class foo { [(a)](){} }', 'class foo { [a](){} }'),
    invalid('class foo {*[(Symbol.iterator)]() {}}', 'class foo {*[Symbol.iterator]() {}}'),
    invalid('class foo { get [(a)](){} }', 'class foo { get [a](){} }'),
    invalid('class foo { set [(a)](bar){} }', 'class foo { set [a](bar){} }'),
    invalid('class foo { static [(a)](bar){} }', 'class foo { static [a](bar){} }'),
    invalid('class foo { [(a=b)](){} }', 'class foo { [a=b](){} }'),
    invalid('class foo { constructor (){} [(a+b)](){} }', 'class foo { constructor (){} [a+b](){} }'),
    invalid('class foo { [(a+b)](){} constructor (){} }', 'class foo { [a+b](){} constructor (){} }'),
    invalid('class foo { [(a+b)](){} c(){} }', 'class foo { [a+b](){} c(){} }'),
    invalid('class foo { a(){} [(b+c)](){} d(){} }', 'class foo { a(){} [b+c](){} d(){} }'),
    invalid('class foo { [(a+b)](){} [c](){} }', 'class foo { [a+b](){} [c](){} }'),
    invalid('class foo { [a](){} [(b+c)](){} [d](){} }', 'class foo { [a](){} [b+c](){} [d](){} }'),
    invalid('class foo { [(a+b)](){} [(c,d)](){} }', 'class foo { [a+b](){} [(c,d)](){} }'),
    invalid('class foo { [(a,b)](){} [(c+d)](){} }', 'class foo { [(a,b)](){} [c+d](){} }'),
    invalid('class foo { [a+(b*c)](){} }', 'class foo { [a+b*c](){} }'),
    invalid('const foo = class { [(a)](){} }', 'const foo = class { [a](){} }'),
    invalid('class foo { [(x)]; }', 'class foo { [x]; }'),
    invalid('class foo { static [(x)]; }', 'class foo { static [x]; }'),
    invalid('class foo { [(x)] = 1; }', 'class foo { [x] = 1; }'),
    invalid('class foo { static [(x)] = 1; }', 'class foo { static [x] = 1; }'),
    invalid('const foo = class { [(x)]; }', 'const foo = class { [x]; }'),
    invalid('class foo { [(x = y)]; }', 'class foo { [x = y]; }'),
    invalid('class foo { [(x + y)]; }', 'class foo { [x + y]; }'),
    invalid('class foo { [(x ? y : z)]; }', 'class foo { [x ? y : z]; }'),
    invalid('class foo { [((x, y))]; }', 'class foo { [(x, y)]; }'),
    invalid('class foo { x = (y); }', 'class foo { x = y; }'),
    invalid('class foo { static x = (y); }', 'class foo { static x = y; }'),
    invalid('class foo { #x = (y); }', 'class foo { #x = y; }'),
    invalid('class foo { static #x = (y); }', 'class foo { static #x = y; }'),
    invalid('const foo = class { x = (y); }', 'const foo = class { x = y; }'),
    invalid('class foo { x = (() => {}); }', 'class foo { x = () => {}; }'),
    invalid('class foo { x = (y + z); }', 'class foo { x = y + z; }'),
    invalid('class foo { x = (y ? z : q); }', 'class foo { x = y ? z : q; }'),
    invalid('class foo { x = ((y, z)); }', 'class foo { x = (y, z); }'),

    //
    invalid(
      'var foo = (function*() { if ((yield foo())) { return; } }())',
      'var foo = (function*() { if (yield foo()) { return; } }())',
      1,
    ),
    invalid('f((0))', 'f(0)'),
    invalid('f(0, (1))', 'f(0, 1)'),
    invalid('!(0)', '!0'),
    invalid('a[(1)]', 'a[1]'),
    invalid('(a)(b)', 'a(b)'),
    invalid('(async)', 'async'),
    invalid('(a, b)', 'a, b'),
    invalid('var a = (b = c);', 'var a = b = c;'),
    invalid('function f(){ return (a); }', 'function f(){ return a; }'),
    invalid('[a, (b = c)]', '[a, b = c]'),
    invalid('!{a: (b = c)}', '!{a: b = c}'),
    invalid('typeof(0)', 'typeof 0'),
    invalid('typeof (0)', 'typeof 0'),
    invalid('typeof([])', 'typeof[]'),
    invalid('typeof ([])', 'typeof []'),
    invalid('typeof( 0)', 'typeof 0'),
    invalid('typeof(typeof 5)', 'typeof typeof 5'),
    invalid('typeof (typeof 5)', 'typeof typeof 5'),
    invalid('+(+foo)', '+ +foo'),
    invalid('-(-foo)', '- -foo'),
    invalid('+(-foo)', '+-foo'),
    invalid('-(+foo)', '-+foo'),
    invalid('-((bar+foo))', '-(bar+foo)'),
    invalid('+((bar-foo))', '+(bar-foo)'),
    invalid('++(foo)', '++foo'),
    invalid('--(foo)', '--foo'),
    invalid('++\n(foo)', '++\nfoo'),
    invalid('--\n(foo)', '--\nfoo'),
    invalid('++(\nfoo)', '++\nfoo'),
    invalid('--(\nfoo)', '--\nfoo'),
    invalid('(foo)++', 'foo++'),
    invalid('(foo)--', 'foo--'),
    invalid('((foo)\n)++', '(foo\n)++'),
    invalid('((foo\n))--', '(foo\n)--'),
    invalid('((foo\n)\n)++', '(foo\n\n)++'),
    invalid('(a\n.b)--', 'a\n.b--'),
    invalid('(a.\nb)++', 'a.\nb++'),
    invalid('(a\n[\nb\n])--', 'a\n[\nb\n]--'),
    invalid('(a || b) ? c : d', 'a || b ? c : d'),
    invalid('a ? (b = c) : d', 'a ? b = c : d'),
    invalid('a ? b : (c = d)', 'a ? b : c = d'),
    invalid('(c = d) ? (b) : c', '(c = d) ? b : c', null, { options: ['all', { conditionalAssign: false }] }),
    invalid('(c = d) ? b : (c)', '(c = d) ? b : c', null, { options: ['all', { conditionalAssign: false }] }),
    invalid('(a) ? foo : bar', 'a ? foo : bar', null, { options: ['all', { ternaryOperandBinaryExpressions: false }] }),
    invalid('(a()) ? foo : bar', 'a() ? foo : bar', null, { options: ['all', { ternaryOperandBinaryExpressions: false }] }),
    invalid('(a.b) ? foo : bar', 'a.b ? foo : bar', null, { options: ['all', { ternaryOperandBinaryExpressions: false }] }),
    invalid('(a || b) ? foo : (bar)', '(a || b) ? foo : bar', null, { options: ['all', { ternaryOperandBinaryExpressions: false }] }),
    invalid('f((a = b))', 'f(a = b)'),
    invalid('a, (b = c)', 'a, b = c'),
    invalid('a = (b * c)', 'a = b * c'),
    invalid('a + (b * c)', 'a + b * c'),
    invalid('(a * b) + c', 'a * b + c'),
    invalid('(a * b) / c', 'a * b / c'),
    invalid('(2) ** 3 ** 4', '2 ** 3 ** 4', null),
    invalid('2 ** (3 ** 4)', '2 ** 3 ** 4', null),
    invalid('(2 ** 3)', '2 ** 3', null),
    invalid('(2 ** 3) + 1', '2 ** 3 + 1', null),
    invalid('1 - (2 ** 3)', '1 - 2 ** 3', null),
    invalid('-((2 ** 3))', '-(2 ** 3)', null),
    invalid('typeof ((a ** b));', 'typeof (a ** b);', null),
    invalid('((-2)) ** 3', '(-2) ** 3', null),

    invalid('a = (b * c)', 'a = b * c', null, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('(b * c)', 'b * c', null, { options: ['all', { nestedBinaryExpressions: false }] }),

    invalid('a = (b = c)', 'a = b = c'),
    invalid('(a).b', 'a.b'),
    invalid('(0)[a]', '0[a]'),
    invalid('(0.0).a', '0.0.a'),
    invalid('(123.4).a', '123.4.a'),
    invalid('(0.0_0).a', '0.0_0.a'),
    invalid('(0xBEEF).a', '0xBEEF.a'),
    invalid('(0xBE_EF).a', '0xBE_EF.a'),
    invalid('(1e6).a', '1e6.a'),
    invalid('(0123).a', '0123.a'),
    invalid('(08.1).a', '08.1.a'),
    invalid('(09.).a', '09..a'),
    invalid('a[(function() {})]', 'a[function() {}]'),
    invalid('new (function(){})', 'new function(){}'),
    invalid('new (\nfunction(){}\n)', 'new \nfunction(){}\n', 1),
    invalid('((function foo() {return 1;}))()', '(function foo() {return 1;})()'),
    invalid('((function(){ return bar(); })())', '(function(){ return bar(); })()'),
    invalid('(foo()).bar', 'foo().bar'),
    invalid('(foo.bar()).baz', 'foo.bar().baz'),
    invalid('(foo\n.bar())\n.baz', 'foo\n.bar()\n.baz'),
    invalid('(new foo()).bar', 'new foo().bar'),
    invalid('(new foo())[bar]', 'new foo()[bar]'),
    invalid('(new foo()).bar()', 'new foo().bar()'),
    invalid('(new foo(bar)).baz', 'new foo(bar).baz'),
    invalid('(new foo.bar()).baz', 'new foo.bar().baz'),
    invalid('(new foo.bar()).baz()', 'new foo.bar().baz()'),
    invalid('new a[(b()).c]', 'new a[b().c]'),

    invalid('(a)()', 'a()'),
    invalid('(a.b)()', 'a.b()'),
    invalid('(a())()', 'a()()'),
    invalid('(a.b())()', 'a.b()()'),
    invalid('(a().b)()', 'a().b()'),
    invalid('(a().b.c)()', 'a().b.c()'),
    invalid('new (A)', 'new A'),
    invalid('(new A())()', 'new A()()'),
    invalid('(new A(1))()', 'new A(1)()'),
    invalid('((new A))()', '(new A)()'),
    invalid('new (foo\n.baz\n.bar\n.foo.baz)', 'new foo\n.baz\n.bar\n.foo.baz'),
    invalid('new (foo.baz.bar.baz)', 'new foo.baz.bar.baz'),
    invalid('new ((a.b())).c', 'new (a.b()).c'),
    invalid('new ((a().b)).c', 'new (a().b).c'),
    invalid('new ((a().b().d))', 'new (a().b().d)'),
    invalid('new ((a())).b.d', 'new (a()).b.d'),
    invalid('new (a.b).d;', 'new a.b.d;'),
    invalid('new (new A())();', 'new new A()();'),
    invalid('new (new A());', 'new new A();'),
    invalid('new (new A);', 'new new A;'),
    invalid('new (new a.b);', 'new new a.b;'),
    invalid('(a().b).d;', 'a().b.d;'),
    invalid('(a.b()).d;', 'a.b().d;'),
    invalid('(a.b).d;', 'a.b.d;'),

    invalid('0, (_ => 0)', '0, _ => 0', 1),
    invalid('(_ => 0), 0', '_ => 0, 0', 1),
    invalid('a = (_ => 0)', 'a = _ => 0', 1),
    invalid('_ => (a = 0)', '_ => a = 0', 1),
    invalid('x => (({}))', 'x => ({})', 1),

    invalid('new (function(){})', 'new function(){}', null, { options: ['functions'] }),
    invalid('new (\nfunction(){}\n)', 'new \nfunction(){}\n', 1, { options: ['functions'] }),
    invalid('((function foo() {return 1;}))()', '(function foo() {return 1;})()', null, { options: ['functions'] }),
    invalid('a[(function() {})]', 'a[function() {}]', null, { options: ['functions'] }),
    invalid('0, (_ => 0)', '0, _ => 0', 1, { options: ['functions'] }),
    invalid('(_ => 0), 0', '_ => 0, 0', 1, { options: ['functions'] }),
    invalid('a = (_ => 0)', 'a = _ => 0', 1, { options: ['functions'] }),

    {
      code: $`
        var y = (function () {return 1;});
      `,
      output: $`
        var y = function () {return 1;};
      `,
      options: ['functions'],
      errors: [{ messageId: 'unexpected', column: 9 }],
    },
    {
      code: $`
        function fn(){
          return (a==b)
        }
      `,
      output: $`
        function fn(){
          return a==b
        }
      `,
      errors: [{ messageId: 'unexpected' }],
    },

    invalid('while ((foo = bar())) {}', 'while (foo = bar()) {}'),
    invalid('while ((foo = bar())) {}', 'while (foo = bar()) {}', 1, { options: ['all', { conditionalAssign: true }] }),
    invalid('if ((foo = bar())) {}', 'if (foo = bar()) {}'),
    invalid('do; while ((foo = bar()))', 'do; while (foo = bar())'),
    invalid('for (;(a = b););', 'for (;a = b;);'),

    // https://github.com/eslint/eslint/issues/3653
    invalid('((function(){})).foo();', '(function(){}).foo();'),
    invalid('((function(){}).foo());', '(function(){}).foo();'),
    invalid('((function(){}).foo);', '(function(){}).foo;'),
    invalid('0, (function(){}).foo();', '0, function(){}.foo();'),
    invalid('void (function(){}).foo();', 'void function(){}.foo();'),
    invalid('++(function(){}).foo;', '++function(){}.foo;'),
    invalid('bar || (function(){}).foo();', 'bar || function(){}.foo();'),
    invalid('1 + (function(){}).foo();', '1 + function(){}.foo();'),
    invalid('bar ? (function(){}).foo() : baz;', 'bar ? function(){}.foo() : baz;'),
    invalid('bar ? baz : (function(){}).foo();', 'bar ? baz : function(){}.foo();'),
    invalid('bar((function(){}).foo(), 0);', 'bar(function(){}.foo(), 0);'),
    invalid('bar[(function(){}).foo()];', 'bar[function(){}.foo()];'),
    invalid('var bar = (function(){}).foo();', 'var bar = function(){}.foo();'),

    invalid('((class{})).foo();', '(class{}).foo();', null),
    invalid('((class{}).foo());', '(class{}).foo();', null),
    invalid('((class{}).foo);', '(class{}).foo;', null),
    invalid('0, (class{}).foo();', '0, class{}.foo();', null),
    invalid('void (class{}).foo();', 'void class{}.foo();', null),
    invalid('++(class{}).foo;', '++class{}.foo;', null),
    invalid('bar || (class{}).foo();', 'bar || class{}.foo();', null),
    invalid('1 + (class{}).foo();', '1 + class{}.foo();', null),
    invalid('bar ? (class{}).foo() : baz;', 'bar ? class{}.foo() : baz;', null),
    invalid('bar ? baz : (class{}).foo();', 'bar ? baz : class{}.foo();', null),
    invalid('bar((class{}).foo(), 0);', 'bar(class{}.foo(), 0);', null),
    invalid('bar[(class{}).foo()];', 'bar[class{}.foo()];', null),
    invalid('var bar = (class{}).foo();', 'var bar = class{}.foo();', null),
    invalid('var foo = ((bar, baz));', 'var foo = (bar, baz);', null),

    // https://github.com/eslint/eslint/issues/4608
    invalid('function *a() { yield (b); }', 'function *a() { yield b; }', null),
    invalid('function *a() { (yield b), c; }', 'function *a() { yield b, c; }', null),
    invalid('function *a() { yield ((b, c)); }', 'function *a() { yield (b, c); }', null),
    invalid('function *a() { yield (b + c); }', 'function *a() { yield b + c; }', null),

    // https://github.com/eslint/eslint/issues/4229
    invalid([
      'function a() {',
      '    return (b);',
      '}',
    ].join('\n'), [
      'function a() {',
      '    return b;',
      '}',
    ].join('\n')),
    invalid([
      'function a() {',
      '    return',
      '    (b);',
      '}',
    ].join('\n'), [
      'function a() {',
      '    return',
      '    b;',
      '}',
    ].join('\n')),
    invalid([
      'function a() {',
      '    return ((',
      '       b',
      '    ));',
      '}',
    ].join('\n'), [
      'function a() {',
      '    return (',
      '       b',
      '    );',
      '}',
    ].join('\n')),
    invalid([
      'function a() {',
      '    return (<JSX />);',
      '}',
    ].join('\n'), [
      'function a() {',
      '    return <JSX />;',
      '}',
    ].join('\n'), null),
    invalid([
      'function a() {',
      '    return',
      '    (<JSX />);',
      '}',
    ].join('\n'), [
      'function a() {',
      '    return',
      '    <JSX />;',
      '}',
    ].join('\n'), null),
    invalid([
      'function a() {',
      '    return ((',
      '       <JSX />',
      '    ));',
      '}',
    ].join('\n'), [
      'function a() {',
      '    return (',
      '       <JSX />',
      '    );',
      '}',
    ].join('\n'), null),
    invalid([
      'function a() {',
      '    return ((',
      '       <></>',
      '    ));',
      '}',
    ].join('\n'), [
      'function a() {',
      '    return (',
      '       <></>',
      '    );',
      '}',
    ].join('\n'), null),
    invalid('throw (a);', 'throw a;'),
    invalid([
      'throw ((',
      '   a',
      '));',
    ].join('\n'), [
      'throw (',
      '   a',
      ');',
    ].join('\n')),
    invalid([
      'function *a() {',
      '    yield (b);',
      '}',
    ].join('\n'), [
      'function *a() {',
      '    yield b;',
      '}',
    ].join('\n'), null),
    invalid([
      'function *a() {',
      '    yield',
      '    (b);',
      '}',
    ].join('\n'), [
      'function *a() {',
      '    yield',
      '    b;',
      '}',
    ].join('\n'), null),
    invalid([
      'function *a() {',
      '    yield ((',
      '       b',
      '    ));',
      '}',
    ].join('\n'), [
      'function *a() {',
      '    yield (',
      '       b',
      '    );',
      '}',
    ].join('\n'), null),

    // returnAssign option
    {
      code: 'function a(b) { return (b || c); }',
      output: 'function a(b) { return b || c; }',
      options: ['all', { returnAssign: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'function a(b) { return ((b = c) || (d = e)); }',
      output: 'function a(b) { return (b = c) || (d = e); }',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'function a(b) { return (b = 1); }',
      output: 'function a(b) { return b = 1; }',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'function a(b) { return c ? (d = b) : (e = b); }',
      output: 'function a(b) { return c ? d = b : e = b; }',
      errors: [
        {
          messageId: 'unexpected',
        },
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => (b || c);',
      output: 'b => b || c;',
      options: ['all', { returnAssign: false }],

      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => ((b = c) || (d = e));',
      output: 'b => (b = c) || (d = e);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => (b = 1);',
      output: 'b => b = 1;',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => c ? (d = b) : (e = b);',
      output: 'b => c ? d = b : e = b;',
      errors: [
        {
          messageId: 'unexpected',
        },
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => { return (b || c); }',
      output: 'b => { return b || c; }',
      options: ['all', { returnAssign: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => { return ((b = c) || (d = e)) };',
      output: 'b => { return (b = c) || (d = e) };',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => { return (b = 1) };',
      output: 'b => { return b = 1 };',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'b => { return c ? (d = b) : (e = b); }',
      output: 'b => { return c ? d = b : e = b; }',
      errors: [
        {
          messageId: 'unexpected',
        },
        {
          messageId: 'unexpected',
        },
      ],
    },

    // https://github.com/eslint-stylistic/eslint-stylistic/issues/699
    {
      code: `
        ((a, b) => {
          return (
            a % b == 0
          ) || (a % b == 1)
        })()
      `,
      output: `
        ((a, b) => {
          return (
            a % b == 0
          ) || a % b == 1
        })()
      `,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `
        ((a, b) => {
          return (
            (a % b == 0)
            || a % b == 1
          )
        })()
      `,
      output: `
        ((a, b) => {
          return (
            a % b == 0
            || a % b == 1
          )
        })()
      `,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `
        ((a, b) => {
          return (a % b == 0)
            || (a % b == 1)
        })()
      `,
      output: `
        ((a, b) => {
          return a % b == 0
            || a % b == 1
        })()
      `,
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    {
      code: `
        (a, b) => {
          return (a % b == 0) || (a % b == 1)
        }
      `,
      output: `
        (a, b) => {
          return a % b == 0 || a % b == 1
        }
      `,
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },

    // async/await
    {
      code: 'async function a() { (await a) + (await b); }',
      output: 'async function a() { await a + await b; }',
      errors: [
        {
          messageId: 'unexpected',
        },
        {
          messageId: 'unexpected',
        },
      ],
    },
    invalid('async function a() { await (a); }', 'async function a() { await a; }', null),
    invalid('async function a() { await (a()); }', 'async function a() { await a(); }', null),
    invalid('async function a() { await (+a); }', 'async function a() { await +a; }', null),
    invalid('async function a() { +(await a); }', 'async function a() { +await a; }', null),
    invalid('async function a() { await ((a,b)); }', 'async function a() { await (a,b); }', null),
    invalid('async function a() { a ** (await b); }', 'async function a() { a ** await b; }', null),

    invalid('(foo) instanceof bar', 'foo instanceof bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('(foo) in bar', 'foo in bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('(foo) + bar', 'foo + bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('(foo) && bar', 'foo && bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('foo instanceof (bar)', 'foo instanceof bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('foo in (bar)', 'foo in bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('foo + (bar)', 'foo + bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),
    invalid('foo && (bar)', 'foo && bar', 1, { options: ['all', { nestedBinaryExpressions: false }] }),

    // ["all", { ignoreJSX: "multi-line" }]
    invalid('const Component = (<div />);', 'const Component = <div />;', 1, {
      options: ['all', { ignoreJSX: 'multi-line' }],
    }),
    invalid([
      'const Component = (',
      '  <div />',
      ');',
    ].join('\n'), 'const Component = \n  <div />\n;', 1, {
      options: ['all', { ignoreJSX: 'multi-line' }],
    }),
    invalid([
      'const Component = (',
      '  <></>',
      ');',
    ].join('\n'), 'const Component = \n  <></>\n;', 1, {
      options: ['all', { ignoreJSX: 'multi-line' }],
    }),

    // ["all", { ignoreJSX: "single-line" }]
    invalid([
      'const Component = (',
      '<div>',
      '  <p />',
      '</div>',
      ');',
    ].join('\n'), 'const Component = \n<div>\n  <p />\n</div>\n;', 1, {
      options: ['all', { ignoreJSX: 'single-line' }],
    }),
    invalid([
      'const Component = (<div>',
      '  <p />',
      '</div>);',
    ].join('\n'), 'const Component = <div>\n  <p />\n</div>;', 1, {
      options: ['all', { ignoreJSX: 'single-line' }],
    }),
    invalid([
      'const Component = (<div',
      '  prop={true}',
      '/>)',
    ].join('\n'), 'const Component = <div\n  prop={true}\n/>', 1, {
      options: ['all', { ignoreJSX: 'single-line' }],
    }),

    // ["all", { ignoreJSX: "none" }] default, same as unspecified
    invalid('const Component = (<div />);', 'const Component = <div />;', 1, {
      options: ['all', { ignoreJSX: 'none' }],
    }),
    invalid([
      'const Component = (<div>',
      '<p />',
      '</div>)',
    ].join('\n'), 'const Component = <div>\n<p />\n</div>', 1, {
      options: ['all', { ignoreJSX: 'none' }],
    }),

    // ["all", { enforceForArrowConditionals: true }]
    {
      code: 'var a = (b) => (1 ? 2 : 3)',
      output: 'var a = (b) => 1 ? 2 : 3',
      options: ['all', { enforceForArrowConditionals: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var a = (b) => ((1 ? 2 : 3))',
      output: 'var a = (b) => (1 ? 2 : 3)',
      options: ['all', { enforceForArrowConditionals: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },

    // ["all", { enforceForSequenceExpressions: true }]
    {
      code: '(a, b)',
      output: 'a, b',
      options: ['all'],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '(a, b)',
      output: 'a, b',
      options: ['all', {}],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '(a, b)',
      output: 'a, b',
      options: ['all', { enforceForSequenceExpressions: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '(foo(), bar());',
      output: 'foo(), bar();',
      options: ['all', { enforceForSequenceExpressions: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'if((a, b)){}',
      output: 'if(a, b){}',
      options: ['all', { enforceForSequenceExpressions: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'while ((val = foo(), val < 10));',
      output: 'while (val = foo(), val < 10);',
      options: ['all', { enforceForSequenceExpressions: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },

    // ["all", { enforceForNewInMemberExpressions: true }]
    {
      code: '(new foo()).bar',
      output: 'new foo().bar',
      options: ['all'],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '(new foo()).bar',
      output: 'new foo().bar',
      options: ['all', {}],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '(new foo()).bar',
      output: 'new foo().bar',
      options: ['all', { enforceForNewInMemberExpressions: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '(new foo())[bar]',
      output: 'new foo()[bar]',
      options: ['all', { enforceForNewInMemberExpressions: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '(new foo.bar()).baz',
      output: 'new foo.bar().baz',
      options: ['all', { enforceForNewInMemberExpressions: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },

    // enforceForFunctionPrototypeMethods
    {
      code: 'var foo = (function(){}).call()',
      output: 'var foo = function(){}.call()',
      options: ['all'],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.apply())',
      output: 'var foo = function(){}.apply()',
      options: ['all'],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}).apply()',
      output: 'var foo = function(){}.apply()',
      options: ['all', {}],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.call())',
      output: 'var foo = function(){}.call()',
      options: ['all', {}],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}).call()',
      output: 'var foo = function(){}.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}).apply()',
      output: 'var foo = function(){}.apply()',
      options: ['all', { enforceForFunctionPrototypeMethods: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.call())',
      output: 'var foo = function(){}.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.apply())',
      output: 'var foo = function(){}.apply()',
      options: ['all', { enforceForFunctionPrototypeMethods: true }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.call)()', // removing these parens does not cause any conflicts with wrap-iife
      output: 'var foo = function(){}.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.apply)()', // removing these parens does not cause any conflicts with wrap-iife
      output: 'var foo = function(){}.apply()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}).call',
      output: 'var foo = function(){}.call',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.call)',
      output: 'var foo = function(){}.call',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = new (function(){}).call()',
      output: 'var foo = new function(){}.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (new function(){}.call())',
      output: 'var foo = new function(){}.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){})[call]()',
      output: 'var foo = function(){}[call]()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}[apply]())',
      output: 'var foo = function(){}[apply]()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}).bar()',
      output: 'var foo = function(){}.bar()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.bar())',
      output: 'var foo = function(){}.bar()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}).call.call()',
      output: 'var foo = function(){}.call.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (function(){}.call.call())',
      output: 'var foo = function(){}.call.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (call())',
      output: 'var foo = call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (apply())',
      output: 'var foo = apply()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (bar).call()',
      output: 'var foo = bar.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = (bar.call())',
      output: 'var foo = bar.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: '((() => {}).call())',
      output: '(() => {}).call()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = function(){}.call((a.b))',
      output: 'var foo = function(){}.call(a.b)',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = function(){}.call((a).b)',
      output: 'var foo = function(){}.call(a.b)',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'var foo = function(){}[(\'call\')]()',
      output: 'var foo = function(){}[\'call\']()',
      options: ['all', { enforceForFunctionPrototypeMethods: false }],
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },

    // https://github.com/eslint/eslint/issues/8175
    invalid(
      'let a = [...(b)]',
      'let a = [...b]',
      1,
    ),
    invalid(
      'let a = {...(b)}',
      'let a = {...b}',
      1,
    ),
    invalid(
      'let a = {...(b)}',
      'let a = {...b}',
      1,
      { parserOptions: { ecmaVersion: 2018 } },
    ),
    invalid(
      'let a = [...((b, c))]',
      'let a = [...(b, c)]',
      1,
    ),
    invalid(
      'let a = {...((b, c))}',
      'let a = {...(b, c)}',
      1,
    ),
    invalid(
      'let a = {...((b, c))}',
      'let a = {...(b, c)}',
      1,
      { parserOptions: { ecmaVersion: 2018 } },
    ),
    invalid(
      'class A extends (B) {}',
      'class A extends B {}',
      1,
    ),
    invalid(
      'const A = class extends (B) {}',
      'const A = class extends B {}',
      1,
    ),
    invalid(
      'class A extends ((B=C)) {}',
      'class A extends (B=C) {}',
      1,
    ),
    invalid(
      'const A = class extends ((B=C)) {}',
      'const A = class extends (B=C) {}',
      1,
    ),
    invalid(
      'class A extends ((++foo)) {}',
      'class A extends (++foo) {}',
      1,
    ),
    invalid(
      'export default ((a, b))',
      'export default (a, b)',
      1,
      { parserOptions: { sourceType: 'module' } },
    ),
    invalid(
      'export default (() => {})',
      'export default () => {}',
      1,
      { parserOptions: { sourceType: 'module' } },
    ),
    invalid(
      'export default ((a, b) => a + b)',
      'export default (a, b) => a + b',
      1,
      { parserOptions: { sourceType: 'module' } },
    ),
    invalid(
      'export default (a => a)',
      'export default a => a',
      1,
      { parserOptions: { sourceType: 'module' } },
    ),
    invalid(
      'export default (a = b)',
      'export default a = b',
      1,
      { parserOptions: { sourceType: 'module' } },
    ),
    invalid(
      'export default (a ? b : c)',
      'export default a ? b : c',
      1,
      { parserOptions: { sourceType: 'module' } },
    ),
    invalid(
      'export default (a)',
      'export default a',
      1,
      { parserOptions: { sourceType: 'module' } },
    ),
    invalid(
      'for (foo of(bar));',
      'for (foo of bar);',
      1,
    ),
    invalid(
      'for ((foo) of bar);',
      'for (foo of bar);',
      1,
    ),
    invalid(
      'for (foo of (baz = bar));',
      'for (foo of baz = bar);',
      1,
    ),
    invalid(
      'function* f() { for (foo of (yield bar)); }',
      'function* f() { for (foo of yield bar); }',
      1,
    ),
    invalid(
      'for (foo of ((bar, baz)));',
      'for (foo of (bar, baz));',
      1,
    ),
    invalid(
      'for ((foo)in bar);',
      'for (foo in bar);',
      1,
    ),
    invalid(
      'for ((foo[\'bar\'])of baz);',
      'for (foo[\'bar\']of baz);',
      1,
    ),
    invalid(
      '() => (({ foo: 1 }).foo)',
      '() => ({ foo: 1 }).foo',
      1,
    ),
    invalid(
      '(let).foo',
      'let.foo',
      1,
    ),

    // ForStatement#init expression cannot start with `let[`, but it can start with `let` if it isn't followed by `[`
    invalid(
      'for ((let);;);',
      'for (let;;);',
      1,
    ),
    invalid(
      'for ((let = 1);;);',
      'for (let = 1;;);',
      1,
    ),
    invalid(
      'for ((let) = 1;;);',
      'for (let = 1;;);',
      1,
    ),
    invalid(
      'for ((let = []);;);',
      'for (let = [];;);',
      1,
    ),
    invalid(
      'for ((let) = [];;);',
      'for (let = [];;);',
      1,
    ),
    invalid(
      'for ((let());;);',
      'for (let();;);',
      1,
    ),
    invalid(
      'for ((let([]));;);',
      'for (let([]);;);',
      1,
    ),
    invalid(
      'for ((let())[a];;);',
      'for (let()[a];;);',
      1,
    ),
    invalid(
      'for ((let`[]`);;);',
      'for (let`[]`;;);',
      1,
    ),
    invalid(
      'for ((let.a);;);',
      'for (let.a;;);',
      1,
    ),
    invalid(
      'for ((let).a;;);',
      'for (let.a;;);',
      1,
    ),
    invalid(
      'for ((let).a = 1;;);',
      'for (let.a = 1;;);',
      1,
    ),
    invalid(
      'for ((let).a[b];;);',
      'for (let.a[b];;);',
      1,
    ),
    invalid(
      'for ((let.a)[b];;);',
      'for (let.a[b];;);',
      1,
    ),
    invalid(
      'for ((let.a[b]);;);',
      'for (let.a[b];;);',
      1,
    ),
    invalid(
      'for ((let);[];);',
      'for (let;[];);',
      1,
    ),
    invalid(
      'for (((let[a]));;);',
      'for ((let[a]);;);',
      1,
    ),
    invalid(
      'for (((let))[a];;);',
      'for ((let)[a];;);',
      1,
    ),
    invalid(
      'for (((let[a])).b;;);',
      'for ((let[a]).b;;);',
      1,
    ),
    invalid(
      'for (((let))[a].b;;);',
      'for ((let)[a].b;;);',
      1,
    ),
    invalid(
      'for (((let)[a]).b;;);',
      'for ((let)[a].b;;);',
      1,
    ),
    invalid(
      'for (((let[a]) = b);;);',
      'for ((let[a]) = b;;);',
      1,
    ),
    invalid(
      'for (((let)[a]) = b;;);',
      'for ((let)[a] = b;;);',
      1,
    ),
    invalid(
      'for (((let)[a] = b);;);',
      'for ((let)[a] = b;;);',
      1,
    ),
    invalid(
      'for ((Let[a]);;);',
      'for (Let[a];;);',
      1,
    ),
    invalid(
      'for ((lett)[a];;);',
      'for (lett[a];;);',
      1,
    ),

    // ForInStatement#left expression cannot start with `let[`, but it can start with `let` if it isn't followed by `[`
    invalid(
      'for ((let) in foo);',
      'for (let in foo);',
      1,
    ),
    invalid(
      'for ((let())[a] in foo);',
      'for (let()[a] in foo);',
      1,
    ),
    invalid(
      'for ((let.a) in foo);',
      'for (let.a in foo);',
      1,
    ),
    invalid(
      'for ((let).a in foo);',
      'for (let.a in foo);',
      1,
    ),
    invalid(
      'for ((let).a.b in foo);',
      'for (let.a.b in foo);',
      1,
    ),
    invalid(
      'for ((let).a[b] in foo);',
      'for (let.a[b] in foo);',
      1,
    ),
    invalid(
      'for ((let.a)[b] in foo);',
      'for (let.a[b] in foo);',
      1,
    ),
    invalid(
      'for ((let.a[b]) in foo);',
      'for (let.a[b] in foo);',
      1,
    ),
    invalid(
      'for (((let[a])) in foo);',
      'for ((let[a]) in foo);',
      1,
    ),
    invalid(
      'for (((let))[a] in foo);',
      'for ((let)[a] in foo);',
      1,
    ),
    invalid(
      'for (((let[a])).b in foo);',
      'for ((let[a]).b in foo);',
      1,
    ),
    invalid(
      'for (((let))[a].b in foo);',
      'for ((let)[a].b in foo);',
      1,
    ),
    invalid(
      'for (((let)[a]).b in foo);',
      'for ((let)[a].b in foo);',
      1,
    ),
    invalid(
      'for (((let[a]).b) in foo);',
      'for ((let[a]).b in foo);',
      1,
    ),
    invalid(
      'for ((Let[a]) in foo);',
      'for (Let[a] in foo);',
      1,
    ),
    invalid(
      'for ((lett)[a] in foo);',
      'for (lett[a] in foo);',
      1,
    ),

    // ForOfStatement#left expression cannot start with `let`
    invalid(
      'for (((let)) of foo);',
      'for ((let) of foo);',
      1,
    ),
    invalid(
      'for (((let)).a of foo);',
      'for ((let).a of foo);',
      1,
    ),
    invalid(
      'for (((let))[a] of foo);',
      'for ((let)[a] of foo);',
      1,
    ),
    invalid(
      'for (((let).a) of foo);',
      'for ((let).a of foo);',
      1,
    ),
    invalid(
      'for (((let[a]).b) of foo);',
      'for ((let[a]).b of foo);',
      1,
    ),
    invalid(
      'for (((let).a).b of foo);',
      'for ((let).a.b of foo);',
      1,
    ),
    invalid(
      'for (((let).a.b) of foo);',
      'for ((let).a.b of foo);',
      1,
    ),
    invalid(
      'for (((let.a).b) of foo);',
      'for ((let.a).b of foo);',
      1,
    ),
    invalid(
      'for (((let()).a) of foo);',
      'for ((let()).a of foo);',
      1,
    ),
    invalid(
      'for ((Let) of foo);',
      'for (Let of foo);',
      1,
    ),
    invalid(
      'for ((lett) of foo);',
      'for (lett of foo);',
      1,
    ),

    invalid('for (a in (b, c));', 'for (a in b, c);', null),
    invalid('for (a of (b));', 'for (a of b);'),
    invalid(
      '(let)',
      'let',
      1,
    ),
    invalid(
      '((let))',
      '(let)',
      1,
    ),
    invalid('let s = `${(v)}`', 'let s = `${v}`'),
    invalid('let s = `${(a, b)}`', 'let s = `${a, b}`'),
    invalid('function foo(a = (b)) {}', 'function foo(a = b) {}'),
    invalid('const bar = (a = (b)) => a', 'const bar = (a = b) => a'),
    invalid('const [a = (b)] = []', 'const [a = b] = []'),
    invalid('const {a = (b)} = {}', 'const {a = b} = {}'),

    // LHS of assignments/Assignment targets
    invalid('(a) = b', 'a = b'),
    invalid('(a.b) = c', 'a.b = c'),
    invalid('(a) += b', 'a += b'),
    invalid('(a.b) >>= c', 'a.b >>= c'),
    invalid('[(a) = b] = []', '[a = b] = []'),
    invalid('[(a.b) = c] = []', '[a.b = c] = []'),
    invalid('({ a: (b) = c } = {})', '({ a: b = c } = {})'),
    invalid('({ a: (b.c) = d } = {})', '({ a: b.c = d } = {})'),
    invalid('[(a)] = []', '[a] = []'),
    invalid('[(a.b)] = []', '[a.b] = []'),
    invalid('[,(a),,] = []', '[,a,,] = []'),
    invalid('[...(a)] = []', '[...a] = []'),
    invalid('[...(a.b)] = []', '[...a.b] = []'),
    invalid('({ a: (b) } = {})', '({ a: b } = {})'),
    invalid('({ a: (b.c) } = {})', '({ a: b.c } = {})'),
    invalid('({ ...(a) } = {})', '({ ...a } = {})'),
    invalid('({ ...(a.b) } = {})', '({ ...a.b } = {})'),

    // https://github.com/eslint/eslint/issues/11706 (also in valid[])
    {
      code: 'for ((a = (b in c)); ;);',
      output: 'for ((a = b in c); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = ((b in c) && (d in e)); ;);',
      output: 'for (let a = (b in c && d in e); ;);',
      errors: Array.from({ length: 2 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = ((b in c) in d); ;);',
      output: 'for (let a = (b in c in d); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b && (c in d)), e = (f in g); ;);',
      output: 'for (let a = (b && c in d), e = (f in g); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b + c), d = (e in f); ;);',
      output: 'for (let a = b + c, d = (e in f); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = [(b in c)]; ;);',
      output: 'for (let a = [b in c]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = [b, (c in d)]; ;);',
      output: 'for (let a = [b, c in d]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = ([b in c]); ;);',
      output: 'for (let a = [b in c]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = ([b, c in d]); ;);',
      output: 'for (let a = [b, c in d]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for ((a = [b in c]); ;);',
      output: 'for (a = [b in c]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = [b && (c in d)]; ;);',
      output: 'for (let a = [b && c in d]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = [(b && c in d)]; ;);',
      output: 'for (let a = [b && c in d]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = ([b && c in d]); ;);',
      output: 'for (let a = [b && c in d]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for ((a = [b && c in d]); ;);',
      output: 'for (a = [b && c in d]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for ([(a in b)]; ;);',
      output: 'for ([a in b]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (([a in b]); ;);',
      output: 'for ([a in b]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = [(b in c)], d = (e in f); ;);',
      output: 'for (let a = [b in c], d = (e in f); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let [a = (b in c)] = []; ;);',
      output: 'for (let [a = b in c] = []; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let [a = b && (c in d)] = []; ;);',
      output: 'for (let [a = b && c in d] = []; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = () => { (b in c) }; ;);',
      output: 'for (let a = () => { b in c }; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = () => { a && (b in c) }; ;);',
      output: 'for (let a = () => { a && b in c }; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = function () { (b in c) }; ;);',
      output: 'for (let a = function () { b in c }; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = { a: (b in c) }; ;);',
      output: 'for (let a = { a: b in c }; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = { a: b && (c in d) }; ;);',
      output: 'for (let a = { a: b && c in d }; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let { a = (b in c) } = {}; ;);',
      output: 'for (let { a = b in c } = {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let { a = b && (c in d) } = {}; ;);',
      output: 'for (let { a = b && c in d } = {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let { a: { b = c && (d in e) } } = {}; ;);',
      output: 'for (let { a: { b = c && d in e } } = {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = `${(a in b)}`; ;);',
      output: 'for (let a = `${a in b}`; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = `${a && (b in c)}`; ;);',
      output: 'for (let a = `${a && b in c}`; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b = (c in d)) => {}; ;);',
      output: 'for (let a = (b = c in d) => {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b = c && (d in e)) => {}; ;);',
      output: 'for (let a = (b = c && d in e) => {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b, c = d && (e in f)) => {}; ;);',
      output: 'for (let a = (b, c = d && e in f) => {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = function (b = c && (d in e)) {}; ;);',
      output: 'for (let a = function (b = c && d in e) {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = function (b, c = d && (e in f)) {}; ;);',
      output: 'for (let a = function (b, c = d && e in f) {}; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b((c in d)); ;);',
      output: 'for (let a = b(c in d); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b(c, (d in e)); ;);',
      output: 'for (let a = b(c, d in e); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b(c && (d in e)); ;);',
      output: 'for (let a = b(c && d in e); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b(c, d && (e in f)); ;);',
      output: 'for (let a = b(c, d && e in f); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = new b((c in d)); ;);',
      output: 'for (let a = new b(c in d); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = new b(c, (d in e)); ;);',
      output: 'for (let a = new b(c, d in e); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = new b(c && (d in e)); ;);',
      output: 'for (let a = new b(c && d in e); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = new b(c, d && (e in f)); ;);',
      output: 'for (let a = new b(c, d && e in f); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b[(c in d)]; ;);',
      output: 'for (let a = b[c in d]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b[c && (d in e)]; ;);',
      output: 'for (let a = b[c && d in e]; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b ? (c in d) : e; ;);',
      output: 'for (let a = b ? c in d : e; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = b ? c && (d in e) : f; ;);',
      output: 'for (let a = b ? c && d in e : f; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (a ? b && (c in d) : e; ;);',
      output: 'for (a ? b && c in d : e; ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = ((b in c)); ;);',
      output: 'for (let a = (b in c); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (((a in b)); ;);',
      output: 'for ((a in b); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (((a && b in c && d)); ;);',
      output: 'for ((a && b in c && d); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (!(b in c)); ;);',
      output: 'for (let a = !(b in c); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (!(b && c in d)); ;);',
      output: 'for (let a = !(b && c in d); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = !((b in c) && (d in e)); ;);',
      output: 'for (let a = !(b in c && d in e); ;);',
      errors: Array.from({ length: 2 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = (x && (b in c)), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((i in j); ;);',
      output: 'for (let a = (x && b in c), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((i in j); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b in c), d = () => { for ((x && (e in f)); ;); for ((g in h); ;); }; ;); for((i in j); ;);',
      output: 'for (let a = (b in c), d = () => { for ((x && e in f); ;); for ((g in h); ;); }; ;); for((i in j); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b in c), d = () => { for ((e in f); ;); for ((x && (g in h)); ;); }; ;); for((i in j); ;);',
      output: 'for (let a = (b in c), d = () => { for ((e in f); ;); for ((x && g in h); ;); }; ;); for((i in j); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (b in c), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((x && (i in j)); ;);',
      output: 'for (let a = (b in c), d = () => { for ((e in f); ;); for ((g in h); ;); }; ;); for((x && i in j); ;);',
      errors: [
        {
          messageId: 'unexpected',
        },
      ],
    },
    {
      code: 'for (let a = (x && (b in c)), d = () => { for ((e in f); ;); for ((y && (g in h)); ;); }; ;); for((i in j); ;);',
      output: 'for (let a = (x && b in c), d = () => { for ((e in f); ;); for ((y && g in h); ;); }; ;); for((i in j); ;);',
      errors: Array.from({ length: 2 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = (x && (b in c)), d = () => { for ((y && (e in f)); ;); for ((z && (g in h)); ;); }; ;); for((w && (i in j)); ;);',
      output: 'for (let a = (x && b in c), d = () => { for ((y && e in f); ;); for ((z && g in h); ;); }; ;); for((w && i in j); ;);',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },

    // https://github.com/eslint/eslint/issues/11706 regression tests (also in valid[])
    {
      code: 'for (let a = (b); a > (b); a = (b)) a = (b); a = (b);',
      output: 'for (let a = b; a > b; a = b) a = b; a = b;',
      errors: Array.from({ length: 5 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for ((a = b); (a > b); (a = b)) (a = b); (a = b);',
      output: 'for (a = b; a > b; a = b) a = b; a = b;',
      errors: Array.from({ length: 5 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = b; a > (b); a = (b)) a = (b); a = (b);',
      output: 'for (let a = b; a > b; a = b) a = b; a = b;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = b; (a > b); (a = b)) (a = b); (a = b);',
      output: 'for (let a = b; a > b; a = b) a = b; a = b;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (; a > (b); a = (b)) a = (b); a = (b);',
      output: 'for (; a > b; a = b) a = b; a = b;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (; (a > b); (a = b)) (a = b); (a = b);',
      output: 'for (; a > b; a = b) a = b; a = b;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = (b); a = (b in c); a = (b in c)) a = (b in c); a = (b in c);',
      output: 'for (let a = b; a = b in c; a = b in c) a = b in c; a = b in c;',
      errors: Array.from({ length: 5 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = (b); (a in b); (a in b)) (a in b); (a in b);',
      output: 'for (let a = b; a in b; a in b) a in b; a in b;',
      errors: Array.from({ length: 5 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = b; a = (b in c); a = (b in c)) a = (b in c); a = (b in c);',
      output: 'for (let a = b; a = b in c; a = b in c) a = b in c; a = b in c;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = b; (a in b); (a in b)) (a in b); (a in b);',
      output: 'for (let a = b; a in b; a in b) a in b; a in b;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (; a = (b in c); a = (b in c)) a = (b in c); a = (b in c);',
      output: 'for (; a = b in c; a = b in c) a = b in c; a = b in c;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (; (a in b); (a in b)) (a in b); (a in b);',
      output: 'for (; a in b; a in b) a in b; a in b;',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },
    {
      code: 'for (let a = (b + c), d = () => { for ((e + f); ;); for ((g + h); ;); }; ;); for((i + j); ;);',
      output: 'for (let a = b + c, d = () => { for (e + f; ;); for (g + h; ;); }; ;); for(i + j; ;);',
      errors: Array.from({ length: 4 }, _ => ({
        messageId: 'unexpected',
      })),
    },

    // import expressions
    invalid(
      'import((source))',
      'import(source)',
      1,
      { parserOptions: { ecmaVersion: 2020 } },
    ),
    invalid(
      'import((source = \'foo.js\'))',
      'import(source = \'foo.js\')',
      1,
      { parserOptions: { ecmaVersion: 2020 } },
    ),
    invalid(
      'import(((s,t)))',
      'import((s,t))',
      1,
      { parserOptions: { ecmaVersion: 2020 } },
    ),

    // https://github.com/eslint/eslint/issues/12127
    {
      code: '[1, ((2, 3))];',
      output: '[1, (2, 3)];',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'const foo = () => ((bar, baz));',
      output: 'const foo = () => (bar, baz);',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'foo = ((bar, baz));',
      output: 'foo = (bar, baz);',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'foo + ((bar + baz));',
      output: 'foo + (bar + baz);',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '((foo + bar)) + baz;',
      output: '(foo + bar) + baz;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'foo * ((bar + baz));',
      output: 'foo * (bar + baz);',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '((foo + bar)) * baz;',
      output: '(foo + bar) * baz;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'new A(((foo, bar)))',
      output: 'new A((foo, bar))',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'class A{ [((foo, bar))]() {} }',
      output: 'class A{ [(foo, bar)]() {} }',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'new ((A, B))()',
      output: 'new (A, B)()',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '((foo, bar)) ? bar : baz;',
      output: '(foo, bar) ? bar : baz;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '((f ? o : o)) ? bar : baz;',
      output: '(f ? o : o) ? bar : baz;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '((f = oo)) ? bar : baz;',
      output: '(f = oo) ? bar : baz;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'foo ? ((bar, baz)) : baz;',
      output: 'foo ? (bar, baz) : baz;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'foo ? bar : ((bar, baz));',
      output: 'foo ? bar : (bar, baz);',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'function foo(bar = ((baz1, baz2))) {}',
      output: 'function foo(bar = (baz1, baz2)) {}',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var foo = { bar: ((baz1, baz2)) };',
      output: 'var foo = { bar: (baz1, baz2) };',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var foo = { [((bar1, bar2))]: baz };',
      output: 'var foo = { [(bar1, bar2)]: baz };',
      errors: [{ messageId: 'unexpected' }],
    },

    // adjacent tokens tests for division operator, comments and regular expressions
    invalid('a+/**/(/**/b)', 'a+/**//**/b'),
    invalid('a+/**/(//\nb)', 'a+/**///\nb'),
    invalid('a in(/**/b)', 'a in/**/b'),
    invalid('a in(//\nb)', 'a in//\nb'),
    invalid('a+(/**/b)', 'a+/**/b'),
    invalid('a+/**/(b)', 'a+/**/b'),
    invalid('a+(//\nb)', 'a+//\nb'),
    invalid('a+//\n(b)', 'a+//\nb'),
    invalid('a+(/^b$/)', 'a+/^b$/'),
    invalid('a/(/**/b)', 'a/ /**/b'),
    invalid('a/(//\nb)', 'a/ //\nb'),
    invalid('a/(/^b$/)', 'a/ /^b$/'),

    // Nullish coalescing
    {
      code: 'var v = ((a ?? b)) || c',
      output: 'var v = (a ?? b) || c',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = a ?? ((b || c))',
      output: 'var v = a ?? (b || c)',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = ((a ?? b)) && c',
      output: 'var v = (a ?? b) && c',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = a ?? ((b && c))',
      output: 'var v = a ?? (b && c)',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = ((a || b)) ?? c',
      output: 'var v = (a || b) ?? c',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = a || ((b ?? c))',
      output: 'var v = a || (b ?? c)',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = ((a && b)) ?? c',
      output: 'var v = (a && b) ?? c',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = a && ((b ?? c))',
      output: 'var v = a && (b ?? c)',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = (a ?? b) ? b : c',
      output: 'var v = a ?? b ? b : c',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = (a | b) ?? c | d',
      output: 'var v = a | b ?? c | d',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = a | b ?? (c | d)',
      output: 'var v = a | b ?? c | d',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },

    {
      code: 'const span = /** {HTMLSpanElement}*/(event.currentTarget);',
      output: 'const span = /** {HTMLSpanElement}*/event.currentTarget;',
      options: ['all', { allowParensAfterCommentPattern: 'invalid' }],
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'if (/** {Compiler | MultiCompiler} */(options).hooks) console.log(\'good\');',
      output: 'if (/** {Compiler | MultiCompiler} */options.hooks) console.log(\'good\');',
      options: ['all', { allowParensAfterCommentPattern: 'invalid' }],
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: $`
        if (condition) {
            /** @type {ServerOptions} */
            /** extra comment */
            (options.server.options).requestCert = false;
        }
      `,
      output: $`
        if (condition) {
            /** @type {ServerOptions} */
            /** extra comment */
            options.server.options.requestCert = false;
        }
      `,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: $`
        if (condition) {
            /** @type {ServerOptions} */
            ((options.server.options)).requestCert = false;
        }
      `,
      output: $`
        if (condition) {
            /** @type {ServerOptions} */
            (options.server.options).requestCert = false;
        }
      `,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: $`
        if (condition) {
            /** @type {ServerOptions} */
            let foo = "bar";
            (options.server.options).requestCert = false;
        }
      `,
      output: $`
        if (condition) {
            /** @type {ServerOptions} */
            let foo = "bar";
            options.server.options.requestCert = false;
        }
      `,
      errors: [{ messageId: 'unexpected' }],
    },

    // Optional chaining
    {
      code: 'var v = (obj?.aaa)?.aaa',
      output: 'var v = obj?.aaa?.aaa',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var v = (obj.aaa)?.aaa',
      output: 'var v = obj.aaa?.aaa',
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var foo = (function(){})?.call()',
      output: 'var foo = function(){}?.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: true }],
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'var foo = (function(){}?.call())',
      output: 'var foo = function(){}?.call()',
      options: ['all', { enforceForFunctionPrototypeMethods: true }],
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '(Object.prototype.toString.call())',
      output: 'Object.prototype.toString.call()',
      options: ['all'],
      parserOptions: { ecmaVersion: 2020 },
      errors: [{ messageId: 'unexpected' }],
    },

    // https://github.com/eslint/eslint/issues/16850
    invalid('(a) = function foo() {};', 'a = function foo() {};'),
    invalid('(a) = class Bar {};', 'a = class Bar {};'),
    invalid('(a.b) = function () {};', 'a.b = function () {};'),
    {
      code: '(newClass) = [(one)] = class { static * [Symbol.iterator]() { yield 1; } };',
      output: 'newClass = [one] = class { static * [Symbol.iterator]() { yield 1; } };',
      errors: [
        { messageId: 'unexpected' },
        { messageId: 'unexpected' },
      ],
    },
    invalid('((a)) = () => {};', '(a) = () => {};'),
    invalid('(a) = (function () {})();', 'a = (function () {})();'),
    ...['**=', '*=', '/=', '%=', '+=', '-=', '<<=', '>>=', '>>>=', '&=', '^=', '|='].map(
      operator => invalid(
        `(a) ${operator} function () {};`,
        `a ${operator} function () {};`,
      ),
    ),

    // Potential directives (no autofix)
    invalid('(\'use strict\');', null),
    invalid('function f() { (\'abc\'); }', null),
    invalid('(function () { (\'abc\'); })();', null),
    invalid('_ = () => { (\'abc\'); };', null),
    invalid('\'use strict\';("foobar");', null),
    invalid('foo(); (\'bar\');', null),
    invalid('foo = { bar() { ; ("baz"); } };', null),

    // Directive lookalikes
    invalid('(12345);', '12345;'),
    invalid('((\'foobar\'));', '(\'foobar\');'),
    invalid('(`foobar`);', '`foobar`;'),
    invalid('void (\'foobar\');', 'void \'foobar\';'),
    invalid('_ = () => (\'abc\');', '_ = () => \'abc\';'),
    invalid('if (foo) (\'bar\');', 'if (foo) \'bar\';'),
    invalid('const foo = () => (\'bar\');', 'const foo = () => \'bar\';'),
  ],
})
