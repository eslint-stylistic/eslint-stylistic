import { AST_TOKEN_TYPES } from '@typescript-eslint/utils'

import rule from './lines-around-comment'
import { unindent as $, run } from '#test'

run({
  name: 'lines-around-comment',
  rule,
  valid: [
    // Interface
    {
      code: $`
        interface A {
          // line
          a: string;
        }
      `,
      options: [
        {
          beforeLineComment: true,
          allowInterfaceStart: true,
        },
      ],
    },
    {
      code: $`
        interface A {
          /* block
            comment */
          a: string;
        }
      `,
      options: [
        {
          beforeBlockComment: true,
          allowInterfaceStart: true,
        },
      ],
    },
    {
      code: $`
        interface A {
          a: string;
          // line
        }
      `,
      options: [
        {
          afterLineComment: true,
          allowInterfaceEnd: true,
        },
      ],
    },
    {
      code: $`
        interface A {
          a: string;
          /* block
            comment */
        }
      `,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowInterfaceEnd: true,
        },
      ],
    },
    // Type
    {
      code: $`
        type A = {
          // line
          a: string;
        }
      `,
      options: [
        {
          beforeLineComment: true,
          allowTypeStart: true,
        },
      ],
    },
    {
      code: $`
        type A = {
          /* block
            comment */
          a: string;
        }
      `,
      options: [
        {
          beforeBlockComment: true,
          allowTypeStart: true,
        },
      ],
    },
    {
      code: $`
        type A = {
          a: string;
          // line
        }
      `,
      options: [
        {
          afterLineComment: true,
          allowTypeEnd: true,
        },
      ],
    },
    {
      code: $`
type A = {
  a: string;
  /* block
     comment */
}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowTypeEnd: true,
        },
      ],
    },

    // Enum
    {
      code: $`
enum A {
  // line
  a,
}
`,
      options: [
        {
          beforeLineComment: true,
          allowEnumStart: true,
        },
      ],
    },
    {
      code: $`
enum A {
  /* block
     comment */
  a,
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowEnumStart: true,
        },
      ],
    },
    {
      code: $`
enum A {
  a,
  // line
}
`,
      options: [
        {
          afterLineComment: true,
          allowEnumEnd: true,
        },
      ],
    },
    {
      code: $`
enum A {
  a,
  /* block
     comment */
}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowEnumEnd: true,
        },
      ],
    },

    // TS module
    {
      code: $`
declare module A {
  // line
  const a: string;
}
`,
      options: [
        {
          beforeLineComment: true,
          allowModuleStart: true,
        },
      ],
    },
    {
      code: $`
declare module A {
  /* block
     comment */
  const a: string;
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowModuleStart: true,
        },
      ],
    },
    {
      code: $`
declare module A {
  const a: string;
  // line
}
`,
      options: [
        {
          afterLineComment: true,
          allowModuleEnd: true,
        },
      ],
    },
    {
      code: $`
declare module A {
  const a: string;
  /* block
     comment */
}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowModuleEnd: true,
        },
      ],
    },
    // ignorePattern
    {
      code:
        'interface A {'
        + 'foo: string;\n\n'
        + '/* eslint-disable no-underscore-dangle */\n\n'
        + '_values: 2;\n'
        + '_values2: true;\n'
        + '/* eslint-enable no-underscore-dangle */\n'
        + 'bar: boolean'
        + '}',
      options: [
        {
          beforeBlockComment: true,
          afterBlockComment: true,
        },
      ],
      linterOptions: {
        reportUnusedDisableDirectives: false,
      },
    },
    `
interface A {
  foo;
  /* eslint */
}
    `,
    `
interface A {
  foo;
  /* jshint */
}
    `,
    `
interface A {
  foo;
  /* jslint */
}
    `,
    `
interface A {
  foo;
  /* istanbul */
}
    `,
    `
interface A {
  foo;
  /* global */
}
    `,
    `
interface A {
  foo;
  /* globals */
}
    `,
    `
interface A {
  foo;
  /* exported */
}
    `,
    `
interface A {
  foo;
  /* jscs */
}
    `,
    {
      code: `
interface A {
  foo: boolean;
  /* this is pragmatic */
}
      `,
      options: [{ ignorePattern: 'pragma' }],
    },
    {
      code: `
interface A {
  foo;
  /* this is pragmatic */
}
      `,
      options: [{ applyDefaultIgnorePatterns: false, ignorePattern: 'pragma' }],
    },
    {
      code: `
interface A {
  foo: string; // this is inline line comment
}
      `,
      options: [{ beforeLineComment: true }],
    },
    {
      code: `
interface A {
  foo: string /* this is inline block comment */;
}
      `,
    },
    {
      code: `
interface A {
  /* this is inline block comment */ foo: string;
}
      `,
    },
    {
      code: `
interface A {
  /* this is inline block comment */ foo: string /* this is inline block comment */;
}
      `,
    },
    {
      code: `
interface A {
  /* this is inline block comment */ foo: string; // this is inline line comment ;
}
      `,
    },
  ],
  invalid: [
    // ESLint base rule test to cover the usage of the original reporter
    {
      code: `
bar();
/** block block block
 * block
 */
var a = 1;
      `,
      output: `
bar();

/** block block block
 * block
 */
var a = 1;
      `,
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block }],
    },

    // interface
    {
      code: $`
interface A {
  a: string;
  // line
}
`,
      output: $`
interface A {
  a: string;

  // line
}
`,
      options: [
        {
          beforeLineComment: true,
          allowInterfaceStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
interface A {
  a: string;
  /* block
     comment */
}
`,
      output: $`
interface A {
  a: string;

  /* block
     comment */
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowInterfaceStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },
    {
      code: $`
interface A {
  // line
  a: string;
}
`,
      output: $`
interface A {

  // line
  a: string;
}
`,
      options: [
        {
          beforeLineComment: true,
          allowInterfaceStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 2 }],
    },
    {
      code: $`
interface A {
  /* block
     comment */
  a: string;
}
`,
      output: $`
interface A {

  /* block
     comment */
  a: string;
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowInterfaceStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 2 }],
    },
    {
      code: $`
interface A {
  a: string;
  // line
}
`,
      output: $`
interface A {
  a: string;
  // line

}
`,
      options: [
        {
          afterLineComment: true,
          allowInterfaceEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
interface A {
  a: string;
  /* block
     comment */
}
`,
      output: $`
interface A {
  a: string;
  /* block
     comment */

}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowInterfaceEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },

    // type
    {
      code: $`
type A = {
  a: string;
  // line
}
`,
      output: $`
type A = {
  a: string;

  // line
}
`,
      options: [
        {
          beforeLineComment: true,
          allowInterfaceStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
type A = {
  a: string;
  /* block
     comment */
}
`,
      output: $`
type A = {
  a: string;

  /* block
     comment */
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowInterfaceStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },
    {
      code: $`
type A = {
  // line
  a: string;
}
`,
      output: $`
type A = {

  // line
  a: string;
}
`,
      options: [
        {
          beforeLineComment: true,
          allowInterfaceStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 2 }],
    },
    {
      code: $`
type A = {
  /* block
     comment */
  a: string;
}
`,
      output: $`
type A = {

  /* block
     comment */
  a: string;
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowInterfaceStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 2 }],
    },
    {
      code: $`
type A = {
  a: string;
  // line
}
`,
      output: $`
type A = {
  a: string;
  // line

}
`,
      options: [
        {
          afterLineComment: true,
          allowInterfaceEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
type A = {
  a: string;
  /* block
     comment */
}
`,
      output: $`
type A = {
  a: string;
  /* block
     comment */

}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowInterfaceEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },

    // Enum
    {
      code: $`
enum A {
  a,
  // line
}
`,
      output: $`
enum A {
  a,

  // line
}
`,
      options: [
        {
          beforeLineComment: true,
          allowEnumStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
enum A {
  a,
  /* block
     comment */
}
`,
      output: $`
enum A {
  a,

  /* block
     comment */
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowEnumStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },
    {
      code: $`
enum A {
  // line
  a,
}
`,
      output: $`
enum A {

  // line
  a,
}
`,
      options: [
        {
          beforeLineComment: true,
          allowEnumStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 2 }],
    },
    {
      code: $`
enum A {
  /* block
     comment */
  a,
}
`,
      output: $`
enum A {

  /* block
     comment */
  a,
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowEnumStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 2 }],
    },
    {
      code: $`
enum A {
  a,
  // line
}
`,
      output: $`
enum A {
  a,
  // line

}
`,
      options: [
        {
          afterLineComment: true,
          allowEnumEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
enum A {
  a,
  /* block
     comment */
}
`,
      output: $`
enum A {
  a,
  /* block
     comment */

}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowEnumEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },

    // TS module
    {
      code: $`
module A {
  const a: string;
  // line
}
`,
      output: $`
module A {
  const a: string;

  // line
}
`,
      options: [
        {
          beforeLineComment: true,
          allowModuleStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
module A {
  const a: string;
  /* block
     comment */
}
`,
      output: $`
module A {
  const a: string;

  /* block
     comment */
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowModuleStart: true,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },
    {
      code: $`
module A {
  // line
  const a: string;
}
`,
      output: $`
module A {

  // line
  const a: string;
}
`,
      options: [
        {
          beforeLineComment: true,
          allowModuleStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Line, line: 2 }],
    },
    {
      code: $`
module A {
  /* block
     comment */
  const a: string;
}
`,
      output: $`
module A {

  /* block
     comment */
  const a: string;
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowModuleStart: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 2 }],
    },
    {
      code: $`
module A {
  const a: string;
  // line
}
`,
      output: $`
module A {
  const a: string;
  // line

}
`,
      options: [
        {
          afterLineComment: true,
          allowModuleEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Line, line: 3 }],
    },
    {
      code: $`
module A {
  const a: string;
  /* block
     comment */
}
`,
      output: $`
module A {
  const a: string;
  /* block
     comment */

}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowModuleEnd: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },

    // multiple comments in one line
    {
      code: $`
interface A {
  a: string;
  /* block */ /* block */
}
`,
      output: $`
interface A {
  a: string;

  /* block */ /* block */
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowInterfaceEnd: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },
    {
      code: $`
interface A {
  a: string;
  /* block */ // line
}
`,
      output: $`
interface A {
  a: string;

  /* block */ // line
}
`,
      options: [
        {
          beforeBlockComment: true,
          allowInterfaceEnd: false,
        },
      ],
      errors: [{ messageId: 'before', type: AST_TOKEN_TYPES.Block, line: 3 }],
    },
    {
      code: $`
interface A {
  /* block */ /* block */
  a: string;
}
`,
      output: $`
interface A {
  /* block */ /* block */

  a: string;
}
`,
      options: [
        {
          beforeBlockComment: false,
          afterBlockComment: true,
          allowInterfaceStart: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Block, line: 2 }],
    },
    {
      code: $`
interface A {
  /* block */ // line
  a: string;
}
`,
      output: $`
interface A {
  /* block */ // line

  a: string;
}
`,
      options: [
        {
          beforeBlockComment: false,
          afterLineComment: true,
          allowInterfaceStart: false,
        },
      ],
      errors: [{ messageId: 'after', type: AST_TOKEN_TYPES.Line, line: 2 }],
    },

    // Hashbang comment
    {
      code: '#!foo\nvar a = 1;',
      output: '#!foo\n\nvar a = 1;',
      options: [{ afterHashbangComment: true }],
      errors: [{ messageId: 'after', type: 'Shebang' }],
    },
  ],
})
