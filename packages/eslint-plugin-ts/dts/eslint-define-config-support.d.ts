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
import type { RuleOptions as ObjectCurlySpacingRuleOptions } from '../rules/object-curly-spacing/types'
import type { RuleOptions as PaddingLineBetweenStatementsRuleOptions } from '../rules/padding-line-between-statements/types'
import type { RuleOptions as QuotesRuleOptions } from '../rules/quotes/types'
import type { RuleOptions as SemiRuleOptions } from '../rules/semi/types'
import type { RuleOptions as SpaceBeforeBlocksRuleOptions } from '../rules/space-before-blocks/types'
import type { RuleOptions as SpaceBeforeFunctionParenRuleOptions } from '../rules/space-before-function-paren/types'
import type { RuleOptions as SpaceInfixOpsRuleOptions } from '../rules/space-infix-ops/types'
import type { RuleOptions as TypeAnnotationSpacingRuleOptions } from '../rules/type-annotation-spacing/types'

declare module 'eslint-define-config' {
  export interface CustomRuleOptions {
    '@stylistic/ts/block-spacing': BlockSpacingRuleOptions
    '@stylistic/ts/brace-style': BraceStyleRuleOptions
    '@stylistic/ts/comma-dangle': CommaDangleRuleOptions
    '@stylistic/ts/comma-spacing': CommaSpacingRuleOptions
    '@stylistic/ts/func-call-spacing': FuncCallSpacingRuleOptions
    '@stylistic/ts/indent': IndentRuleOptions
    '@stylistic/ts/key-spacing': KeySpacingRuleOptions
    '@stylistic/ts/keyword-spacing': KeywordSpacingRuleOptions
    '@stylistic/ts/lines-around-comment': LinesAroundCommentRuleOptions
    '@stylistic/ts/lines-between-class-members': LinesBetweenClassMembersRuleOptions
    '@stylistic/ts/member-delimiter-style': MemberDelimiterStyleRuleOptions
    '@stylistic/ts/object-curly-spacing': ObjectCurlySpacingRuleOptions
    '@stylistic/ts/padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
    '@stylistic/ts/quotes': QuotesRuleOptions
    '@stylistic/ts/semi': SemiRuleOptions
    '@stylistic/ts/space-before-blocks': SpaceBeforeBlocksRuleOptions
    '@stylistic/ts/space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
    '@stylistic/ts/space-infix-ops': SpaceInfixOpsRuleOptions
    '@stylistic/ts/type-annotation-spacing': TypeAnnotationSpacingRuleOptions
  }
}

export {}
