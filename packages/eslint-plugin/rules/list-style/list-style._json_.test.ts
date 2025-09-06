import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './list-style'

run<RuleOptions, MessageIds>({
  name: 'list-style',
  rule,
  lang: 'json',
  valid: [
    $`
      {
        "foo": ["bar", "baz"]
      }
    `,
    $`
      {
        "foo": [
          "bar", 
          "baz"
        ]
      }
    `,
    {
      code: $`
        {
          "foo": {"a": "1", "b": "2"}
        }
      `,
      options: [{
        overrides: {
          JSONObjectExpression: {
            singleLine: {
              spacing: 'never',
            },
          },
        },
      }],
    },
    $`
      {
        "foo": {
          "a": "1",
          "b": "2"
        }
      }
    `,
  ],
  invalid: [
    {
      code: $`
        {
          "foo": ["bar",
          "baz"],
        }
      `,
      output: $`
        {
          "foo": ["bar",  "baz"],
        }
      `,
    },
    {
      code: $`
        {
          "foo": [
            "bar","baz"
          ],
        }
      `,
      output: $`
        {
          "foo": [
            "bar",
        "baz"
          ],
        }
      `,
    },
    {
      code: $`
        {
          "foo": {"a": "1",
          "b": "2"}
        }
      `,
      output: $`
        {
          "foo": {"a": "1",  "b": "2"}
        }
      `,
    },
    {
      code: $`
        {
          "foo": {
            "a": "1",         "b": "2"
          }
        }
      `,
      output: $`
        {
          "foo": {
            "a": "1",         
        "b": "2"
          }
        }
      `,
    },
    {
      description: 'Only ignore when there is a comment',
      code: $`
        {
          "foo": {          "a": "1",
            // comment
            "b": "2"
          },
          "bar": ["1",
          "2"]
        }
      `,
      output: $`
        {
          "foo": {          "a": "1",
            // comment
            "b": "2"  },
          "bar": ["1",  "2"]
        }
      `,
    },
  ],
})
