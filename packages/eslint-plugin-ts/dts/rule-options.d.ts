import type { RuleOptions as BlockSpacingRuleOptions } from '../rules/block-spacing/types'
import type { RuleOptions as BraceStyleRuleOptions } from '../rules/brace-style/types'
import type { RuleOptions as CommaDangleRuleOptions } from '../rules/comma-dangle/types'
import type { RuleOptions as CommaSpacingRuleOptions } from '../rules/comma-spacing/types'
import type { RuleOptions as FuncCallSpacingRuleOptions } from '../rules/func-call-spacing/types'
import type { RuleOptions as IndentRuleOptions } from '../rules/indent/types'
import type { RuleOptions as KeySpacingRuleOptions } from '../rules/key-spacing/types'
import type { RuleOptions as KeywordSpacingRuleOptions } from '../rules/keyword-spacing/types'
import type { RuleOptions as LinesAroundCommentRuleOptions } from '../rules/lines-around-comment/types'
import type { RuleOptions as LinesBetweenClassMembersRuleOptions } from '../rules/lines-between-class-members/types'
import type { RuleOptions as MemberDelimiterStyleRuleOptions } from '../rules/member-delimiter-style/types'
import type { RuleOptions as NoExtraParensRuleOptions } from '../rules/no-extra-parens/types'
import type { RuleOptions as NoExtraSemiRuleOptions } from '../rules/no-extra-semi/types'
import type { RuleOptions as ObjectCurlySpacingRuleOptions } from '../rules/object-curly-spacing/types'
import type { RuleOptions as PaddingLineBetweenStatementsRuleOptions } from '../rules/padding-line-between-statements/types'
import type { RuleOptions as QuotesRuleOptions } from '../rules/quotes/types'
import type { RuleOptions as SemiRuleOptions } from '../rules/semi/types'
import type { RuleOptions as SpaceBeforeBlocksRuleOptions } from '../rules/space-before-blocks/types'
import type { RuleOptions as SpaceBeforeFunctionParenRuleOptions } from '../rules/space-before-function-paren/types'
import type { RuleOptions as SpaceInfixOpsRuleOptions } from '../rules/space-infix-ops/types'
import type { RuleOptions as TypeAnnotationSpacingRuleOptions } from '../rules/type-annotation-spacing/types'

export interface RuleOptions {
  /** @see {@link https://eslint.style/rules/ts/block-spacing} */
  '@stylistic/ts/block-spacing': BlockSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/ts/brace-style} */
  '@stylistic/ts/brace-style': BraceStyleRuleOptions
  /** @see {@link https://eslint.style/rules/ts/comma-dangle} */
  '@stylistic/ts/comma-dangle': CommaDangleRuleOptions
  /** @see {@link https://eslint.style/rules/ts/comma-spacing} */
  '@stylistic/ts/comma-spacing': CommaSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/ts/func-call-spacing} */
  '@stylistic/ts/func-call-spacing': FuncCallSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/ts/indent} */
  '@stylistic/ts/indent': IndentRuleOptions
  /** @see {@link https://eslint.style/rules/ts/key-spacing} */
  '@stylistic/ts/key-spacing': KeySpacingRuleOptions
  /** @see {@link https://eslint.style/rules/ts/keyword-spacing} */
  '@stylistic/ts/keyword-spacing': KeywordSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/ts/lines-around-comment} */
  '@stylistic/ts/lines-around-comment': LinesAroundCommentRuleOptions
  /** @see {@link https://eslint.style/rules/ts/lines-between-class-members} */
  '@stylistic/ts/lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /** @see {@link https://eslint.style/rules/ts/member-delimiter-style} */
  '@stylistic/ts/member-delimiter-style': MemberDelimiterStyleRuleOptions
  /** @see {@link https://eslint.style/rules/ts/no-extra-parens} */
  '@stylistic/ts/no-extra-parens': NoExtraParensRuleOptions
  /** @see {@link https://eslint.style/rules/ts/no-extra-semi} */
  '@stylistic/ts/no-extra-semi': NoExtraSemiRuleOptions
  /** @see {@link https://eslint.style/rules/ts/object-curly-spacing} */
  '@stylistic/ts/object-curly-spacing': ObjectCurlySpacingRuleOptions
  /** @see {@link https://eslint.style/rules/ts/padding-line-between-statements} */
  '@stylistic/ts/padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /** @see {@link https://eslint.style/rules/ts/quotes} */
  '@stylistic/ts/quotes': QuotesRuleOptions
  /** @see {@link https://eslint.style/rules/ts/semi} */
  '@stylistic/ts/semi': SemiRuleOptions
  /** @see {@link https://eslint.style/rules/ts/space-before-blocks} */
  '@stylistic/ts/space-before-blocks': SpaceBeforeBlocksRuleOptions
  /** @see {@link https://eslint.style/rules/ts/space-before-function-paren} */
  '@stylistic/ts/space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /** @see {@link https://eslint.style/rules/ts/space-infix-ops} */
  '@stylistic/ts/space-infix-ops': SpaceInfixOpsRuleOptions
  /** @see {@link https://eslint.style/rules/ts/type-annotation-spacing} */
  '@stylistic/ts/type-annotation-spacing': TypeAnnotationSpacingRuleOptions
}

export interface UnprefixedRuleOptions {
  'block-spacing': BlockSpacingRuleOptions
  'brace-style': BraceStyleRuleOptions
  'comma-dangle': CommaDangleRuleOptions
  'comma-spacing': CommaSpacingRuleOptions
  'func-call-spacing': FuncCallSpacingRuleOptions
  'indent': IndentRuleOptions
  'key-spacing': KeySpacingRuleOptions
  'keyword-spacing': KeywordSpacingRuleOptions
  'lines-around-comment': LinesAroundCommentRuleOptions
  'lines-between-class-members': LinesBetweenClassMembersRuleOptions
  'member-delimiter-style': MemberDelimiterStyleRuleOptions
  'no-extra-parens': NoExtraParensRuleOptions
  'no-extra-semi': NoExtraSemiRuleOptions
  'object-curly-spacing': ObjectCurlySpacingRuleOptions
  'padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  'quotes': QuotesRuleOptions
  'semi': SemiRuleOptions
  'space-before-blocks': SpaceBeforeBlocksRuleOptions
  'space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  'space-infix-ops': SpaceInfixOpsRuleOptions
  'type-annotation-spacing': TypeAnnotationSpacingRuleOptions
}
