import rule from './indent-unindent'
import { $, run } from '#test'

run({
  name: 'indent-unindent',
  rule,

  valid: [
    $`
      const a = $\`
        b
      \`
    `,
    $`
      const a = foo\`b\`
    `,
  ],
  invalid: [
    {
      code: $`
        const a = {
          foo: $\`
              if (true)
                return 1
          \`
        } 
      `,
      output: $`
        const a = {
          foo: $\`
            if (true)
              return 1
          \`
        } 
      `,
    },
    {
      code: $`
        const a = $\`
            if (true)
              return 1\`
      `,
      output: $`
        const a = $\`
          if (true)
            return 1
        \`
      `,
    },
  ],
})
