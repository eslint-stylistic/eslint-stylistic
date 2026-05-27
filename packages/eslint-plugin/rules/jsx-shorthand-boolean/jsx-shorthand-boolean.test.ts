import { run } from '#test'
import rule from './jsx-shorthand-boolean'

run({
  name: 'jsx-shorthand-boolean',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  valid: [
    '<div disabled />',
    '<div disabled={false} />',
    '<div disabled={variable} />',
    '<div disabled="string" />',
    '<div disabled={condition ? true : false} />',
  ],
  invalid: [
    {
      code: '<div disabled={true} />',
      output: '<div disabled />',
      errors: [{ messageId: 'omitBooleanValue' }],
    },
    {
      code: '<input readOnly={true} />',
      output: '<input readOnly />',
      errors: [{ messageId: 'omitBooleanValue' }],
    },
  ],
})
