import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './padding-line-between-statements'

run<RuleOptions, MessageIds>({
  name: 'padding-line-between-statements',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  invalid: [
    {
      code: $`
        <button
          title="Some button"
          // this is a comment
          // second comment
        
          onClick={(value) => {
            console.log(value);
          }}
        
          type="button"
        />;
      `,
      output: $`
        <button
          title="Some button"
          // this is a comment
          // second comment
          onClick={(value) => {
            console.log(value);
          }}
          type="button"
        />;
      `,
      options: [{ prev: '*', next: 'jsx-prop', blankLine: 'never' }],
      errors: [
        { messageId: 'unexpectedBlankLine' },
        { messageId: 'unexpectedBlankLine' },
      ],
    },
  ],
})
