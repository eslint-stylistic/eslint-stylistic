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
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions.
   * @see {@link https://eslint.style/rules/jsx/jsx-child-element-spacing}
   */
  '@stylistic/jsx/jsx-child-element-spacing': JsxChildElementSpacingRuleOptions
  /**
   * Enforce the closing bracket location for JSX multiline elements.
   * @see {@link https://eslint.style/rules/jsx/jsx-closing-bracket-location}
   */
  '@stylistic/jsx/jsx-closing-bracket-location': JsxClosingBracketLocationRuleOptions
  /**
   * Enforce the closing tag location for multiline JSX elements.
   * For situations where JSX expressions are unnecessary, please refer to the {@link https://legacy.reactjs.org/docs/jsx-in-depth.html React doc} and {@link https://github.com/facebook/react/blob/v15.4.0-rc.3/docs/docs/02.3-jsx-gotchas.md#html-entities this page about JSX gotchas}.
   * @see {@link https://eslint.style/rules/jsx/jsx-closing-tag-location}
   */
  '@stylistic/jsx/jsx-closing-tag-location': JsxClosingTagLocationRuleOptions
  /**
   * Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes.
   * For situations where JSX expressions are unnecessary, please refer to the {@link https://legacy.reactjs.org/docs/jsx-in-depth.html React doc} and {@link https://github.com/facebook/react/blob/v15.4.0-rc.3/docs/docs/02.3-jsx-gotchas.md#html-entities this page about JSX gotchas}.
   * @see {@link https://eslint.style/rules/jsx/jsx-curly-brace-presence}
   */
  '@stylistic/jsx/jsx-curly-brace-presence': JsxCurlyBracePresenceRuleOptions
  /**
   * Enforce consistent linebreaks in curly braces in JSX attributes and expressions.
   * @see {@link https://eslint.style/rules/jsx/jsx-curly-newline}
   */
  '@stylistic/jsx/jsx-curly-newline': JsxCurlyNewlineRuleOptions
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions.
   * @see {@link https://eslint.style/rules/jsx/jsx-curly-spacing}
   */
  '@stylistic/jsx/jsx-curly-spacing': JsxCurlySpacingRuleOptions
  /**
   * Enforce or disallow spaces around equal signs in JSX attributes.
   * @see {@link https://eslint.style/rules/jsx/jsx-equals-spacing}
   */
  '@stylistic/jsx/jsx-equals-spacing': JsxEqualsSpacingRuleOptions
  /**
   * Enforce proper position of the first property in JSX.
   * @see {@link https://eslint.style/rules/jsx/jsx-first-prop-new-line}
   */
  '@stylistic/jsx/jsx-first-prop-new-line': JsxFirstPropNewLineRuleOptions
  /**
   * Enforce props indentation in JSX.
   * @see {@link https://eslint.style/rules/jsx/jsx-indent-props}
   */
  '@stylistic/jsx/jsx-indent-props': JsxIndentPropsRuleOptions
  /**
   * Enforce JSX indentation.
   * Note: The fixer will fix whitespace and tabs indentation.
   * @see {@link https://eslint.style/rules/jsx/jsx-indent}
   */
  '@stylistic/jsx/jsx-indent': JsxIndentRuleOptions
  /**
   * Enforce maximum of props on a single line in JSX.
   * @see {@link https://eslint.style/rules/jsx/jsx-max-props-per-line}
   */
  '@stylistic/jsx/jsx-max-props-per-line': JsxMaxPropsPerLineRuleOptions
  /**
   * Require or prevent a new line after jsx elements and expressions
   * @see {@link https://eslint.style/rules/jsx/jsx-newline}
   */
  '@stylistic/jsx/jsx-newline': JsxNewlineRuleOptions
  /**
   * Require one JSX element per line.
   * Note: The fixer will insert line breaks between any expression that are on the same line.
   * @see {@link https://eslint.style/rules/jsx/jsx-one-expression-per-line}
   */
  '@stylistic/jsx/jsx-one-expression-per-line': JsxOneExpressionPerLineRuleOptions
  /**
   * Disallow multiple spaces between inline JSX props.
   * Enforces that there is exactly one space between all attributes and after tag name and the first attribute in the same line.
   * @see {@link https://eslint.style/rules/jsx/jsx-props-no-multi-spaces}
   */
  '@stylistic/jsx/jsx-props-no-multi-spaces': JsxPropsNoMultiSpacesRuleOptions
  /**
   * Enforce props alphabetical sorting.
   * @see {@link https://eslint.style/rules/jsx/jsx-sort-props}
   */
  '@stylistic/jsx/jsx-sort-props': JsxSortPropsRuleOptions
  /**
   * Enforce whitespace in and around the JSX opening and closing brackets.
   * Enforce or forbid spaces after the opening bracket, before the closing bracket, before the closing bracket of self-closing elements, and between the angle bracket and slash of JSX closing or self-closing elements.
   * @see {@link https://eslint.style/rules/jsx/jsx-tag-spacing}
   */
  '@stylistic/jsx/jsx-tag-spacing': JsxTagSpacingRuleOptions
  /**
   * Disallow missing parentheses around multiline JSX.
   * Wrapping multiline JSX in parentheses can improve readability and/or convenience.
   * @see {@link https://eslint.style/rules/jsx/jsx-wrap-multilines}
   */
  '@stylistic/jsx/jsx-wrap-multilines': JsxWrapMultilinesRuleOptions
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
