import type { InvalidTestCase, TestCaseError, ValidTestCase } from '#test'
import type { NodeTypes } from '#types'
import { run } from '#test'
import rule from '.'

const prefixOfNodes = {
  TSTypeLiteral: 'type Foo = ',
  TSInterfaceBody: 'interface Foo ',
} as Record<NodeTypes, string>

function createValidRule(input: string[], option: boolean) {
  // add comment for better experience in `vitest` extension
  const code = `${input.join('\n')}// ${JSON.stringify(option) || 'default'}`

  return Object.entries(prefixOfNodes).flatMap(([_, prefix]) => {
    const res: ValidTestCase[] = [
      { code: `${prefix}${code}`, options: [{ allowAllPropertiesOnSameLine: option }] },
      { code: `${prefix}${code}`, options: [{ /* deprecated */ allowMultiplePropertiesPerLine: option }] },
    ]
    if (!option)
      res.push({ code: `${prefix}${code}` })

    return res
  })
}

function createInvalidRule(input: string[], out: string[], err: TestCaseError[], option: boolean) {
  // add comment for better experience in `vitest` extension
  const code = `${input.join('\n')}// ${JSON.stringify(option) || 'default'}`
  const output = `${out.join('\n')}// ${JSON.stringify(option) || 'default'}`

  return Object.entries(prefixOfNodes).flatMap(([_, prefix]) => {
    const errors = err.map(e => ({
      ...e,
      column: e.line === 1 && typeof e.column === 'number' ? e.column + prefix.length : e.column,
    }))

    const res: InvalidTestCase[] = [
      { code: `${prefix}${code}`, output: `${prefix}${output}`, errors, options: [{ allowAllPropertiesOnSameLine: option }] },
      { code: `${prefix}${code}`, output: `${prefix}${output}`, errors, options: [{ /* deprecated */ allowMultiplePropertiesPerLine: option }] },
    ]
    if (!option)
      res.push({ code: `${prefix}${code}`, output: `${prefix}${output}`, errors })

    return res
  })
}

run({
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
    {
      code: 'type T = { a: string, b: number };',
      options: [{
        allowAllPropertiesOnSameLine: true,
      }],
    },
    {
      code: 'interface Foo { a: string, b: number }',
      options: [{
        allowAllPropertiesOnSameLine: true,
      }],
    },
    {
      code: 'type T = { a: string, b: number }; interface Bar { c: boolean, d: string }',
      options: [{
        allowAllPropertiesOnSameLine: true,
      }],
    },
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
        ],
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
        ],
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
        ],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, false)),
    ...[
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
        ],
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
        ],
      },
    ].flatMap(c => createInvalidRule(c.code, c.output, c.errors, true)),

    // Invalid tests for granular configuration
    {
      code: 'type T = { a: string, b: number };',
      output: 'type T = { a: string,\nb: number };',
      options: [{
        TSTypeLiteral: { allowAllPropertiesOnSameLine: false },
      }],
      errors: [
        { messageId: 'propertiesOnNewline', line: 1, column: 23 },
      ],
    },
    {
      code: 'interface Foo { a: string, b: number }',
      output: 'interface Foo { a: string,\nb: number }',
      options: [{
        TSInterfaceBody: { allowAllPropertiesOnSameLine: false },
      }],
      errors: [
        { messageId: 'propertiesOnNewline', line: 1, column: 28 },
      ],
    },
    {
      code: 'type T = { a: string, b: number }; interface Bar { c: boolean, d: string }',
      output: 'type T = { a: string,\nb: number }; interface Bar { c: boolean,\nd: string }',
      options: [{
        TSTypeLiteral: { allowAllPropertiesOnSameLine: false },
        TSInterfaceBody: { allowAllPropertiesOnSameLine: false },
      }],
      errors: [
        { messageId: 'propertiesOnNewline', line: 1, column: 23 },
        { messageId: 'propertiesOnNewline', line: 1, column: 64 },
      ],
    },
  ],
})
