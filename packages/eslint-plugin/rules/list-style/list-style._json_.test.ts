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
          "foo": ["bar","baz"],
        }
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 2, column: 17 },
      ],
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
      errors: [
        { messageId: 'shouldWrap', line: 3, column: 11 },
      ],
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
          "foo": {"a": "1","b": "2"}
        }
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 2, column: 20 },
      ],
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
      errors: [
        { messageId: 'shouldWrap', line: 3, column: 14 },
      ],
    },
    {
      description: 'Only ignore when there is a comment',
      code: $`
        {
          "foo": { "a": "1",
            // comment
            "b": "2"
          },
          "bar": ["1",
          "2"]
        }
      `,
      output: $`
        {
          "foo": { "a": "1",
            // comment
            "b": "2"},
          "bar": ["1","2"]
        }
      `,
      errors: [
        { messageId: 'shouldNotWrap', line: 2, column: 21 },
        { messageId: 'shouldNotWrap', line: 4, column: 13 },
        { messageId: 'shouldNotWrap', line: 6, column: 15 },
      ],
    },
  ],
})
