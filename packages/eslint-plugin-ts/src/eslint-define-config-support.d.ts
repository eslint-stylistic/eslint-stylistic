declare module 'eslint-define-config' {
  export interface CustomRuleOptions {
    /**
     * Disallow or enforce spaces inside of blocks after opening block and before closing block.
     *
     * @see [block-spacing](https://typescript-eslint.io/rules/block-spacing)
     */
    '@typescript-eslint/block-spacing': [('always' | 'never')?]
  }
}

export {}
