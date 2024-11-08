/* GENERATED, DO NOT EDIT DIRECTLY */

import type { BlockSpacingRuleOptions } from '../../eslint-plugin/rules/block-spacing/types'
import type { BraceStyleRuleOptions } from '../../eslint-plugin/rules/brace-style/types'
import type { CommaDangleRuleOptions } from '../../eslint-plugin/rules/comma-dangle/types._ts_'
import type { CommaSpacingRuleOptions } from '../../eslint-plugin/rules/comma-spacing/types._ts_'
import type { FunctionCallSpacingRuleOptions } from '../../eslint-plugin/rules/function-call-spacing/types._ts_'
import type { IndentRuleOptions } from '../../eslint-plugin/rules/indent/types'
import type { KeySpacingRuleOptions } from '../../eslint-plugin/rules/key-spacing/types'
import type { KeywordSpacingRuleOptions } from '../../eslint-plugin/rules/keyword-spacing/types._ts_'
import type { LinesAroundCommentRuleOptions } from '../../eslint-plugin/rules/lines-around-comment/types._ts_'
import type { LinesBetweenClassMembersRuleOptions } from '../../eslint-plugin/rules/lines-between-class-members/types._ts_'
import type { MemberDelimiterStyleRuleOptions } from '../../eslint-plugin/rules/member-delimiter-style/types'
import type { NoExtraParensRuleOptions } from '../../eslint-plugin/rules/no-extra-parens/types'
import type { NoExtraSemiRuleOptions } from '../../eslint-plugin/rules/no-extra-semi/types'
import type { ObjectCurlyNewlineRuleOptions } from '../../eslint-plugin/rules/object-curly-newline/types'
import type { ObjectCurlySpacingRuleOptions } from '../../eslint-plugin/rules/object-curly-spacing/types'
import type { ObjectPropertyNewlineRuleOptions } from '../../eslint-plugin/rules/object-property-newline/types'
import type { PaddingLineBetweenStatementsRuleOptions } from '../../eslint-plugin/rules/padding-line-between-statements/types._ts_'
import type { QuotePropsRuleOptions } from '../../eslint-plugin/rules/quote-props/types'
import type { QuotesRuleOptions } from '../../eslint-plugin/rules/quotes/types'
import type { SemiRuleOptions } from '../../eslint-plugin/rules/semi/types'
import type { SpaceBeforeBlocksRuleOptions } from '../../eslint-plugin/rules/space-before-blocks/types'
import type { SpaceBeforeFunctionParenRuleOptions } from '../../eslint-plugin/rules/space-before-function-paren/types._ts_'
import type { SpaceInfixOpsRuleOptions } from '../../eslint-plugin/rules/space-infix-ops/types'
import type { TypeAnnotationSpacingRuleOptions } from '../../eslint-plugin/rules/type-annotation-spacing/types'

export interface RuleOptions {
  /**
   * Disallow or enforce spaces inside of blocks after opening block and before closing block
   * @see https://eslint.style/rules/ts/block-spacing
   */
  '@stylistic/ts/block-spacing': BlockSpacingRuleOptions
  /**
   * Enforce consistent brace style for blocks
   * @see https://eslint.style/rules/ts/brace-style
   */
  '@stylistic/ts/brace-style': BraceStyleRuleOptions
  /**
   * Require or disallow trailing commas
   * @see https://eslint.style/rules/ts/comma-dangle
   */
  '@stylistic/ts/comma-dangle': CommaDangleRuleOptions
  /**
   * Enforce consistent spacing before and after commas
   * @see https://eslint.style/rules/ts/comma-spacing
   */
  '@stylistic/ts/comma-spacing': CommaSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/ts/function-call-spacing
   */
  '@stylistic/ts/func-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/ts/function-call-spacing
   */
  '@stylistic/ts/function-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce consistent indentation
   * @see https://eslint.style/rules/ts/indent
   */
  '@stylistic/ts/indent': IndentRuleOptions
  /**
   * Enforce consistent spacing between property names and type annotations in types and interfaces
   * @see https://eslint.style/rules/ts/key-spacing
   */
  '@stylistic/ts/key-spacing': KeySpacingRuleOptions
  /**
   * Enforce consistent spacing before and after keywords
   * @see https://eslint.style/rules/ts/keyword-spacing
   */
  '@stylistic/ts/keyword-spacing': KeywordSpacingRuleOptions
  /**
   * Require empty lines around comments
   * @see https://eslint.style/rules/ts/lines-around-comment
   */
  '@stylistic/ts/lines-around-comment': LinesAroundCommentRuleOptions
  /**
   * Require or disallow an empty line between class members
   * @see https://eslint.style/rules/ts/lines-between-class-members
   */
  '@stylistic/ts/lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /**
   * Require a specific member delimiter style for interfaces and type literals
   * @see https://eslint.style/rules/ts/member-delimiter-style
   */
  '@stylistic/ts/member-delimiter-style': MemberDelimiterStyleRuleOptions
  /**
   * Disallow unnecessary parentheses
   * @see https://eslint.style/rules/ts/no-extra-parens
   */
  '@stylistic/ts/no-extra-parens': NoExtraParensRuleOptions
  /**
   * Disallow unnecessary semicolons
   * @see https://eslint.style/rules/ts/no-extra-semi
   */
  '@stylistic/ts/no-extra-semi': NoExtraSemiRuleOptions
  /**
   * Enforce consistent line breaks after opening and before closing braces
   * @see https://eslint.style/rules/ts/object-curly-newline
   */
  '@stylistic/ts/object-curly-newline': ObjectCurlyNewlineRuleOptions
  /**
   * Enforce consistent spacing inside braces
   * @see https://eslint.style/rules/ts/object-curly-spacing
   */
  '@stylistic/ts/object-curly-spacing': ObjectCurlySpacingRuleOptions
  /**
   * Enforce placing object properties on separate lines
   * @see https://eslint.style/rules/ts/object-property-newline
   */
  '@stylistic/ts/object-property-newline': ObjectPropertyNewlineRuleOptions
  /**
   * Require or disallow padding lines between statements
   * @see https://eslint.style/rules/ts/padding-line-between-statements
   */
  '@stylistic/ts/padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /**
   * Require quotes around object literal, type literal, interfaces and enums property names
   * @see https://eslint.style/rules/ts/quote-props
   */
  '@stylistic/ts/quote-props': QuotePropsRuleOptions
  /**
   * Enforce the consistent use of either backticks, double, or single quotes
   * @see https://eslint.style/rules/ts/quotes
   */
  '@stylistic/ts/quotes': QuotesRuleOptions
  /**
   * Require or disallow semicolons instead of ASI
   * @see https://eslint.style/rules/ts/semi
   */
  '@stylistic/ts/semi': SemiRuleOptions
  /**
   * Enforce consistent spacing before blocks
   * @see https://eslint.style/rules/ts/space-before-blocks
   */
  '@stylistic/ts/space-before-blocks': SpaceBeforeBlocksRuleOptions
  /**
   * Enforce consistent spacing before function parenthesis
   * @see https://eslint.style/rules/ts/space-before-function-paren
   */
  '@stylistic/ts/space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /**
   * Require spacing around infix operators
   * @see https://eslint.style/rules/ts/space-infix-ops
   */
  '@stylistic/ts/space-infix-ops': SpaceInfixOpsRuleOptions
  /**
   * Require consistent spacing around type annotations
   * @see https://eslint.style/rules/ts/type-annotation-spacing
   */
  '@stylistic/ts/type-annotation-spacing': TypeAnnotationSpacingRuleOptions
}

export interface UnprefixedRuleOptions {
  /**
   * Disallow or enforce spaces inside of blocks after opening block and before closing block
   * @see https://eslint.style/rules/ts/block-spacing
   */
  'block-spacing': BlockSpacingRuleOptions
  /**
   * Enforce consistent brace style for blocks
   * @see https://eslint.style/rules/ts/brace-style
   */
  'brace-style': BraceStyleRuleOptions
  /**
   * Require or disallow trailing commas
   * @see https://eslint.style/rules/ts/comma-dangle
   */
  'comma-dangle': CommaDangleRuleOptions
  /**
   * Enforce consistent spacing before and after commas
   * @see https://eslint.style/rules/ts/comma-spacing
   */
  'comma-spacing': CommaSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/ts/function-call-spacing
   */
  'func-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/ts/function-call-spacing
   */
  'function-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce consistent indentation
   * @see https://eslint.style/rules/ts/indent
   */
  'indent': IndentRuleOptions
  /**
   * Enforce consistent spacing between property names and type annotations in types and interfaces
   * @see https://eslint.style/rules/ts/key-spacing
   */
  'key-spacing': KeySpacingRuleOptions
  /**
   * Enforce consistent spacing before and after keywords
   * @see https://eslint.style/rules/ts/keyword-spacing
   */
  'keyword-spacing': KeywordSpacingRuleOptions
  /**
   * Require empty lines around comments
   * @see https://eslint.style/rules/ts/lines-around-comment
   */
  'lines-around-comment': LinesAroundCommentRuleOptions
  /**
   * Require or disallow an empty line between class members
   * @see https://eslint.style/rules/ts/lines-between-class-members
   */
  'lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /**
   * Require a specific member delimiter style for interfaces and type literals
   * @see https://eslint.style/rules/ts/member-delimiter-style
   */
  'member-delimiter-style': MemberDelimiterStyleRuleOptions
  /**
   * Disallow unnecessary parentheses
   * @see https://eslint.style/rules/ts/no-extra-parens
   */
  'no-extra-parens': NoExtraParensRuleOptions
  /**
   * Disallow unnecessary semicolons
   * @see https://eslint.style/rules/ts/no-extra-semi
   */
  'no-extra-semi': NoExtraSemiRuleOptions
  /**
   * Enforce consistent line breaks after opening and before closing braces
   * @see https://eslint.style/rules/ts/object-curly-newline
   */
  'object-curly-newline': ObjectCurlyNewlineRuleOptions
  /**
   * Enforce consistent spacing inside braces
   * @see https://eslint.style/rules/ts/object-curly-spacing
   */
  'object-curly-spacing': ObjectCurlySpacingRuleOptions
  /**
   * Enforce placing object properties on separate lines
   * @see https://eslint.style/rules/ts/object-property-newline
   */
  'object-property-newline': ObjectPropertyNewlineRuleOptions
  /**
   * Require or disallow padding lines between statements
   * @see https://eslint.style/rules/ts/padding-line-between-statements
   */
  'padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /**
   * Require quotes around object literal, type literal, interfaces and enums property names
   * @see https://eslint.style/rules/ts/quote-props
   */
  'quote-props': QuotePropsRuleOptions
  /**
   * Enforce the consistent use of either backticks, double, or single quotes
   * @see https://eslint.style/rules/ts/quotes
   */
  'quotes': QuotesRuleOptions
  /**
   * Require or disallow semicolons instead of ASI
   * @see https://eslint.style/rules/ts/semi
   */
  'semi': SemiRuleOptions
  /**
   * Enforce consistent spacing before blocks
   * @see https://eslint.style/rules/ts/space-before-blocks
   */
  'space-before-blocks': SpaceBeforeBlocksRuleOptions
  /**
   * Enforce consistent spacing before function parenthesis
   * @see https://eslint.style/rules/ts/space-before-function-paren
   */
  'space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /**
   * Require spacing around infix operators
   * @see https://eslint.style/rules/ts/space-infix-ops
   */
  'space-infix-ops': SpaceInfixOpsRuleOptions
  /**
   * Require consistent spacing around type annotations
   * @see https://eslint.style/rules/ts/type-annotation-spacing
   */
  'type-annotation-spacing': TypeAnnotationSpacingRuleOptions
}
