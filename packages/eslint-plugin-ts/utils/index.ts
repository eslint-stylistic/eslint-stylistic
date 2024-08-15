import { ESLintUtils } from '@typescript-eslint/utils'

export * from '../../utils'
export * from './getStringLength'

const {
  nullThrows,
  NullThrowsReasons,
} = ESLintUtils

export {
  nullThrows,
  NullThrowsReasons,
}
