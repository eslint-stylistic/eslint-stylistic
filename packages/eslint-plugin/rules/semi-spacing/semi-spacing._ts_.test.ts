import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from '.'

run<RuleOptions, MessageIds>({
  name: 'semi-spacing',
  rule,
  valid: [
    'type Union = number | string;',
    `interface Foo { name: string; greet: () => string; }`,
    'declare function example();',
    'declare function example(): void;',
    `function foo(a: number): void;
function foo(a: string): void;
function foo(a: string | number): void {}`,
    'interface Example { new (): number; }',
    'abstract class Example { abstract prop: string; }',
    'abstract class Example { abstract method(): void; }',
    {
      code: 'type A = Record<string, number>;type B = string;',
      options: [{ before: false, after: false }],
    },
  ],
  invalid: [
    {
      code: 'type Union = number | string ;',
      output: 'type Union = number | string;',
      errors: [
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSTypeAliasDeclaration',
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 30,
        },
      ],
    },
    {
      code: 'interface Foo { name: string;greet: () => string ; }',
      output: 'interface Foo { name: string; greet: () => string; }',
      errors: [
        {
          messageId: 'missingWhitespaceAfter',
          type: 'TSPropertySignature',
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 30,
        },
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSPropertySignature',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 50,
        },
      ],
    },
    {
      code: 'declare function example() ;',
      output: 'declare function example();',
      errors: [
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSDeclareFunction',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28,
        },
      ],
    },
    {
      code: 'declare function example(): void ;',
      output: 'declare function example(): void;',
      errors: [
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSDeclareFunction',
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 34,
        },
      ],
    },
    {
      code: `function foo(a: number): void;function foo(a: string): void ;
function foo(a: string | number): void {}`,
      output: `function foo(a: number): void; function foo(a: string): void;
function foo(a: string | number): void {}`,
      errors: [
        {
          messageId: 'missingWhitespaceAfter',
          type: 'TSDeclareFunction',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 31,
        },
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSDeclareFunction',
          line: 1,
          column: 60,
          endLine: 1,
          endColumn: 61,
        },
      ],
    },
    {
      code: 'interface Example { new (): number ; }',
      output: 'interface Example { new (): number; }',
      errors: [
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSConstructSignatureDeclaration',
          line: 1,
          column: 35,
          endLine: 1,
          endColumn: 36,
        },
      ],
    },
    {
      code: 'abstract class Example { abstract prop: string ; }',
      output: 'abstract class Example { abstract prop: string; }',
      errors: [
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSAbstractPropertyDefinition',
          line: 1,
          column: 47,
          endLine: 1,
          endColumn: 48,
        },
      ],
    },
    {
      code: 'abstract class Example { abstract method(): void ; }',
      output: 'abstract class Example { abstract method(): void; }',
      errors: [
        {
          messageId: 'unexpectedWhitespaceBefore',
          type: 'TSEmptyBodyFunctionExpression',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 50,
        },
      ],
    },
  ],
})
