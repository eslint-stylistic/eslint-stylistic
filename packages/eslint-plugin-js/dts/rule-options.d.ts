/* GENERATED, DO NOT EDIT DIRECTLY */

import type { ArrayBracketNewlineRuleOptions } from '../rules/array-bracket-newline/types'
import type { ArrayBracketSpacingRuleOptions } from '../rules/array-bracket-spacing/types'
import type { ArrayElementNewlineRuleOptions } from '../rules/array-element-newline/types'
import type { ArrowParensRuleOptions } from '../rules/arrow-parens/types'
import type { ArrowSpacingRuleOptions } from '../rules/arrow-spacing/types'
import type { BlockSpacingRuleOptions } from '../rules/block-spacing/types'
import type { BraceStyleRuleOptions } from '../rules/brace-style/types'
import type { CommaDangleRuleOptions } from '../rules/comma-dangle/types'
import type { CommaSpacingRuleOptions } from '../rules/comma-spacing/types'
import type { CommaStyleRuleOptions } from '../rules/comma-style/types'
import type { ComputedPropertySpacingRuleOptions } from '../rules/computed-property-spacing/types'
import type { DotLocationRuleOptions } from '../rules/dot-location/types'
import type { EolLastRuleOptions } from '../rules/eol-last/types'
import type { FunctionCallArgumentNewlineRuleOptions } from '../rules/function-call-argument-newline/types'
import type { FunctionCallSpacingRuleOptions } from '../rules/function-call-spacing/types'
import type { FunctionParenNewlineRuleOptions } from '../rules/function-paren-newline/types'
import type { GeneratorStarSpacingRuleOptions } from '../rules/generator-star-spacing/types'
import type { ImplicitArrowLinebreakRuleOptions } from '../rules/implicit-arrow-linebreak/types'
import type { IndentRuleOptions } from '../rules/indent/types'
import type { JsxQuotesRuleOptions } from '../rules/jsx-quotes/types'
import type { KeySpacingRuleOptions } from '../rules/key-spacing/types'
import type { KeywordSpacingRuleOptions } from '../rules/keyword-spacing/types'
import type { LineCommentPositionRuleOptions } from '../rules/line-comment-position/types'
import type { LinebreakStyleRuleOptions } from '../rules/linebreak-style/types'
import type { LinesAroundCommentRuleOptions } from '../rules/lines-around-comment/types'
import type { LinesBetweenClassMembersRuleOptions } from '../rules/lines-between-class-members/types'
import type { MaxLenRuleOptions } from '../rules/max-len/types'
import type { MaxStatementsPerLineRuleOptions } from '../rules/max-statements-per-line/types'
import type { MultilineCommentStyleRuleOptions } from '../rules/multiline-comment-style/types'
import type { MultilineTernaryRuleOptions } from '../rules/multiline-ternary/types'
import type { NewParensRuleOptions } from '../rules/new-parens/types'
import type { NewlinePerChainedCallRuleOptions } from '../rules/newline-per-chained-call/types'
import type { NoConfusingArrowRuleOptions } from '../rules/no-confusing-arrow/types'
import type { NoExtraParensRuleOptions } from '../rules/no-extra-parens/types'
import type { NoExtraSemiRuleOptions } from '../rules/no-extra-semi/types'
import type { NoFloatingDecimalRuleOptions } from '../rules/no-floating-decimal/types'
import type { NoMixedOperatorsRuleOptions } from '../rules/no-mixed-operators/types'
import type { NoMixedSpacesAndTabsRuleOptions } from '../rules/no-mixed-spaces-and-tabs/types'
import type { NoMultiSpacesRuleOptions } from '../rules/no-multi-spaces/types'
import type { NoMultipleEmptyLinesRuleOptions } from '../rules/no-multiple-empty-lines/types'
import type { NoTabsRuleOptions } from '../rules/no-tabs/types'
import type { NoTrailingSpacesRuleOptions } from '../rules/no-trailing-spaces/types'
import type { NoWhitespaceBeforePropertyRuleOptions } from '../rules/no-whitespace-before-property/types'
import type { NonblockStatementBodyPositionRuleOptions } from '../rules/nonblock-statement-body-position/types'
import type { ObjectCurlyNewlineRuleOptions } from '../rules/object-curly-newline/types'
import type { ObjectCurlySpacingRuleOptions } from '../rules/object-curly-spacing/types'
import type { ObjectPropertyNewlineRuleOptions } from '../rules/object-property-newline/types'
import type { OneVarDeclarationPerLineRuleOptions } from '../rules/one-var-declaration-per-line/types'
import type { OperatorLinebreakRuleOptions } from '../rules/operator-linebreak/types'
import type { PaddedBlocksRuleOptions } from '../rules/padded-blocks/types'
import type { PaddingLineBetweenStatementsRuleOptions } from '../rules/padding-line-between-statements/types'
import type { QuotePropsRuleOptions } from '../rules/quote-props/types'
import type { QuotesRuleOptions } from '../rules/quotes/types'
import type { RestSpreadSpacingRuleOptions } from '../rules/rest-spread-spacing/types'
import type { SemiRuleOptions } from '../rules/semi/types'
import type { SemiSpacingRuleOptions } from '../rules/semi-spacing/types'
import type { SemiStyleRuleOptions } from '../rules/semi-style/types'
import type { SpaceBeforeBlocksRuleOptions } from '../rules/space-before-blocks/types'
import type { SpaceBeforeFunctionParenRuleOptions } from '../rules/space-before-function-paren/types'
import type { SpaceInParensRuleOptions } from '../rules/space-in-parens/types'
import type { SpaceInfixOpsRuleOptions } from '../rules/space-infix-ops/types'
import type { SpaceUnaryOpsRuleOptions } from '../rules/space-unary-ops/types'
import type { SpacedCommentRuleOptions } from '../rules/spaced-comment/types'
import type { SwitchColonSpacingRuleOptions } from '../rules/switch-colon-spacing/types'
import type { TemplateCurlySpacingRuleOptions } from '../rules/template-curly-spacing/types'
import type { TemplateTagSpacingRuleOptions } from '../rules/template-tag-spacing/types'
import type { WrapIifeRuleOptions } from '../rules/wrap-iife/types'
import type { WrapRegexRuleOptions } from '../rules/wrap-regex/types'
import type { YieldStarSpacingRuleOptions } from '../rules/yield-star-spacing/types'

export interface RuleOptions {
  /**
   * Enforce linebreaks after opening and before closing array brackets
   * @see https://eslint.style/rules/js/array-bracket-newline
   */
  '@stylistic/js/array-bracket-newline': ArrayBracketNewlineRuleOptions
  /**
   * Enforce consistent spacing inside array brackets
   * @see https://eslint.style/rules/js/array-bracket-spacing
   */
  '@stylistic/js/array-bracket-spacing': ArrayBracketSpacingRuleOptions
  /**
   * Enforce line breaks after each array element
   * @see https://eslint.style/rules/js/array-element-newline
   */
  '@stylistic/js/array-element-newline': ArrayElementNewlineRuleOptions
  /**
   * Require parentheses around arrow function arguments
   * @see https://eslint.style/rules/js/arrow-parens
   */
  '@stylistic/js/arrow-parens': ArrowParensRuleOptions
  /**
   * Enforce consistent spacing before and after the arrow in arrow functions
   * @see https://eslint.style/rules/js/arrow-spacing
   */
  '@stylistic/js/arrow-spacing': ArrowSpacingRuleOptions
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
   * Enforce consistent comma style
   * @see https://eslint.style/rules/js/comma-style
   */
  '@stylistic/js/comma-style': CommaStyleRuleOptions
  /**
   * Enforce consistent spacing inside computed property brackets
   * @see https://eslint.style/rules/js/computed-property-spacing
   */
  '@stylistic/js/computed-property-spacing': ComputedPropertySpacingRuleOptions
  /**
   * Enforce consistent newlines before and after dots
   * @see https://eslint.style/rules/js/dot-location
   */
  '@stylistic/js/dot-location': DotLocationRuleOptions
  /**
   * Require or disallow newline at the end of files
   * @see https://eslint.style/rules/js/eol-last
   */
  '@stylistic/js/eol-last': EolLastRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  '@stylistic/js/func-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce line breaks between arguments of a function call
   * @see https://eslint.style/rules/js/function-call-argument-newline
   */
  '@stylistic/js/function-call-argument-newline': FunctionCallArgumentNewlineRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  '@stylistic/js/function-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce consistent line breaks inside function parentheses
   * @see https://eslint.style/rules/js/function-paren-newline
   */
  '@stylistic/js/function-paren-newline': FunctionParenNewlineRuleOptions
  /**
   * Enforce consistent spacing around `*` operators in generator functions
   * @see https://eslint.style/rules/js/generator-star-spacing
   */
  '@stylistic/js/generator-star-spacing': GeneratorStarSpacingRuleOptions
  /**
   * Enforce the location of arrow function bodies
   * @see https://eslint.style/rules/js/implicit-arrow-linebreak
   */
  '@stylistic/js/implicit-arrow-linebreak': ImplicitArrowLinebreakRuleOptions
  /**
   * Enforce consistent indentation
   * @see https://eslint.style/rules/js/indent
   */
  '@stylistic/js/indent': IndentRuleOptions
  /**
   * Enforce the consistent use of either double or single quotes in JSX attributes
   * @see https://eslint.style/rules/js/jsx-quotes
   */
  '@stylistic/js/jsx-quotes': JsxQuotesRuleOptions
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
   * Enforce position of line comments
   * @see https://eslint.style/rules/js/line-comment-position
   */
  '@stylistic/js/line-comment-position': LineCommentPositionRuleOptions
  /**
   * Enforce consistent linebreak style
   * @see https://eslint.style/rules/js/linebreak-style
   */
  '@stylistic/js/linebreak-style': LinebreakStyleRuleOptions
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
   * Enforce a maximum line length
   * @see https://eslint.style/rules/js/max-len
   */
  '@stylistic/js/max-len': MaxLenRuleOptions
  /**
   * Enforce a maximum number of statements allowed per line
   * @see https://eslint.style/rules/js/max-statements-per-line
   */
  '@stylistic/js/max-statements-per-line': MaxStatementsPerLineRuleOptions
  /**
   * Enforce a particular style for multiline comments
   * @see https://eslint.style/rules/js/multiline-comment-style
   */
  '@stylistic/js/multiline-comment-style': MultilineCommentStyleRuleOptions
  /**
   * Enforce newlines between operands of ternary expressions
   * @see https://eslint.style/rules/js/multiline-ternary
   */
  '@stylistic/js/multiline-ternary': MultilineTernaryRuleOptions
  /**
   * Enforce or disallow parentheses when invoking a constructor with no arguments
   * @see https://eslint.style/rules/js/new-parens
   */
  '@stylistic/js/new-parens': NewParensRuleOptions
  /**
   * Require a newline after each call in a method chain
   * @see https://eslint.style/rules/js/newline-per-chained-call
   */
  '@stylistic/js/newline-per-chained-call': NewlinePerChainedCallRuleOptions
  /**
   * Disallow arrow functions where they could be confused with comparisons
   * @see https://eslint.style/rules/js/no-confusing-arrow
   */
  '@stylistic/js/no-confusing-arrow': NoConfusingArrowRuleOptions
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
   * Disallow leading or trailing decimal points in numeric literals
   * @see https://eslint.style/rules/js/no-floating-decimal
   */
  '@stylistic/js/no-floating-decimal': NoFloatingDecimalRuleOptions
  /**
   * Disallow mixed binary operators
   * @see https://eslint.style/rules/js/no-mixed-operators
   */
  '@stylistic/js/no-mixed-operators': NoMixedOperatorsRuleOptions
  /**
   * Disallow mixed spaces and tabs for indentation
   * @see https://eslint.style/rules/js/no-mixed-spaces-and-tabs
   */
  '@stylistic/js/no-mixed-spaces-and-tabs': NoMixedSpacesAndTabsRuleOptions
  /**
   * Disallow multiple spaces
   * @see https://eslint.style/rules/js/no-multi-spaces
   */
  '@stylistic/js/no-multi-spaces': NoMultiSpacesRuleOptions
  /**
   * Disallow multiple empty lines
   * @see https://eslint.style/rules/js/no-multiple-empty-lines
   */
  '@stylistic/js/no-multiple-empty-lines': NoMultipleEmptyLinesRuleOptions
  /**
   * Disallow all tabs
   * @see https://eslint.style/rules/js/no-tabs
   */
  '@stylistic/js/no-tabs': NoTabsRuleOptions
  /**
   * Disallow trailing whitespace at the end of lines
   * @see https://eslint.style/rules/js/no-trailing-spaces
   */
  '@stylistic/js/no-trailing-spaces': NoTrailingSpacesRuleOptions
  /**
   * Disallow whitespace before properties
   * @see https://eslint.style/rules/js/no-whitespace-before-property
   */
  '@stylistic/js/no-whitespace-before-property': NoWhitespaceBeforePropertyRuleOptions
  /**
   * Enforce the location of single-line statements
   * @see https://eslint.style/rules/js/nonblock-statement-body-position
   */
  '@stylistic/js/nonblock-statement-body-position': NonblockStatementBodyPositionRuleOptions
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
   * Require or disallow newlines around variable declarations
   * @see https://eslint.style/rules/js/one-var-declaration-per-line
   */
  '@stylistic/js/one-var-declaration-per-line': OneVarDeclarationPerLineRuleOptions
  /**
   * Enforce consistent linebreak style for operators
   * @see https://eslint.style/rules/js/operator-linebreak
   */
  '@stylistic/js/operator-linebreak': OperatorLinebreakRuleOptions
  /**
   * Require or disallow padding within blocks
   * @see https://eslint.style/rules/js/padded-blocks
   */
  '@stylistic/js/padded-blocks': PaddedBlocksRuleOptions
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
   * Enforce spacing between rest and spread operators and their expressions
   * @see https://eslint.style/rules/js/rest-spread-spacing
   */
  '@stylistic/js/rest-spread-spacing': RestSpreadSpacingRuleOptions
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
   * Enforce location of semicolons
   * @see https://eslint.style/rules/js/semi-style
   */
  '@stylistic/js/semi-style': SemiStyleRuleOptions
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
   * Enforce consistent spacing inside parentheses
   * @see https://eslint.style/rules/js/space-in-parens
   */
  '@stylistic/js/space-in-parens': SpaceInParensRuleOptions
  /**
   * Require spacing around infix operators
   * @see https://eslint.style/rules/js/space-infix-ops
   */
  '@stylistic/js/space-infix-ops': SpaceInfixOpsRuleOptions
  /**
   * Enforce consistent spacing before or after unary operators
   * @see https://eslint.style/rules/js/space-unary-ops
   */
  '@stylistic/js/space-unary-ops': SpaceUnaryOpsRuleOptions
  /**
   * Enforce consistent spacing after the `//` or `/*` in a comment
   * @see https://eslint.style/rules/js/spaced-comment
   */
  '@stylistic/js/spaced-comment': SpacedCommentRuleOptions
  /**
   * Enforce spacing around colons of switch statements
   * @see https://eslint.style/rules/js/switch-colon-spacing
   */
  '@stylistic/js/switch-colon-spacing': SwitchColonSpacingRuleOptions
  /**
   * Require or disallow spacing around embedded expressions of template strings
   * @see https://eslint.style/rules/js/template-curly-spacing
   */
  '@stylistic/js/template-curly-spacing': TemplateCurlySpacingRuleOptions
  /**
   * Require or disallow spacing between template tags and their literals
   * @see https://eslint.style/rules/js/template-tag-spacing
   */
  '@stylistic/js/template-tag-spacing': TemplateTagSpacingRuleOptions
  /**
   * Require parentheses around immediate `function` invocations
   * @see https://eslint.style/rules/js/wrap-iife
   */
  '@stylistic/js/wrap-iife': WrapIifeRuleOptions
  /**
   * Require parenthesis around regex literals
   * @see https://eslint.style/rules/js/wrap-regex
   */
  '@stylistic/js/wrap-regex': WrapRegexRuleOptions
  /**
   * Require or disallow spacing around the `*` in `yield*` expressions
   * @see https://eslint.style/rules/js/yield-star-spacing
   */
  '@stylistic/js/yield-star-spacing': YieldStarSpacingRuleOptions
}

export interface UnprefixedRuleOptions {
  /**
   * Enforce linebreaks after opening and before closing array brackets
   * @see https://eslint.style/rules/js/array-bracket-newline
   */
  'array-bracket-newline': ArrayBracketNewlineRuleOptions
  /**
   * Enforce consistent spacing inside array brackets
   * @see https://eslint.style/rules/js/array-bracket-spacing
   */
  'array-bracket-spacing': ArrayBracketSpacingRuleOptions
  /**
   * Enforce line breaks after each array element
   * @see https://eslint.style/rules/js/array-element-newline
   */
  'array-element-newline': ArrayElementNewlineRuleOptions
  /**
   * Require parentheses around arrow function arguments
   * @see https://eslint.style/rules/js/arrow-parens
   */
  'arrow-parens': ArrowParensRuleOptions
  /**
   * Enforce consistent spacing before and after the arrow in arrow functions
   * @see https://eslint.style/rules/js/arrow-spacing
   */
  'arrow-spacing': ArrowSpacingRuleOptions
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
   * Enforce consistent comma style
   * @see https://eslint.style/rules/js/comma-style
   */
  'comma-style': CommaStyleRuleOptions
  /**
   * Enforce consistent spacing inside computed property brackets
   * @see https://eslint.style/rules/js/computed-property-spacing
   */
  'computed-property-spacing': ComputedPropertySpacingRuleOptions
  /**
   * Enforce consistent newlines before and after dots
   * @see https://eslint.style/rules/js/dot-location
   */
  'dot-location': DotLocationRuleOptions
  /**
   * Require or disallow newline at the end of files
   * @see https://eslint.style/rules/js/eol-last
   */
  'eol-last': EolLastRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  'func-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce line breaks between arguments of a function call
   * @see https://eslint.style/rules/js/function-call-argument-newline
   */
  'function-call-argument-newline': FunctionCallArgumentNewlineRuleOptions
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://eslint.style/rules/js/function-call-spacing
   */
  'function-call-spacing': FunctionCallSpacingRuleOptions
  /**
   * Enforce consistent line breaks inside function parentheses
   * @see https://eslint.style/rules/js/function-paren-newline
   */
  'function-paren-newline': FunctionParenNewlineRuleOptions
  /**
   * Enforce consistent spacing around `*` operators in generator functions
   * @see https://eslint.style/rules/js/generator-star-spacing
   */
  'generator-star-spacing': GeneratorStarSpacingRuleOptions
  /**
   * Enforce the location of arrow function bodies
   * @see https://eslint.style/rules/js/implicit-arrow-linebreak
   */
  'implicit-arrow-linebreak': ImplicitArrowLinebreakRuleOptions
  /**
   * Enforce consistent indentation
   * @see https://eslint.style/rules/js/indent
   */
  'indent': IndentRuleOptions
  /**
   * Enforce the consistent use of either double or single quotes in JSX attributes
   * @see https://eslint.style/rules/js/jsx-quotes
   */
  'jsx-quotes': JsxQuotesRuleOptions
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
   * Enforce position of line comments
   * @see https://eslint.style/rules/js/line-comment-position
   */
  'line-comment-position': LineCommentPositionRuleOptions
  /**
   * Enforce consistent linebreak style
   * @see https://eslint.style/rules/js/linebreak-style
   */
  'linebreak-style': LinebreakStyleRuleOptions
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
   * Enforce a maximum line length
   * @see https://eslint.style/rules/js/max-len
   */
  'max-len': MaxLenRuleOptions
  /**
   * Enforce a maximum number of statements allowed per line
   * @see https://eslint.style/rules/js/max-statements-per-line
   */
  'max-statements-per-line': MaxStatementsPerLineRuleOptions
  /**
   * Enforce a particular style for multiline comments
   * @see https://eslint.style/rules/js/multiline-comment-style
   */
  'multiline-comment-style': MultilineCommentStyleRuleOptions
  /**
   * Enforce newlines between operands of ternary expressions
   * @see https://eslint.style/rules/js/multiline-ternary
   */
  'multiline-ternary': MultilineTernaryRuleOptions
  /**
   * Enforce or disallow parentheses when invoking a constructor with no arguments
   * @see https://eslint.style/rules/js/new-parens
   */
  'new-parens': NewParensRuleOptions
  /**
   * Require a newline after each call in a method chain
   * @see https://eslint.style/rules/js/newline-per-chained-call
   */
  'newline-per-chained-call': NewlinePerChainedCallRuleOptions
  /**
   * Disallow arrow functions where they could be confused with comparisons
   * @see https://eslint.style/rules/js/no-confusing-arrow
   */
  'no-confusing-arrow': NoConfusingArrowRuleOptions
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
   * Disallow leading or trailing decimal points in numeric literals
   * @see https://eslint.style/rules/js/no-floating-decimal
   */
  'no-floating-decimal': NoFloatingDecimalRuleOptions
  /**
   * Disallow mixed binary operators
   * @see https://eslint.style/rules/js/no-mixed-operators
   */
  'no-mixed-operators': NoMixedOperatorsRuleOptions
  /**
   * Disallow mixed spaces and tabs for indentation
   * @see https://eslint.style/rules/js/no-mixed-spaces-and-tabs
   */
  'no-mixed-spaces-and-tabs': NoMixedSpacesAndTabsRuleOptions
  /**
   * Disallow multiple spaces
   * @see https://eslint.style/rules/js/no-multi-spaces
   */
  'no-multi-spaces': NoMultiSpacesRuleOptions
  /**
   * Disallow multiple empty lines
   * @see https://eslint.style/rules/js/no-multiple-empty-lines
   */
  'no-multiple-empty-lines': NoMultipleEmptyLinesRuleOptions
  /**
   * Disallow all tabs
   * @see https://eslint.style/rules/js/no-tabs
   */
  'no-tabs': NoTabsRuleOptions
  /**
   * Disallow trailing whitespace at the end of lines
   * @see https://eslint.style/rules/js/no-trailing-spaces
   */
  'no-trailing-spaces': NoTrailingSpacesRuleOptions
  /**
   * Disallow whitespace before properties
   * @see https://eslint.style/rules/js/no-whitespace-before-property
   */
  'no-whitespace-before-property': NoWhitespaceBeforePropertyRuleOptions
  /**
   * Enforce the location of single-line statements
   * @see https://eslint.style/rules/js/nonblock-statement-body-position
   */
  'nonblock-statement-body-position': NonblockStatementBodyPositionRuleOptions
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
   * Require or disallow newlines around variable declarations
   * @see https://eslint.style/rules/js/one-var-declaration-per-line
   */
  'one-var-declaration-per-line': OneVarDeclarationPerLineRuleOptions
  /**
   * Enforce consistent linebreak style for operators
   * @see https://eslint.style/rules/js/operator-linebreak
   */
  'operator-linebreak': OperatorLinebreakRuleOptions
  /**
   * Require or disallow padding within blocks
   * @see https://eslint.style/rules/js/padded-blocks
   */
  'padded-blocks': PaddedBlocksRuleOptions
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
   * Enforce spacing between rest and spread operators and their expressions
   * @see https://eslint.style/rules/js/rest-spread-spacing
   */
  'rest-spread-spacing': RestSpreadSpacingRuleOptions
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
   * Enforce location of semicolons
   * @see https://eslint.style/rules/js/semi-style
   */
  'semi-style': SemiStyleRuleOptions
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
   * Enforce consistent spacing inside parentheses
   * @see https://eslint.style/rules/js/space-in-parens
   */
  'space-in-parens': SpaceInParensRuleOptions
  /**
   * Require spacing around infix operators
   * @see https://eslint.style/rules/js/space-infix-ops
   */
  'space-infix-ops': SpaceInfixOpsRuleOptions
  /**
   * Enforce consistent spacing before or after unary operators
   * @see https://eslint.style/rules/js/space-unary-ops
   */
  'space-unary-ops': SpaceUnaryOpsRuleOptions
  /**
   * Enforce consistent spacing after the `//` or `/*` in a comment
   * @see https://eslint.style/rules/js/spaced-comment
   */
  'spaced-comment': SpacedCommentRuleOptions
  /**
   * Enforce spacing around colons of switch statements
   * @see https://eslint.style/rules/js/switch-colon-spacing
   */
  'switch-colon-spacing': SwitchColonSpacingRuleOptions
  /**
   * Require or disallow spacing around embedded expressions of template strings
   * @see https://eslint.style/rules/js/template-curly-spacing
   */
  'template-curly-spacing': TemplateCurlySpacingRuleOptions
  /**
   * Require or disallow spacing between template tags and their literals
   * @see https://eslint.style/rules/js/template-tag-spacing
   */
  'template-tag-spacing': TemplateTagSpacingRuleOptions
  /**
   * Require parentheses around immediate `function` invocations
   * @see https://eslint.style/rules/js/wrap-iife
   */
  'wrap-iife': WrapIifeRuleOptions
  /**
   * Require parenthesis around regex literals
   * @see https://eslint.style/rules/js/wrap-regex
   */
  'wrap-regex': WrapRegexRuleOptions
  /**
   * Require or disallow spacing around the `*` in `yield*` expressions
   * @see https://eslint.style/rules/js/yield-star-spacing
   */
  'yield-star-spacing': YieldStarSpacingRuleOptions
}
