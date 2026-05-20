import { run } from '#test'
import rule from './jsx-shorthand-fragment'

run({
  name: 'jsx-shorthand-fragment',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  valid: [
    '<><div /></>',
    '<><span /><span /></>',
    // Fragment with key prop should not be reported
    '<Fragment key={id}><div /></Fragment>',
    '<React.Fragment key={id}><div /></React.Fragment>',
    // ignore non React Fragment
    '<NonReact.Fragment><div /></NonReact.Fragment>',
    // ignore React non Fragment
    '<React.Anything><div /></React.Anything>',
  ],
  invalid: [
    {
      code: '<Fragment><div /></Fragment>',
      output: '<><div /></>',
      errors: [{ messageId: 'preferShorthandFragment' as const }],
    },

    // Missing closing
    {
      code: '<Fragment />',
      errors: [{ messageId: 'preferShorthandFragment' as const }],
    },

    {
      code: '<React.Fragment><div /></React.Fragment>',
      output: '<><div /></>',
      errors: [{ messageId: 'preferShorthandFragment' as const }],
    },
    {
      code: '<Fragment><span /><span /></Fragment>',
      output: '<><span /><span /></>',
      errors: [{ messageId: 'preferShorthandFragment' as const }],
    },
    {
      code: '<React.Fragment><span /><span /></React.Fragment>',
      output: '<><span /><span /></>',
      errors: [{ messageId: 'preferShorthandFragment' as const }],
    },
  ],
})
