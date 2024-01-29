import { RuleTester } from '@typescript-eslint/rule-tester'
import { expect, it } from 'vitest'
import { createLinter } from '../../../test-utils/createLinter'
import { unIndent } from '../../../eslint-plugin-js/test-utils/unindent'
import rule from './indent-binary-ops'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('indent-binary-ops', rule, {
  valid: [
    unIndent`
      type a = {
        [K in keyof T]: T[K] extends Date
          ? Date | string
          : T[K] extends (Date | null)
            ? Date | string | null
            : T[K];
      }
    `,
    unIndent`
      type Foo =
        | A
        | B
    `,
    unIndent`
      if (
        this.level >= this.max ||
        this.level <= this.min
      ) {
        this.overflow = true;
      }
    `,
  ],
  invalid: [],
})

it('snapshots', async () => {
  const { fix } = createLinter('indent-binary-ops', rule)

  expect(
    fix(unIndent`
    if (
      a && (
        a.b ||
          a.c
      ) &&
        a.d
    ) {}
    `),
  ).toMatchInlineSnapshot(
    `
    "if (
      a && (
        a.b ||
        a.c
      ) &&
      a.d
    ) {}"
  `,
  )

  expect(
    fix(unIndent`
    const a =
    x +
      y * z
    `),
  ).toMatchInlineSnapshot(
    `
    "const a =
    x +
    y * z"
  `,
  )
  expect(
    fix(unIndent`
    if (
      aaaaaa >
    bbbbb
    ) {}
    `),
  ).toMatchInlineSnapshot(
    `
    "if (
      aaaaaa >
      bbbbb
    ) {}"
  `,
  )

  expect(
    fix(unIndent`
    function foo() {
      if (a
      || b
          || c || d
            || (d && b)
      ) {
        foo()
      }
    }
    `),
  ).toMatchInlineSnapshot(
    `
    "function foo() {
      if (a
        || b
        || c || d
        || (d && b)
      ) {
        foo()
      }
    }"
  `,
  )

  expect(
    fix(unIndent`
    type Foo = A | B
    | C | D
      | E
    `),
  ).toMatchInlineSnapshot(
    `
    "type Foo = A | B
      | C | D
      | E"
  `,
  )

  expect(
    fix(unIndent`
    type Foo = 
    | A | C
      | B
    `),
  ).toMatchInlineSnapshot(
    `
    "type Foo = 
      | A | C
      | B"
  `,
  )

  expect(
    fix(unIndent`
    type T =
    & A
      & (B
      | A
      | D)
    `),
  ).toMatchInlineSnapshot(
    `
    "type T =
      & A
      & (B
      | A
      | D)"
  `,
  )

  expect(
    fix(unIndent`
    type T = 
    a 
    | b 
      | c`),
  ).toMatchInlineSnapshot(
    `
    "type T = 
      a 
      | b 
      | c"
  `,
  )

  expect(
    fix(unIndent`
    function TSPropertySignatureToProperty(
      node:
      | TSESTree.TSEnumMember
        | TSESTree.TSPropertySignature
      | TSESTree.TypeElement,
      type:
      | AST_NODE_TYPES.Property
        | AST_NODE_TYPES.PropertyDefinition = AST_NODE_TYPES.Property,
    ): TSESTree.Node | null {}
    `),
  ).toMatchInlineSnapshot(
    `
    "function TSPropertySignatureToProperty(
      node:
        | TSESTree.TSEnumMember
        | TSESTree.TSPropertySignature
        | TSESTree.TypeElement,
      type:
        | AST_NODE_TYPES.Property
        | AST_NODE_TYPES.PropertyDefinition = AST_NODE_TYPES.Property,
    ): TSESTree.Node | null {}"
  `,
  )

  expect(
    fix(unIndent`
    type Foo = Merge<
        A 
      & B
        & C
    >
    `),
  ).toMatchInlineSnapshot(
    `
    "type Foo = Merge<
      A 
      & B
      & C
    >"
  `,
  )

  expect(
    fix(unIndent`
    if (
      typeof woof === 'string' &&
      typeof woof === 'string' &&
        typeof woof === 'string' &&
      isNaN(null) &&
        isNaN(NaN)
    ) {
      return;
    }
    `),
  ).toMatchInlineSnapshot(
    `
    "if (
      typeof woof === 'string' &&
      typeof woof === 'string' &&
      typeof woof === 'string' &&
      isNaN(null) &&
      isNaN(NaN)
    ) {
      return;
    }"
  `,
  )
})
