// this rule tests the new lines, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import { $, run } from '#test'
import rule from '.'

run({
  name: 'lines-between-class-members',
  rule,
  valid: [
    {
      code: $`
        class foo {
        baz1() { }
        
        baz2() { }
        
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        qux1() { }
        
        qux2() { }
        };
      `,
      options: ['always'],
    },
    {
      code: $`
        class foo {
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        baz() { }
        
        qux() { }
        };
      `,
      options: ['always', { exceptAfterOverload: true }],
    },
    {
      code: $`
        class foo {
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        baz() { }
        qux() { }
        };
      `,
      options: [
        'always',
        { exceptAfterOverload: true, exceptAfterSingleLine: true },
      ],
    },
    {
      code: $`
        class foo{
        bar(a: string):void;
        
        bar(a: string, b:string):void;
        
        bar(a: string, b:string){
        
        }
        
        baz() { }
        
        qux() { }
        };
      `,
      options: [
        'always',
        { exceptAfterOverload: false, exceptAfterSingleLine: false },
      ],
    },
    {
      code: $`
        class foo {
        bar(a: string):void
        bar(a: string, b:string):void;
        bar(a: string, b:string){
        
        }
        baz() { }
        qux() { }
        };
      `,
      options: [
        'never',
        { exceptAfterOverload: true, exceptAfterSingleLine: true },
      ],
    },
    {
      code: $`
        class foo{
        bar(a: string):void
        bar(a: string, b:string):void;
        bar(a: string, b:string){
        
        }
        baz() { }
        qux() { }
        };
      `,
      options: [
        'never',
        { exceptAfterOverload: true, exceptAfterSingleLine: true },
      ],
    },
    {
      code: $`
        abstract class foo {
        abstract bar(a: string): void;
        abstract bar(a: string, b: string): void;
        };
      `,
      options: ['always'],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/240
    {
      code: $`
        class foo {
          bar(a: string): void;
          bar(a: string, b:string): void;
          bar(a: string, b:string) {
        
          }
        
          baz() { }
        
          qux() { }
        };
      `,
      options: [
        { enforce: [{ blankLine: 'always', prev: 'method', next: 'method' }] },
        { exceptAfterOverload: true },
      ],
    },
  ],
  invalid: [
    {
      code: $`
        class foo {
        baz1() { }
        baz2() { }
        
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        qux1() { }
        qux2() { }
        };
      `,
      output: $`
        class foo {
        baz1() { }
        
        baz2() { }
        
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        qux1() { }
        
        qux2() { }
        };
      `,
      options: ['always'],
      errors: [
        {
          messageId: 'always',
        },
        {
          messageId: 'always',
        },
      ],
    },
    {
      code: $`
        class foo {
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        baz() { }
        qux() { }
        }
      `,
      output: $`
        class foo {
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        baz() { }
        
        qux() { }
        }
      `,
      options: ['always', { exceptAfterOverload: true }],
      errors: [
        {
          messageId: 'always',
        },
        {
          messageId: 'always',
        },
      ],
    },
    {
      code: $`
        class foo {
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        baz() { }
        qux() { }
        }
      `,
      output: $`
        class foo {
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        baz() { }
        qux() { }
        }
      `,
      options: [
        'always',
        { exceptAfterOverload: true, exceptAfterSingleLine: true },
      ],
      errors: [
        {
          messageId: 'always',
        },
      ],
    },
    {
      code: $`
        class foo {
        bar(a: string): void;
        bar(a: string, b:string): void;
        bar(a: string, b:string) {
        
        }
        
        baz() { }
        qux() { }
        }
      `,
      output: $`
        class foo {
        bar(a: string): void;
        
        bar(a: string, b:string): void;
        
        bar(a: string, b:string) {
        
        }
        
        baz() { }
        
        qux() { }
        }
      `,
      options: [
        'always',
        { exceptAfterOverload: false, exceptAfterSingleLine: false },
      ],
      errors: [
        {
          messageId: 'always',
        },
        {
          messageId: 'always',
        },
        {
          messageId: 'always',
        },
      ],
    },
    {
      code: $`
        class foo{
        bar(a: string):void;
        
        bar(a: string, b:string):void;
        
        bar(a: string, b:string){
        
        }
        
        baz() { }
        
        qux() { }
        };
      `,
      output: $`
        class foo{
        bar(a: string):void;
        bar(a: string, b:string):void;
        bar(a: string, b:string){
        
        }
        baz() { }
        qux() { }
        };
      `,
      options: [
        'never',
        { exceptAfterOverload: true, exceptAfterSingleLine: true },
      ],
      errors: [
        {
          messageId: 'never',
        },
        {
          messageId: 'never',
        },
        {
          messageId: 'never',
        },
        {
          messageId: 'never',
        },
      ],
    },
  ],
})
