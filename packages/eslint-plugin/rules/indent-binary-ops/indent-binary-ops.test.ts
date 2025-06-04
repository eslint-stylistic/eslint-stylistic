import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './indent-binary-ops'

run<RuleOptions, MessageIds>({
  name: 'indent-binary-ops',
  rule,
  recursive: 10,
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
    $`
      if (a
        && b
        && c
        && (d
          || e
          || f
        )
      ) {
        foo()
      }
    `,
    $`
      type Foo = Pick<Bar,
        Baz
        | Qux,
      >;
    `,
    $`
      type Foo = [Bar,
        Baz
        | Qux,
      ];
    `,
    $`
      type Foo = { x: Foo,
        y: Baz
          | Quz
      };
    `,
    $`
      type Foo = Pick<Bar
        | Baz,
        Baz
        | Qux,
      >;
    `,
    $`
      type Foo = [Bar
        | Baz,
        Baz
        | Qux,
      ];
    `,
    $`
      type Foo = { x: Foo
        | Baz,
        y: Baz
          | Quz
      };
    `,
    $`
      const a = 1
        + 2
        + 3;
    `,
    $`
      a = 1
        + 2
        + 3;
    `,
    $`
      const a = 1 +
        2 +
        3;
    `,
    $`
      a = 1 +
        2 +
        3;
    `,
    $`
      this.a = this.b
        || c
        || d;
    `,
    $`
      { aaaaa &&
        bbbbb &&
        ccccc }
    `,
    $`
      {
        aaaaa &&
        bbbbb &&
        ccccc
      }
    `,
    $`
      if (condition1 &&
        condition2 &&
        condition3
      ) {
        a &&
        b() &&
        c()
      }
    `,
  ],
  invalid: [
    {
      code: $`
        if (
          a && (
            a.b ||
              a.c
          ) &&
            a.d
        ) {}
      `,
      output: $`
        if (
          a && (
            a.b ||
            a.c
          ) &&
          a.d
        ) {}
      `,
    },
    {
      code: $`
        const a =
          x +
            y * z
      `,
      output: $`
        const a =
          x +
          y * z
      `,
    },
    {
      code: $`
        if (
          aaaaaa >
        bbbbb
        ) {}
      `,
      output: $`
        if (
          aaaaaa >
          bbbbb
        ) {}
      `,
    },
    {
      code: $`
        function foo() {
          if (a
          || b
              || c || d
                || (d && b)
          ) {
            foo()
          }
        }
      `,
      output: $`
        function foo() {
          if (a
            || b
            || c || d
            || (d && b)
          ) {
            foo()
          }
        }
      `,
    },
    {
      code: $`
        type Foo = A | B
          | C | D
            | E
      `,
      output: $`
        type Foo = A | B
          | C | D
          | E
      `,
    },
    {
      code: $`
        type Foo =
        | A | C
          | B
      `,
      output: $`
        type Foo =
          | A | C
          | B
      `,
    },
    {
      code: $`
        type Foo =
        | A | C
          | B
      `,
      output: $`
        type Foo =
          | A | C
          | B
      `,
    },
    {
      code: $`
        type T =
        & A
          & (B
          | A
          | D)
      `,
      output: $`
        type T =
          & A
          & (B
            | A
            | D)
      `,
    },
    {
      code: $`
        type T =
        a
        | b
          | c
      `,
      output: $`
        type T =
          a
          | b
          | c
      `,
    },
    {
      code: $`
        function TSPropertySignatureToProperty(
          node:
          | TSESTree.TSEnumMember
            | TSESTree.TSPropertySignature
          | TSESTree.TypeElement,
          type:
          | AST_NODE_TYPES.Property
            | AST_NODE_TYPES.PropertyDefinition = AST_NODE_TYPES.Property,
        ): TSESTree.Node | null {}
      `,
      output: $`
        function TSPropertySignatureToProperty(
          node:
            | TSESTree.TSEnumMember
            | TSESTree.TSPropertySignature
            | TSESTree.TypeElement,
          type:
            | AST_NODE_TYPES.Property
            | AST_NODE_TYPES.PropertyDefinition = AST_NODE_TYPES.Property,
        ): TSESTree.Node | null {}
      `,
    },
    {
      code: $`
        type Foo = Merge<
            A
          & B
            & C
        >
      `,
      output: $`
        type Foo = Merge<
          A
          & B
          & C
        >
      `,
    },
    {
      code: $`
        if (
          typeof woof === 'string' &&
          typeof woof === 'string' &&
            typeof woof === 'string' &&
          isNaN(null) &&
            isNaN(NaN)
        ) {
          return;
        }
      `,
      output: $`
        if (
          typeof woof === 'string' &&
          typeof woof === 'string' &&
          typeof woof === 'string' &&
          isNaN(null) &&
          isNaN(NaN)
        ) {
          return;
        }
      `,
    },
    {
      code: $`
        const a = () => b
        || c
        
        const a = (
          p,
        ) => (b
        || c)
        
        const a = b
        + c;
        const a = {
          p: b
          + c,
        };
      `,
      output: $`
        const a = () => b
          || c
        
        const a = (
          p,
        ) => (b
          || c)
        
        const a = b
          + c;
        const a = {
          p: b
            + c,
        };
      `,
    },
    {
      code: $`
        const a = (
          (b
              && c)
            || (d
          && e)
        )
      `,
      output: $`
        const a = (
          (b
            && c)
          || (d
            && e)
        )
      `,
    },
    {
      code: $`
        const a = (
          (b
              && c)
            || (d
          && e)
        )
      `,
      output: $`
        const a = (
          (b
            && c)
          || (d
            && e)
        )
      `,
    },
    {
      code: $`
        {
          const a = false
          || (a && b)
          || (c && d)
          || (e && f)
          || (g && h)
        }
      `,
      output: $`
        {
          const a = false
            || (a && b)
            || (c && d)
            || (e && f)
            || (g && h)
        }
      `,
    },
    {
      code: $`
        type Type =
          | ({
            type: 'a';
          } & A)
          | ({
            type: 'b';
            } & B)
          | ({
            type: 'c';
          } & {
            c: string;
          });
      `,
      output: $`
        type Type =
          | ({
            type: 'a';
          } & A)
          | ({
            type: 'b';
            } & B)
            | ({
            type: 'c';
          } & {
            c: string;
          });
      `,
    },
    {
      code: $`
        type Foo = Pick<Bar,
        Baz
            | Qux,
        >;
      `,
      output: $`
        type Foo = Pick<Bar,
          Baz
          | Qux,
        >;
      `,
    },
    {
      code: $`
        type Foo = [Bar,
        Baz
              | Qux,
        ];
      `,
      output: $`
        type Foo = [Bar,
          Baz
          | Qux,
        ];
      `,
    },
    {
      code: $`
        type Foo = { x: Foo,
          y: Baz
          | Quz
        };
      `,
      output: $`
        type Foo = { x: Foo,
          y: Baz
            | Quz
        };
      `,
    },
    {
      code: $`
        type Foo = Pick<Bar
        | Baz,
        Baz
            | Qux,
        >;
      `,
      output: $`
        type Foo = Pick<Bar
          | Baz,
          Baz
          | Qux,
        >;
      `,
    },
    {
      code: $`
        type Foo = [Bar
        | Baz,
        Baz
              | Qux,
        ];
      `,
      output: $`
        type Foo = [Bar
          | Baz,
          Baz
          | Qux,
        ];
      `,
    },
    {
      code: $`
        type Foo = { x: Foo
        | Baz,
          y: Baz
          | Quz
        };
      `,
      output: $`
        type Foo = { x: Foo
          | Baz,
          y: Baz
            | Quz
        };
      `,
    },
    {
      code: $`
        const a = 1
        + 2
            + 3;
      `,
      output: $`
        const a = 1
          + 2
          + 3;
      `,
    },
    {
      code: $`
        a = 1
        - 2
            - 3;
      `,
      output: $`
        a = 1
          - 2
          - 3;
      `,
    },
    {
      code: $`
        const a = 1 *
        2 *
            3;
      `,
      output: $`
        const a = 1 *
          2 *
          3;
      `,
    },
    {
      code: $`
        a = 1 /
        2 /
            3;
      `,
      output: $`
        a = 1 /
          2 /
          3;
      `,
    },
    {
      code: $`
        this.a = this.b
        || 2
            || 3;
      `,
      output: $`
        this.a = this.b
          || 2
          || 3;
      `,
    },
    {
      code: $`
        { aaaaa &&
              bbbbb &&
            ccccc }
      `,
      output: $`
        { aaaaa &&
          bbbbb &&
          ccccc }
      `,
    },
  ],
})
