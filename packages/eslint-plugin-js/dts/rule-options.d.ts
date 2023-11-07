import type { RuleOptions as ArrayBracketNewlineRuleOptions } from '../rules/array-bracket-newline/types'
import type { RuleOptions as ArrayBracketSpacingRuleOptions } from '../rules/array-bracket-spacing/types'
import type { RuleOptions as ArrayElementNewlineRuleOptions } from '../rules/array-element-newline/types'
import type { RuleOptions as ArrowParensRuleOptions } from '../rules/arrow-parens/types'
import type { RuleOptions as ArrowSpacingRuleOptions } from '../rules/arrow-spacing/types'
import type { RuleOptions as BlockSpacingRuleOptions } from '../rules/block-spacing/types'
import type { RuleOptions as BraceStyleRuleOptions } from '../rules/brace-style/types'
import type { RuleOptions as CommaDangleRuleOptions } from '../rules/comma-dangle/types'
import type { RuleOptions as CommaSpacingRuleOptions } from '../rules/comma-spacing/types'
import type { RuleOptions as CommaStyleRuleOptions } from '../rules/comma-style/types'
import type { RuleOptions as ComputedPropertySpacingRuleOptions } from '../rules/computed-property-spacing/types'
import type { RuleOptions as DotLocationRuleOptions } from '../rules/dot-location/types'
import type { RuleOptions as EolLastRuleOptions } from '../rules/eol-last/types'
import type { RuleOptions as FuncCallSpacingRuleOptions } from '../rules/func-call-spacing/types'
import type { RuleOptions as FunctionCallArgumentNewlineRuleOptions } from '../rules/function-call-argument-newline/types'
import type { RuleOptions as FunctionParenNewlineRuleOptions } from '../rules/function-paren-newline/types'
import type { RuleOptions as GeneratorStarSpacingRuleOptions } from '../rules/generator-star-spacing/types'
import type { RuleOptions as ImplicitArrowLinebreakRuleOptions } from '../rules/implicit-arrow-linebreak/types'
import type { RuleOptions as IndentRuleOptions } from '../rules/indent/types'
import type { RuleOptions as JsxQuotesRuleOptions } from '../rules/jsx-quotes/types'
import type { RuleOptions as KeySpacingRuleOptions } from '../rules/key-spacing/types'
import type { RuleOptions as KeywordSpacingRuleOptions } from '../rules/keyword-spacing/types'
import type { RuleOptions as LinebreakStyleRuleOptions } from '../rules/linebreak-style/types'
import type { RuleOptions as LinesAroundCommentRuleOptions } from '../rules/lines-around-comment/types'
import type { RuleOptions as LinesBetweenClassMembersRuleOptions } from '../rules/lines-between-class-members/types'
import type { RuleOptions as MaxLenRuleOptions } from '../rules/max-len/types'
import type { RuleOptions as MaxStatementsPerLineRuleOptions } from '../rules/max-statements-per-line/types'
import type { RuleOptions as MultilineTernaryRuleOptions } from '../rules/multiline-ternary/types'
import type { RuleOptions as NewParensRuleOptions } from '../rules/new-parens/types'
import type { RuleOptions as NewlinePerChainedCallRuleOptions } from '../rules/newline-per-chained-call/types'
import type { RuleOptions as NoConfusingArrowRuleOptions } from '../rules/no-confusing-arrow/types'
import type { RuleOptions as NoExtraParensRuleOptions } from '../rules/no-extra-parens/types'
import type { RuleOptions as NoExtraSemiRuleOptions } from '../rules/no-extra-semi/types'
import type { RuleOptions as NoFloatingDecimalRuleOptions } from '../rules/no-floating-decimal/types'
import type { RuleOptions as NoMixedOperatorsRuleOptions } from '../rules/no-mixed-operators/types'
import type { RuleOptions as NoMixedSpacesAndTabsRuleOptions } from '../rules/no-mixed-spaces-and-tabs/types'
import type { RuleOptions as NoMultiSpacesRuleOptions } from '../rules/no-multi-spaces/types'
import type { RuleOptions as NoMultipleEmptyLinesRuleOptions } from '../rules/no-multiple-empty-lines/types'
import type { RuleOptions as NoTabsRuleOptions } from '../rules/no-tabs/types'
import type { RuleOptions as NoTrailingSpacesRuleOptions } from '../rules/no-trailing-spaces/types'
import type { RuleOptions as NoWhitespaceBeforePropertyRuleOptions } from '../rules/no-whitespace-before-property/types'
import type { RuleOptions as NonblockStatementBodyPositionRuleOptions } from '../rules/nonblock-statement-body-position/types'
import type { RuleOptions as ObjectCurlyNewlineRuleOptions } from '../rules/object-curly-newline/types'
import type { RuleOptions as ObjectCurlySpacingRuleOptions } from '../rules/object-curly-spacing/types'
import type { RuleOptions as ObjectPropertyNewlineRuleOptions } from '../rules/object-property-newline/types'
import type { RuleOptions as OneVarDeclarationPerLineRuleOptions } from '../rules/one-var-declaration-per-line/types'
import type { RuleOptions as OperatorLinebreakRuleOptions } from '../rules/operator-linebreak/types'
import type { RuleOptions as PaddedBlocksRuleOptions } from '../rules/padded-blocks/types'
import type { RuleOptions as PaddingLineBetweenStatementsRuleOptions } from '../rules/padding-line-between-statements/types'
import type { RuleOptions as QuotePropsRuleOptions } from '../rules/quote-props/types'
import type { RuleOptions as QuotesRuleOptions } from '../rules/quotes/types'
import type { RuleOptions as RestSpreadSpacingRuleOptions } from '../rules/rest-spread-spacing/types'
import type { RuleOptions as SemiSpacingRuleOptions } from '../rules/semi-spacing/types'
import type { RuleOptions as SemiStyleRuleOptions } from '../rules/semi-style/types'
import type { RuleOptions as SemiRuleOptions } from '../rules/semi/types'
import type { RuleOptions as SpaceBeforeBlocksRuleOptions } from '../rules/space-before-blocks/types'
import type { RuleOptions as SpaceBeforeFunctionParenRuleOptions } from '../rules/space-before-function-paren/types'
import type { RuleOptions as SpaceInParensRuleOptions } from '../rules/space-in-parens/types'
import type { RuleOptions as SpaceInfixOpsRuleOptions } from '../rules/space-infix-ops/types'
import type { RuleOptions as SpaceUnaryOpsRuleOptions } from '../rules/space-unary-ops/types'
import type { RuleOptions as SpacedCommentRuleOptions } from '../rules/spaced-comment/types'
import type { RuleOptions as SwitchColonSpacingRuleOptions } from '../rules/switch-colon-spacing/types'
import type { RuleOptions as TemplateCurlySpacingRuleOptions } from '../rules/template-curly-spacing/types'
import type { RuleOptions as TemplateTagSpacingRuleOptions } from '../rules/template-tag-spacing/types'
import type { RuleOptions as WrapIifeRuleOptions } from '../rules/wrap-iife/types'
import type { RuleOptions as WrapRegexRuleOptions } from '../rules/wrap-regex/types'
import type { RuleOptions as YieldStarSpacingRuleOptions } from '../rules/yield-star-spacing/types'

export interface RuleOptions {
  /** @see {@link https://eslint.style/rules/js/array-bracket-newline} */
  '@stylistic/js/array-bracket-newline': ArrayBracketNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/js/array-bracket-spacing} */
  '@stylistic/js/array-bracket-spacing': ArrayBracketSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/array-element-newline} */
  '@stylistic/js/array-element-newline': ArrayElementNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/js/arrow-parens} */
  '@stylistic/js/arrow-parens': ArrowParensRuleOptions
  /** @see {@link https://eslint.style/rules/js/arrow-spacing} */
  '@stylistic/js/arrow-spacing': ArrowSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/block-spacing} */
  '@stylistic/js/block-spacing': BlockSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/brace-style} */
  '@stylistic/js/brace-style': BraceStyleRuleOptions
  /** @see {@link https://eslint.style/rules/js/comma-dangle} */
  '@stylistic/js/comma-dangle': CommaDangleRuleOptions
  /** @see {@link https://eslint.style/rules/js/comma-spacing} */
  '@stylistic/js/comma-spacing': CommaSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/comma-style} */
  '@stylistic/js/comma-style': CommaStyleRuleOptions
  /** @see {@link https://eslint.style/rules/js/computed-property-spacing} */
  '@stylistic/js/computed-property-spacing': ComputedPropertySpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/dot-location} */
  '@stylistic/js/dot-location': DotLocationRuleOptions
  /** @see {@link https://eslint.style/rules/js/eol-last} */
  '@stylistic/js/eol-last': EolLastRuleOptions
  /** @see {@link https://eslint.style/rules/js/func-call-spacing} */
  '@stylistic/js/func-call-spacing': FuncCallSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/function-call-argument-newline} */
  '@stylistic/js/function-call-argument-newline': FunctionCallArgumentNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/js/function-paren-newline} */
  '@stylistic/js/function-paren-newline': FunctionParenNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/js/generator-star-spacing} */
  '@stylistic/js/generator-star-spacing': GeneratorStarSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/implicit-arrow-linebreak} */
  '@stylistic/js/implicit-arrow-linebreak': ImplicitArrowLinebreakRuleOptions
  /** @see {@link https://eslint.style/rules/js/indent} */
  '@stylistic/js/indent': IndentRuleOptions
  /** @see {@link https://eslint.style/rules/js/jsx-quotes} */
  '@stylistic/js/jsx-quotes': JsxQuotesRuleOptions
  /** @see {@link https://eslint.style/rules/js/key-spacing} */
  '@stylistic/js/key-spacing': KeySpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/keyword-spacing} */
  '@stylistic/js/keyword-spacing': KeywordSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/linebreak-style} */
  '@stylistic/js/linebreak-style': LinebreakStyleRuleOptions
  /** @see {@link https://eslint.style/rules/js/lines-around-comment} */
  '@stylistic/js/lines-around-comment': LinesAroundCommentRuleOptions
  /** @see {@link https://eslint.style/rules/js/lines-between-class-members} */
  '@stylistic/js/lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /** @see {@link https://eslint.style/rules/js/max-len} */
  '@stylistic/js/max-len': MaxLenRuleOptions
  /** @see {@link https://eslint.style/rules/js/max-statements-per-line} */
  '@stylistic/js/max-statements-per-line': MaxStatementsPerLineRuleOptions
  /** @see {@link https://eslint.style/rules/js/multiline-ternary} */
  '@stylistic/js/multiline-ternary': MultilineTernaryRuleOptions
  /** @see {@link https://eslint.style/rules/js/new-parens} */
  '@stylistic/js/new-parens': NewParensRuleOptions
  /** @see {@link https://eslint.style/rules/js/newline-per-chained-call} */
  '@stylistic/js/newline-per-chained-call': NewlinePerChainedCallRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-confusing-arrow} */
  '@stylistic/js/no-confusing-arrow': NoConfusingArrowRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-extra-parens} */
  '@stylistic/js/no-extra-parens': NoExtraParensRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-extra-semi} */
  '@stylistic/js/no-extra-semi': NoExtraSemiRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-floating-decimal} */
  '@stylistic/js/no-floating-decimal': NoFloatingDecimalRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-mixed-operators} */
  '@stylistic/js/no-mixed-operators': NoMixedOperatorsRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-mixed-spaces-and-tabs} */
  '@stylistic/js/no-mixed-spaces-and-tabs': NoMixedSpacesAndTabsRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-multi-spaces} */
  '@stylistic/js/no-multi-spaces': NoMultiSpacesRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-multiple-empty-lines} */
  '@stylistic/js/no-multiple-empty-lines': NoMultipleEmptyLinesRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-tabs} */
  '@stylistic/js/no-tabs': NoTabsRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-trailing-spaces} */
  '@stylistic/js/no-trailing-spaces': NoTrailingSpacesRuleOptions
  /** @see {@link https://eslint.style/rules/js/no-whitespace-before-property} */
  '@stylistic/js/no-whitespace-before-property': NoWhitespaceBeforePropertyRuleOptions
  /** @see {@link https://eslint.style/rules/js/nonblock-statement-body-position} */
  '@stylistic/js/nonblock-statement-body-position': NonblockStatementBodyPositionRuleOptions
  /** @see {@link https://eslint.style/rules/js/object-curly-newline} */
  '@stylistic/js/object-curly-newline': ObjectCurlyNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/js/object-curly-spacing} */
  '@stylistic/js/object-curly-spacing': ObjectCurlySpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/object-property-newline} */
  '@stylistic/js/object-property-newline': ObjectPropertyNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/js/one-var-declaration-per-line} */
  '@stylistic/js/one-var-declaration-per-line': OneVarDeclarationPerLineRuleOptions
  /** @see {@link https://eslint.style/rules/js/operator-linebreak} */
  '@stylistic/js/operator-linebreak': OperatorLinebreakRuleOptions
  /** @see {@link https://eslint.style/rules/js/padded-blocks} */
  '@stylistic/js/padded-blocks': PaddedBlocksRuleOptions
  /** @see {@link https://eslint.style/rules/js/padding-line-between-statements} */
  '@stylistic/js/padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /** @see {@link https://eslint.style/rules/js/quote-props} */
  '@stylistic/js/quote-props': QuotePropsRuleOptions
  /** @see {@link https://eslint.style/rules/js/quotes} */
  '@stylistic/js/quotes': QuotesRuleOptions
  /** @see {@link https://eslint.style/rules/js/rest-spread-spacing} */
  '@stylistic/js/rest-spread-spacing': RestSpreadSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/semi-spacing} */
  '@stylistic/js/semi-spacing': SemiSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/semi-style} */
  '@stylistic/js/semi-style': SemiStyleRuleOptions
  /** @see {@link https://eslint.style/rules/js/semi} */
  '@stylistic/js/semi': SemiRuleOptions
  /** @see {@link https://eslint.style/rules/js/space-before-blocks} */
  '@stylistic/js/space-before-blocks': SpaceBeforeBlocksRuleOptions
  /** @see {@link https://eslint.style/rules/js/space-before-function-paren} */
  '@stylistic/js/space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /** @see {@link https://eslint.style/rules/js/space-in-parens} */
  '@stylistic/js/space-in-parens': SpaceInParensRuleOptions
  /** @see {@link https://eslint.style/rules/js/space-infix-ops} */
  '@stylistic/js/space-infix-ops': SpaceInfixOpsRuleOptions
  /** @see {@link https://eslint.style/rules/js/space-unary-ops} */
  '@stylistic/js/space-unary-ops': SpaceUnaryOpsRuleOptions
  /** @see {@link https://eslint.style/rules/js/spaced-comment} */
  '@stylistic/js/spaced-comment': SpacedCommentRuleOptions
  /** @see {@link https://eslint.style/rules/js/switch-colon-spacing} */
  '@stylistic/js/switch-colon-spacing': SwitchColonSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/template-curly-spacing} */
  '@stylistic/js/template-curly-spacing': TemplateCurlySpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/template-tag-spacing} */
  '@stylistic/js/template-tag-spacing': TemplateTagSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/js/wrap-iife} */
  '@stylistic/js/wrap-iife': WrapIifeRuleOptions
  /** @see {@link https://eslint.style/rules/js/wrap-regex} */
  '@stylistic/js/wrap-regex': WrapRegexRuleOptions
  /** @see {@link https://eslint.style/rules/js/yield-star-spacing} */
  '@stylistic/js/yield-star-spacing': YieldStarSpacingRuleOptions
}

export interface UnprefixedRuleOptions {
  'array-bracket-newline': ArrayBracketNewlineRuleOptions
  'array-bracket-spacing': ArrayBracketSpacingRuleOptions
  'array-element-newline': ArrayElementNewlineRuleOptions
  'arrow-parens': ArrowParensRuleOptions
  'arrow-spacing': ArrowSpacingRuleOptions
  'block-spacing': BlockSpacingRuleOptions
  'brace-style': BraceStyleRuleOptions
  'comma-dangle': CommaDangleRuleOptions
  'comma-spacing': CommaSpacingRuleOptions
  'comma-style': CommaStyleRuleOptions
  'computed-property-spacing': ComputedPropertySpacingRuleOptions
  'dot-location': DotLocationRuleOptions
  'eol-last': EolLastRuleOptions
  'func-call-spacing': FuncCallSpacingRuleOptions
  'function-call-argument-newline': FunctionCallArgumentNewlineRuleOptions
  'function-paren-newline': FunctionParenNewlineRuleOptions
  'generator-star-spacing': GeneratorStarSpacingRuleOptions
  'implicit-arrow-linebreak': ImplicitArrowLinebreakRuleOptions
  'indent': IndentRuleOptions
  'jsx-quotes': JsxQuotesRuleOptions
  'key-spacing': KeySpacingRuleOptions
  'keyword-spacing': KeywordSpacingRuleOptions
  'linebreak-style': LinebreakStyleRuleOptions
  'lines-around-comment': LinesAroundCommentRuleOptions
  'lines-between-class-members': LinesBetweenClassMembersRuleOptions
  'max-len': MaxLenRuleOptions
  'max-statements-per-line': MaxStatementsPerLineRuleOptions
  'multiline-ternary': MultilineTernaryRuleOptions
  'new-parens': NewParensRuleOptions
  'newline-per-chained-call': NewlinePerChainedCallRuleOptions
  'no-confusing-arrow': NoConfusingArrowRuleOptions
  'no-extra-parens': NoExtraParensRuleOptions
  'no-extra-semi': NoExtraSemiRuleOptions
  'no-floating-decimal': NoFloatingDecimalRuleOptions
  'no-mixed-operators': NoMixedOperatorsRuleOptions
  'no-mixed-spaces-and-tabs': NoMixedSpacesAndTabsRuleOptions
  'no-multi-spaces': NoMultiSpacesRuleOptions
  'no-multiple-empty-lines': NoMultipleEmptyLinesRuleOptions
  'no-tabs': NoTabsRuleOptions
  'no-trailing-spaces': NoTrailingSpacesRuleOptions
  'no-whitespace-before-property': NoWhitespaceBeforePropertyRuleOptions
  'nonblock-statement-body-position': NonblockStatementBodyPositionRuleOptions
  'object-curly-newline': ObjectCurlyNewlineRuleOptions
  'object-curly-spacing': ObjectCurlySpacingRuleOptions
  'object-property-newline': ObjectPropertyNewlineRuleOptions
  'one-var-declaration-per-line': OneVarDeclarationPerLineRuleOptions
  'operator-linebreak': OperatorLinebreakRuleOptions
  'padded-blocks': PaddedBlocksRuleOptions
  'padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  'quote-props': QuotePropsRuleOptions
  'quotes': QuotesRuleOptions
  'rest-spread-spacing': RestSpreadSpacingRuleOptions
  'semi-spacing': SemiSpacingRuleOptions
  'semi-style': SemiStyleRuleOptions
  'semi': SemiRuleOptions
  'space-before-blocks': SpaceBeforeBlocksRuleOptions
  'space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  'space-in-parens': SpaceInParensRuleOptions
  'space-infix-ops': SpaceInfixOpsRuleOptions
  'space-unary-ops': SpaceUnaryOpsRuleOptions
  'spaced-comment': SpacedCommentRuleOptions
  'switch-colon-spacing': SwitchColonSpacingRuleOptions
  'template-curly-spacing': TemplateCurlySpacingRuleOptions
  'template-tag-spacing': TemplateTagSpacingRuleOptions
  'wrap-iife': WrapIifeRuleOptions
  'wrap-regex': WrapRegexRuleOptions
  'yield-star-spacing': YieldStarSpacingRuleOptions
}
