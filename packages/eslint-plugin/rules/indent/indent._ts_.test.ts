// this rule tests the spacing, which prettier will want to fix and break the tests

import type { InvalidTestCase, TestCaseError, TestCasesOptions, ValidTestCase } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import { AST_NODE_TYPES } from '#utils/ast'
import rule from './indent'

// #region individualNodeTests
const individualNodeTests = [
  {
    node: AST_NODE_TYPES.ClassDeclaration,
    code: [
      $`
        abstract class Foo {
            constructor() {}
            method() {
                console.log('hi');
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSAbstractPropertyDefinition,
    code: [
      $`
        class Foo {
            abstract bar : baz;
            abstract foo : {
                a : number
                b : number
            };
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSAbstractMethodDefinition,
    code: [
      $`
        class Foo {
            abstract bar() : baz;
            abstract foo() : {
                a : number
                b : number
            };
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSArrayType,
    code: [
      $`
        type foo = ArrType[];
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSAsExpression,
    code: [
      $`
        const foo = {} as {
            foo: string,
            bar: number,
        };
      `,
      $`
        const foo = {} as
        {
            foo: string,
            bar: number,
        };
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSConditionalType,
    code: [
      $`
        type Foo<T> = T extends string
            ? {
                a: number,
                b: boolean
            }
            : {
                c: string
            };
      `,
      $`
        type Foo<T> = T extends string ? {
            a: number,
            b: boolean
        } : string;
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSConstructorType,
    code: [
      $`
        type Constructor<T> = new (
            ...args: any[]
        ) => T;
      `,
    ],
  },
  {
    node: 'TSConstructSignature',
    code: [
      $`
        interface Foo {
            new () : Foo
            new () : {
                bar : string
                baz : string
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSDeclareFunction,
    code: [
      $`
        declare function foo() : {
            bar : number,
            baz : string,
        };
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSEmptyBodyFunctionExpression,
    code: [
      $`
        class Foo {
            constructor(
                a : string,
                b : {
                    c : number
                }
            )
        }
      `,
    ],
  },
  {
    node: 'TSEnumDeclaration, TSEnumMember',
    code: [
      $`
        enum Foo {
            bar = 1,
            baz = 1,
        }
      `,
      $`
        enum Foo
        {
            bar = 1,
            baz = 1,
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSExportAssignment,
    code: [
      $`
        export = {
            a: 1,
            b: 2,
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSFunctionType,
    code: [
      $`
        const foo: () => void = () => ({
            a: 1,
            b: 2,
        });
      `,
      $`
        const foo: () => {
            a: number,
            b: number,
        } = () => ({
            a: 1,
            b: 2,
        });
      `,
      $`
        const foo: ({
            a: number,
            b: number,
        }) => void = (arg) => ({
            a: 1,
            b: 2,
        });
      `,
      $`
        const foo: ({
            a: number,
            b: number,
        }) => {
            a: number,
            b: number,
        } = (arg) => ({
            a: arg.a,
            b: arg.b,
        });
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSImportType,
    code: [
      $`
        const foo: import("bar") = {
            a: 1,
            b: 2,
        };
      `,
      $`
        const foo: import(
            "bar"
        ) = {
            a: 1,
            b: 2,
        };
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSIndexedAccessType,
    code: [
      $`
        type Foo = Bar[
            'asdf'
        ];
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSIndexSignature,
    code: [
      $`
        type Foo = {
            [a : string] : {
                x : foo
                [b : number] : boolean
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSInferType,
    code: [
      $`
        type Foo<T> = T extends string
            ? infer U
            : {
                a : string
            };
      `,
    ],
  },
  {
    node: 'TSInterfaceBody, TSInterfaceDeclaration',
    code: [
      $`
        interface Foo {
            a : string
            b : {
                c : number
                d : boolean
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSInterfaceHeritage,
    code: [
      $`
        interface Foo extends Bar {
            a : string
            b : {
                c : number
                d : boolean
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSIntersectionType,
    code: [
      $`
        type Foo = "string" & {
            a : number
        } & number;
      `,
    ],
  },
  {
    node: 'TSImportEqualsDeclaration, TSExternalModuleReference',
    code: [
      $`
        import foo = require(
            'asdf'
        );
      `,
    ],
  },
  // TSLiteralType
  {
    node: AST_NODE_TYPES.TSMappedType,
    code: [
      $`
        type Partial<T> = {
            [P in keyof T];
        }
      `,
      $`
        type Partial<T> = {
            [P in keyof T]: T[P];
        }
      `,
      $`
        // TSQuestionToken
        type Partial<T> = {
            [P in keyof T]?: T[P];
        }
      `,
      $`
        // TSPlusToken
        type Partial<T> = {
            [P in keyof T]+?: T[P];
        }
      `,
      $`
        // TSMinusToken
        type Partial<T> = {
            [P in keyof T]-?: T[P];
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSMethodSignature,
    code: [
      $`
        interface Foo {
            method() : string
            method2() : {
                a : number
                b : string
            }
        }
      `,
    ],
  },
  // TSMinusToken - tested in TSMappedType
  {
    node: 'TSModuleBlock, TSModuleDeclaration',
    code: [
      $`
        declare module "foo" {
            export const bar : {
                a : string,
                b : number,
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSNonNullExpression,
    code: [
      $`
        const foo = a!
            .b!.
            c;
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSParameterProperty,
    code: [
      $`
        class Foo {
            constructor(
                private foo : string,
                public bar : {
                    a : string,
                    b : number,
                }
            ) {
                console.log('foo')
            }
        }
      `,
    ],
  },
  // TSPlusToken - tested in TSMappedType
  {
    node: AST_NODE_TYPES.TSPropertySignature,
    code: [
      $`
        interface Foo {
            bar : string
            baz : {
                a : string
                b : number
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSQualifiedName,
    code: [
      $`
        const a: Foo.bar = {
            a: 1,
            b: 2,
        };
      `,
      $`
        const a: Foo.
            bar
            .baz = {
                a: 1,
                b: 2,
            };
      `,
    ],
  },
  // TSQuestionToken - tested in TSMappedType
  {
    node: AST_NODE_TYPES.TSRestType,
    code: [
      $`
        type foo = [
            string,
            ...string[],
        ];
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSThisType,
    code: [
      $`
        declare class MyArray<T> extends Array<T> {
            sort(compareFn?: (a: T, b: T) => number): this;
            meth() : {
                a: number,
            }
        }
      `,
    ],
  },
  {
    node: AST_NODE_TYPES.TSTupleType,
    code: [
      $`
        type foo = [
            string,
            number,
        ];
      `,
      $`
        type foo = [
            [
                string,
                number,
            ],
        ];
      `,
    ],
  },
  // TSTypeAnnotation - tested in everything..
  // TSTypeLiteral - tested in everything..
  {
    node: AST_NODE_TYPES.TSTypeOperator,
    code: [
      $`
        type T = keyof {
            a: 1,
            b: 2,
        };
      `,
    ],
  },
  {
    node: 'TSTypeParameter, TSTypeParameterDeclaration',
    code: [
      $`
        type Foo<T> = {
            a : unknown,
            b : never,
        }
      `,
      $`
        function foo<
            T,
            U
        >() {
            console.log('');
        }
      `,
    ],
  },
  // TSTypeReference - tested in everything..
  {
    node: AST_NODE_TYPES.TSUnionType,
    code: [
      $`
        type Foo = string | {
            a : number
        } | number;
      `,
    ],
  },
].reduce<TestCasesOptions<RuleOptions, MessageIds>>(
  (acc, testCase) => {
    const indent = '    '

    const validCases: ValidTestCase<RuleOptions>[] = [...acc.valid!]
    const invalidCases: InvalidTestCase<RuleOptions, MessageIds>[] = [...acc.invalid!]

    const codeCases = testCase.code.map(code => [
      '', // newline to make test error messages nicer
      `// ${testCase.node}`, // add comment to easily identify which node a test belongs to
      code.trim(), // remove leading/trailing spaces from the case
    ].join('\n'))

    codeCases.forEach((code) => {
      // valid test case is just the code
      validCases.push(code)

      const invalid = {
        // test the fixer by removing all the spaces
        code: code.replace(new RegExp(indent, 'g'), ''),
        output: code,
        errors: code
          .split('\n')
          .map<TestCaseError<MessageIds> | null>((line, lineNum) => {
            const indentCount = line.split(indent).length - 1
            const spaceCount = indentCount * indent.length

            if (indentCount < 1)
              return null

            return {
              messageId: 'wrongIndentation',
              data: {
                expected: `${spaceCount} spaces`,
                actual: 0,
              },
              line: lineNum + 1,
              column: 1,
            }
          })
          .filter(
            (error): error is TestCaseError<MessageIds> =>
              error != null,
          ),
      }
      if (invalid.errors.length > 0)
        invalidCases.push(invalid)
    })

    return { ...acc, valid: validCases, invalid: invalidCases }
  },
  { valid: [], invalid: [] },
)
// #endregion

run<RuleOptions, MessageIds>({
  name: 'indent',
  rule,
  valid: [
    ...individualNodeTests.valid!,
    $`
      @Component({
          components: {
              ErrorPage: () => import('@/components/ErrorPage.vue'),
          },
          head: {
              titleTemplate(title) {
                  if (title) {
                      return \`test\`
                  }
                  return 'Title'
              },
              htmlAttrs: {
                  lang: 'en',
              },
              meta: [
                  { charset: 'utf-8' },
                  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
              ],
          },
      })
      export default class App extends Vue
      {
          get error()
          {
              return this.$store.state.errorHandler.error
          }
      }
    `,
    // https://github.com/eslint/typescript-eslint-parser/issues/474
    $`
      /**
       * @param {string} name
       * @param {number} age
       * @returns {string}
       */
      function foo(name: string, age: number): string {}
    `,
    $`
      const firebaseApp = firebase.apps.length
          ? firebase.app()
          : firebase.initializeApp({
              apiKey: __FIREBASE_API_KEY__,
              authDomain: __FIREBASE_AUTH_DOMAIN__,
              databaseURL: __FIREBASE_DATABASE_URL__,
              projectId: __FIREBASE_PROJECT_ID__,
              storageBucket: __FIREBASE_STORAGE_BUCKET__,
              messagingSenderId: __FIREBASE_MESSAGING_SENDER_ID__,
          })
    `,
    // https://github.com/bradzacher/eslint-plugin-typescript/issues/271
    {
      code: $`
        const foo = {
                        a: 1,
                        b: 2
                    },
                    bar = 1;
      `,
      options: [4, { VariableDeclarator: { const: 3 } }],
    },
    {
      code: $`
        const foo : Foo = {
                        a: 1,
                        b: 2
                    },
                    bar = 1;
      `,
      options: [4, { VariableDeclarator: { const: 3 } }],
    },
    {
      code: $`
        const name: string = '  Typescript  '
                .toUpperCase()
                .trim(),
        
              greeting: string = (" Hello " + name)
                .toUpperCase()
                .trim();
      `,
      options: [2, { VariableDeclarator: { const: 3 } }],
    },
    {
      code: $`
        const div: JQuery<HTMLElement> = $('<div>')
                .addClass('some-class')
                .appendTo($('body')),
        
              button: JQuery<HTMLElement> = $('<button>')
                .text('Cancel')
                .appendTo(div);
      `,
      options: [2, { VariableDeclarator: { const: 3 } }],
    },

    // https://github.com/eslint-stylistic/eslint-stylistic/issues/229
    {
      code: $`
        @Bar()
        export class Foo {
          @a
          id: string;
        
          @a @b()
          age: number;
        
          @a @b() username: string;
        }
      `,
      options: [2],
    },

    // https://github.com/eslint-stylistic/eslint-stylistic/issues/270
    {
      code: $`
        const map2 = Object.keys(map)
          .filter((key) => true)
          .reduce<Record<string, string>>((result, key) => {
            result[key] = map[key];
            return result;
          }, {});
      `,
      options: [2],
    },
    {
      code: $`
        class Some {
          range: {
            index?: number
            length?: number
          } = {
            index: 0,
            length: 0
          }
        }
      `,
      options: [2],
    },
    {
      code: $`
        const some: {
          index?: number
          length?: number
        } = {
          index: 0,
          length: 0
        }
      `,
      options: [2],
    },
    {
      code: $`
        const some: {
          index?: number
          length?: number
        } = {
          index: 0,
          length: 0
        } as {
          index?: number
          length?: number
        }
      `,
      options: [2],
    },
    $`
      type Foo = string
      declare type Foo = number
      namespace Foo {
          type Bar = boolean
      }
    `,
    {
      code: $`
        class Foo {
          accessor [bar]: string
          accessor baz: number
        }
      `,
      options: [2],
    },
    {
      code: $`
        using a = foo(),
          b = bar();
        await using c = baz(),
          d = qux();
      `,
      options: [2, { VariableDeclarator: 1 }],
    },
    {
      code: $`
        using a = foo(),
              b = bar();
        await using c = baz(),
                    d = qux();
      `,
      options: [2, { VariableDeclarator: { using: 'first' } }],
    },
    {
      code: $`
        async function foo(bar: number): Promise<
          number
        > {
          return 2;
        }
      `,
      options: [2],
    },
    {
      code: $`
        async function foo(
          bar: number,
        ): Promise<
          number
        > {
          return 2;
        }
      `,
      options: [2],
    },
    {
      code: $`
        function foo(bar: number): (
          number
        ) {
          return 2;
        }
      `,
      options: [2],
    },
    {
      code: $`
        function foo(
          bar: number,
        ): (
          number
        ) {
          return 2;
        }
      `,
      options: [2],
    },
    {
      code: $`
        const a = (
          param: 2 | 3,
        ): Promise<
          (
            2 | 3
          )
        > => {
          return Promise.resolve(param)
        }
      `,
      options: [2],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/875
    $`
      export function isAuthenticated(authResult: AuthenticationResult | null | undefined)
          : authResult is SuccessAuthenticationResult {
          return !! authResult && authResult.isAuthenticated();
      }
    `,
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/901
    $`
      type SomeType =
        'one'
        | 'two'
        | 'four'
      ;
    `,
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/909
    $`
      genericFunction<
          () => void
      >(
          () => {
              console.log("Test");
          }
      );
    `,
    $`
      genericFunction<() => void>(
          () => {
              console.log("Test");
          }
      )
    `,
    $`
      function foo<
          T
              =
                  Foo
      >() {}
    `,
    $`
      import foo
          =
              require('source')
    `,
    { // fails, `indent` should probably ignore checks in this example and leave it to indent-binary-ops
      code: $`
        return 1 +
          2 + (
            3
          )
      `,
      options: [2],
    },
    { // passes, contradicts the previous test, change only the + to *
      code: $`
        return 1 +
          2 * (
            3
          )
      `,
      options: [2],
    },
    { // passes
      code: $`
        const result = x 
          + z * (
            x ** 2
            + y ** 3
          );
      `,
      options: [2],
    },
    { // passes with operators on line-end
      code: $`
        const result = x +
          z * (
            x ** 2 +
            y ** 3
          );
      `,
      options: [2],
    },
    { // fails, `indent` should probably ignore checks in this example and leave it to indent-binary-ops
      code: $`
        const result = x +
          z + (
            x ** 2 +
            y ** 3
          );
      `,
      options: [2],
    },
    { // fails, `indent` should probably ignore checks in this example and leave it to indent-binary-ops
      code: $`
        const condition1 = true;
        const condition2 = false;
        const condition3 = true;
        const data = "foo"
        
        const consolidated = condition1 &&
          condition2 && (
            condition3 ||
            typeof data === "string"
          )
      `,
      options: [2],
    },
    { // passes, change && for || which changes the order of operations?
      code: $`
        const condition1 = true;
        const condition2 = false;
        const condition3 = true;
        const data = "foo"
        
        const consolidated = condition1 ||
          condition2 && (
            condition3 ||
            typeof data === "string"
          )
      `,
      options: [2],
    },
  ],
  invalid: [
    ...individualNodeTests.invalid!,
    {
      code: $`
        type Foo = {
        bar : string,
        age : number,
        }
      `,
      output: $`
        type Foo = {
            bar : string,
            age : number,
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
      ],
    },
    {
      code: $`
        interface Foo {
        bar : string,
        age : number,
        foo(): boolean,
        baz(
        asdf: string,
        ): boolean,
        new(): Foo,
        new(
        asdf: string,
        ): Foo,
        }
      `,
      output: $`
        interface Foo {
            bar : string,
            age : number,
            foo(): boolean,
            baz(
                asdf: string,
            ): boolean,
            new(): Foo,
            new(
                asdf: string,
            ): Foo,
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 5,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 6,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 7,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 8,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 9,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 10,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 11,
          column: 1,
        },
      ],
    },
    {
      code: $`
        interface Foo {
        bar : {
        baz : string,
        },
        age : number,
        }
      `,
      output: $`
        interface Foo {
            bar : {
                baz : string,
            },
            age : number,
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 5,
          column: 1,
        },
      ],
    },
    {
      code: $`
        interface Foo extends Bar {
        bar : string,
        age : number,
        }
      `,
      output: $`
        interface Foo extends Bar {
            bar : string,
            age : number,
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
      ],
    },
    // this is just to show how eslint handles class with extends on a new line so we can keep the interface indent
    // handling the same
    {
      code: $`
        class Foo
        extends Bar {
        bar : string = "asdf";
        age : number = 1;
        }
      `,
      output: $`
        class Foo
            extends Bar {
            bar : string = "asdf";
            age : number = 1;
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
      ],
    },
    {
      code: $`
        interface Foo
        extends Bar {
        bar : string,
        age : number,
        }
      `,
      output: $`
        interface Foo
            extends Bar {
            bar : string,
            age : number,
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
      ],
    },
    {
      code: $`
        const foo : Foo<{
        bar : string,
        age : number,
        }>
      `,
      output: $`
        const foo : Foo<{
            bar : string,
            age : number,
        }>
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
      ],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/pull/256
    {
      code: $`
        type FooAlias = Foo<
        Bar,
        Baz
        >
      `,
      output: $`
        type FooAlias = Foo<
            Bar,
            Baz
        >
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
      ],
    },
    {
      code: $`
        type T = {
        bar : string,
        age : number,
        } | {
        bar : string,
        age : number,
        }
      `,
      output: $`
        type T = {
            bar : string,
            age : number,
        } | {
            bar : string,
            age : number,
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 5,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 6,
          column: 1,
        },
      ],
    },
    {
      code: $`
        type T =
            | {
        bar : string,
        age : number,
        }
            | {
            bar : string,
            age : number,
        }
      `,
      output: $`
        type T =
            | {
                bar : string,
                age : number,
            }
            | {
                bar : string,
                age : number,
            }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 5,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 4,
          },
          line: 7,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 4,
          },
          line: 8,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 9,
          column: 1,
        },
      ],
    },
    {
      code: `    import Dialogs = require("widgets/Dialogs");`,
      output: $`
        import Dialogs = require("widgets/Dialogs");
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `
    import Dialogs =
      require("widgets/Dialogs");
      `,
      output: `
import Dialogs =
    require("widgets/Dialogs");
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 6,
          },
          line: 3,
          column: 1,
        },
      ],
    },
    {
      code: $`
        class Foo {
        public bar : string;
        private bar : string;
        protected bar : string;
        abstract bar : string;
        foo : string;
        constructor() {
        const foo = "";
        }
        constructor(
        asdf : number,
        private test : boolean,
        ) {}
        }
      `,
      output: $`
        class Foo {
            public bar : string;
            private bar : string;
            protected bar : string;
            abstract bar : string;
            foo : string;
            constructor() {
                const foo = "";
            }
            constructor(
                asdf : number,
                private test : boolean,
            ) {}
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 5,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 6,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 7,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 8,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 9,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 10,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 11,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 12,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 13,
          column: 1,
        },
      ],
    },
    {

      code: `
    abstract class Foo {}
    class Foo {}
      `,
      output: `
abstract class Foo {}
class Foo {}
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 3,
          column: 1,
        },
      ],
    },
    {
      code: $`
        enum Foo {
        bar,
        baz = 1,
        buzz = '',
        }
      `,
      output: $`
        enum Foo {
            bar,
            baz = 1,
            buzz = '',
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
      ],
    },
    {
      code: $`
        enum Foo
            {
            bar,
            baz = 1,
            buzz = '',
            }
      `,
      output: $`
        enum Foo
        {
            bar,
            baz = 1,
            buzz = '',
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 6,
          column: 1,
        },
      ],
    },
    {
      code: $`
        const enum Foo {
        bar,
        baz = 1,
        buzz = '',
        }
      `,
      output: $`
        const enum Foo {
            bar,
            baz = 1,
            buzz = '',
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
      ],
    },
    {

      code: `
    export = Foo;
      `,
      output: `
export = Foo;
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 2,
          column: 1,
        },
      ],
    },
    {

      code: `
    declare function h(x: number): number;
      `,
      output: `
declare function h(x: number): number;
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 2,
          column: 1,
        },
      ],
    },
    {
      code: $`
        declare function h(
        x: number,
        ): number;
      `,
      output: $`
        declare function h(
            x: number,
        ): number;
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
      ],
    },
    {
      code: $`
        namespace Validation {
        export interface StringValidator {
        isAcceptable(s: string): boolean;
        }
        }
      `,
      output: $`
        namespace Validation {
            export interface StringValidator {
                isAcceptable(s: string): boolean;
            }
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
      ],
    },
    {
      code: $`
        declare module "Validation" {
        export interface StringValidator {
        isAcceptable(s: string): boolean;
        }
        }
      `,
      output: $`
        declare module "Validation" {
            export interface StringValidator {
                isAcceptable(s: string): boolean;
            }
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 2,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 4,
          column: 1,
        },
      ],
    },
    // Class Decorators and Property Decorators
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/208
    {
      code: $`
            @Decorator()
        class Foo {
            @a
                foo: any;
        
        @b @c()
            bar: any;
        
                @d baz: any;
        }
      `,
      output: $`
        @Decorator()
        class Foo {
            @a
            foo: any;
        
            @b @c()
            bar: any;
        
            @d baz: any;
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '0 spaces',
            actual: 4,
          },
          line: 1,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 8,
          },
          line: 4,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 0,
          },
          line: 6,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 8,
          },
          line: 9,
          column: 1,
        },
      ],
    },
    // Method Decorators and Accessor Decorators
    {
      code: $`
        class Foo {
            @a
              func() {}
          @b
            get bar() { return }
          @c
          baz: () => 1
        }
      `,
      output: $`
        class Foo {
            @a
            func() {}
            @b
            get bar() { return }
            @c
            baz: () => 1
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 6,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 2,
          },
          line: 4,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 2,
          },
          line: 6,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '4 spaces',
            actual: 2,
          },
          line: 7,
          column: 1,
        },
      ],
    },
    {
      code: $`
        class Foo {
            bar =
        "baz";
        }
      `,
      output: $`
        class Foo {
            bar =
                "baz";
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 0,
          },
          line: 3,
          column: 1,
        },
      ],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/486
    {
      code: $`
        class Foo {
            func(
                    @Param('foo') foo: string,
            @Param('bar') bar: string,
                @Param('baz') baz: string
            ) {
                return { foo, bar, baz };
            }
        }
      `,
      output: $`
        class Foo {
            func(
                @Param('foo') foo: string,
                @Param('bar') bar: string,
                @Param('baz') baz: string
            ) {
                return { foo, bar, baz };
            }
        }
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 12,
          },
          line: 3,
          column: 1,
        },
        {
          messageId: 'wrongIndentation',
          data: {
            expected: '8 spaces',
            actual: 4,
          },
          line: 4,
          column: 1,
        },
      ],
    },
    {
      code: $`
        class Foo {
        accessor [bar]: string
            accessor baz: number
        }
      `,
      output: $`
        class Foo {
          accessor [bar]: string
          accessor baz: number
        }
      `,
      options: [2],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '2 spaces', actual: 0 } },
        { messageId: 'wrongIndentation', data: { expected: '2 spaces', actual: 4 } },
      ],
    },
    {
      code: $`
        abstract class Foo {
        abstract protected bar: number
            abstract accessor [baz]: string
        }
      `,
      output: $`
        abstract class Foo {
          abstract protected bar: number
          abstract accessor [baz]: string
        }
      `,
      options: [2],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '2 spaces', actual: 0 } },
        { messageId: 'wrongIndentation', data: { expected: '2 spaces', actual: 4 } },
      ],
    },
    {
      code: $`
         type A = number
          declare type B = number
        namespace Foo {
              declare type C = number
        }
      `,
      output: $`
        type A = number
        declare type B = number
        namespace Foo {
            declare type C = number
        }
      `,
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '0 spaces', actual: 1 }, line: 1, column: 1 },
        { messageId: 'wrongIndentation', data: { expected: '0 spaces', actual: 2 }, line: 2, column: 1 },
        { messageId: 'wrongIndentation', data: { expected: '4 spaces', actual: 6 }, line: 4, column: 1 },
      ],
    },
    {
      code: $`
        using a = foo(),
          b = bar();
        await using c = baz(),
          d = qux();
      `,
      output: $`
        using a = foo(),
              b = bar();
        await using c = baz(),
                    d = qux();
      `,
      options: [2, { VariableDeclarator: 'first' }],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '6 spaces', actual: 2 } },
        { messageId: 'wrongIndentation', data: { expected: '12 spaces', actual: 2 } },
      ],
    },
    {
      code: $`
        using a = foo(),
              b = bar();
        await using c = baz(),
                    d = qux();
      `,
      output: $`
        using a = foo(),
          b = bar();
        await using c = baz(),
          d = qux();
      `,
      options: [2, { VariableDeclarator: { using: 1 } }],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '2 spaces', actual: 6 } },
        { messageId: 'wrongIndentation', data: { expected: '2 spaces', actual: 12 } },
      ],
    },
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/875
    {
      code: $`
        export function isAuthenticated(authResult: AuthenticationResult | null | undefined)
        : authResult is SuccessAuthenticationResult {
          return !! authResult && authResult.isAuthenticated();
        }
      `,
      output: $`
        export function isAuthenticated(authResult: AuthenticationResult | null | undefined)
            : authResult is SuccessAuthenticationResult {
          return !! authResult && authResult.isAuthenticated();
        }
      `,
      options: [2, { FunctionDeclaration: { returnType: 2 } }],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '4 spaces', actual: 0 } },
      ],
    },
    {
      code: $`
        const foo = function(a: string)
          : a is 'a' {
        }
      `,
      output: $`
        const foo = function(a: string)
        : a is 'a' {
        }
      `,
      options: [2, { FunctionExpression: { returnType: 0 } }],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '0 spaces', actual: 2 } },
      ],
    },
    {
      code: $`
        function foo<
            T
            =
            Foo
        >() {}
      `,
      output: $`
        function foo<
            T
                =
                    Foo
        >() {}
      `,
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '8 spaces', actual: 4 } },
        { messageId: 'wrongIndentation', data: { expected: '12 spaces', actual: 4 } },
      ],
    },
    {
      code: $`
        import foo
        =
        require('source')
      `,
      output: $`
        import foo
            =
                require('source')
      `,
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '4 spaces', actual: 0 } },
        { messageId: 'wrongIndentation', data: { expected: '8 spaces', actual: 0 } },
      ],
    },
    {
      code: $`
        const x = 10;
        const y = 4;
        const z = 2;
        
        const result = x +
            z * (
                  x ** 2 +
                y ** 3
            );
      `,
      output: $`
        const x = 10;
        const y = 4;
        const z = 2;
        
        const result = x +
            z * (
                x ** 2 +
                y ** 3
            );
      `,
      options: [4],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '8 spaces', actual: 10 } },
      ],
    },
    {
      code: $`
        const x = 10;
        const y = 4;
        const z = 2;
        
        const result = x +
            z + (
                  x ** 2 +
                y ** 3
            );
      `,
      output: $`
        const x = 10;
        const y = 4;
        const z = 2;
        
        const result = x +
            z + (
                x ** 2 +
                y ** 3
            );
      `,
      options: [4],
      errors: [
        { messageId: 'wrongIndentation', data: { expected: '8 spaces', actual: 10 } },
      ],
    },
  ],
})
