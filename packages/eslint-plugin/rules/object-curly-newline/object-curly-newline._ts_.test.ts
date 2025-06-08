import type { InvalidTestCase, TestCaseError } from '#test'
import type { NodeTypes } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './object-curly-newline'

const prefixOfNodes = {
  TSTypeLiteral: 'type Foo = ',
  TSInterfaceBody: 'interface Foo ',
} as Record<NodeTypes, string>

function createValidRule(input: string[], options?: RuleOptions[0]) {
  // add comment for better experience in `vitest` extension
  const code = `${input.join('\n')}// ${JSON.stringify(options) || 'default'}`

  return Object.entries(prefixOfNodes).flatMap(([key, prefix]) =>
    options
      ? [
          { code: `${prefix}${code}`, options: [options] },
          { code: `${prefix}${code}`, options: [{ [key]: options }] },
        ]
      : [
          { code: `${prefix}${code}` },
        ],
  )
}

function createInvalidRule(input: string[], out: string[], err: TestCaseError<MessageIds>[], options?: RuleOptions[0]): InvalidTestCase<RuleOptions, MessageIds>[] {
  // add comment for better experience in `vitest` extension
  const code = `${input.join('\n')}// ${JSON.stringify(options) || 'default'}`
  const output = `${out.join('\n')}// ${JSON.stringify(options) || 'default'}`

  return Object.entries(prefixOfNodes).flatMap(([key, prefix]) => {
    const errors = err.map(e => ({
      ...e,
      column: e.line === 1 && typeof e.column === 'number' ? e.column + prefix.length : e.column,
    }))

    return options
      ? [
          { code: `${prefix}${code}`, output: `${prefix}${output}`, errors, options: [options] },
          { code: `${prefix}${code}`, output: `${prefix}${output}`, errors, options: [{ [key]: options }] },
        ]
      : [
          { code: `${prefix}${code}`, output: `${prefix}${output}`, errors },
        ]
  })
}

run<RuleOptions, MessageIds>({
  name: 'object-curly-newline',
  rule,
  valid: [
    ...[
      [
        '{',
        '};',
      ],
      [
        '{',
        '    a: number;',
        '};',
      ],
      [
        '{',
        '    a: number; b: number;',
        '};',
      ],
      [
        '{',
        '    a: number;',
        '    b: number;',
        '};',
      ],
    ].flatMap(c => createValidRule(c, 'always')),
    ...[
      [
        '{}',
      ],
      [
        '{ a: number; }',
      ],
      [
        '{ a: number; b: number; }',
      ],
      [
        '{ a: number;',
        '    b: number; }',
      ],
    ].flatMap(c => createValidRule(c, 'never')),
    ...[
      [
        '{}',
      ],
      [
        '{ a: number; }',
      ],
      [
        '{ a: number; b: number; }',
      ],
      [
        '{',
        '    a: number;',
        '    b: number;',
        '}',
      ],
      [
        '{',
        '    // comment',
        '    a: number;',
        '}',
      ],
      [
        '{ // comment',
        '    a: number;',
        '}',
      ],
    ].flatMap(c => createValidRule(c, { multiline: true })),
    ...[
      [
        '{}',
      ],
      [
        '{ a: number; }',
      ],
      [
        '{',
        '    a: number; b: number;',
        '}',
      ],
      [
        '{',
        '    a: number;',
        '    b: number;',
        '}',
      ],
    ].flatMap(c => createValidRule(c, { minProperties: 2 })),
    ...[
      [
        '{}',
      ],
      [
        '{',
        '}',
      ],
      [
        '{ a: number; }',
      ],
      [
        '{',
        '    a: number;',
        '}',
      ],
      [
        '{',
        '    a: number; b: number; ',
        '}',
      ],
      [
        '{',
        '    a: number;',
        '    b: number;',
        '}',
      ],
      [
        '{ a: number;',
        'b: number; }',
      ],
    ].flatMap(c => [
      ...createValidRule(c),
      ...createValidRule(c, { consistent: true }),
    ]),
    ...[
      [
        '{}',
      ],
      [
        '{ a: number; }',
      ],
      [
        '{',
        '    a: number; b: number;',
        '}',
      ],
      [
        '{',
        '    a: number;',
        '    b: number;',
        '}',
      ],
    ].flatMap(c => createValidRule(c, { multiline: true, minProperties: 2 })),
    ...[
      [
        '{}',
      ],
      [
        '{',
        '}',
      ],
      [
        '{ a: number; }',
      ],
      [
        '{',
        '    a: number;',
        '}',
      ],
      [
        '{',
        '    a: number; b: number; ',
        '}',
      ],
      [
        '{',
        '    a: number;',
        '    b: number;',
        '}',
      ],
    ].flatMap(c => createValidRule(c, { multiline: true, consistent: true })),
    ...[
      [
        '{',
        '    a: number;',
        '    b: number; ',
        '}',
      ],
    ].flatMap(c => createValidRule(c, { minProperties: 2, consistent: true })),
    ...[
      [
        '{}',
      ],
      [
        '{ a: number; }',
      ],
      [
        '{',
        '    a: number;',
        '    b: number; ',
        '}',
      ],
    ].flatMap(c => createValidRule(c, { multiline: true, minProperties: 2, consistent: true })),
    {
      code: $`
        enum Foo {
          A, B,
        }
      `,
      options: ['always'],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: ['always'],
    },
    {
      code: $`
        enum Foo { A, B }
      `,
      options: ['never'],
    },
    {
      code: $`
        enum Foo { A,
          B }
      `,
      options: ['never'],
    },
    {
      code: $`
        enum Foo { A, B }
      `,
      options: [{ multiline: true }],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: [{ multiline: true }],
    },
    {
      code: $`
        enum Foo {
          A, B
        }
      `,
      options: [{ minProperties: 2 }],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: [{ minProperties: 2 }],
    },
    {
      code: $`
        enum Foo {
          A, B
        }
      `,
      options: [{ consistent: true }],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: [{ consistent: true }],
    },
    {
      code: $`
        enum Foo {
          A, B
        }
      `,
      options: [{ multiline: true, minProperties: 2 }],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: [{ multiline: true, minProperties: 2 }],
    },
    {
      code: $`
        enum Foo {
          A, B
        }
      `,
      options: [{ multiline: true, consistent: true }],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: [{ multiline: true, consistent: true }],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: [{ minProperties: 2, consistent: true }],
    },
    {
      code: $`
        enum Foo {
          A,
          B,
        }
      `,
      options: [{ multiline: true, minProperties: 2, consistent: true }],
    },
  ],
  invalid: [
    ...[
      {
        code: [
          '{}',
        ],
        output: [
          '{',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 1, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;}',
        ],
        output: [
          '{',
          'a: number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 1, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;b:number;}',
        ],
        output: [
          '{',
          'a: number;b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 1, column: 21, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;',
          '  b:number;}',
        ],
        output: [
          '{',
          'a: number;',
          '  b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, 'always')),
    ...[
      {
        code: [
          '{',
          '}',
        ],
        output: [
          '{}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  a: number;',
          '}',
        ],
        output: [
          '{a: number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          'a: number;b:number;',
          '}',
        ],
        output: [
          '{a: number;b:number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  a: number;',
          '  b:number;',
          '}',
        ],
        output: [
          '{a: number;',
          '  b:number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 4, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, 'never')),
    ...[
      {
        code: [
          '{',
          '}',
        ],
        output: [
          '{}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  a: number;',
          '}',
        ],
        output: [
          '{a: number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  a: number;b:number;',
          '}',
        ],
        output: [
          '{a: number;b:number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;',
          '  b:number;}',
        ],
        output: [
          '{',
          'a: number;',
          '  b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, { multiline: true })),
    ...[
      {
        code: [
          '{',
          '}',
        ],
        output: [
          '{}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  a: number;',
          '}',
        ],
        output: [
          '{a: number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;b:number;}',
        ],
        output: [
          '{',
          'a: number;b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 1, column: 21, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;',
          '  b:number;}',
        ],
        output: [
          '{',
          'a: number;',
          '  b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, { minProperties: 2 })),
    ...[
      {
        code: [
          '{a:number;',
          '}',
        ],
        output: [
          '{a:number;}',
        ],
        errors: [
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          'a:number;}',
        ],
        output: [
          '{a:number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a:number;b:number;',
          '}',
        ],
        output: [
          '{a:number;b:number;}',
        ],
        errors: [
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          'a:number;b:number;}',
        ],
        output: [
          '{a:number;b:number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => [
      ...createInvalidRule(c.code, c.output, c.errors),
      ...createInvalidRule(c.code, c.output, c.errors, { consistent: true }),
    ]),
    ...[
      {
        code: [
          '{',
          '}',
        ],
        output: [
          '{}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  a: number;',
          '}',
        ],
        output: [
          '{a: number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
          { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;',
          '  b:number;}',
        ],
        output: [
          '{',
          'a: number;',
          '  b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, { multiline: true, minProperties: 2 })),
    ...[
      {
        code: [
          '{a:number;',
          '}',
        ],
        output: [
          '{a:number;}',
        ],
        errors: [
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          'a:number;}',
        ],
        output: [
          '{a:number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a:number;b:number;',
          '}',
        ],
        output: [
          '{a:number;b:number;}',
        ],
        errors: [
          { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          'a:number;b:number;}',
        ],
        output: [
          '{a:number;b:number;}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;',
          '  b:number;}',
        ],
        output: [
          '{',
          'a: number;',
          '  b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, { multiline: true, consistent: true })),
    ...[
      {
        code: [
          '{a: number;b:number;}',
        ],
        output: [
          '{',
          'a: number;b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 1, column: 21, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;',
          '  b:number;}',
        ],
        output: [
          '{',
          'a: number;',
          '  b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, { minProperties: 2, consistent: true })),
    ...[
      {
        code: [
          '{a: number;b:number;}',
        ],
        output: [
          '{',
          'a: number;b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 1, column: 21, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{a: number;',
          '  b:number;}',
        ],
        output: [
          '{',
          'a: number;',
          '  b:number;',
          '}',
        ],
        errors: [
          { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' },
          { line: 2, column: 12, messageId: 'expectedLinebreakBeforeClosingBrace' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, { multiline: true, minProperties: 2, consistent: true })),
    // #region TSEnumBody
    // #region always
    {
      code: 'enum Foo {}',
      output: $`
        enum Foo {
        }
      `,
      options: ['always'],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 1, column: 11, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    {
      code: 'enum Foo {A,B}',
      output: $`
        enum Foo {
        A,B
        }
      `,
      options: ['always'],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 1, column: 14, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    {
      code: $`
        enum Foo {A,
          B}
      `,
      output: $`
        enum Foo {
        A,
          B
        }
      `,
      options: ['always'],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 2, column: 4, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    // #endregion
    // #region never
    {
      code: $`
        enum Foo {
        }
      `,
      output: 'enum Foo {}',
      options: ['never'],
      errors: [
        { line: 1, column: 10, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
      ],
    },
    {
      code: $`
        enum Foo {
          A,B
        }
      `,
      output: 'enum Foo {A,B}',
      options: ['never'],
      errors: [
        { line: 1, column: 10, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
      ],
    },
    {
      code: $`
        enum Foo {
          A,
          B
        }
      `,
      output: $`
        enum Foo {A,
          B}
      `,
      options: ['never'],
      errors: [
        { line: 1, column: 10, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        { line: 4, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
      ],
    },
    // #endregion
    // #region multiline
    {
      code: $`
        enum Foo {
          A,B
        }
      `,
      output: 'enum Foo {A,B}',
      options: [{ multiline: true }],
      errors: [
        { line: 1, column: 10, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
        { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
      ],
    },
    {
      code: $`
        enum Foo {A,
          B}
      `,
      output: $`
        enum Foo {
        A,
          B
        }
      `,
      options: [{ multiline: true }],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 2, column: 4, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    // #endregion
    // #region minProperties
    {
      code: 'enum Foo {A,B}',
      output: $`
        enum Foo {
        A,B
        }
      `,
      options: [{ minProperties: 2 }],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 1, column: 14, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    {
      code: $`
        enum Foo {A,
          B}
      `,
      output: $`
        enum Foo {
        A,
          B
        }
      `,
      options: [{ minProperties: 2 }],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 2, column: 4, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    // #endregion
    // #region consistent
    {
      code: $`
        enum Foo {
          A,B}
      `,
      output: 'enum Foo {A,B}',
      options: [{ consistent: true }],
      errors: [
        { line: 1, column: 10, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
      ],
    },
    // #endregion
    // #region { multiline: true, minProperties: 2, consistent: true }
    {
      code: 'enum Foo {A,B}',
      output: $`
        enum Foo {
        A,B
        }
      `,
      options: [{ multiline: true, minProperties: 2, consistent: true }],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 1, column: 14, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    {
      code: $`
        enum Foo {A,
          B}
      `,
      output: $`
        enum Foo {
        A,
          B
        }
      `,
      options: [{ multiline: true, minProperties: 2, consistent: true }],
      errors: [
        { line: 1, column: 10, messageId: 'expectedLinebreakAfterOpeningBrace' },
        { line: 2, column: 4, messageId: 'expectedLinebreakBeforeClosingBrace' },
      ],
    },
    // #endregion
    // #endregion
  ],
})
