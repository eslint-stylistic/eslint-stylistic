/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

import { run } from '#test'
import { invalids, valids } from '#test/parsers-jsx'
import rule from './jsx-closing-tag-location._jsx_'

run({
  name: 'jsx-closing-tag-location',
  rule,
  parserOptions: {
    sourceType: 'module',
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
        <App>foo</App>
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
        <>foo</>
      `,
      features: ['fragment'],
    },
    {
      code: `
        const foo = () => {
          return <App>
       bar</App>
        }
      `,
      options: ['line-aligned'],
    },
    {
      code: `
        const foo = () => {
          return <App>
              bar</App>
        }
      `,
    },
    {
      code: `
        const foo = () => {
          return <App>
              bar
          </App>
        }
      `,
      options: ['line-aligned'],
    },
    {
      code: `
        const foo = <App>
              bar
        </App>
      `,
      options: ['line-aligned'],
    },
    {
      code: `
        const x = <App>
              foo
                  </App>
      `,
    },
    {
      code: `
        const foo =
          <App>
              bar
          </App>
      `,
      options: ['line-aligned'],
    },
  ),

  invalid: invalids(
    {
      code: `
        <App>
          foo
          </App>
      `,
      output: `
        <App>
          foo
        </App>
      `,
      errors: [{ messageId: 'matchIndent' }],
    },
    {
      code: `
        <App>
          foo</App>
      `,
      output: `
        <App>
          foo
        </App>
      `,
      errors: [{ messageId: 'onOwnLine' }],
    },
    {
      code: `
        <>
          foo
          </>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        <>
          foo
        </>
      `,
      errors: [{ messageId: 'matchIndent' }],
    },
    {
      code: `
        <>
          foo</>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        <>
          foo
        </>
      `,
      errors: [{ messageId: 'onOwnLine' }],
    },
    {
      code: `
        const x = () => {
          return <App>
              foo</App>
        }
      `,
      output: `
        const x = () => {
          return <App>
              foo
          </App>
        }
      `,
      errors: [{ messageId: 'onOwnLine' }],
      options: ['line-aligned'],
    },
    {
      code: `
        const x = <App>
              foo
                  </App>
      `,
      output: `
        const x = <App>
              foo
        </App>
      `,
      errors: [{ messageId: 'alignWithOpening' }],
      options: ['line-aligned'],
    },
  ),
})
