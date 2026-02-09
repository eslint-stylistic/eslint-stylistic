import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './dot-location'

run<RuleOptions, MessageIds>({
  name: 'dot-location',
  rule,
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  valid: [
    {
      code: `<Form.\nInput />`,
      options: ['object'],
    },
    {
      code: `<Form\n.Input />`,
      options: ['property'],
    },
  ],
  invalid: [
    {
      code: `<Form\n.Input />`,
      output: `<Form.\nInput />`,
      options: ['object'],
    },
    {
      code: `<Form.\nInput />`,
      output: `<Form\n.Input />`,
      options: ['property'],
    },
  ],
})
