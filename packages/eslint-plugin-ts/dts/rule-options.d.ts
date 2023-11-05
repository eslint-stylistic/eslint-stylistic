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
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/block-spacing block-spacing} rule.
   * This version adds support for TypeScript related blocks (interfaces, object type literals and enums).
   * @see {@link https://eslint.style/rules/ts/block-spacing}
   */
  '@stylistic/ts/block-spacing': BlockSpacingRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/brace-style brace-style} rule.
   * It adds support for enum, interface, namespace and module declarations.
   * @see {@link https://eslint.style/rules/ts/brace-style}
   */
  '@stylistic/ts/brace-style': BraceStyleRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/comma-dangle comma-dangle} rule.
   * It adds support for TypeScript syntax.
   * See the {@link https://eslint.org/docs/latest/rules/comma-dangle ESLint documentation} for more details on the comma-dangle rule.
   * @see {@link https://eslint.style/rules/ts/comma-dangle}
   */
  '@stylistic/ts/comma-dangle': CommaDangleRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/comma-spacing comma-spacing} rule.
   * It adds support for trailing comma in a types parameters list.
   * @see {@link https://eslint.style/rules/ts/comma-spacing}
   */
  '@stylistic/ts/comma-spacing': CommaSpacingRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/func-call-spacing func-call-spacing} rule.
   * It adds support for generic type parameters on function calls.
   * @see {@link https://eslint.style/rules/ts/func-call-spacing}
   */
  '@stylistic/ts/func-call-spacing': FuncCallSpacingRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/indent indent} rule. It adds support for TypeScript nodes.
   * Please read Issue {@link https://github.com/typescript-eslint/typescript-eslint/issues/1824 #1824: Problems with the indent rule} before using this rule!
   * @see {@link https://eslint.style/rules/ts/indent}
   */
  '@stylistic/ts/indent': IndentRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/key-spacing key-spacing} rule.
   * It adds support for type annotations on interfaces, classes and type literals properties.
   * @see {@link https://eslint.style/rules/ts/key-spacing}
   */
  '@stylistic/ts/key-spacing': KeySpacingRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/keyword-spacing keyword-spacing} rule.
   * It adds support for generic type parameters on function calls.
   * @see {@link https://eslint.style/rules/ts/keyword-spacing}
   */
  '@stylistic/ts/keyword-spacing': KeywordSpacingRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/lines-around-comment lines-around-comment} rule.
   * It adds support for TypeScript syntax.
   * See the {@link https://eslint.org/docs/latest/rules/lines-around-comment ESLint documentation} for more details on the lines-around-comment rule.
   * @see {@link https://eslint.style/rules/ts/lines-around-comment}
   */
  '@stylistic/ts/lines-around-comment': LinesAroundCommentRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/lines-between-class-members lines-between-class-members} rule.
   * It adds support for ignoring overload methods in a class.
   * @see {@link https://eslint.style/rules/ts/lines-between-class-members}
   */
  '@stylistic/ts/lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /**
   * This rule enforces keeping to one configurable code style. It can also standardize the presence (or absence) of a delimiter in the last member of a construct, as well as a separate delimiter syntax for single line declarations.
   * @see {@link https://eslint.style/rules/ts/member-delimiter-style}
   */
  '@stylistic/ts/member-delimiter-style': MemberDelimiterStyleRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/no-extra-parens no-extra-parens} rule.
   * It adds support for TypeScript type assertions.
   * @see {@link https://eslint.style/rules/ts/no-extra-parens}
   */
  '@stylistic/ts/no-extra-parens': NoExtraParensRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/no-extra-semi no-extra-semi }rule. It adds support for class properties.
   * @see {@link https://eslint.style/rules/ts/no-extra-semi}
   */
  '@stylistic/ts/no-extra-semi': NoExtraSemiRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/object-curly-spacing object-curly-spacing} rule.
   * It adds support for TypeScript's object types.
   * @see {@link https://eslint.style/rules/ts/object-curly-spacing}
   */
  '@stylistic/ts/object-curly-spacing': ObjectCurlySpacingRuleOptions
  /**
   * This rule extends the base
   * @see {@link https://eslint.style/rules/ts/padding-line-between-statements}
   */
  '@stylistic/ts/padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/padding-line-between-statements padding-line-between-statements} rule.
   * It adds support for TypeScript constructs such as interface and type.
   * @see {@link https://eslint.style/rules/ts/quotes}
   */
  '@stylistic/ts/quotes': QuotesRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/semi semi} rule.
   * It adds support for TypeScript features that require semicolons.
   * @see {@link https://eslint.style/rules/ts/semi}
   */
  '@stylistic/ts/semi': SemiRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/space-before-blocks space-before-blocks} rule.
   * It adds support for interfaces and enums.
   * @see {@link https://eslint.style/rules/ts/space-before-blocks}
   */
  '@stylistic/ts/space-before-blocks': SpaceBeforeBlocksRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/space-before-function-paren space-before-function-paren }rule.
   * It adds support for generic type parameters on function calls.
   * @see {@link https://eslint.style/rules/ts/space-before-function-paren}
   */
  '@stylistic/ts/space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /**
   * This rule extends the base {@link https://eslint.style/rules/js/space-infix-ops space-infix-ops} rule.
   * It adds support for enum members.
   * @see {@link https://eslint.style/rules/ts/space-infix-ops}
   */
  '@stylistic/ts/space-infix-ops': SpaceInfixOpsRuleOptions
  /**
   * This rule aims to enforce specific spacing patterns around type annotations and function types in type literals.
   * @see {@link https://eslint.style/rules/ts/type-annotation-spacing}
   */
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
