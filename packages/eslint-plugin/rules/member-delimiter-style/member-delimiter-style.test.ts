// this rule tests the delimiter, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './member-delimiter-style'

run<RuleOptions, MessageIds>({
  name: 'member-delimiter-style',
  rule,
  valid: [
    `
interface Foo {
    name: string;
    age: number;
}
    `,
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: true },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma' },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: false },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'none', requireLast: true },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'none', requireLast: false },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'comma',
            requireLast: false,
          },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'semi',
                requireLast: true,
              },
            },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'comma',
          },
          overrides: {
            interface: { multiline: { delimiter: 'semi' } },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'semi',
                requireLast: false,
              },
            },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: false,
          },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'comma',
                requireLast: true,
              },
            },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
          },
          overrides: {
            interface: { multiline: { delimiter: 'comma' } },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: false,
          },
          overrides: {
            interface: {
              multiline: { delimiter: 'none', requireLast: true },
            },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
    },
    `
type Foo = {
    name: string;
    age: number;
}
    `,
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: true } }],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi' } }],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: false } }],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: true } }],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma' } }],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: false } }],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: true } }],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'comma',
            requireLast: false,
          },
          overrides: {
            typeLiteral: {
              multiline: { delimiter: 'semi', requireLast: true },
            },
          },
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'comma',
          },
          overrides: {
            typeLiteral: { multiline: { delimiter: 'semi' } },
          },
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'semi',
                requireLast: false,
              },
            },
          },
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: false,
          },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'comma',
                requireLast: true,
              },
            },
          },
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
          },
          overrides: {
            typeLiteral: { multiline: { delimiter: 'comma' } },
          },
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: false,
          },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: false,
          },
          overrides: {
            typeLiteral: {
              multiline: { delimiter: 'none', requireLast: true },
            },
          },
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}

type Bar = {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: {
            delimiter: 'none',
          },
          overrides: {
            interface: { multiline: { delimiter: 'semi' } },
            typeLiteral: { multiline: { delimiter: 'comma' } },
          },
        },
      ],
    },
    'interface Foo { a: any; [key: string]: any }',
    {
      code: 'interface Foo { a: any; [key: string]: any }',
      options: [
        {
          singleline: { requireLast: false },
        },
      ],
    },
    {
      code: 'interface Foo { a: any; [key: string]: any; }',
      options: [
        {
          singleline: { requireLast: true },
        },
      ],
    },
    {
      code: 'interface Foo { a: any, [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'comma' },
        },
      ],
    },
    {
      code: 'interface Foo { a: any, [key: string]: any, }',
      options: [
        {
          singleline: { delimiter: 'comma', requireLast: true },
        },
      ],
    },
    {
      code: 'interface Foo { a: any, [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'comma', requireLast: false },
        },
      ],
    },
    {
      code: 'interface Foo { a: any; [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'semi' },
        },
      ],
    },
    {
      code: 'interface Foo { a: any; [key: string]: any; }',
      options: [
        {
          singleline: { delimiter: 'semi', requireLast: true },
        },
      ],
    },
    {
      code: 'interface Foo { a: any; [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],
    },
    'type Foo = { a: any; [key: string]: any }',
    {
      code: 'type Foo = { a: any; [key: string]: any }',
      options: [
        {
          singleline: { requireLast: false },
        },
      ],
    },
    {
      code: 'type Foo = { a: any; [key: string]: any; }',
      options: [
        {
          singleline: { requireLast: true },
        },
      ],
    },
    {
      code: 'type Foo = { a: any, [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'comma' },
        },
      ],
    },
    {
      code: 'type Foo = { a: any, [key: string]: any, }',
      options: [
        {
          singleline: { delimiter: 'comma', requireLast: true },
        },
      ],
    },
    {
      code: 'type Foo = { a: any, [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'comma', requireLast: false },
        },
      ],
    },
    {
      code: 'type Foo = { a: any; [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'semi' },
        },
      ],
    },
    {
      code: 'type Foo = { a: any; [key: string]: any; }',
      options: [
        {
          singleline: { delimiter: 'semi', requireLast: true },
        },
      ],
    },
    {
      code: 'type Foo = { a: any; [key: string]: any }',
      options: [
        {
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],
    },
    {
      code: `
type Foo = {a: {
  b: true;
}};
      `,
      options: [
        {
          multilineDetection: 'last-member',
        },
      ],
    },
    `
type Foo = {a: {
  b: true;
};};
    `,
    {
      code: `
type Foo = {a: {
  b: true;
};};
      `,
      options: [
        {
          multilineDetection: 'brackets',
        },
      ],
    },
    {
      code: `
type Foo = {
  a: {
    b: true;
  };
};
      `,
      options: [
        {
          multilineDetection: 'last-member',
        },
      ],
    },
    {
      code: `
type Foo = {a: {
  b: true;
};};
      `,
      options: [
        {
          singleline: { delimiter: 'semi', requireLast: true },
          multilineDetection: 'last-member',
        },
      ],
    },
    {
      code: `
type Foo = {

};
      `,
      options: [
        {
          singleline: { delimiter: 'semi', requireLast: true },
          multilineDetection: 'last-member',
        },
      ],
    },

    {
      code: `
interface Foo {
    name: string;
    age: number;
}

interface Bar { name: string, age: number }
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: { delimiter: 'comma', requireLast: false },
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}

type Bar = { name: string, age: number }
      `,
      options: [
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: { delimiter: 'semi', requireLast: true },
          overrides: {
            typeLiteral: {
              singleline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number;
}
      `,
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Test = {
  a: {
      one: 1
  }; b: 2
};
      `,
      output: null,
      options: [{ multiline: { delimiter: 'none' } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 5,
          column: 5,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi' } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: false } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma' } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: false } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma' } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: false } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number;
}
      `,
      output: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: false } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none' } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: true } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number;
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none' } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: true } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number,
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma' },
          overrides: {
            interface: { multiline: { delimiter: 'semi' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: false },
          overrides: {
            interface: {
              multiline: { delimiter: 'semi', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      output: `
interface Foo {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: false },
          overrides: {
            interface: {
              multiline: { delimiter: 'semi', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
          overrides: {
            interface: { multiline: { delimiter: 'comma' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'comma',
                requireLast: true,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
          overrides: {
            interface: { multiline: { delimiter: 'comma' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'comma',
                requireLast: true,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      output: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number;
}
      `,
      output: `
interface Foo {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
          overrides: {
            interface: { multiline: { delimiter: 'none' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
          overrides: {
            interface: {
              multiline: { delimiter: 'none', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number;
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
          overrides: {
            interface: { multiline: { delimiter: 'none' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number,
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
          overrides: {
            interface: {
              multiline: { delimiter: 'none', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string,
    age: number
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string
    age: number,
}
      `,
      output: `
interface Foo {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string;
    age: number;
}
      `,
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi' } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      output: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma' } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: false } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma' } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: false } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number;
}
      `,
      output: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'comma', requireLast: false } }],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none' } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: true } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number;
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none' } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: true } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number,
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'none', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma' },
          overrides: {
            typeLiteral: { multiline: { delimiter: 'semi' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: false },
          overrides: {
            typeLiteral: {
              multiline: { delimiter: 'semi', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      output: `
type Foo = {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: false },
          overrides: {
            typeLiteral: {
              multiline: { delimiter: 'semi', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
          overrides: {
            typeLiteral: { multiline: { delimiter: 'comma' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'comma',
                requireLast: true,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 16,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
          overrides: {
            typeLiteral: { multiline: { delimiter: 'comma' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string,
    age: number,
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'comma',
                requireLast: true,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      output: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number;
}
      `,
      output: `
type Foo = {
    name: string,
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'comma',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 17,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi' },
          overrides: {
            typeLiteral: { multiline: { delimiter: 'none' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: false },
          overrides: {
            typeLiteral: {
              multiline: { delimiter: 'none', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number;
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'semi', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma' },
          overrides: {
            typeLiteral: { multiline: { delimiter: 'none' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number,
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: false },
          overrides: {
            typeLiteral: {
              multiline: { delimiter: 'none', requireLast: true },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string,
    age: number
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 3,
          column: 18,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string
    age: number,
}
      `,
      output: `
type Foo = {
    name: string
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'none',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedComma',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}

type Bar = {
    name: string,
    age: number,
}
      `,
      output: `
interface Foo {
    name: string,
    age: number,
}

type Bar = {
    name: string;
    age: number;
}
      `,
      options: [
        {
          multiline: { delimiter: 'none', requireLast: true },
          overrides: {
            interface: { multiline: { delimiter: 'comma' } },
            typeLiteral: { multiline: { delimiter: 'semi' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedComma',
          line: 3,
          column: 18,
        },
        {
          messageId: 'expectedComma',
          line: 4,
          column: 17,
        },
        {
          messageId: 'expectedSemi',
          line: 8,
          column: 18,
        },
        {
          messageId: 'expectedSemi',
          line: 9,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    [key: string]: any
}
      `,
      output: `
interface Foo {
    [key: string]: any;
}
      `,
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 23,
        },
      ],
    },
    {
      code: `
interface Foo {
    [key: string]: any
}
      `,
      output: `
interface Foo {
    [key: string]: any;
}
      `,
      options: [{ singleline: { delimiter: 'comma' } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 23,
        },
      ],
    },
    {
      code: 'interface Foo { a: any, [key: string]: any }',
      output: 'interface Foo { a: any; [key: string]: any }',
      options: [{ singleline: { delimiter: 'semi' } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 24,
        },
      ],
    },
    {
      code: 'interface Foo { a: any, [key: string]: any, }',
      output: 'interface Foo { a: any; [key: string]: any }',
      options: [
        {
          multiline: { requireLast: true },
          singleline: { delimiter: 'semi' },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 24,
        },
        {
          messageId: 'unexpectedComma',
          line: 1,
          column: 44,
        },
      ],
    },
    {
      code: 'interface Foo { [key: string]: any }',
      output: 'interface Foo { [key: string]: any; }',
      options: [
        {
          multiline: { requireLast: true },
          singleline: { delimiter: 'comma', requireLast: false },
          overrides: {
            interface: {
              singleline: {
                delimiter: 'semi',
                requireLast: true,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 35,
        },
      ],
    },
    {
      code: `
type Foo = {
    [key: string]: any
}
      `,
      output: `
type Foo = {
    [key: string]: any;
}
      `,
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 23,
        },
      ],
    },
    {
      code: `
type Foo = {
    [key: string]: any
}
      `,
      output: `
type Foo = {
    [key: string]: any;
}
      `,
      options: [{ singleline: { delimiter: 'semi' } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 3,
          column: 23,
        },
      ],
    },
    {
      code: 'type Foo = { [key: string]: any }',
      output: 'type Foo = { [key: string]: any; }',
      options: [{ singleline: { delimiter: 'semi', requireLast: true } }],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 32,
        },
      ],
    },
    {
      code: 'type Foo = { [key: string]: any }',
      output: 'type Foo = { [key: string]: any; }',
      options: [
        {
          multiline: { requireLast: false },
          singleline: { delimiter: 'semi', requireLast: true },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 32,
        },
      ],
    },
    {
      code: 'type Foo = { a: any, [key: string]: any }',
      output: 'type Foo = { a: any; [key: string]: any }',
      options: [
        {
          multiline: { requireLast: true },
          singleline: { delimiter: 'comma' },
          overrides: {
            typeLiteral: { singleline: { delimiter: 'semi' } },
          },
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 21,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string;
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
interface Foo {
    name: string;
    age: number;
}
      `,
      output: `
interface Foo {
    name: string;
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: true },
          overrides: {
            interface: {
              multiline: {
                delimiter: 'semi',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: 'interface Foo { a: any, [key: string]: any }',
      output: 'interface Foo { a: any; [key: string]: any }',
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 24,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string;
    age: number
}
      `,
      options: [{ multiline: { delimiter: 'semi', requireLast: false } }],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: `
type Foo = {
    name: string;
    age: number;
}
      `,
      output: `
type Foo = {
    name: string;
    age: number
}
      `,
      options: [
        {
          multiline: { delimiter: 'comma', requireLast: true },
          overrides: {
            typeLiteral: {
              multiline: {
                delimiter: 'semi',
                requireLast: false,
              },
            },
          },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 17,
        },
      ],
    },
    {
      code: 'type Foo = { a: any, [key: string]: any }',
      output: 'type Foo = { a: any; [key: string]: any }',
      errors: [
        {
          messageId: 'expectedSemi',
          line: 1,
          column: 21,
        },
      ],
    },
    {
      code: `
type Foo = {a: {
  b: true;
};};
      `,
      output: `
type Foo = {a: {
  b: true;
}};
      `,
      options: [
        {
          multilineDetection: 'last-member',
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 3,
        },
      ],
    },
    {
      code: `
type Foo = {a: {
  b: true;
}};
      `,
      output: `
type Foo = {a: {
  b: true;
};};
      `,
      errors: [
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 2,
        },
      ],
    },
    {
      code: `
type Foo = {
  a: {
    b: true;
  }
};
      `,
      output: `
type Foo = {
  a: {
    b: true;
  };
};
      `,
      options: [
        {
          multilineDetection: 'last-member',
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 5,
          column: 4,
        },
      ],
    },
    {
      code: `
type Foo = {a: {
  b: true;
}};
      `,
      output: `
type Foo = {a: {
  b: true;
};};
      `,
      options: [
        {
          singleline: { delimiter: 'semi', requireLast: true },
          multilineDetection: 'last-member',
        },
      ],
      errors: [
        {
          messageId: 'expectedSemi',
          line: 4,
          column: 2,
        },
      ],
    },
    {
      code: `
type Foo = {
  a: {
    b: true;
  }; c: false;
}
      `,
      output: `
type Foo = {
  a: {
    b: true
  }; c: false
}
      `,
      options: [
        {
          multiline: { delimiter: 'none' },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 13,
        },
        {
          messageId: 'unexpectedSemi',
          line: 5,
          column: 5,
        },
        {
          messageId: 'unexpectedSemi',
          line: 5,
          column: 15,
        },
      ],
    },
    {
      code: `
type Foo = {
  a: true; /** something */ /** some
  thing */ b: true; /** something */ c: false; // something
}
      `,
      output: `
type Foo = {
  a: true /** something */ /** some
  thing */ b: true; /** something */ c: false // something
}
      `,
      options: [
        {
          multiline: { delimiter: 'none' },
        },
      ],
      errors: [
        {
          messageId: 'unexpectedSemi',
          line: 3,
          column: 11,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 20,
        },
        {
          messageId: 'unexpectedSemi',
          line: 4,
          column: 47,
        },
      ],
    },
  ],
})
