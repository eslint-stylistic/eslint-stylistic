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
        { messageId: 'newLine', data: { prop: 'foo' } },
        { messageId: 'newLine', data: { prop: 'bar' } },
      ],
    },
    {
      description: 'single line exceeds maxItems with spread',
      code: '<App foo {...props} bar />',
      output: '<App\nfoo\n{...props}\nbar />',
      options: [{ singleLine: { maxItems: 1 } }],
      errors: [
        { messageId: 'newLine', data: { prop: 'foo' } },
        { messageId: 'newLine', data: { prop: 'props' } },
        { messageId: 'newLine', data: { prop: 'bar' } },
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
        { messageId: 'newLine', data: { prop: 'bar' } },
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
        { messageId: 'singleLine', data: { prop: 'foo' } },
        { messageId: 'singleLine', data: { prop: 'bar' } },
      ],
    },
    {
      description: 'single line with maxItems=0 should wrap all',
      code: '<App foo />',
      output: '<App\nfoo />',
      options: [{ singleLine: { maxItems: 0 } }],
      errors: [
        { messageId: 'newLine', data: { prop: 'foo' } },
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
        { messageId: 'singleLine', data: { prop: 'bar' } },
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
        { messageId: 'newLine', data: { prop: 'bar' } },
      ],
    },
  ],
})
