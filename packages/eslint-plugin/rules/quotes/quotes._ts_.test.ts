// this rule tests quotes, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './quotes'

const useDoubleQuote = {
  messageId: 'wrongQuotes' as const,
  data: {
    description: 'doublequote',
  },
}

const useSingleQuote = {
  messageId: 'wrongQuotes' as const,
  data: {
    description: 'singlequote',
  },
}

const useBacktick = {
  messageId: 'wrongQuotes' as const,
  data: {
    description: 'backtick',
  },
}

run<RuleOptions, MessageIds>({
  name: 'quotes',
  rule,
  valid: [
    {
      code: 'declare module \'*.html\' {}',
      options: ['backtick'],
    },
    {
      code: $`
        class A {
          public prop: IProps[\`prop\`];
        }
      `,
      options: ['backtick'],
    },

    // `backtick` should not warn import with attributes.
    {
      code: 'import "a" assert { type: "json" }; import \'b\' assert { type: \'json\' };',
      options: ['backtick'],
    },
    {
      code: 'import a from "a" assert { type: "json" }; import b from \'b\' assert { type: \'json\' };',
      options: ['backtick'],
    },
    {
      code: 'import "a" with { type: "json" }; import \'b\' with { type: \'json\' };',
      options: ['backtick'],
    },
    {
      code: 'import a from "a" with { type: "json" }; import b from \'b\' with { type: \'json\' };',
      options: ['backtick'],
    },
    // `backtick` should not warn import with require.
    {
      code: 'import moment = require(\'moment\');',
      options: ['backtick'],
    },

    // TSPropertySignature
    {
      code: $`
        interface Foo {
          a: number;
          b: string;
          "a-b": boolean;
          "a-b-c": boolean;
        }
      `,
    },
    {
      code: $`
        interface Foo {
          a: number;
          b: string;
          'a-b': boolean;
          'a-b-c': boolean;
        }
      `,
      options: ['single'],
    },
    {
      code: $`
        interface Foo {
          a: number;
          b: string;
          'a-b': boolean;
          'a-b-c': boolean;
        }
      `,
      options: ['backtick'],
    },

    // TSEnumMember
    {
      code: $`
        enum Foo {
          A = 1,
          "A-B" = 2
        }
      `,
    },
    {
      code: $`
        enum Foo {
          A = 1,
          'A-B' = 2
        }
      `,
      options: ['single'],
    },
    {
      code: $`
        enum Foo {
          A = \`A\`,
          'A-B' = \`A-B\`
        }
      `,
      options: ['backtick'],
    },

    // TSMethodSignature
    {
      code: $`
        interface Foo {
          a(): void;
          "a-b"(): void;
        }
      `,
    },
    {
      code: $`
        interface Foo {
          a(): void;
          'a-b'(): void;
        }
      `,
      options: ['single'],
    },
    {
      code: $`
        interface Foo {
          a(): void;
          'a-b'(): void;
        }
      `,
      options: ['backtick'],
    },

    // PropertyDefinition
    {
      code: $`
        class Foo {
          public a = "";
          public "a-b" = "";
        }
      `,
    },
    {
      code: $`
        class Foo {
          public a = '';
          public 'a-b' = '';
        }
      `,
      options: ['single'],
    },
    {
      code: $`
        class Foo {
          public a = \`\`;
          public 'a-b' = \`\`;
        }
      `,
      options: ['backtick'],
    },

    // AccessorProperty
    {
      code: $`
        class Foo {
          accessor a = "";
          accessor "a-b" = "";
        }
      `,
    },
    {
      code: $`
        class Foo {
          accessor a = '';
          accessor 'a-b' = '';
        }
      `,
      options: ['single'],
    },
    {
      code: $`
        class Foo {
          accessor a = \`\`;
          accessor 'a-b' = \`\`;
        }
      `,
      options: ['backtick'],
    },

    // TSAbstractPropertyDefinition
    {
      code: $`
        abstract class Foo {
          public abstract a: "";
          public abstract "a-b": "";
        }
      `,
    },
    {
      code: $`
        abstract class Foo {
          public abstract a: '';
          public abstract 'a-b': '';
        }
      `,
      options: ['single'],
    },
    {
      code: $`
        abstract class Foo {
          public abstract a: \`\`;
          public abstract 'a-b': \`\`;
        }
      `,
      options: ['backtick'],
    },

    // TSAbstractMethodDefinition
    {
      code: $`
        abstract class Foo {
          public abstract a(): void;
          public abstract "a-b"(): void;
        }
      `,
    },
    {
      code: $`
        abstract class Foo {
          public abstract a(): void;
          public abstract 'a-b'(): void;
        }
      `,
      options: ['single'],
    },
    {
      code: $`
        abstract class Foo {
          public abstract a(): void;
          public abstract 'a-b'(): void;
        }
      `,
      options: ['backtick'],
    },

    // TSLiteralType
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/473
    {
      code: $`
        type A = import('hi');
      `,
      options: ['backtick'],
    },
    {
      code: $`
        type A = \`a\` | \`b\`;
      `,
      options: ['backtick'],
    },
  ],

  invalid: [
    {
      code: $`
        interface Foo {
          a: number;
          b: string;
          'a-b': boolean;
          'a-b-c': boolean;
        }
      `,
      output: $`
        interface Foo {
          a: number;
          b: string;
          "a-b": boolean;
          "a-b-c": boolean;
        }
      `,
      errors: [
        {
          ...useDoubleQuote,
          line: 4,
          column: 3,
        },
        {
          ...useDoubleQuote,
          line: 5,
          column: 3,
        },
      ],
    },
    {
      code: $`
        interface Foo {
          a: number;
          b: string;
          "a-b": boolean;
          "a-b-c": boolean;
        }
      `,
      output: $`
        interface Foo {
          a: number;
          b: string;
          'a-b': boolean;
          'a-b-c': boolean;
        }
      `,
      errors: [
        {
          ...useSingleQuote,
          line: 4,
          column: 3,
        },
        {
          ...useSingleQuote,
          line: 5,
          column: 3,
        },
      ],
      options: ['single'],
    },

    // Enums
    {
      code: $`
        enum Foo {
          A = 1,
          'A-B' = 2
        }
      `,
      output: $`
        enum Foo {
          A = 1,
          "A-B" = 2
        }
      `,
      errors: [
        {
          ...useDoubleQuote,
          line: 3,
          column: 3,
        },
      ],
    },
    {
      code: $`
        enum Foo {
          A = 1,
          "A-B" = 2
        }
      `,
      output: $`
        enum Foo {
          A = 1,
          'A-B' = 2
        }
      `,
      errors: [
        {
          ...useSingleQuote,
          line: 3,
          column: 3,
        },
      ],
      options: ['single'],
    },
    {
      code: $`
        enum Foo {
          A = 'A',
          'A-B' = 'A-B'
        }
      `,
      output: $`
        enum Foo {
          A = \`A\`,
          'A-B' = \`A-B\`
        }
      `,
      errors: [
        {
          ...useBacktick,
          line: 2,
          column: 7,
        },
        {
          ...useBacktick,
          line: 3,
          column: 11,
        },
      ],
      options: ['backtick'],
    },

    // TSMethodSignature
    {
      code: $`
        interface Foo {
          a(): void;
          'a-b'(): void;
        }
      `,
      output: $`
        interface Foo {
          a(): void;
          "a-b"(): void;
        }
      `,
      errors: [
        {
          ...useDoubleQuote,
          line: 3,
          column: 3,
        },
      ],
    },
    {
      code: $`
        interface Foo {
          a(): void;
          "a-b"(): void;
        }
      `,
      output: $`
        interface Foo {
          a(): void;
          'a-b'(): void;
        }
      `,
      errors: [
        {
          ...useSingleQuote,
          line: 3,
          column: 3,
        },
      ],
      options: ['single'],
    },

    // PropertyDefinition
    {
      code: $`
        class Foo {
          public a = '';
          public 'a-b' = '';
        }
      `,
      output: $`
        class Foo {
          public a = "";
          public "a-b" = "";
        }
      `,
      errors: [
        {
          ...useDoubleQuote,
          line: 2,
          column: 14,
        },
        {
          ...useDoubleQuote,
          line: 3,
          column: 10,
        },
        {
          ...useDoubleQuote,
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: $`
        class Foo {
          public a = "";
          public "a-b" = "";
        }
      `,
      output: $`
        class Foo {
          public a = '';
          public 'a-b' = '';
        }
      `,
      errors: [
        {
          ...useSingleQuote,
          line: 2,
          column: 14,
        },
        {
          ...useSingleQuote,
          line: 3,
          column: 10,
        },
        {
          ...useSingleQuote,
          line: 3,
          column: 18,
        },
      ],
      options: ['single'],
    },
    {
      code: $`
        class Foo {
          public a = "";
          public "a-b" = "";
        }
      `,
      output: $`
        class Foo {
          public a = \`\`;
          public "a-b" = \`\`;
        }
      `,
      errors: [
        {
          ...useBacktick,
          line: 2,
          column: 14,
        },
        {
          ...useBacktick,
          line: 3,
          column: 18,
        },
      ],
      options: ['backtick'],
    },

    // AccessorProperty
    {
      code: $`
        class Foo {
          accessor a = '';
          accessor 'a-b' = '';
        }
      `,
      output: $`
        class Foo {
          accessor a = "";
          accessor "a-b" = "";
        }
      `,
      errors: [
        {
          ...useDoubleQuote,
          line: 2,
          column: 16,
        },
        {
          ...useDoubleQuote,
          line: 3,
          column: 12,
        },
        {
          ...useDoubleQuote,
          line: 3,
          column: 20,
        },
      ],
    },
    {
      code: $`
        class Foo {
          accessor a = "";
          accessor "a-b" = "";
        }
      `,
      output: $`
        class Foo {
          accessor a = '';
          accessor 'a-b' = '';
        }
      `,
      errors: [
        {
          ...useSingleQuote,
          line: 2,
          column: 16,
        },
        {
          ...useSingleQuote,
          line: 3,
          column: 12,
        },
        {
          ...useSingleQuote,
          line: 3,
          column: 20,
        },
      ],
      options: ['single'],
    },
    {
      code: $`
        class Foo {
          accessor a = "";
          accessor "a-b" = "";
        }
      `,
      output: $`
        class Foo {
          accessor a = \`\`;
          accessor "a-b" = \`\`;
        }
      `,
      errors: [
        {
          ...useBacktick,
          line: 2,
          column: 16,
        },
        {
          ...useBacktick,
          line: 3,
          column: 20,
        },
      ],
      options: ['backtick'],
    },

    // TSAbstractPropertyDefinition
    {
      code: $`
        abstract class Foo {
          public abstract a: '';
          public abstract 'a-b': '';
        }
      `,
      output: $`
        abstract class Foo {
          public abstract a: "";
          public abstract "a-b": "";
        }
      `,
      errors: [
        {
          ...useDoubleQuote,
          line: 2,
          column: 22,
        },
        {
          ...useDoubleQuote,
          line: 3,
          column: 19,
        },
        {
          ...useDoubleQuote,
          line: 3,
          column: 26,
        },
      ],
    },
    {
      code: $`
        abstract class Foo {
          public abstract a: "";
          public abstract "a-b": "";
        }
      `,
      output: $`
        abstract class Foo {
          public abstract a: '';
          public abstract 'a-b': '';
        }
      `,
      errors: [
        {
          ...useSingleQuote,
          line: 2,
          column: 22,
        },
        {
          ...useSingleQuote,
          line: 3,
          column: 19,
        },
        {
          ...useSingleQuote,
          line: 3,
          column: 26,
        },
      ],
      options: ['single'],
    },

    // TSAbstractMethodDefinition
    {
      code: $`
        abstract class Foo {
          public abstract a(): void;
          public abstract 'a-b'(): void;
        }
      `,
      output: $`
        abstract class Foo {
          public abstract a(): void;
          public abstract "a-b"(): void;
        }
      `,
      errors: [
        {
          ...useDoubleQuote,
          line: 3,
          column: 19,
        },
      ],
    },
    {
      code: $`
        abstract class Foo {
          public abstract a(): void;
          public abstract "a-b"(): void;
        }
      `,
      output: $`
        abstract class Foo {
          public abstract a(): void;
          public abstract 'a-b'(): void;
        }
      `,
      errors: [
        {
          ...useSingleQuote,
          line: 3,
          column: 19,
        },
      ],
      options: ['single'],
    },

    // TSLiteralType
    {
      code: $`
        type A = "a" | "b";
      `,
      output: $`
        type A = \`a\` | \`b\`;
      `,
      options: ['backtick'],
      errors: [
        {
          ...useBacktick,
          line: 1,
          column: 10,
        },
        {
          ...useBacktick,
          line: 1,
          column: 16,
        },
      ],
    },
  ],
})
