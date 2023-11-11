const entries = object => Object.entries(object)
const flatMap = (array, callback) => array.flatMap(callback)

function minEcmaVersion(features, parserOptions) {
  const minEcmaVersionForFeatures = {
    'class fields': 2022,
    'optional chaining': 2020,
    'nullish coalescing': 2020,
  }
  // eslint-disable-next-line prefer-spread
  const result = Math.max.apply(
    Math,
    [].concat(
      (parserOptions && parserOptions.ecmaVersion) || [],
      flatMap(entries(minEcmaVersionForFeatures), (entry) => {
        const f = entry[0]
        const y = entry[1]
        return features.has(f) ? y : []
      }),
    ).map(y => (y > 5 && y < 2015 ? y + 2009 : y)), // normalize editions to years
  )
  return Number.isFinite(result) ? result : undefined
}

const parsers = {
  // 'BABEL_ESLINT': 'babel-eslint',
  '@BABEL_ESLINT': require.resolve('@babel/eslint-parser'),
  // 'TYPESCRIPT_ESLINT': 'typescript-eslint-parser',
  '@TYPESCRIPT_ESLINT': require.resolve('@typescript-eslint/parser'),
  'skipDueToMultiErrorSorting': true,
  'babelParserOptions': function parserOptions(test, features) {
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
  },
  'tsParserOptions': function parserOptions(test, features) {
    return {
      ...test.parserOptions,
      ecmaFeatures: {
        jsx: true,
        modules: true,
        legacyDecorators: features.has('decorators'),
      },
    }
  },
  'all': function all(tests) {
    const t = flatMap(tests, (test) => {
      if (typeof test === 'string')
        test = { code: test }

      if ('parser' in test) {
        delete test.features
        return test
      }
      const features = new Set([].concat(test.features || []))
      delete test.features

      const es = minEcmaVersion(features, test.parserOptions)

      function addComment(testObject, parser) {
        const extras = [].concat(
          `features: [${Array.from(features).join(',')}]`,
          `parser: ${parser}`,
          testObject.parserOptions ? `parserOptions: ${JSON.stringify(testObject.parserOptions)}` : [],
          testObject.options ? `options: ${JSON.stringify(testObject.options)}` : [],
          testObject.settings ? `settings: ${JSON.stringify(testObject.settings)}` : [],
        )

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
              (errorObject) => {
                const nextSuggestions = errorObject.suggestions && {
                  suggestions: errorObject.suggestions.map(suggestion => Object.assign({}, suggestion, {
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
      // const tsOld = !skipTS && !features.has('no-ts-old')
      const tsNew = !skipTS && !features.has('no-ts-new')

      return [].concat(
        skipBase ? [] : addComment(
          Object.assign({}, test, typeof es === 'number' && {
            parserOptions: Object.assign({}, test.parserOptions, {
              ecmaVersion: es,
            }),
          }),
          'default',
        ),
        skipNewBabel ? [] : addComment(Object.assign({}, test, {
          parser: parsers['@BABEL_ESLINT'],
          parserOptions: parsers.babelParserOptions(test, features),
        }), '@babel/eslint-parser'),
        tsNew ? addComment(Object.assign({}, test, {
          parser: parsers['@TYPESCRIPT_ESLINT'],
          parserOptions: parsers.tsParserOptions(test, features),
        }), '@typescript-eslint/parser') : [],
      )
    })

    return t
  },
}

export default parsers
