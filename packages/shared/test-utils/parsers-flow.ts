import babelParser from '@babel/eslint-parser'

export const languageOptionsForBabelFlow = {
  parser: babelParser,
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: ['flow'],
      },
    },
  },
}
