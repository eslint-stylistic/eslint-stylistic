import type * as core from '@eslint/core'
import type * as pluginKit from '@eslint/plugin-kit'

/**
 * Check if the given sourceCode is TextSourceCode
 */
export function isTextSourceCode(sourceCode: core.SourceCode): sourceCode is core.TextSourceCode {
  // The `sourceCode` is probably `core.BinarySourceCode`.
  // ESLint core can specify `core.BinarySourceCode` using type annotations,
  // but it seems that there is no plugin yet that can actually use `core.BinarySourceCode`. (2025/11)
  return typeof (sourceCode as { text?: unknown }).text === 'string'
}

export type TextSourceCodeWithLinesAndGetLocFromIndex
  = Pick<pluginKit.TextSourceCodeBase, 'getLocFromIndex' | 'lines'>
    & core.TextSourceCode

/**
 * Check if the given sourceCode has `lines` and `getLocFromIndex()`
 */
export function hasLinesAndGetLocFromIndex(sourceCode: core.TextSourceCode): sourceCode is TextSourceCodeWithLinesAndGetLocFromIndex {
  // If the `sourceCode` is not `TextSourceCodeBase` in the plugin kit,
  // the rules in this plugin cannot be checked.
  // For the rules to work, `sourceCode` must implement at least `lines` and `getLocFromIndex()`.
  return (
    typeof (sourceCode as { getLocFromIndex?: unknown }).getLocFromIndex === 'function'
    && Array.isArray((sourceCode as { lines?: unknown }).lines)
  )
}

/**
 * Check the source code is ESTree compatible
 * https://github.com/eslint/eslint/blob/04c21475b3004904948f02049f2888b401d82c78/lib/languages/js/source-code/source-code.js#L312-L316
 */
export function isESTreeSourceCode(sourceCode: unknown) {
  return (
    typeof sourceCode === 'object'
    && sourceCode !== null
    && 'isESTree' in sourceCode
    && sourceCode.isESTree === true
  )
}
