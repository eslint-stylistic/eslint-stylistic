import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import { invalids, valids } from '#test/parsers-jsx'
import rule from './no-multi-spaces'

run<RuleOptions, MessageIds>({
  name: 'no-multi-spaces',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: valids<RuleOptions>(
    {
      code: `
        <App />
      `,
    },
    {
      code: `
        <App foo />
      `,
    },
    {
      code: `
        <App foo bar />
      `,
    },
    {
      code: `
        <App foo="with  spaces   " bar />
      `,
    },
    {
      code: `
        <App
          foo bar />
      `,
    },
    {
      code: `
        <App
          foo
          bar />
      `,
    },
    {
      code: `
        <App
          foo {...test}
          bar />
      `,
    },
    {
      code: '<App<T> foo bar />',
      features: ['ts', 'no-babel'],
    },
    {
      code: '<Foo.Bar baz="quux" />',
    },
    {
      code: '<Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy="thud" />',
    },
    {
      code: `
        <button
          title="Some button"
          type="button"
        />
      `,
    },
    {
      code: `
        <button
          title="Some button"
          onClick={(value) => {
            console.log(value);
          }}
          type="button"
        />
      `,
    },
    {
      code: `
        <button
          title="Some button"
          // this is a comment
          onClick={(value) => {
            console.log(value);
          }}
          type="button"
        />
      `,
    },
    {
      code: `
        <button
          title="Some button"
          // this is a comment
          // this is a second comment
          onClick={(value) => {
            console.log(value);
          }}
          type="button"
        />
      `,
    },
    {
      code: `
        <App
          foo="Some button" // comment
          // comment
          bar=""
        />
      `,
    },
    {
      code: `
        <button
          title="Some button"
          /* this is a multiline comment
              ...
              ... */
          onClick={(value) => {
            console.log(value);
          }}
          type="button"
        />
      `,
    },
  ),

  invalid: invalids<RuleOptions, MessageIds>(
    {
      code: `
        <App  foo />
      `,
      output: `
        <App foo />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <App foo="with  spaces   "   bar />
      `,
      output: `
        <App foo="with  spaces   " bar />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <App foo  bar />
      `,
      output: `
        <App foo bar />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <App  foo   bar />
      `,
      output: `
        <App foo bar />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <App foo  {...test}  bar />
      `,
      output: `
        <App foo {...test} bar />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: '<Foo.Bar  baz="quux" />',
      output: '<Foo.Bar baz="quux" />',
      errors: [
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh  xyzzy="thud" />
      `,
      output: `
        <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy="thud" />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <button
          title='Some button'

          type="button"
        />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <button
          title="Some button"

          onClick={(value) => {
            console.log(value);
          }}

          type="button"
        />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <button
          title="Some button"
          // this is a comment
          onClick={(value) => {
            console.log(value);
          }}

          type="button"
        />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
        <button
          title="Some button"
          // this is a comment
          // second comment

          onClick={(value) => {
            console.log(value);
          }}

          type="button"
        />
      `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
    {
      code: `
          <button
            title="Some button"
            /*this is a
              multiline
              comment
            */

            onClick={(value) => {
              console.log(value);
            }}

            type="button"
          />
        `,
      errors: [
        {
          messageId: 'multipleSpaces',
        },
        {
          messageId: 'multipleSpaces',
        },
      ],
    },
  ),
})
