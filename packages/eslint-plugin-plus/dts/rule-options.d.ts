/* GENERATED, DO NOT EDIT DIRECTLY */

import type { IndentBinaryOpsRuleOptions } from '../../eslint-plugin/rules/indent-binary-ops/types'
import type { TypeGenericSpacingRuleOptions } from '../../eslint-plugin/rules/type-generic-spacing/types'
import type { TypeNamedTupleSpacingRuleOptions } from '../../eslint-plugin/rules/type-named-tuple-spacing/types'

export interface RuleOptions {
  /**
   * Indentation for binary operators
   * @see https://eslint.style/rules/plus/indent-binary-ops
   */
  '@stylistic/plus/indent-binary-ops': IndentBinaryOpsRuleOptions
  /**
   * Enforces consistent spacing inside TypeScript type generics
   * @see https://eslint.style/rules/plus/type-generic-spacing
   */
  '@stylistic/plus/type-generic-spacing': TypeGenericSpacingRuleOptions
  /**
   * Expect space before the type declaration in the named tuple
   * @see https://eslint.style/rules/plus/type-named-tuple-spacing
   */
  '@stylistic/plus/type-named-tuple-spacing': TypeNamedTupleSpacingRuleOptions
}

export interface UnprefixedRuleOptions {
  /**
   * Indentation for binary operators
   * @see https://eslint.style/rules/plus/indent-binary-ops
   */
  'indent-binary-ops': IndentBinaryOpsRuleOptions
  /**
   * Enforces consistent spacing inside TypeScript type generics
   * @see https://eslint.style/rules/plus/type-generic-spacing
   */
  'type-generic-spacing': TypeGenericSpacingRuleOptions
  /**
   * Expect space before the type declaration in the named tuple
   * @see https://eslint.style/rules/plus/type-named-tuple-spacing
   */
  'type-named-tuple-spacing': TypeNamedTupleSpacingRuleOptions
}
