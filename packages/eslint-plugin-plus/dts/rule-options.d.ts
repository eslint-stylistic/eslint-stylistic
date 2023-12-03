/* GENERATED, DO NOT EDIT DIRECTLY */

import type { RuleOptions as IndentBinaryOpsRuleOptions } from '../rules/indent-binary-ops/types'
import type { RuleOptions as TypeGenericSpacingRuleOptions } from '../rules/type-generic-spacing/types'
import type { RuleOptions as TypeNamedTupleSpacingRuleOptions } from '../rules/type-named-tuple-spacing/types'

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
