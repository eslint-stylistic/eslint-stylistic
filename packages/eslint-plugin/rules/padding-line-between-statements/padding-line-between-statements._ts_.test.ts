import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './padding-line-between-statements'

run<RuleOptions, MessageIds>({
  name: 'padding-line-between-statements',
  rule,
  valid: [
    // ----------------------------------------------------------------------
    // exports
    // ----------------------------------------------------------------------

    {
      code: 'module.exports=1',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'exports', next: '*' },
      ],
    },
    {
      code: 'module.exports=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'exports', next: '*' },
      ],
    },
    {
      code: 'module.exports.foo=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'exports', next: '*' },
      ],
    },
    {
      code: 'exports.foo=1\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'exports', next: '*' },
      ],
    },
    {
      code: 'm.exports=1\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'exports', next: '*' },
      ],
    },
    {
      code: 'module.foo=1\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'exports', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // require
    // ----------------------------------------------------------------------

    {
      code: 'foo=require("foo")\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'require', next: '*' },
      ],
    },
    {
      code: 'const foo=a.require("foo")\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'require', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // type
    // ----------------------------------------------------------------------

    {
      code: 'type a=number\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'type', next: '*' },
      ],
    },
    {
      code: 'let a=number\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'type', next: '*' },
      ],
    },
    {
      code: 'let var1, var2, type;\nvar1 = "bar";\ntype="baz";\ntype="qux";\nvar2="quux";',
      options: [
        { blankLine: 'never', prev: '*', next: 'type' },
        { blankLine: 'always', prev: 'type', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // enum
    // ----------------------------------------------------------------------

    {
      code: 'enum Test{\nA = 0\n}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'enum', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // interface
    // ----------------------------------------------------------------------

    {
      code: 'interface Test{\na:number;\n}\n\nfoo()',
      options: [
        { blankLine: 'never', prev: '*', next: '*' },
        { blankLine: 'always', prev: 'interface', next: '*' },
      ],
    },

    // ----------------------------------------------------------------------
    // From JSCS disallowPaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'var a = 2;\nmodule.exports = a;',
      options: [{ blankLine: 'never', prev: '*', next: 'exports' }],
    },
    {
      code: 'module.exports = 2;',
      options: [{ blankLine: 'never', prev: '*', next: 'exports' }],
    },
    {
      code: 'var a = 2;\n// foo\nmodule.exports = a;',
      options: [{ blankLine: 'never', prev: '*', next: 'exports' }],
    },

    /**
     * TODO: May it need an option to ignore blank lines followed by comments?
     * {
     *     code: "var a = 2;\n\n// foo\nmodule.exports = a;",
     *     options: [
     *         { blankLine: "never", prev: "*", next: "exports" }
     *     ]
     * },
     */
    {
      code: 'var a = 2;\n\nfoo.exports = a;',
      options: [{ blankLine: 'never', prev: '*', next: 'exports' }],
    },
    {
      code: 'var a = 2;\n\nmodule.foo = a;',
      options: [{ blankLine: 'never', prev: '*', next: 'exports' }],
    },
    {
      code: 'var a = 2;\n\nfoo = a;',
      options: [{ blankLine: 'never', prev: '*', next: 'exports' }],
    },

    // ----------------------------------------------------------------------
    // From JSCS requirePaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'module.exports = 2;',
      options: [{ blankLine: 'always', prev: '*', next: 'exports' }],
    },
    {
      code: 'var a = 2;\n\nmodule.exports = a;',
      options: [{ blankLine: 'always', prev: '*', next: 'exports' }],
    },
    {
      code: 'var a = 2;\nfoo.exports = a;',
      options: [{ blankLine: 'always', prev: '*', next: 'exports' }],
    },
    {
      code: 'var a = 2;\nmodule.foo = a;',
      options: [{ blankLine: 'always', prev: '*', next: 'exports' }],
    },
    {
      code: 'if (true) {\nmodule.exports = a;\n}',
      options: [{ blankLine: 'always', prev: '*', next: 'exports' }],
    },

    {
      code: 'export function foo(arg1: string): number;\nexport function foo(arg2: number) {\n return arg2;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'never', prev: '*', next: 'export' },
      ],
    },
    {
      code: 'function foo(arg1: string): number;\nfunction foo(arg2: number) {\n return arg2;\n}',
      options: [
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'never', prev: '*', next: 'function' },
      ],
    },

    // ----------------------------------------------------------------------
    // ESLint Stylistic
    // ----------------------------------------------------------------------

    // Function overloads https://github.com/eslint-stylistic/eslint-stylistic/issues/190
    {
      code: $`
        function foo(): void;
        function foo(param0?: true): boolean;
        function foo(param0?: boolean): boolean {
          return param0;
        }
      `,
      options: [
        {
          blankLine: 'always',
          prev: ['*'],
          next: ['multiline-block-like'],
        },
        {
          blankLine: 'never',
          prev: ['function-overload'],
          next: ['multiline-block-like'],
        },
      ],
    },
    {
      code: $`
        export function before() {}
        
        export function foo(a: string): void;
        export function foo(a: number): void;
        export function foo(a: string | number): void {
          return;
        }
      `,
      options: [
        {
          blankLine: 'always',
          prev: 'export',
          next: 'export',
        },
        {
          blankLine: 'never',
          prev: { selector: 'ExportNamedDeclaration[declaration.type="TSDeclareFunction"]' },
          next: { selector: 'ExportNamedDeclaration[declaration.type="TSDeclareFunction"]' },
        },
        {
          blankLine: 'never',
          prev: { selector: 'ExportNamedDeclaration[declaration.type="TSDeclareFunction"]' },
          next: { selector: 'ExportNamedDeclaration[declaration.type="FunctionDeclaration"]' },
        },
      ],
    },
  ],
  invalid: [
    {
      code: $`
        export function foo(a: string): void;
        
        export function foo(a: string | number): void {
          return;
        }
      `,
      output: $`
        export function foo(a: string): void;
        export function foo(a: string | number): void {
          return;
        }
      `,
      options: [
        {
          blankLine: 'always',
          prev: 'export',
          next: 'export',
        },
        {
          blankLine: 'never',
          prev: { selector: 'ExportNamedDeclaration[declaration.type="TSDeclareFunction"]' },
          next: { selector: 'ExportNamedDeclaration[declaration.type="FunctionDeclaration"]' },
        },
      ],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // exports
    // ----------------------------------------------------------------------

    {
      code: 'module.exports=1\n\nfoo()',
      output: 'module.exports=1\nfoo()',
      options: [{ blankLine: 'never', prev: 'exports', next: '*' }],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'module.exports=1\nfoo()',
      output: 'module.exports=1\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'exports', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'module.exports.foo=1\nfoo()',
      output: 'module.exports.foo=1\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'exports', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'module.exports[foo]=1\nfoo()',
      output: 'module.exports[foo]=1\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'exports', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'exports.foo=1\nfoo()',
      output: 'exports.foo=1\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'exports', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'exports[foo]=1\nfoo()',
      output: 'exports[foo]=1\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'exports', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // require
    // ----------------------------------------------------------------------

    {
      code: 'const foo=require("foo")\n\nfoo()',
      output: 'const foo=require("foo")\nfoo()',
      options: [{ blankLine: 'never', prev: 'require', next: '*' }],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'const foo=require("foo")\nfoo()',
      output: 'const foo=require("foo")\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'require', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'const foo=require("foo").Foo\nfoo()',
      output: 'const foo=require("foo").Foo\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'require', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'const foo=require("foo")[a]\nfoo()',
      output: 'const foo=require("foo")[a]\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'require', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // type
    // ----------------------------------------------------------------------

    {
      code: 'type a=number\n\nfoo()',
      output: 'type a=number\nfoo()',
      options: [{ blankLine: 'never', prev: 'type', next: '*' }],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },
    {
      code: 'type a=number\nfoo()',
      output: 'type a=number\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'type', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // enum
    // ----------------------------------------------------------------------

    {
      code: 'enum Test{\nA = 0\n}\nfoo()',
      output: 'enum Test{\nA = 0\n}\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'enum', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // interface
    // ----------------------------------------------------------------------

    {
      code: 'interface Test{\na:number;\n}\nfoo()',
      output: 'interface Test{\na:number;\n}\n\nfoo()',
      options: [{ blankLine: 'always', prev: 'interface', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // From JSCS disallowPaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/disallow-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'var a = 2;\n\nmodule.exports = a;',
      output: 'var a = 2;\nmodule.exports = a;',
      options: [{ blankLine: 'never', prev: '*', next: 'exports' }],
      errors: [{ messageId: 'unexpectedBlankLine' }],
    },

    // ----------------------------------------------------------------------
    // From JSCS requirePaddingNewLinesBeforeExport
    // https://github.com/jscs-dev/node-jscs/blob/44f9b86eb0757fd4ca05a81a50450c5f1b25c37b/test/specs/rules/require-padding-newlines-before-export.js
    // ----------------------------------------------------------------------

    {
      code: 'var a = 2;\nmodule.exports = a;',
      output: 'var a = 2;\n\nmodule.exports = a;',
      options: [{ blankLine: 'always', prev: '*', next: 'exports' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    {
      // https://github.com/typescript-eslint/typescript-eslint/issues/3863
      code: $`
        declare namespace Types {
          type Foo = string;
          type Bar = string;
          interface FooBar {
            [key: string]: string;
          }
          interface BarBaz {
            [key: string]: string;
          }
        }
      `,
      output: $`
        declare namespace Types {
          type Foo = string;
        
          type Bar = string;
        
          interface FooBar {
            [key: string]: string;
          }
        
          interface BarBaz {
            [key: string]: string;
          }
        }
      `,
      options: [
        { blankLine: 'always', prev: '*', next: ['interface', 'type'] },
      ],
      errors: [
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
        { messageId: 'expectedBlankLine' },
      ],
    },
    {
      code: 'export function foo(arg1: string): number;\nexport function foo(arg2: number) {\n return arg2;\n}',
      output:
        'export function foo(arg1: string): number;\n\nexport function foo(arg2: number) {\n return arg2;\n}',
      options: [{ blankLine: 'always', prev: '*', next: 'block-like' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: 'function foo(arg1: string): number;\nfunction foo(arg2: number) {\n return arg2;\n}',
      output:
        'function foo(arg1: string): number;\n\nfunction foo(arg2: number) {\n return arg2;\n}',
      options: [{ blankLine: 'always', prev: '*', next: 'block-like' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },

    // https://github.com/eslint-stylistic/eslint-stylistic/issues/71
    // https://github.com/typescript-eslint/typescript-eslint/issues/7909
    {
      code: $`
        interface Foo {\na(): string;\n\nb(): number;\nc(): boolean;\n\nd(): string;\n}
      `,
      output: $`
        interface Foo {\na(): string;\n\nb(): number;\n\nc(): boolean;\n\nd(): string;\n}
      `,
      options: [{ blankLine: 'always', prev: '*', next: 'ts-method' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: $`
        type Foo = {\na(): string;\n\nb(): number;\nc(): boolean;\n\nd(): string;\n}
      `,
      output: $`
        type Foo = {\na(): string;\n\nb(): number;\n\nc(): boolean;\n\nd(): string;\n}
      `,
      options: [{ blankLine: 'always', prev: 'ts-method', next: '*' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
    {
      code: $`
        type Foo = number
        type Bar = {
          x: string
        }
      `,
      output: $`
        type Foo = number
        
        type Bar = {
          x: string
        }
      `,
      options: [{ blankLine: 'always', prev: '*', next: 'multiline-type' }],
      errors: [{ messageId: 'expectedBlankLine' }],
    },
  ],
})
