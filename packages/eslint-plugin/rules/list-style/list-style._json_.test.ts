import { $, run } from '#test'
import rule from './list-style'

run({
  name: 'list-newline',
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
    $`
      {
        "foo": {"a": "1", "b": "2"}
      }
    `,
    $`
      {
        "foo": {
          "a": "1",
          "b": "2"
        }
      }
    `,
    {
      description: 'Ignore when there is a comment',
      code: $`
        {
          "foo": {          "a": "1",
            // comment
            "b": "2"
          },
        }
      `,
    },
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
            "b": "2"
          },
          "bar": ["1",  "2"]
        }
      `,
    },
  ],
})
