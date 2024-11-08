// this rule tests the spacing, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { InvalidTestCase, ValidTestCase } from '#test'
import { $, run } from '#test'
import rule from '.'

run({
  name: 'function-call-spacing',
  rule,
  valid: [
    ...[
      'f();',
      'f(a, b);',
      'f.b();',
      'f.b().c();',
      'f()()',
      '(function() {}())',
      'var f = new Foo()',
      'var f = new Foo',
      'f( (0) )',
      '(function(){ if (foo) { bar(); } }());',
      'f(0, (1))',
      'describe/**/(\'foo\', function () {});',
      'new (foo())',
      '( f )( 0 )',
      '( (f) )( (0) )',
      '( f()() )(0)',
      'f<a>()',
      'f<a>(b, b)',
      'f.b<a>(b, b)',
      '(function<T>() {}<a>())',
      '((function<T>() {})<a>())',
      '( f )<a>( 0 )',
      '( (f) )<a>( (0) )',
      '( f()() )<a>(0)',
      'import(source)',

      // optional call
      'f?.();',
      'f?.(a, b);',
      'f?.b();',
      'f?.b()?.c();',
      'f.b?.();',
      'f.b?.().c();',
      'f()?.()',
      '(function() {}?.())',
      'f?.( (0) )',
      '(function(){ if (foo) { bar(); } }?.());',
      'f?.(0, (1))',
      'describe/**/?.(\'foo\', function () {});',
      'describe?./**/(\'foo\', function () {});',
      '( f )?.( 0 )',
      '( (f) )?.( (0) )',
      '( f?.()() )(0)',
      '( f()?.() )(0)',
      '( f?.()?.() )(0)',
      '( f?.()() )?.(0)',
      '( f()?.() )?.(0)',
      '( f?.()?.() )?.(0)',
      'f?.<a>()',
      'f?.<a>(b, b)',
      'f.b?.<a>(b, b)',
      'f?.b<a>(b, b)',
      'f?.b?.<a>(b, b)',
      '(function<T>() {}?.<a>())',
      '((function<T>() {})<a>())',
      '( f )?.<a>( 0 )',
      '( (f) )?.<a>( (0) )',
      '( f()() )?.<a>(0)',
    ].map<ValidTestCase>(code => ({
      code,
      options: ['never'],
    })),

    ...[
      'f ();',
      'f (a, b);',
      'f.b ();',
      'f.b ().c ();',
      'f () ()',
      '(function() {} ())',
      'var f = new Foo ()',
      'var f = new Foo',
      'f ( (0) )',
      'f (0) (1)',
      'f ();\n t   ();',
      '( f ) ( 0 )',
      '( (f) ) ( (0) )',
      'f<a> ()',
      'f<a> (b, b)',
      'f.b<a> (b, b)',
      '(function<T>() {}<a> ())',
      '((function<T>() {})<a> ())',
      '( f )<a> ( 0 )',
      '( (f) )<a> ( (0) )',
      '( f () )<a> (0)',
      'import (source)',

      // optional call
      'f?.b ();',
      'f?.b ()?.c ();',
      'f?.b<a> (b, b)',
      'f ?. ();',
    ].map<ValidTestCase>(code => ({
      code,
      options: ['always'],
    })),
    ...[
      'f\n();',
      'f.b \n ();',
      'f\n() ().b \n()\n ()',
      'var f = new Foo\n();',
      'f// comment\n()',
      'f // comment\n ()',
      'f\n/*\n*/\n()',
      'f\r();',
      'f\u2028();',
      'f\u2029();',
      'f\r\n();',
      'import\n(source)',

      // optional call
      'f?.b \n ();',
      'f\n() ()?.b \n()\n ()',
      'f ?. ();',
      'f\n?.\n();',
    ].map<ValidTestCase>(code => ({
      code,
      options: ['always', { allowNewlines: true }],
    })),
    {
      code: 'f?. ();',
      options: ['always', { optionalChain: { before: false } }],
    },
    {
      code: 'f ?.();',
      options: ['always', { optionalChain: { after: false } }],
    },
    {
      code: 'f?.\n();',
      options: ['always', { allowNewlines: true, optionalChain: { before: false } }],
    },
    {
      code: 'f\n?.();',
      options: ['always', { allowNewlines: true, optionalChain: { after: false } }],
    },
  ],
  invalid: [
    // "never"
    ...[
      {
        code: 'f ();',
        output: 'f();',
      },
      {
        code: 'f /* comment */ ();',
        output: null,
      },
      {
        code: 'f (a, b);',
        output: 'f(a, b);',
      },
      {
        code: 'f.b ();',
        output: 'f.b();',
        errors: [
          {
            messageId: 'unexpectedWhitespace' as const,
            column: 3,
          },
        ],
      },
      {
        code: 'f.b().c ();',
        output: 'f.b().c();',
        errors: [
          {
            messageId: 'unexpectedWhitespace' as const,
            column: 7,
          },
        ],
      },
      {
        code: 'f() ()',
        output: 'f()()',
      },
      {
        code: '(function() {} ())',
        output: '(function() {}())',
      },
      {
        code: 'var f = new Foo ()',
        output: 'var f = new Foo()',
      },
      {
        code: 'var f = new Foo /* comment */ ()',
        output: null,
      },
      {
        code: 'f ( (0) )',
        output: 'f( (0) )',
      },
      {
        code: 'f(0) (1)',
        output: 'f(0)(1)',
      },
      {
        code: 'f ();\n t   ();',
        output: 'f();\n t();',
        errors: [
          {
            messageId: 'unexpectedWhitespace' as const,
          },
          {
            messageId: 'unexpectedWhitespace' as const,
          },
        ],
      },

      // https://github.com/eslint/eslint/issues/7787
      {
        code: 'f\n();',
        output: null, // no change
      },
      {
        code: 'f\n//comment\n();',
        output: null,
      },
      {
        code: $`
          this.cancelled.add(request)
          this.decrement(request)
          (request.reject(new api.Cancel()))
        `,
        output: null, // no change
        errors: [
          {
            messageId: 'unexpectedWhitespace' as const,
            line: 2,
            column: 23,
          },
        ],
      },
      {
        code: $`
          var a = foo
          (function(global) {}(this));
        `,
        output: null, // no change
        errors: [
          {
            messageId: 'unexpectedWhitespace' as const,
            line: 1,
            column: 9,
          },
        ],
      },
      {
        code: $`
          var a = foo
          (baz())
        `,
        output: null, // no change
        errors: [
          {
            messageId: 'unexpectedWhitespace' as const,
            line: 1,
            column: 9,
          },
        ],
      },
      {
        code: 'f\r();',
        output: null, // no change
      },
      {
        code: 'f\u2028();',
        output: null, // no change
      },
      {
        code: 'f\u2029();',
        output: null, // no change
      },
      {
        code: 'f\r\n();',
        output: null, // no change
      },
      {
        code: 'import (source)',
        output: 'import(source)',
      },
      {
        code: 'import\n(source)',
        output: null,
      },
      {
        code: 'import\n//comment\n(source)',
        output: null,
      },
    ].map<InvalidTestCase>(code => ({
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedWhitespace',
        },
      ],
      ...code,
    })),

    // "always"
    ...[
      {
        code: 'f();',
        output: 'f ();',
      },
      {
        code: 'f(a, b);',
        output: 'f (a, b);',
      },
      {
        code: 'f() ()',
        output: 'f () ()',
      },
      {
        code: 'var f = new Foo()',
        output: 'var f = new Foo ()',
      },
      {
        code: 'f( (0) )',
        output: 'f ( (0) )',
      },
      {
        code: 'f(0) (1)',
        output: 'f (0) (1)',
      },
      {
        code: 'import(source)',
        output: 'import (source)',
      },
    ].map<InvalidTestCase>(code => ({
      options: ['always'],
      errors: [
        {
          messageId: 'missing',
        },
      ],
      ...code,
    })),
    ...[
      {
        code: 'f\n();',
        output: 'f ();',
      },
      {
        code: 'f\n//comment\n();',
        output: null,
      },
      {
        code: 'f\n(a, b);',
        output: 'f (a, b);',
      },
      {
        code: 'f.b();',
        output: 'f.b ();',
        errors: [
          {
            messageId: 'missing' as const,
            column: 3,
          },
        ],
      },
      {
        code: 'f.b\n();',
        output: 'f.b ();',
      },
      {
        code: 'f.b().c ();',
        output: 'f.b ().c ();',
        errors: [
          {
            messageId: 'missing' as const,
            column: 3,
          },
        ],
      },
      {
        code: 'f.b\n().c ();',
        output: 'f.b ().c ();',
      },
      {
        code: 'f\n() ()',
        output: 'f () ()',
      },
      {
        code: 'f\n()()',
        output: 'f () ()',
        errors: [
          {
            messageId: 'unexpectedNewline' as const,
          },
          {
            messageId: 'missing' as const,
          },
        ],
      },
      {
        code: '(function() {}())',
        output: '(function() {} ())',
        errors: [
          {
            messageId: 'missing' as const,
          },
        ],
      },
      {
        code: 'f();\n t();',
        output: 'f ();\n t ();',
        errors: [
          {
            messageId: 'missing' as const,
          },
          {
            messageId: 'missing' as const,
          },
        ],
      },
      {
        code: 'f\r();',
        output: 'f ();',
      },
      {
        code: 'f\u2028();',
        output: 'f ();',
        errors: [
          {
            messageId: 'unexpectedNewline' as const,
          },
        ],
      },
      {
        code: 'f\u2029();',
        output: 'f ();',
        errors: [
          {
            messageId: 'unexpectedNewline' as const,
          },
        ],
      },
      {
        code: 'f\r\n();',
        output: 'f ();',
      },
    ].map<InvalidTestCase>(code => ({
      options: ['always'],
      errors: [
        {
          messageId:
            code.code.includes('\n') || code.code.includes('\r')
              ? 'unexpectedNewline'
              : 'unexpectedWhitespace',
        },
      ],
      ...code,
    })),

    // "always", "allowNewlines": true
    ...[
      {
        code: 'f();',
        output: 'f ();',
      },
      {
        code: 'f(a, b);',
        output: 'f (a, b);',
      },
      {
        code: 'f.b();',
        output: 'f.b ();',
        errors: [
          {
            messageId: 'missing' as const,
            column: 3,
          },
        ],
      },
      {
        code: 'f.b().c ();',
        output: 'f.b ().c ();',
      },
      {
        code: 'f() ()',
        output: 'f () ()',
      },
      {
        code: '(function() {}())',
        output: '(function() {} ())',
      },
      {
        code: 'var f = new Foo()',
        output: 'var f = new Foo ()',
      },
      {
        code: 'f( (0) )',
        output: 'f ( (0) )',
      },
      {
        code: 'f(0) (1)',
        output: 'f (0) (1)',
      },
      {
        code: 'f();\n t();',
        output: 'f ();\n t ();',
        errors: [
          {
            messageId: 'missing' as const,
          },
          {
            messageId: 'missing' as const,
          },
        ],
      },
    ].map<InvalidTestCase>(code => ({
      options: ['always', { allowNewlines: true }],
      errors: [
        {
          messageId: 'missing',
        },
      ],
      ...code,
    })),

    // optional chain
    // never
    ...[
      'f ?.();',
      'f?. ();',
      'f ?. ();',
      'f\n?.();',
      'f?.\n();',
      'f\n?.\n();',
      'f ?.\n();',
      'f\n?. ();',
    ].map<InvalidTestCase>(code => ({
      options: ['never'],
      output: 'f?.();',
      errors: [
        {
          messageId: 'unexpectedWhitespace',
        },
      ],
      code,
    })),
    // always
    ...[
      'f?.();',
      'f ?.();',
      'f?. ();',
      'f\n?.();',
      'f?.\n();',
      'f\n?.\n();',
      'f ?.\n();',
      'f\n?. ();',
    ].map<InvalidTestCase>(code => ({
      options: ['always'],
      output: 'f ?. ();',
      errors: [
        {
          messageId: code.includes('\n') ? 'unexpectedNewline' : 'missing',
        },
      ],
      code,
    })),
    // always allowNewlines: true
    ...[
      {
        code: 'f\n?.();',
        output: 'f\n?. ();',
      },
      {
        code: 'f?.\n();',
        output: 'f ?.\n();',
      },
    ].map<InvalidTestCase>(code => ({
      options: ['always', { allowNewlines: true }],
      errors: [
        {
          messageId: 'missing',
        },
      ],
      ...code,
    })),
    // always optionalChain: { before: false }
    ...[
      'f?.();',
      'f ?.();',
      'f\n?.();',
      'f\n?.\n();',
      'f ?.\n();',
      'f\n?. ();',
    ].flatMap<InvalidTestCase>((code) => {
      const messageId = code.includes('f ') || code.includes('f\n') ? 'unexpectedWhitespace' : 'missing'
      return [
        {
          options: ['always', { optionalChain: { before: false } }],
          output: 'f?. ();',
          errors: [
            {
              messageId: code.includes('\n') ? 'unexpectedNewline' : messageId,
            },
          ],
          code,
        },
        {
          options: ['always', { allowNewlines: true, optionalChain: { before: false } }],
          output: code.includes('\n()') ? 'f?.\n();' : 'f?. ();',
          errors: [
            {
              messageId,
            },
          ],
          code,
        },
      ]
    }),
    // always optionalChain: { after: false }
    ...[
      'f?.();',
      'f?. ();',
      'f?.\n();',
      'f\n?.\n();',
      'f ?.\n();',
      'f\n?. ();',
    ].flatMap<InvalidTestCase>((code) => {
      const messageId = code.includes(' ();') || code.includes('\n();') ? 'unexpectedWhitespace' : 'missing'
      return [
        {
          options: ['always', { optionalChain: { after: false } }],
          output: 'f ?.();',
          errors: [
            {
              messageId: code.includes('\n') ? 'unexpectedNewline' : messageId,
            },
          ],
          code,
        },
        {
          options: ['always', { allowNewlines: true, optionalChain: { after: false } }],
          output: code.includes('f\n') ? 'f\n?.();' : 'f ?.();',
          errors: [
            {
              messageId,
            },
          ],
          code,
        },
      ]
    }),
  ],
})
