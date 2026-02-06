import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './jsx-props-style'

run<RuleOptions, MessageIds>({
  name: 'jsx-props-style',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: [
    '<App />',
    '<App foo />',
    '<App foo bar />',
    '<App foo bar baz />',
    '<App {...props} />',
    '<App foo {...props} bar />',
    $`
      <App
        foo
        bar
      />
    `,
    $`
      <App
        foo
        bar
        baz
      />
    `,
    $`
      <App
        foo
        {...props}
        bar
      />
    `,
    {
      code: '<App foo />',
      options: [{ singleLine: { maxItems: 1 } }],
    },
    {
      code: $`
        <App
          foo
          bar
        />
      `,
      options: [{ singleLine: { maxItems: 1 } }],
    },
    {
      code: '<App foo bar />',
      options: [{ multiLine: { minItems: 3 } }],
    },
    {
      code: $`
        <App
          foo
          bar
          baz
        />
      `,
      options: [{ multiLine: { minItems: 3 } }],
    },
    {
      code: '<App foo bar />',
      options: [{ singleLine: { maxItems: 2 } }],
    },
    $`
      <App
        foo={{
          a: 1,
        }}
        bar
      />
    `,
  ],

  invalid: [
    {
      description: 'single line exceeds maxItems',
      code: '<App foo bar />',
      output: '<App\nfoo\nbar />',
      options: [{ singleLine: { maxItems: 1 } }],
      errors: [
        { messageId: 'shouldWrap', data: { prop: 'foo' }, line: 1, column: 6, endLine: 1, endColumn: 9 },
        { messageId: 'shouldWrap', data: { prop: 'bar' }, line: 1, column: 10, endLine: 1, endColumn: 13 },
      ],
    },
    {
      description: 'single line exceeds maxItems with spread',
      code: '<App foo {...props} bar />',
      output: '<App\nfoo\n{...props}\nbar />',
      options: [{ singleLine: { maxItems: 1 } }],
      errors: [
        { messageId: 'shouldWrap', data: { prop: 'foo' }, line: 1, column: 6, endLine: 1, endColumn: 9 },
        { messageId: 'shouldWrap', data: { prop: 'props' }, line: 1, column: 10, endLine: 1, endColumn: 20 },
        { messageId: 'shouldWrap', data: { prop: 'bar' }, line: 1, column: 21, endLine: 1, endColumn: 24 },
      ],
    },
    {
      description: 'multiline should wrap all props',
      code: $`
        <App
          foo bar
          baz
        />
      `,
      output: $`
        <App
          foo
        bar
          baz
        />
      `,
      errors: [
        { messageId: 'shouldWrap', data: { prop: 'bar' }, line: 2, column: 7, endLine: 2, endColumn: 10 },
      ],
    },
    {
      description: 'multiline with minItems not reached should collapse',
      code: $`
        <App
          foo
          bar
        />
      `,
      output: '<App foo bar\n/>',
      options: [{ multiLine: { minItems: 3 } }],
      errors: [
        { messageId: 'shouldNotWrap', data: { prop: 'foo' }, line: 2, column: 3, endLine: 2, endColumn: 6 },
        { messageId: 'shouldNotWrap', data: { prop: 'bar' }, line: 3, column: 3, endLine: 3, endColumn: 6 },
      ],
    },
    {
      description: 'single line with maxItems=0 should wrap all',
      code: '<App foo />',
      output: '<App\nfoo />',
      options: [{ singleLine: { maxItems: 0 } }],
      errors: [
        { messageId: 'shouldWrap', data: { prop: 'foo' }, line: 1, column: 6, endLine: 1, endColumn: 9 },
      ],
    },
    {
      description: 'multiline mixed - first prop on same line means collapse',
      code: $`
        <App foo
          bar
        />
      `,
      output: '<App foo bar\n/>',
      errors: [
        { messageId: 'shouldNotWrap', data: { prop: 'bar' }, line: 2, column: 3, endLine: 2, endColumn: 6 },
      ],
    },
    {
      description: 'multiline mixed - first prop on new line means wrap all',
      code: $`
        <App
          foo bar
        />
      `,
      output: $`
        <App
          foo
        bar
        />
      `,
      errors: [
        { messageId: 'shouldWrap', data: { prop: 'bar' }, line: 2, column: 7, endLine: 2, endColumn: 10 },
      ],
    },
    {
      description: 'should not fix newLine when comments exist between props',
      code: '<App foo /* comment */ bar />',
      output: '<App\nfoo /* comment */ bar />',
      options: [{ singleLine: { maxItems: 1 } }],
      errors: [
        { messageId: 'shouldWrap', data: { prop: 'foo' } },
        { messageId: 'shouldWrap', data: { prop: 'bar' } },
      ],
    },
    {
      description: 'should not fix singleLine when comments exist between props',
      code: $`
        <App
          foo
          /* comment */
          bar
        />
      `,
      output: $`
        <App foo
          /* comment */
          bar
        />
      `,
      options: [{ multiLine: { minItems: 3 } }],
      errors: [
        { messageId: 'shouldNotWrap', data: { prop: 'foo' } },
        { messageId: 'shouldNotWrap', data: { prop: 'bar' } },
      ],
    },
  ],
})
