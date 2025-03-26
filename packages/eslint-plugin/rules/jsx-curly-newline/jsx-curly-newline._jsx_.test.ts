/**
 * @fileoverview enforce consistent line breaks inside jsx curly
 */

import type { RuleOptions } from './types'
import { run } from '#test'
import { invalids, valids } from '#test/parsers-jsx'
import rule from './jsx-curly-newline._jsx_'

const LEFT_MISSING_ERROR = { messageId: 'expectedAfter', type: 'Punctuator' }
const LEFT_UNEXPECTED_ERROR = { messageId: 'unexpectedAfter', type: 'Punctuator' }
const RIGHT_MISSING_ERROR = { messageId: 'expectedBefore', type: 'Punctuator' }
const RIGHT_UNEXPECTED_ERROR = { messageId: 'unexpectedBefore', type: 'Punctuator' }
// const EXPECTED_BETWEEN = {messageId: 'expectedBetween', type: 'Identifier'};

const CONSISTENT: RuleOptions = ['consistent']
const NEVER: RuleOptions = ['never']
const MULTILINE_REQUIRE: RuleOptions = [{ singleline: 'consistent', multiline: 'require' }]

run<RuleOptions>({
  name: 'jsx-curly-newline',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: valids<RuleOptions>(
    // consistent option (default)
    {
      code: '<div>{foo}</div>',
      options: ['consistent'],
    },

    {
      code: `
        <div>
          {
            foo
          }
        </div>
      `,
      options: CONSISTENT,
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar }
        </div>
      `,
      options: CONSISTENT,
    },

    {
      code: `
        <div>
          {
            foo &&
            foo.bar
          }
        </div>
      `,
      options: CONSISTENT,
    },

    {
      code: `
        <div foo={
          bar
        } />
      `,
      options: CONSISTENT,
    },

    // {singleline: 'consistent', multiline: 'require'} option
    {
      code: '<div>{foo}</div>',
      options: MULTILINE_REQUIRE,
    },
    {
      code: '<div foo={bar} />',
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div>
          {
            foo &&
            foo.bar
          }
        </div>
      `,
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div>
          {
            foo
          }
        </div>
      `,
      options: MULTILINE_REQUIRE,
    },

    // never option

    {
      code: '<div>{foo}</div>',
      options: NEVER,
    },

    {
      code: '<div foo={bar} />',
      options: NEVER,
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar }
        </div>
      `,
      options: NEVER,
    },
  ),

  invalid: invalids<RuleOptions>(
    // consistent option (default)
    {
      code: `
        <div>
          { foo \n}
        </div>
      `,
      output: `
        <div>
          { foo}
        </div>
      `,
      options: CONSISTENT,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar \n}
        </div>
      `,
      output: `
        <div>
          { foo &&
            foo.bar}
        </div>
      `,
      options: CONSISTENT,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: `
        <div>
          { foo &&
            bar
          }
        </div>
      `,
      output: `
        <div>
          { foo &&
            bar}
        </div>
      `,
      options: CONSISTENT,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },

    // {singleline: 'consistent', multiline: 'require'} option
    {
      code: '<div>{foo\n}</div>',
      output: '<div>{foo}</div>',
      errors: [RIGHT_UNEXPECTED_ERROR],
      options: MULTILINE_REQUIRE,
    },
    {
      code: '<div>{\nfoo}</div>',
      output: '<div>{\nfoo\n}</div>',
      errors: [RIGHT_MISSING_ERROR],
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div>
          { foo &&
            bar }
        </div>
      `,
      output: `
        <div>
          {\n foo &&
            bar \n}
        </div>
      `,
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div style={foo &&
          foo.bar
        } />
      `,
      output: `
        <div style={\nfoo &&
          foo.bar
        } />
      `,
      errors: [LEFT_MISSING_ERROR],
      options: MULTILINE_REQUIRE,
    },

    // never options
    {
      code: `
        <div>
          {\nfoo\n}
        </div>
      `,
      output: `
        <div>
          {foo}
        </div>
      `,
      options: NEVER,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          {
            foo &&
            foo.bar
          }
        </div>
      `,
      output: `
        <div>
          {foo &&
            foo.bar}
        </div>
      `,
      options: NEVER,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar
          }
        </div>
      `,
      output: `
        <div>
          { foo &&
            foo.bar}
        </div>
      `,
      options: NEVER,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { /* not fixed due to comment */
            foo }
        </div>
      `,
      output: null,
      options: NEVER,
      errors: [LEFT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { foo
            /* not fixed due to comment */}
        </div>
      `,
      output: null,
      options: NEVER,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
  ),
})
