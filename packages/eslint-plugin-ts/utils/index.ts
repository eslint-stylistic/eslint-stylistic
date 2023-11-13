import { ESLintUtils } from '@typescript-eslint/utils'

export * from './astUtils'
export * from './createRule'
export * from './getStringLength'
export * from './isNodeEqual'
export * from './isNullLiteral'
export * from './isUndefinedIdentifier'

const {
  applyDefault,
  deepMerge,
  isObjectNotArray,
  getParserServices,
  nullThrows,
  NullThrowsReasons,
} = ESLintUtils

export {
  applyDefault,
  deepMerge,
  isObjectNotArray,
  getParserServices,
  nullThrows,
  NullThrowsReasons,
}
