/* GENERATED, DO NOT EDIT DIRECTLY */

import type { RuleOptions as JsxChildElementSpacingRuleOptions } from '../rules/jsx-child-element-spacing/types'
import type { RuleOptions as JsxClosingBracketLocationRuleOptions } from '../rules/jsx-closing-bracket-location/types'
import type { RuleOptions as JsxClosingTagLocationRuleOptions } from '../rules/jsx-closing-tag-location/types'
import type { RuleOptions as JsxCurlyBracePresenceRuleOptions } from '../rules/jsx-curly-brace-presence/types'
import type { RuleOptions as JsxCurlyNewlineRuleOptions } from '../rules/jsx-curly-newline/types'
import type { RuleOptions as JsxCurlySpacingRuleOptions } from '../rules/jsx-curly-spacing/types'
import type { RuleOptions as JsxEqualsSpacingRuleOptions } from '../rules/jsx-equals-spacing/types'
import type { RuleOptions as JsxFirstPropNewLineRuleOptions } from '../rules/jsx-first-prop-new-line/types'
import type { RuleOptions as JsxFunctionCallNewlineRuleOptions } from '../rules/jsx-function-call-newline/types'
import type { RuleOptions as JsxIndentRuleOptions } from '../rules/jsx-indent/types'
import type { RuleOptions as JsxIndentPropsRuleOptions } from '../rules/jsx-indent-props/types'
import type { RuleOptions as JsxMaxPropsPerLineRuleOptions } from '../rules/jsx-max-props-per-line/types'
import type { RuleOptions as JsxNewlineRuleOptions } from '../rules/jsx-newline/types'
import type { RuleOptions as JsxOneExpressionPerLineRuleOptions } from '../rules/jsx-one-expression-per-line/types'
import type { RuleOptions as JsxPascalCaseRuleOptions } from '../rules/jsx-pascal-case/types'
import type { RuleOptions as JsxPropsNoMultiSpacesRuleOptions } from '../rules/jsx-props-no-multi-spaces/types'
import type { RuleOptions as JsxSelfClosingCompRuleOptions } from '../rules/jsx-self-closing-comp/types'
import type { RuleOptions as JsxSortPropsRuleOptions } from '../rules/jsx-sort-props/types'
import type { RuleOptions as JsxTagSpacingRuleOptions } from '../rules/jsx-tag-spacing/types'
import type { RuleOptions as JsxWrapMultilinesRuleOptions } from '../rules/jsx-wrap-multilines/types'

export interface RuleOptions {
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
   * @see https://eslint.style/rules/jsx/jsx-child-element-spacing
   */
  '@stylistic/jsx/jsx-child-element-spacing': JsxChildElementSpacingRuleOptions
  /**
   * Enforce closing bracket location in JSX
   * @see https://eslint.style/rules/jsx/jsx-closing-bracket-location
   */
  '@stylistic/jsx/jsx-closing-bracket-location': JsxClosingBracketLocationRuleOptions
  /**
   * Enforce closing tag location for multiline JSX
   * @see https://eslint.style/rules/jsx/jsx-closing-tag-location
   */
  '@stylistic/jsx/jsx-closing-tag-location': JsxClosingTagLocationRuleOptions
  /**
   * Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes
   * @see https://eslint.style/rules/jsx/jsx-curly-brace-presence
   */
  '@stylistic/jsx/jsx-curly-brace-presence': JsxCurlyBracePresenceRuleOptions
  /**
   * Enforce consistent linebreaks in curly braces in JSX attributes and expressions
   * @see https://eslint.style/rules/jsx/jsx-curly-newline
   */
  '@stylistic/jsx/jsx-curly-newline': JsxCurlyNewlineRuleOptions
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
   * @see https://eslint.style/rules/jsx/jsx-curly-spacing
   */
  '@stylistic/jsx/jsx-curly-spacing': JsxCurlySpacingRuleOptions
  /**
   * Enforce or disallow spaces around equal signs in JSX attributes
   * @see https://eslint.style/rules/jsx/jsx-equals-spacing
   */
  '@stylistic/jsx/jsx-equals-spacing': JsxEqualsSpacingRuleOptions
  /**
   * Enforce proper position of the first property in JSX
   * @see https://eslint.style/rules/jsx/jsx-first-prop-new-line
   */
  '@stylistic/jsx/jsx-first-prop-new-line': JsxFirstPropNewLineRuleOptions
  /**
   * Enforce line breaks before and after JSX elements when they are used as arguments to a function.
   * @see https://eslint.style/rules/jsx/jsx-function-call-newline
   */
  '@stylistic/jsx/jsx-function-call-newline': JsxFunctionCallNewlineRuleOptions
  /**
   * Enforce JSX indentation
   * @see https://eslint.style/rules/jsx/jsx-indent
   */
  '@stylistic/jsx/jsx-indent': JsxIndentRuleOptions
  /**
   * Enforce props indentation in JSX
   * @see https://eslint.style/rules/jsx/jsx-indent-props
   */
  '@stylistic/jsx/jsx-indent-props': JsxIndentPropsRuleOptions
  /**
   * Enforce maximum of props on a single line in JSX
   * @see https://eslint.style/rules/jsx/jsx-max-props-per-line
   */
  '@stylistic/jsx/jsx-max-props-per-line': JsxMaxPropsPerLineRuleOptions
  /**
   * Require or prevent a new line after jsx elements and expressions.
   * @see https://eslint.style/rules/jsx/jsx-newline
   */
  '@stylistic/jsx/jsx-newline': JsxNewlineRuleOptions
  /**
   * Require one JSX element per line
   * @see https://eslint.style/rules/jsx/jsx-one-expression-per-line
   */
  '@stylistic/jsx/jsx-one-expression-per-line': JsxOneExpressionPerLineRuleOptions
  /**
   * Enforce PascalCase for user-defined JSX components
   * @see https://eslint.style/rules/jsx/jsx-pascal-case
   */
  '@stylistic/jsx/jsx-pascal-case': JsxPascalCaseRuleOptions
  /**
   * Disallow multiple spaces between inline JSX props
   * @see https://eslint.style/rules/jsx/jsx-props-no-multi-spaces
   */
  '@stylistic/jsx/jsx-props-no-multi-spaces': JsxPropsNoMultiSpacesRuleOptions
  /**
   * Disallow extra closing tags for components without children
   * @see https://eslint.style/rules/jsx/jsx-self-closing-comp
   */
  '@stylistic/jsx/jsx-self-closing-comp': JsxSelfClosingCompRuleOptions
  /**
   * Enforce props alphabetical sorting
   * @see https://eslint.style/rules/jsx/jsx-sort-props
   */
  '@stylistic/jsx/jsx-sort-props': JsxSortPropsRuleOptions
  /**
   * Enforce whitespace in and around the JSX opening and closing brackets
   * @see https://eslint.style/rules/jsx/jsx-tag-spacing
   */
  '@stylistic/jsx/jsx-tag-spacing': JsxTagSpacingRuleOptions
  /**
   * Disallow missing parentheses around multiline JSX
   * @see https://eslint.style/rules/jsx/jsx-wrap-multilines
   */
  '@stylistic/jsx/jsx-wrap-multilines': JsxWrapMultilinesRuleOptions
}

export interface UnprefixedRuleOptions {
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
   * @see https://eslint.style/rules/jsx/jsx-child-element-spacing
   */
  'jsx-child-element-spacing': JsxChildElementSpacingRuleOptions
  /**
   * Enforce closing bracket location in JSX
   * @see https://eslint.style/rules/jsx/jsx-closing-bracket-location
   */
  'jsx-closing-bracket-location': JsxClosingBracketLocationRuleOptions
  /**
   * Enforce closing tag location for multiline JSX
   * @see https://eslint.style/rules/jsx/jsx-closing-tag-location
   */
  'jsx-closing-tag-location': JsxClosingTagLocationRuleOptions
  /**
   * Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes
   * @see https://eslint.style/rules/jsx/jsx-curly-brace-presence
   */
  'jsx-curly-brace-presence': JsxCurlyBracePresenceRuleOptions
  /**
   * Enforce consistent linebreaks in curly braces in JSX attributes and expressions
   * @see https://eslint.style/rules/jsx/jsx-curly-newline
   */
  'jsx-curly-newline': JsxCurlyNewlineRuleOptions
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
   * @see https://eslint.style/rules/jsx/jsx-curly-spacing
   */
  'jsx-curly-spacing': JsxCurlySpacingRuleOptions
  /**
   * Enforce or disallow spaces around equal signs in JSX attributes
   * @see https://eslint.style/rules/jsx/jsx-equals-spacing
   */
  'jsx-equals-spacing': JsxEqualsSpacingRuleOptions
  /**
   * Enforce proper position of the first property in JSX
   * @see https://eslint.style/rules/jsx/jsx-first-prop-new-line
   */
  'jsx-first-prop-new-line': JsxFirstPropNewLineRuleOptions
  /**
   * Enforce line breaks before and after JSX elements when they are used as arguments to a function.
   * @see https://eslint.style/rules/jsx/jsx-function-call-newline
   */
  'jsx-function-call-newline': JsxFunctionCallNewlineRuleOptions
  /**
   * Enforce JSX indentation
   * @see https://eslint.style/rules/jsx/jsx-indent
   */
  'jsx-indent': JsxIndentRuleOptions
  /**
   * Enforce props indentation in JSX
   * @see https://eslint.style/rules/jsx/jsx-indent-props
   */
  'jsx-indent-props': JsxIndentPropsRuleOptions
  /**
   * Enforce maximum of props on a single line in JSX
   * @see https://eslint.style/rules/jsx/jsx-max-props-per-line
   */
  'jsx-max-props-per-line': JsxMaxPropsPerLineRuleOptions
  /**
   * Require or prevent a new line after jsx elements and expressions.
   * @see https://eslint.style/rules/jsx/jsx-newline
   */
  'jsx-newline': JsxNewlineRuleOptions
  /**
   * Require one JSX element per line
   * @see https://eslint.style/rules/jsx/jsx-one-expression-per-line
   */
  'jsx-one-expression-per-line': JsxOneExpressionPerLineRuleOptions
  /**
   * Enforce PascalCase for user-defined JSX components
   * @see https://eslint.style/rules/jsx/jsx-pascal-case
   */
  'jsx-pascal-case': JsxPascalCaseRuleOptions
  /**
   * Disallow multiple spaces between inline JSX props
   * @see https://eslint.style/rules/jsx/jsx-props-no-multi-spaces
   */
  'jsx-props-no-multi-spaces': JsxPropsNoMultiSpacesRuleOptions
  /**
   * Disallow extra closing tags for components without children
   * @see https://eslint.style/rules/jsx/jsx-self-closing-comp
   */
  'jsx-self-closing-comp': JsxSelfClosingCompRuleOptions
  /**
   * Enforce props alphabetical sorting
   * @see https://eslint.style/rules/jsx/jsx-sort-props
   */
  'jsx-sort-props': JsxSortPropsRuleOptions
  /**
   * Enforce whitespace in and around the JSX opening and closing brackets
   * @see https://eslint.style/rules/jsx/jsx-tag-spacing
   */
  'jsx-tag-spacing': JsxTagSpacingRuleOptions
  /**
   * Disallow missing parentheses around multiline JSX
   * @see https://eslint.style/rules/jsx/jsx-wrap-multilines
   */
  'jsx-wrap-multilines': JsxWrapMultilinesRuleOptions
}
