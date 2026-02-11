// this rule tests the position of braces, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './object-curly-spacing'

run<RuleOptions, MessageIds>({
  name: 'object-curly-spacing',
  rule,
  valid: [
    // default - object literal types
    {
      code: 'const x:{}',
    },
    {
      code: 'const x:{ }',
    },
    {
      code: 'const x:{f: number}',
    },
    {
      code: 'const x:{ // line-comment\nf: number\n}',
    },
    {
      code: 'const x:{// line-comment\nf: number\n}',
    },
    {
      code: 'const x:{/* inline-comment */f: number/* inline-comment */}',
    },
    {
      code: 'const x:{\nf: number\n}',
    },
    {
      code: 'const x:{f: {g: number}}',
    },
    {
      code: 'const x:{f: [number]}',
    },
    {
      code: 'const x:{[key: string]: value}',
    },
    {
      code: 'const x:{[key: string]: [number]}',
    },

    // default - mapped types
    {
      code: 'const x:{[k in \'union\']: number}',
    },
    {
      code: 'const x:{ // line-comment\n[k in \'union\']: number\n}',
    },
    {
      code: 'const x:{// line-comment\n[k in \'union\']: number\n}',
    },
    {
      code: 'const x:{/* inline-comment */[k in \'union\']: number/* inline-comment */}',
    },
    {
      code: 'const x:{\n[k in \'union\']: number\n}',
    },
    {
      code: 'const x:{[k in \'union\']: {[k in \'union\']: number}}',
    },
    {
      code: 'const x:{[k in \'union\']: [number]}',
    },
    {
      code: 'const x:{[k in \'union\']: value}',
    },

    // never - mapped types
    {
      code: 'const x:{[k in \'union\']: {[k in \'union\']: number} }',
      options: ['never', { objectsInObjects: true }],
    },
    {
      code: 'const x:{[k in \'union\']: {[k in \'union\']: number}}',
      options: ['never', { objectsInObjects: false }],
    },
    {
      code: 'const x:{[k in \'union\']: () => {[k in \'union\']: number} }',
      options: ['never', { objectsInObjects: true }],
    },
    {
      code: 'const x:{[k in \'union\']: () => {[k in \'union\']: number}}',
      options: ['never', { objectsInObjects: false }],
    },
    {
      code: 'const x:{[k in \'union\']: [ number ]}',
      options: ['never', { arraysInObjects: false }],
    },
    {
      code: 'const x:{ [k in \'union\']: value}',
      options: ['never', { arraysInObjects: true }],
    },
    {
      code: 'const x:{[k in \'union\']: value}',
      options: ['never', { arraysInObjects: false }],
    },
    {
      code: 'const x:{ [k in \'union\']: [number] }',
      options: ['never', { arraysInObjects: true }],
    },
    {
      code: 'const x:{[k in \'union\']: [number]}',
      options: ['never', { arraysInObjects: false }],
    },

    // never - object literal types
    {
      code: 'const x:{f: {g: number} }',
      options: ['never', { objectsInObjects: true }],
    },
    {
      code: 'const x:{f: {g: number}}',
      options: ['never', { objectsInObjects: false }],
    },
    {
      code: 'const x:{f: () => {g: number} }',
      options: ['never', { objectsInObjects: true }],
    },
    {
      code: 'const x:{f: () => {g: number}}',
      options: ['never', { objectsInObjects: false }],
    },
    {
      code: 'const x:{f: [number] }',
      options: ['never', { arraysInObjects: true }],
    },
    {
      code: 'const x:{f: [ number ]}',
      options: ['never', { arraysInObjects: false }],
    },
    {
      code: 'const x:{ [key: string]: value}',
      options: ['never', { arraysInObjects: true }],
    },
    {
      code: 'const x:{[key: string]: value}',
      options: ['never', { arraysInObjects: false }],
    },
    {
      code: 'const x:{ [key: string]: [number] }',
      options: ['never', { arraysInObjects: true }],
    },
    {
      code: 'const x:{[key: string]: [number]}',
      options: ['never', { arraysInObjects: false }],
    },

    // always - mapped types
    {
      code: 'const x:{ [k in \'union\']: number }',
      options: ['always'],
    },
    {
      code: 'const x:{ // line-comment\n[k in \'union\']: number\n}',
      options: ['always'],
    },
    {
      code: 'const x:{ /* inline-comment */ [k in \'union\']: number /* inline-comment */ }',
      options: ['always'],
    },
    {
      code: 'const x:{\n[k in \'union\']: number\n}',
      options: ['always'],
    },
    {
      code: 'const x:{ [k in \'union\']: [number] }',
      options: ['always'],
    },

    // always - mapped types - objectsInObjects
    {
      code: 'const x:{ [k in \'union\']: { [k in \'union\']: number } }',
      options: ['always', { objectsInObjects: true }],
    },
    {
      code: 'const x:{ [k in \'union\']: { [k in \'union\']: number }}',
      options: ['always', { objectsInObjects: false }],
    },
    {
      code: 'const x:{ [k in \'union\']: () => { [k in \'union\']: number } }',
      options: ['always', { objectsInObjects: true }],
    },
    {
      code: 'const x:{ [k in \'union\']: () => { [k in \'union\']: number }}',
      options: ['always', { objectsInObjects: false }],
    },

    // always - mapped types - arraysInObjects
    {
      code: 'type x = { [k in \'union\']: number }',
      options: ['always'],
    },
    {
      code: 'const x:{ [k in \'union\']: [number] }',
      options: ['always', { arraysInObjects: true }],
    },
    {
      code: 'const x:{ [k in \'union\']: value }',
      options: ['always', { arraysInObjects: true }],
    },
    {
      code: 'const x:{[k in \'union\']: value }',
      options: ['always', { arraysInObjects: false }],
    },
    {
      code: 'const x:{[k in \'union\']: [number]}',
      options: ['always', { arraysInObjects: false }],
    },

    // always - object literal types
    {
      code: 'const x:{}',
      options: ['always'],
    },
    {
      code: 'const x:{ }',
      options: ['always'],
    },
    {
      code: 'const x:{ f: number }',
      options: ['always'],
    },
    {
      code: 'const x:{ // line-comment\nf: number\n}',
      options: ['always'],
    },
    {
      code: 'const x:{ /* inline-comment */ f: number /* inline-comment */ }',
      options: ['always'],
    },
    {
      code: 'const x:{\nf: number\n}',
      options: ['always'],
    },
    {
      code: 'const x:{ f: [number] }',
      options: ['always'],
    },

    // always - literal types - objectsInObjects
    {
      code: 'const x:{ f: { g: number } }',
      options: ['always', { objectsInObjects: true }],
    },
    {
      code: 'const x:{ f: { g: number }}',
      options: ['always', { objectsInObjects: false }],
    },
    {
      code: 'const x:{ f: () => { g: number } }',
      options: ['always', { objectsInObjects: true }],
    },
    {
      code: 'const x:{ f: () => { g: number }}',
      options: ['always', { objectsInObjects: false }],
    },

    // always - literal types - arraysInObjects
    {
      code: 'const x:{ f: [number] }',
      options: ['always', { arraysInObjects: true }],
    },
    {
      code: 'const x:{ f: [ number ]}',
      options: ['always', { arraysInObjects: false }],
    },
    {
      code: 'const x:{ [key: string]: value }',
      options: ['always', { arraysInObjects: true }],
    },
    {
      code: 'const x:{[key: string]: value }',
      options: ['always', { arraysInObjects: false }],
    },
    {
      code: 'const x:{ [key: string]: [number] }',
      options: ['always', { arraysInObjects: true }],
    },
    {
      code: 'const x:{[key: string]: [number]}',
      options: ['always', { arraysInObjects: false }],
    },

    // default - TSInterfaceBody
    {
      code: 'interface x {f: number}',
    },
    // always - TSInterfaceBody
    {
      code: 'interface x { f: number }',
      options: ['always'],
    },
    // never - TSInterfaceBody
    {
      code: 'interface x {f: number}',
      options: ['never'],
    },
    // default - TSEnumBody
    {
      code: 'enum Foo {ONE, TWO,}',
    },
    // always - TSEnumBody
    {
      code: 'enum Foo { ONE, TWO = 2 }',
      options: ['always'],
    },
    // never - TSEnumBody
    {
      code: 'enum Foo {ONE, TWO,}',
      options: ['never'],
    },
    {
      code: `import pkgJson from 'package.json' with {type: 'json'}`,
    },
    {
      code: `export { name } from 'package.json' with { type: 'json' }`,
      options: ['always'],
    },
    {
      code: `export * from 'package.json' with {type: 'json'}`,
      options: ['never'],
    },
    {
      code: `import {name, version} from 'package.json' with { type: 'json' }`,
      options: ['never', {
        overrides: {
          ImportAttributes: 'always',
        },
      }],
    },

    {
      code: 'const x:{/* comment */}',
      options: ['never', { emptyObjects: 'always' }],
    },
    {
      code: 'const x:{  /* comment */  }',
      options: ['never', { emptyObjects: 'never' }],
    },
    {
      code: 'const x:{}',
      options: ['never', { emptyObjects: 'never' }],
    },
    {
      code: 'const x:{ }',
      options: ['never', { emptyObjects: 'always' }],
    },
    {
      code: 'const x:{f: {}}',
      options: ['never', { emptyObjects: 'never' }],
    },
    {
      code: 'const x:{f: { }}',
      options: ['never', { emptyObjects: 'always' }],
    },
    {
      code: 'interface x {}',
      options: ['never', { emptyObjects: 'never' }],
    },
    {
      code: 'interface x { }',
      options: ['never', { emptyObjects: 'always' }],
    },
    {
      code: 'interface x { /* comment */ \n foo: string \n}',
      options: ['never', { emptyObjects: 'never' }],
    },
    {
      code: 'import {} from "package.json" with {}',
      options: ['never', { emptyObjects: 'never' }],
    },
    {
      code: 'import { } from "package.json" with { }',
      options: ['never', { emptyObjects: 'always' }],
    },
    {
      code: 'enum Foo {}',
      options: ['never', { emptyObjects: 'never' }],
    },
    {
      code: 'enum Foo { }',
      options: ['never', { emptyObjects: 'always' }],
    },
  ],

  invalid: [
    // https://github.com/eslint/eslint/issues/6940
    {
      code: 'function foo ({a, b }: Props) {\n}',
      output: 'function foo ({a, b}: Props) {\n}',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpaceBefore',
          data: { token: '}' },
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 21,
        },
      ],
    },

    // object literal types
    // never - literal types
    {
      code: 'type x = { f: number }',
      output: 'type x = {f: number}',
      errors: [
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    {
      code: 'type x = { f: number}',
      output: 'type x = {f: number}',
      errors: [{ messageId: 'unexpectedSpaceAfter' }],
    },
    {
      code: 'type x = {f: number }',
      output: 'type x = {f: number}',
      errors: [{ messageId: 'unexpectedSpaceBefore' }],
    },
    // always - literal types
    {
      code: 'type x = {f: number}',
      output: 'type x = { f: number }',
      options: ['always'],
      errors: [
        { messageId: 'requireSpaceAfter' },
        { messageId: 'requireSpaceBefore' },
      ],
    },
    {
      code: 'type x = {f: number }',
      output: 'type x = { f: number }',
      options: ['always'],
      errors: [{ messageId: 'requireSpaceAfter' }],
    },
    {
      code: 'type x = { f: number}',
      output: 'type x = { f: number }',
      options: ['always'],
      errors: [{ messageId: 'requireSpaceBefore' }],
    },

    // never - mapped types
    {
      code: 'type x = { [k in \'union\']: number }',
      output: 'type x = {[k in \'union\']: number}',
      errors: [
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    {
      code: 'type x = { [k in \'union\']: number}',
      output: 'type x = {[k in \'union\']: number}',
      errors: [{ messageId: 'unexpectedSpaceAfter' }],
    },
    {
      code: 'type x = {[k in \'union\']: number }',
      output: 'type x = {[k in \'union\']: number}',
      errors: [{ messageId: 'unexpectedSpaceBefore' }],
    },
    // always - mapped types
    {
      code: 'type x = {[k in \'union\']: number}',
      output: 'type x = { [k in \'union\']: number }',
      options: ['always'],
      errors: [
        { messageId: 'requireSpaceAfter' },
        { messageId: 'requireSpaceBefore' },
      ],
    },
    {
      code: 'type x = {[k in \'union\']: number }',
      output: 'type x = { [k in \'union\']: number }',
      options: ['always'],
      errors: [{ messageId: 'requireSpaceAfter' }],
    },
    {
      code: 'type x = { [k in \'union\']: number}',
      output: 'type x = { [k in \'union\']: number }',
      options: ['always'],
      errors: [{ messageId: 'requireSpaceBefore' }],
    },
    // Mapped and literal types mix
    {
      code: 'type x = { [k in \'union\']: { [k: string]: number } }',
      output: 'type x = {[k in \'union\']: {[k: string]: number}}',
      errors: [
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    // TSInterfaceBody
    {
      code: 'interface x { f: number }',
      output: 'interface x {f: number}',
      errors: [
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    {
      code: 'interface x {f: number}',
      output: 'interface x { f: number }',
      options: ['always'],
      errors: [
        { messageId: 'requireSpaceAfter' },
        { messageId: 'requireSpaceBefore' },
      ],
    },
    // TSEnumBody
    {
      code: 'enum Foo { ONE, TWO = 2 }',
      output: 'enum Foo {ONE, TWO = 2}',
      errors: [
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    {
      code: 'enum Foo {ONE, TWO,}',
      output: 'enum Foo { ONE, TWO, }',
      options: ['always'],
      errors: [
        { messageId: 'requireSpaceAfter' },
        { messageId: 'requireSpaceBefore' },
      ],
    },
    {
      code: `import pkgJson from 'package.json' with { type: 'json' }`,
      output: `import pkgJson from 'package.json' with {type: 'json'}`,
      errors: [
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    {
      code: `export { name } from 'package.json' with {type: 'json'}`,
      output: `export { name } from 'package.json' with { type: 'json' }`,
      options: ['always'],
      errors: [
        { messageId: 'requireSpaceAfter' },
        { messageId: 'requireSpaceBefore' },
      ],
    },
    {
      code: `export * from 'package.json' with { type: 'json' }`,
      output: `export * from 'package.json' with {type: 'json'}`,
      options: ['never'],
      errors: [
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    {
      code: `import {name, version} from 'package.json' with { type: 'json' }`,
      output: `import { name, version } from 'package.json' with {type: 'json'}`,
      options: ['always', {
        overrides: {
          ImportAttributes: 'never',
        },
      }],
      errors: [
        { messageId: 'requireSpaceAfter' },
        { messageId: 'requireSpaceBefore' },
        { messageId: 'unexpectedSpaceAfter' },
        { messageId: 'unexpectedSpaceBefore' },
      ],
    },
    {
      code: 'import { } from "package.json" with { }',
      output: 'import {} from "package.json" with {}',
      options: ['never', { emptyObjects: 'never' }],
      errors: [
        {
          messageId: 'unexpectedSpaceInEmptyObject',
          data: { node: 'ImportDeclaration' },
          type: 'ImportDeclaration',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 10,
        },
        {
          messageId: 'unexpectedSpaceInEmptyObject',
          data: { node: 'ImportAttributes' },
          type: 'ImportDeclaration',
          line: 1,
          column: 38,
          endLine: 1,
          endColumn: 39,
        },
      ],
    },
    {
      code: 'enum Foo {}',
      output: 'enum Foo { }',
      options: ['never', { emptyObjects: 'always' }],
      errors: [
        {
          messageId: 'requiredSpaceInEmptyObject',
          data: { node: 'TSEnumBody' },
          type: 'TSEnumBody',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 11,
        },
      ],
    },
    {
      code: 'const x:{f: {}}',
      output: 'const x:{f: { }}',
      options: ['never', { emptyObjects: 'always' }],
      errors: [
        {
          messageId: 'requiredSpaceInEmptyObject',
          data: { node: 'TSTypeLiteral' },
          type: 'TSTypeLiteral',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 14,
        },
      ],
    },
    {
      code: 'interface x {    }',
      output: 'interface x {}',
      options: ['never', { emptyObjects: 'never' }],
      errors: [
        {
          messageId: 'unexpectedSpaceInEmptyObject',
          data: { node: 'TSInterfaceBody' },
          type: 'TSInterfaceBody',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 18,
        },
      ],
    },
    {
      code: 'export {   } from "package.json" with {   }',
      output: 'export {} from "package.json" with {}',
      options: ['never', { emptyObjects: 'never' }],
      errors: [
        {
          messageId: 'unexpectedSpaceInEmptyObject',
          data: { node: 'ExportNamedDeclaration' },
          type: 'ExportNamedDeclaration',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 12,
        },
        {
          messageId: 'unexpectedSpaceInEmptyObject',
          data: { node: 'ImportAttributes' },
          type: 'ExportNamedDeclaration',
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 43,
        },
      ],
    },
    {
      code: 'import {   } from "package.json" with {   }',
      output: 'import { } from "package.json" with { }',
      options: ['never', { emptyObjects: 'always' }],
      errors: [
        {
          messageId: 'requiredSpaceInEmptyObject',
          data: { node: 'ImportDeclaration' },
          type: 'ImportDeclaration',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 12,
        },
        {
          messageId: 'requiredSpaceInEmptyObject',
          data: { node: 'ImportAttributes' },
          type: 'ImportDeclaration',
          line: 1,
          column: 40,
          endLine: 1,
          endColumn: 43,
        },
      ],
    },
    {
      code: 'enum Foo {   }',
      output: 'enum Foo { }',
      options: ['never', { emptyObjects: 'always' }],
      errors: [
        {
          messageId: 'requiredSpaceInEmptyObject',
          data: { node: 'TSEnumBody' },
          type: 'TSEnumBody',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 14,
        },
      ],
    },
    {
      code: 'const x:{f: {   }}',
      output: 'const x:{f: { }}',
      options: ['never', { emptyObjects: 'always' }],
      errors: [
        {
          messageId: 'requiredSpaceInEmptyObject',
          data: { node: 'TSTypeLiteral' },
          type: 'TSTypeLiteral',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 17,
        },
      ],
    },
    {
      code: 'const foo = ({str}: { str: string }) => null',
      output: 'const foo = ({ str }: { str: string }) => null',
      options: ['always'],
      errors: [
        { messageId: 'requireSpaceAfter' },
        { messageId: 'requireSpaceBefore' },
      ],
    },
  ],
})
