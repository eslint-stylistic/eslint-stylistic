/**
 * @fileoverview Ensure proper position of the first property in JSX
 * @author Joachim Seminck
 */

import rule from './jsx-first-prop-new-line._jsx_'
import { invalids, valids } from '#test/parsers-jsx'
import { run } from '#test'

run({
  name: 'jsx-first-prop-new-line',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: valids(
    {
      code: '<Foo />',
      options: ['never'],
    },
    {
      code: '<Foo prop="bar" />',
      options: ['never'],
    },
    {
      code: '<Foo {...this.props} />',
      options: ['never'],
    },
    {
      code: '<Foo a a a />',
      options: ['never'],
    },
    {
      code: `
        <Foo a
          b
        />
      `,
      options: ['never'],
    },
    {
      code: '<Foo />',
      options: ['multiline'],
    },
    {
      code: '<Foo prop="one" />',
      options: ['multiline'],
    },
    {
      code: '<Foo {...this.props} />',
      options: ['multiline'],
    },
    {
      code: '<Foo a a a />',
      options: ['multiline'],
    },
    {
      code: `
        <Foo
          propOne="one"
          propTwo="two"
        />
      `,
      options: ['multiline'],
    },
    {
      code: `
        <Foo
          {...this.props}
          propTwo="two"
        />
      `,
      options: ['multiline'],
    },
    {
      code: `
        <Foo bar />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: `
        <Foo bar baz />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: `
        <Foo prop={{
        }} />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: `
        <Foo
          foo={{
          }}
          bar
        />
      `,
      options: ['multiline-multiprop'],
    },
    {
      code: '<Foo />',
      options: ['always'],
    },
    {
      code: `
        <Foo
          propOne="one"
          propTwo="two"
        />
      `,
      options: ['always'],
    },
    {
      code: `
        <Foo
          {...this.props}
          propTwo="two"
        />
      `,
      options: ['always'],
    },
    {
      code: `
        <Foo />
      `,
      options: ['multiprop'],
    },
    {
      code: `
        <Foo bar />
      `,
      options: ['multiprop'],
    },
    {
      code: `
        <Foo {...this.props} />
      `,
      options: ['multiprop'],
    },
  ),

  invalid: invalids(
    {
      code: `
        <Foo propOne="one" propTwo="two" />
      `,
      output: `
        <Foo
propOne="one" propTwo="two" />
      `,
      options: ['always'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
        <Foo propOne="one"
          propTwo="two"
        />
      `,
      output: `
        <Foo
propOne="one"
          propTwo="two"
        />
      `,
      options: ['always'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
        <Foo
          propOne="one"
          propTwo="two"
        />
      `,
      output: `
        <Foo propOne="one"
          propTwo="two"
        />
      `,
      options: ['never'],
      errors: [{ messageId: 'propOnSameLine' }],
    },
    {
      code: `
        <Foo prop={{
        }} />
      `,
      output: `
        <Foo
prop={{
        }} />
      `,
      options: ['multiline'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
        <Foo bar={{
        }} baz />
      `,
      output: `
        <Foo
bar={{
        }} baz />
      `,
      options: ['multiline-multiprop'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
      <Foo propOne="one" propTwo="two" />
      `,
      output: `
      <Foo
propOne="one" propTwo="two" />
      `,
      options: ['multiprop'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
    {
      code: `
      <Foo
bar />
      `,
      output: `
      <Foo bar />
      `,
      options: ['multiprop'],
      errors: [{ messageId: 'propOnSameLine' }],
    },
    {
      code: `
      <Foo
{...this.props} />
      `,
      output: `
      <Foo {...this.props} />
      `,
      options: ['multiprop'],
      errors: [{ messageId: 'propOnSameLine' }],
    },
    {
      code: `
        <DataTable<Items> fullscreen keyField="id" items={items}
          activeSortableColumn={sorting}
          onSortClick={handleSortedClick}
          rowActions={[
          ]}
        />
      `,
      features: ['ts', 'no-babel-old'],
      output: `
        <DataTable<Items>
fullscreen keyField="id" items={items}
          activeSortableColumn={sorting}
          onSortClick={handleSortedClick}
          rowActions={[
          ]}
        />
      `,
      options: ['multiline'],
      errors: [{ messageId: 'propOnNewLine' }],
    },
  ),
})
