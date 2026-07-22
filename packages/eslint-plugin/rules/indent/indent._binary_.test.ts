import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './indent'

run<RuleOptions, MessageIds>({
  name: 'indent (binary operators)',
  rule,
  valid: [
    ...[
      $`
        const value = foo
          + bar
          + baz
      `,
      $`
        const value = foo +
          bar
      `,
      'const value = foo + bar',
      $`
        if (foo
          && bar
          && (baz
            || qux)
        ) {}
      `,
      $`
        if ((
          foo
          || bar)
        && baz) {}
      `,
      $`
        const value = (
          foo
          || bar
        )
      `,
      $`
        const value = (
          foo
        ) + bar
      `,
      $`
        type Result =
          | Success
          | Failure
        
        type Combined =
          & Left
          & Right
      `,
      $`
        type Result = Success |
          Failure
      `,
      'type Result = Success | Failure',
      $`
        type Config
          = | {
            first: boolean
          }
          | {
            second: boolean
          }
      `,
      $`
        type Placement =
          | (
            | 'before'
            | 'after'
            )
            | false
      `,
    ].map(code => ({
      code,
      options: [2, { binaryOps: 1 }] as RuleOptions,
    })),
    {
      code: $`
        type Ignored =
              | Left
        | Right
      `,
      options: [2, { binaryOps: 1, ignoredNodes: ['TSUnionType'] }],
    },
  ],
  invalid: [
    {
      code: $`
        const value = foo
            + bar
          + baz
      `,
      output: $`
        const value = foo
          + bar
          + baz
      `,
    },
    {
      code: $`
        const value = foo +
            bar
      `,
      output: $`
        const value = foo +
          bar
      `,
    },
    {
      code: $`
        if (foo
            && bar
          && baz
        ) {}
      `,
      output: $`
        if (foo
          && bar
          && baz
        ) {}
      `,
    },
    {
      code: $`
        type Result =
            | Success
          | Failure
      `,
      output: $`
        type Result =
          | Success
          | Failure
      `,
    },
    {
      code: $`
        type Result = Success |
            Failure
      `,
      output: $`
        type Result = Success |
          Failure
      `,
    },
    {
      code: $`
        type Combined =
            & Left
          & Right
      `,
      output: $`
        type Combined =
          & Left
          & Right
      `,
    },
  ].map(testCase => ({
    options: [2, { binaryOps: 1 }],
    ...testCase,
  })),
})
