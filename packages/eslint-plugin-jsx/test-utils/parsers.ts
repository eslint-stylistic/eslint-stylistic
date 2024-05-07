import type { RuleTester } from 'eslint'
import type { InvalidTestCaseBase, ValidTestCaseBase } from '#test'

export interface InvalidTestCase extends InvalidTestCaseBase {
  features?: string[]
}

export interface ValidTestCase extends ValidTestCaseBase {
  features?: string[]
}

function minEcmaVersion(features: any, parserOptions: any) {
  const minEcmaVersionForFeatures = {
    'class fields': 2022,
    'optional chaining': 2020,
    'nullish coalescing': 2020,
  }
  // eslint-disable-next-line prefer-spread
  const result = Math.max.apply(
    Math,
    [
      (parserOptions && parserOptions.ecmaVersion) || '',
      ...Object.entries(minEcmaVersionForFeatures).flatMap((entry) => {
        const f = entry[0]
        const y = entry[1]
        return features.has(f) ? y : []
      }),
    ].filter(Boolean).map(y => (y > 5 && y < 2015 ? y + 2009 : y)), // normalize editions to years
  )
  return Number.isFinite(result) ? result : undefined
}

// @ts-expect-error missing types
export const BABEL_ESLINT = await import('@babel/eslint-parser').then(m => m.default)
export const TYPESCRIPT_ESLINT = await import('@typescript-eslint/parser').then(m => m.default)

export function tsParserOptions(test: Partial<InvalidTestCase | ValidTestCase>, features: Set<string>) {
  return {
    ...test.parserOptions,
    ecmaFeatures: {
      jsx: true,
      modules: true,
      legacyDecorators: features.has('decorators'),
    },
  }
}

export function babelParserOptions(test: Partial<InvalidTestCase | ValidTestCase>, features: Set<string>) {
  return Object.assign({}, test.parserOptions, {
    requireConfigFile: false,
    babelOptions: {
      presets: [
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/plugin-syntax-do-expressions',
        '@babel/plugin-syntax-function-bind',
        ['@babel/plugin-syntax-decorators', { legacy: true }],
      ],
      parserOpts: {
        allowSuperOutsideMethod: false,
        allowReturnOutsideFunction: false,
      },
    },
    ecmaFeatures: Object.assign(
      {},
      test.parserOptions && test.parserOptions.ecmaFeatures,
      {
        jsx: true,
        modules: true,
        legacyDecorators: features.has('decorators'),
      },
    ),
  })
}

function applyAllParsers(tests: InvalidTestCase[]): InvalidTestCase[]
function applyAllParsers(tests: ValidTestCase[]): ValidTestCase[]
function applyAllParsers(tests: ValidTestCase[] | InvalidTestCase[]) {
  const t = tests.flatMap((test: any): any => {
    if (typeof test === 'string')
      test = { code: test }

    if ('parser' in test) {
      delete test.features
      return test
    }
    const features = new Set<string>(test.features || [])
    delete test.features

    const es = minEcmaVersion(features, test.parserOptions)

    function addComment(testObject: any, parser: any) {
      const extras = [
        `features: [${Array.from(features).join(',')}]`,
        `parser: ${parser}`,
        testObject.parserOptions ? `parserOptions: ${JSON.stringify(testObject.parserOptions)}` : '',
        testObject.options ? `options: ${JSON.stringify(testObject.options)}` : '',
        testObject.settings ? `settings: ${JSON.stringify(testObject.settings)}` : '',
      ]

      const extraComment = `\n// ${extras.join(', ')}`

      // Augment expected fix code output with extraComment
      const nextCode = { code: testObject.code + extraComment }
      const nextOutput = testObject.output && { output: testObject.output + extraComment }

      // Augment expected suggestion outputs with extraComment
      // `errors` may be a number (expected number of errors) or an array of
      // error objects.
      const nextErrors = testObject.errors
        && typeof testObject.errors !== 'number'
        && {
          errors: testObject.errors.map(
            (errorObject: any) => {
              const nextSuggestions = errorObject.suggestions && {
                suggestions: errorObject.suggestions.map((suggestion: any) => Object.assign({}, suggestion, {
                  output: suggestion.output + extraComment,
                })),
              }

              return Object.assign({}, errorObject, nextSuggestions)
            },
          ),
        }

      return Object.assign(
        {},
        testObject,
        nextCode,
        nextOutput,
        nextErrors,
      )
    }

    const skipBase = features.has('class fields')
      || features.has('no-default')
      || features.has('bind operator')
      || features.has('do expressions')
      || features.has('decorators')
      || features.has('flow')
      || features.has('ts')
      || features.has('types')
      || features.has('fragment')
    const skipBabel = features.has('no-babel')
    const skipNewBabel = skipBabel
      || features.has('no-babel-new')
      || features.has('flow')
      || features.has('types')
      || features.has('ts')
    const skipTS = features.has('no-ts')
      || features.has('flow')
      || features.has('jsx namespace')
      || features.has('bind operator')
      || features.has('do expressions')

    const tsNew = !skipTS && !features.has('no-ts-new')

    return [].concat(
      skipBase ? [] : addComment(
        Object.assign({}, test, typeof es === 'number' && {
          languageOptions: {
            parserOptions: Object.assign({}, test.parserOptions, {
              ecmaVersion: es,
            }),
          },
        }),
        'default',
      ),
      skipNewBabel ? [] : addComment(Object.assign({}, test, {
        languageOptions: {
          parser: BABEL_ESLINT,
          parserOptions: babelParserOptions(test, features),
        },
      }), '@babel/eslint-parser'),
      tsNew ? addComment(Object.assign({}, test, {
        languageOptions: {
          parser: TYPESCRIPT_ESLINT,
          parserOptions: tsParserOptions(test, features),
        },
      }), '@typescript-eslint/parser') : [],
    )
  })

  return t
}

export function valids(...tests: (ValidTestCase | ValidTestCase[] | undefined | false)[]): ValidTestCase[] {
  return applyAllParsers(tests.flat().filter(Boolean) as ValidTestCase[])
}

export function invalids(...tests: (InvalidTestCase | InvalidTestCase[] | undefined | false)[]): InvalidTestCase[] {
  return applyAllParsers(tests.flat().filter(Boolean) as InvalidTestCase[])
}

export const skipDueToMultiErrorSorting = true
