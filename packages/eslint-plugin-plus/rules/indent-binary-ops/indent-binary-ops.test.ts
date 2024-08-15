import { expect, it } from 'vitest'
import rule from './indent-binary-ops'
import { $, createLinter, run } from '#test'

run({
  name: 'indent-binary-ops',
  rule,
  valid: [
    $`
      type a = {
        [K in keyof T]: T[K] extends Date
          ? Date | string
          : T[K] extends (Date | null)
            ? Date | string | null
            : T[K];
      }
    `,
    $`
      type Foo =
        | A
        | B
    `,
    $`
      if (
        this.level >= this.max ||
        this.level <= this.min
      ) {
        this.overflow = true;
      }
    `,
    $`
      const woof = computed(() => keys.value.filter(
        ({ type }) => type === 'bark' ||
          type === 'pooque' ||
          type === 'srenque'
        ));
    `,
  ],
  invalid: [],
})

it('snapshots', async () => {
  const { fix } = createLinter('indent-binary-ops', rule)

  expect(
    fix($`
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
    fix($`
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
    fix($`
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
    fix($`
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
    fix($`
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
    fix($`
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
    fix($`
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
    fix($`
      type T = 
      a 
      | b 
        | c
    `),
  ).toMatchInlineSnapshot(
    `
    "type T = 
      a 
      | b 
      | c"
  `,
  )

  expect(
    fix($`
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
    fix($`
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
    fix($`
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
