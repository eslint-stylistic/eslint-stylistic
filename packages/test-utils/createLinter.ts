import { Linter } from 'eslint'
import tsParser from '@typescript-eslint/parser'

export function createLinter<T extends unknown[]>(name: string, rule: any) {
  const linter = new Linter({
    configType: 'flat',
  })

  return {
    linter,
    fix(code: string, options?: T) {
      const config: Linter.FlatConfig[] = [
        {
          languageOptions: {
            parser: tsParser as any,
            sourceType: 'module',
          },
          plugins: {
            temp: {
              rules: {
                [name]: rule,
              },
            },
          },
          rules: {
            [`temp/${name}`]: ['error', ...options || []],
          },
        },
      ]

      const result = linter.verifyAndFix(code, config)
      if (result.fixed)
        return result.output

      throw new Error(`Expect to fix ${name}, but nothing changed`)
    },
  }
}
