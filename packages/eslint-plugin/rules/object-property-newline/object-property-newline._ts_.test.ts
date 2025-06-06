import type { InvalidTestCase, TestCaseError, ValidTestCase } from '#test'
import type { NodeTypes } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './object-property-newline'

const prefixOfNodes = {
  TSTypeLiteral: 'type Foo = ',
  TSInterfaceBody: 'interface Foo ',
} as Record<NodeTypes, string>

function createValidRule(input: string[], option: boolean) {
  // add comment for better experience in `vitest` extension
  const code = `${input.join('\n')}// ${JSON.stringify(option) || 'default'}`

  return Object.entries(prefixOfNodes).flatMap(([_, prefix]) => {
    const res: ValidTestCase<RuleOptions>[] = [
      { code: `${prefix}${code}`, options: [{ allowAllPropertiesOnSameLine: option }] },
    ]
    if (!option)
      res.push({ code: `${prefix}${code}` })

    return res
  })
}

function createInvalidRule(input: string[], out: string[], err: TestCaseError<MessageIds>[], option: boolean) {
  // add comment for better experience in `vitest` extension
  const code = `${input.join('\n')}// ${JSON.stringify(option) || 'default'}`
  const output = `${out.join('\n')}// ${JSON.stringify(option) || 'default'}`

  return Object.entries(prefixOfNodes).flatMap(([_, prefix]) => {
    const errors = err.map(e => ({
      ...e,
      column: e.line === 1 && typeof e.column === 'number' ? e.column + prefix.length : e.column,
    }))

    const res: InvalidTestCase<RuleOptions, MessageIds>[] = [
      { code: `${prefix}${code}`, output: `${prefix}${output}`, errors, options: [{ allowAllPropertiesOnSameLine: option }] },
    ]
    if (!option)
      res.push({ code: `${prefix}${code}`, output: `${prefix}${output}`, errors })

    return res
  })
}

run<RuleOptions, MessageIds>({
  name: 'object-property-newline',
  rule,
  valid: [
    ...[
      [
        '{',
        '  id: number;',
        '  name: string;',
        '  age: number;',
        '}',
      ],
      [
        '{  id: number;',
        '  name: string;',
        '  age: number; }',
      ],
    ].flatMap(code => createValidRule(code, false)),
    ...[
      [
        '{',
        '  id: number;',
        '  name: string;',
        '  age: number;',
        '}',
      ],
      [
        '{ id: number; name: string; age: number; }',
      ],
    ].flatMap(code => createValidRule(code, true)),
  ],
  invalid: [
    ...[
      {
        code: [
          '{  id: number; name: string;',
          '  age: number; }',
        ],
        output: [
          '{  id: number;',
          'name: string;',
          '  age: number; }',
        ],
        errors: [
          { line: 1, column: 16, messageId: 'propertiesOnNewline' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  id: number; name: string;',
          '  age: number; }',
        ],
        output: [
          '{',
          '  id: number;',
          'name: string;',
          '  age: number; }',
        ],
        errors: [
          { line: 2, column: 15, messageId: 'propertiesOnNewline' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{ id: number; name: string; age: number; }',
        ],
        output: [
          '{ id: number;',
          'name: string;',
          'age: number; }',
        ],
        errors: [
          { line: 1, column: 15, messageId: 'propertiesOnNewline' },
          { line: 1, column: 29, messageId: 'propertiesOnNewline' },
        ] as TestCaseError<MessageIds>[],
      },
    ].flatMap<InvalidTestCase<RuleOptions, MessageIds>>(c => createInvalidRule(c.code, c.output, c.errors, false)),
    ...([
      {
        code: [
          '{  id: number; name: string;',
          'age: number; }',
        ],
        output: [
          '{  id: number;',
          'name: string;',
          'age: number; }',
        ],
        errors: [
          { line: 1, column: 16, messageId: 'propertiesOnNewlineAll' },
        ] as TestCaseError<MessageIds>[],
      },
      {
        code: [
          '{',
          '  id: number; name: string;',
          '  age: number; }',
        ],
        output: [
          '{',
          '  id: number;',
          'name: string;',
          '  age: number; }',
        ],
        errors: [
          { line: 2, column: 15, messageId: 'propertiesOnNewlineAll' },
        ] as TestCaseError<MessageIds>[],
      },
    ]).flatMap<InvalidTestCase<RuleOptions, MessageIds>>(c => createInvalidRule(c.code, c.output, c.errors, true)),
  ],
})
