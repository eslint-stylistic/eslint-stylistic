declare module 'eslint' {
  export namespace RuleTester {
    interface ValidTestCase {
      /**
       * @deprecated
       */
      parserOptions?: { never: 'never' }
      languageOptions?: Linter.FlatConfig['languageOptions']
    }
  }
}

export {}
