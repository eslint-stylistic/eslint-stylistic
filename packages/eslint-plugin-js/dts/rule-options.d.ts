/* GENERATED, DO NOT EDIT DIRECTLY */

import type { BlockSpacingRuleOptions } from '../../eslint-plugin/rules/block-spacing/types'
import type { BraceStyleRuleOptions } from '../../eslint-plugin/rules/brace-style/types'
import type { CommaDangleRuleOptions } from '../../eslint-plugin/rules/comma-dangle/types._js_'
import type { CommaSpacingRuleOptions } from '../../eslint-plugin/rules/comma-spacing/types._js_'
import type { FunctionCallSpacingRuleOptions } from '../../eslint-plugin/rules/function-call-spacing/types._js_'
import type { IndentRuleOptions } from '../../eslint-plugin/rules/indent/types'
import type { KeySpacingRuleOptions } from '../../eslint-plugin/rules/key-spacing/types'
import type { KeywordSpacingRuleOptions } from '../../eslint-plugin/rules/keyword-spacing/types._js_'
import type { LinesAroundCommentRuleOptions } from '../../eslint-plugin/rules/lines-around-comment/types._js_'
import type { LinesBetweenClassMembersRuleOptions } from '../../eslint-plugin/rules/lines-between-class-members/types._js_'
import type { NoExtraParensRuleOptions } from '../../eslint-plugin/rules/no-extra-parens/types'
import type { NoExtraSemiRuleOptions } from '../../eslint-plugin/rules/no-extra-semi/types'
import type { ObjectCurlyNewlineRuleOptions } from '../../eslint-plugin/rules/object-curly-newline/types'
import type { ObjectCurlySpacingRuleOptions } from '../../eslint-plugin/rules/object-curly-spacing/types'
import type { ObjectPropertyNewlineRuleOptions } from '../../eslint-plugin/rules/object-property-newline/types'
import type { PaddingLineBetweenStatementsRuleOptions } from '../../eslint-plugin/rules/padding-line-between-statements/types._js_'
import type { QuotePropsRuleOptions } from '../../eslint-plugin/rules/quote-props/types'
import type { QuotesRuleOptions } from '../../eslint-plugin/rules/quotes/types'
import type { SemiSpacingRuleOptions } from '../../eslint-plugin/rules/semi-spacing/types'
import type { SemiRuleOptions } from '../../eslint-plugin/rules/semi/types'
import type { SpaceBeforeBlocksRuleOptions } from '../../eslint-plugin/rules/space-before-blocks/types'
import type { SpaceBeforeFunctionParenRuleOptions } from '../../eslint-plugin/rules/space-before-function-paren/types._js_'
import type { SpaceInfixOpsRuleOptions } from '../../eslint-plugin/rules/space-infix-ops/types._js_'

export interface RuleOptions {
  /**
   * Disallow or enforce spaces inside of blocks after opening block and before closing block
   * @see https://eslint.style/rules/js/block-spacing
   */
  '@stylistic/js/block-spacing': BlockSpacingRuleOptions
  /**
   * Enforce consistent brace style for blocks
   * @see https://eslint.style/rules/js/brace-style
   */
  '@stylistic/js/brace-style': BraceStyleRuleOptions
  /**
   * Require or disallow trailing commas
   * @see https://eslint.style/rules/js/comma-dangle
   */
  '@stylistic/js/comma-dangle': CommaDangleRuleOptions
  /**
   * Enforce consistent spacing before and after commas
   * @see https://eslint.style/rules/js/comma-spacing
   */
  '@stylistic/js/comma-spacing': CommaSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  '@stylistic/js/func-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  '@stylistic/js/function-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce consistent indentation
   * @see https://eslint.style/rules/js/indent
   */
  '@stylistic/js/indent': IndentRuleOptions
  /**
   * Enforce consistent spacing between keys and values in object literal properties
   * @see https://eslint.style/rules/js/key-spacing
   */
  '@stylistic/js/key-spacing': KeySpacingRuleOptions
  /**
   * Enforce consistent spacing before and after keywords
   * @see https://eslint.style/rules/js/keyword-spacing
   */
  '@stylistic/js/keyword-spacing': KeywordSpacingRuleOptions
  /**
   * Require empty lines around comments
   * @see https://eslint.style/rules/js/lines-around-comment
   */
  '@stylistic/js/lines-around-comment': LinesAroundCommentRuleOptions
  /**
   * Require or disallow an empty line between class members
   * @see https://eslint.style/rules/js/lines-between-class-members
   */
  '@stylistic/js/lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /**
   * Disallow unnecessary parentheses
   * @see https://eslint.style/rules/js/no-extra-parens
   */
  '@stylistic/js/no-extra-parens': NoExtraParensRuleOptions
  /**
   * Disallow unnecessary semicolons
   * @see https://eslint.style/rules/js/no-extra-semi
   */
  '@stylistic/js/no-extra-semi': NoExtraSemiRuleOptions
  /**
   * Enforce consistent line breaks after opening and before closing braces
   * @see https://eslint.style/rules/js/object-curly-newline
   */
  '@stylistic/js/object-curly-newline': ObjectCurlyNewlineRuleOptions
  /**
   * Enforce consistent spacing inside braces
   * @see https://eslint.style/rules/js/object-curly-spacing
   */
  '@stylistic/js/object-curly-spacing': ObjectCurlySpacingRuleOptions
  /**
   * Enforce placing object properties on separate lines
   * @see https://eslint.style/rules/js/object-property-newline
   */
  '@stylistic/js/object-property-newline': ObjectPropertyNewlineRuleOptions
  /**
   * Require or disallow padding lines between statements
   * @see https://eslint.style/rules/js/padding-line-between-statements
   */
  '@stylistic/js/padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /**
   * Require quotes around object literal property names
   * @see https://eslint.style/rules/js/quote-props
   */
  '@stylistic/js/quote-props': QuotePropsRuleOptions
  /**
   * Enforce the consistent use of either backticks, double, or single quotes
   * @see https://eslint.style/rules/js/quotes
   */
  '@stylistic/js/quotes': QuotesRuleOptions
  /**
   * Require or disallow semicolons instead of ASI
   * @see https://eslint.style/rules/js/semi
   */
  '@stylistic/js/semi': SemiRuleOptions
  /**
   * Enforce consistent spacing before and after semicolons
   * @see https://eslint.style/rules/js/semi-spacing
   */
  '@stylistic/js/semi-spacing': SemiSpacingRuleOptions
  /**
   * Enforce consistent spacing before blocks
   * @see https://eslint.style/rules/js/space-before-blocks
   */
  '@stylistic/js/space-before-blocks': SpaceBeforeBlocksRuleOptions
  /**
   * Enforce consistent spacing before `function` definition opening parenthesis
   * @see https://eslint.style/rules/js/space-before-function-paren
   */
  '@stylistic/js/space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /**
   * Require spacing around infix operators
   * @see https://eslint.style/rules/js/space-infix-ops
   */
  '@stylistic/js/space-infix-ops': SpaceInfixOpsRuleOptions
}

export interface UnprefixedRuleOptions {
  /**
   * Disallow or enforce spaces inside of blocks after opening block and before closing block
   * @see https://eslint.style/rules/js/block-spacing
   */
  'block-spacing': BlockSpacingRuleOptions
  /**
   * Enforce consistent brace style for blocks
   * @see https://eslint.style/rules/js/brace-style
   */
  'brace-style': BraceStyleRuleOptions
  /**
   * Require or disallow trailing commas
   * @see https://eslint.style/rules/js/comma-dangle
   */
  'comma-dangle': CommaDangleRuleOptions
  /**
   * Enforce consistent spacing before and after commas
   * @see https://eslint.style/rules/js/comma-spacing
   */
  'comma-spacing': CommaSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  'func-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  'function-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce consistent indentation
   * @see https://eslint.style/rules/js/indent
   */
  'indent': IndentRuleOptions
  /**
   * Enforce consistent spacing between keys and values in object literal properties
   * @see https://eslint.style/rules/js/key-spacing
   */
  'key-spacing': KeySpacingRuleOptions
  /**
   * Enforce consistent spacing before and after keywords
   * @see https://eslint.style/rules/js/keyword-spacing
   */
  'keyword-spacing': KeywordSpacingRuleOptions
  /**
   * Require empty lines around comments
   * @see https://eslint.style/rules/js/lines-around-comment
   */
  'lines-around-comment': LinesAroundCommentRuleOptions
  /**
   * Require or disallow an empty line between class members
   * @see https://eslint.style/rules/js/lines-between-class-members
   */
  'lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /**
   * Disallow unnecessary parentheses
   * @see https://eslint.style/rules/js/no-extra-parens
   */
  'no-extra-parens': NoExtraParensRuleOptions
  /**
   * Disallow unnecessary semicolons
   * @see https://eslint.style/rules/js/no-extra-semi
   */
  'no-extra-semi': NoExtraSemiRuleOptions
  /**
   * Enforce consistent line breaks after opening and before closing braces
   * @see https://eslint.style/rules/js/object-curly-newline
   */
  'object-curly-newline': ObjectCurlyNewlineRuleOptions
  /**
   * Enforce consistent spacing inside braces
   * @see https://eslint.style/rules/js/object-curly-spacing
   */
  'object-curly-spacing': ObjectCurlySpacingRuleOptions
  /**
   * Enforce placing object properties on separate lines
   * @see https://eslint.style/rules/js/object-property-newline
   */
  'object-property-newline': ObjectPropertyNewlineRuleOptions
  /**
   * Require or disallow padding lines between statements
   * @see https://eslint.style/rules/js/padding-line-between-statements
   */
  'padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /**
   * Require quotes around object literal property names
   * @see https://eslint.style/rules/js/quote-props
   */
  'quote-props': QuotePropsRuleOptions
  /**
   * Enforce the consistent use of either backticks, double, or single quotes
   * @see https://eslint.style/rules/js/quotes
   */
  'quotes': QuotesRuleOptions
  /**
   * Require or disallow semicolons instead of ASI
   * @see https://eslint.style/rules/js/semi
   */
  'semi': SemiRuleOptions
  /**
   * Enforce consistent spacing before and after semicolons
   * @see https://eslint.style/rules/js/semi-spacing
   */
  'semi-spacing': SemiSpacingRuleOptions
  /**
   * Enforce consistent spacing before blocks
   * @see https://eslint.style/rules/js/space-before-blocks
   */
  'space-before-blocks': SpaceBeforeBlocksRuleOptions
  /**
   * Enforce consistent spacing before `function` definition opening parenthesis
   * @see https://eslint.style/rules/js/space-before-function-paren
   */
  'space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /**
   * Require spacing around infix operators
   * @see https://eslint.style/rules/js/space-infix-ops
   */
  'space-infix-ops': SpaceInfixOpsRuleOptions
}
