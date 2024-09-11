import { run } from '#test'
import { invalids, valids } from '#test/parsers-jsx'
import rule from './jsx-child-element-spacing._jsx_'

run({
  name: 'jsx-child-element-spacing',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: valids(
    {
      code: `
        <App>
          foo
        </App>
      `,
    },
    {
      code: `
        <>
          foo
        </>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <App>
          <a>bar</a>
        </App>
      `,
    },
    {
      code: `
        <App>
          <a>
            <b>nested</b>
          </a>
        </App>
      `,
    },
    {
      code: `
        <App>
          foo
          bar
        </App>
      `,
    },
    {
      code: `
        <App>
          foo<a>bar</a>baz
        </App>
      `,
    },
    {
      code: `
        <App>
          foo
          {' '}
          <a>bar</a>
          {' '}
          baz
        </App>
      `,
    },
    {
      code: `
        <App>
          foo
          {' '}<a>bar</a>{' '}
          baz
        </App>
      `,
    },
    {
      code: `
        <App>
          foo{' '}
          <a>bar</a>
          {' '}baz
        </App>
      `,
    },
    {
      code: `
        <App>
          foo{/*
          */}<a>bar</a>{/*
          */}baz
        </App>
      `,
    },
    {
      code: `
        <App>
          Please take a look at <a href="https://js.org">this link</a>.
        </App>
      `,
    },
    {
      code: `
        <App>
          Please take a look at
          {' '}
          <a href="https://js.org">this link</a>.
        </App>
      `,
    },
    {
      code: `
        <App>
          <p>A</p>
          <p>B</p>
        </App>
      `,
    },
    {
      code: `
        <App>
          <p>A</p><p>B</p>
        </App>
      `,
    },
    {
      code: `
        <App>
          <a>foo</a>
          <a>bar</a>
        </App>
      `,
    },
    {
      code: `
        <App>
          <a>
            <b>nested1</b>
            <b>nested2</b>
          </a>
        </App>
      `,
    },
    {
      code: `
        <App>
          A
          B
        </App>
      `,
    },
    {
      code: `
        <App>
          A
          <br/>
          B
        </App>
      `,
    },
    {
      code: `
        <App>
          A<br/>
          B
        </App>
      `,
    },
    {
      code: `
        <App>
          A<br/>B
        </App>
      `,
    },
    {
      code: `
        <App>A<br/>B</App>
      `,
    },
  ),

  invalid: invalids(
    {
      code: `
        <App>
          foo
          <a>bar</a>
        </App>
      `,
      errors: [
        {
          messageId: 'spacingBeforeNext',
          data: { element: 'a' },
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        <>
          foo
          <a>bar</a>
        </>
      `,
      features: ['fragment'],
      errors: [
        {
          messageId: 'spacingBeforeNext',
          data: { element: 'a' },
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        <App>
          <a>bar</a>
          baz
        </App>
      `,
      errors: [
        {
          messageId: 'spacingAfterPrev',
          data: { element: 'a' },
          line: 3,
          column: 21,
        },
      ],
    },
    {
      code: `
        <App>
          {' '}<a>bar</a>
          baz
        </App>
      `,
      errors: [
        {
          messageId: 'spacingAfterPrev',
          data: { element: 'a' },
          line: 3,
          column: 26,
        },
      ],
    },
    {
      code: `
        <App>
          Please take a look at
          <a href="https://js.org">this link</a>.
        </App>
      `,
      errors: [
        {
          messageId: 'spacingBeforeNext',
          data: { element: 'a' },
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        <App>
          Some <code>loops</code> and some
          <code>if</code> statements.
        </App>
      `,
      errors: [
        {
          messageId: 'spacingBeforeNext',
          data: { element: 'code' },
          line: 4,
          column: 11,
        },
      ],
    },
    {
      code: `
        <App>
          Here is
          <a href="https://js.org">a link</a> and here is
          <a href="https://js.org">another</a>
        </App>
      `,
      errors: [
        {
          messageId: 'spacingBeforeNext',
          data: { element: 'a' },
          line: 4,
          column: 11,
        },
        {
          messageId: 'spacingBeforeNext',
          data: { element: 'a' },
          line: 5,
          column: 11,
        },
      ],
    },
  ),
})
