import type { RuleOptions as JsxChildElementSpacingRuleOptions } from '../rules/jsx-child-element-spacing/types'
import type { RuleOptions as JsxClosingBracketLocationRuleOptions } from '../rules/jsx-closing-bracket-location/types'
import type { RuleOptions as JsxClosingTagLocationRuleOptions } from '../rules/jsx-closing-tag-location/types'
import type { RuleOptions as JsxCurlyBracePresenceRuleOptions } from '../rules/jsx-curly-brace-presence/types'
import type { RuleOptions as JsxCurlyNewlineRuleOptions } from '../rules/jsx-curly-newline/types'
import type { RuleOptions as JsxCurlySpacingRuleOptions } from '../rules/jsx-curly-spacing/types'
import type { RuleOptions as JsxEqualsSpacingRuleOptions } from '../rules/jsx-equals-spacing/types'
import type { RuleOptions as JsxFirstPropNewLineRuleOptions } from '../rules/jsx-first-prop-new-line/types'
import type { RuleOptions as JsxIndentPropsRuleOptions } from '../rules/jsx-indent-props/types'
import type { RuleOptions as JsxIndentRuleOptions } from '../rules/jsx-indent/types'
import type { RuleOptions as JsxMaxPropsPerLineRuleOptions } from '../rules/jsx-max-props-per-line/types'
import type { RuleOptions as JsxNewlineRuleOptions } from '../rules/jsx-newline/types'
import type { RuleOptions as JsxOneExpressionPerLineRuleOptions } from '../rules/jsx-one-expression-per-line/types'
import type { RuleOptions as JsxPropsNoMultiSpacesRuleOptions } from '../rules/jsx-props-no-multi-spaces/types'
import type { RuleOptions as JsxSortPropsRuleOptions } from '../rules/jsx-sort-props/types'
import type { RuleOptions as JsxTagSpacingRuleOptions } from '../rules/jsx-tag-spacing/types'
import type { RuleOptions as JsxWrapMultilinesRuleOptions } from '../rules/jsx-wrap-multilines/types'
import type { RuleOptions as SelfClosingCompRuleOptions } from '../rules/self-closing-comp/types'

export interface RuleOptions {
  /** @see {@link https://eslint.style/rules/jsx/jsx-child-element-spacing} */
  '@stylistic/jsx/jsx-child-element-spacing': JsxChildElementSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-closing-bracket-location} */
  '@stylistic/jsx/jsx-closing-bracket-location': JsxClosingBracketLocationRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-closing-tag-location} */
  '@stylistic/jsx/jsx-closing-tag-location': JsxClosingTagLocationRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-curly-brace-presence} */
  '@stylistic/jsx/jsx-curly-brace-presence': JsxCurlyBracePresenceRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-curly-newline} */
  '@stylistic/jsx/jsx-curly-newline': JsxCurlyNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-curly-spacing} */
  '@stylistic/jsx/jsx-curly-spacing': JsxCurlySpacingRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-equals-spacing} */
  '@stylistic/jsx/jsx-equals-spacing': JsxEqualsSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-first-prop-new-line} */
  '@stylistic/jsx/jsx-first-prop-new-line': JsxFirstPropNewLineRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-indent-props} */
  '@stylistic/jsx/jsx-indent-props': JsxIndentPropsRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-indent} */
  '@stylistic/jsx/jsx-indent': JsxIndentRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-max-props-per-line} */
  '@stylistic/jsx/jsx-max-props-per-line': JsxMaxPropsPerLineRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-newline} */
  '@stylistic/jsx/jsx-newline': JsxNewlineRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-one-expression-per-line} */
  '@stylistic/jsx/jsx-one-expression-per-line': JsxOneExpressionPerLineRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-props-no-multi-spaces} */
  '@stylistic/jsx/jsx-props-no-multi-spaces': JsxPropsNoMultiSpacesRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-sort-props} */
  '@stylistic/jsx/jsx-sort-props': JsxSortPropsRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-tag-spacing} */
  '@stylistic/jsx/jsx-tag-spacing': JsxTagSpacingRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/jsx-wrap-multilines} */
  '@stylistic/jsx/jsx-wrap-multilines': JsxWrapMultilinesRuleOptions
  /** @see {@link https://eslint.style/rules/jsx/self-closing-comp} */
  '@stylistic/jsx/self-closing-comp': SelfClosingCompRuleOptions
}

export interface UnprefixedRuleOptions {
  'jsx-child-element-spacing': JsxChildElementSpacingRuleOptions
  'jsx-closing-bracket-location': JsxClosingBracketLocationRuleOptions
  'jsx-closing-tag-location': JsxClosingTagLocationRuleOptions
  'jsx-curly-brace-presence': JsxCurlyBracePresenceRuleOptions
  'jsx-curly-newline': JsxCurlyNewlineRuleOptions
  'jsx-curly-spacing': JsxCurlySpacingRuleOptions
  'jsx-equals-spacing': JsxEqualsSpacingRuleOptions
  'jsx-first-prop-new-line': JsxFirstPropNewLineRuleOptions
  'jsx-indent-props': JsxIndentPropsRuleOptions
  'jsx-indent': JsxIndentRuleOptions
  'jsx-max-props-per-line': JsxMaxPropsPerLineRuleOptions
  'jsx-newline': JsxNewlineRuleOptions
  'jsx-one-expression-per-line': JsxOneExpressionPerLineRuleOptions
  'jsx-props-no-multi-spaces': JsxPropsNoMultiSpacesRuleOptions
  'jsx-sort-props': JsxSortPropsRuleOptions
  'jsx-tag-spacing': JsxTagSpacingRuleOptions
  'jsx-wrap-multilines': JsxWrapMultilinesRuleOptions
  'self-closing-comp': SelfClosingCompRuleOptions
}
