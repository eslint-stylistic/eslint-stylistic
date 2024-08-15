/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

import { invalids, valids } from '../../../test-utils/parsers-jsx'
import rule from './jsx-closing-tag-location'
import { run } from '#test'

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
  ),
})
