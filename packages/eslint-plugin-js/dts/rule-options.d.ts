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
  /**
   * This rule enforces line breaks after opening and before closing array brackets.
   * @see {@link https://eslint.style/rules/js/array-bracket-newline}
   */
  '@stylistic/js/array-bracket-newline': ArrayBracketNewlineRuleOptions
  /**
   * This rule enforces consistent spacing inside array brackets.
   * @see {@link https://eslint.style/rules/js/array-bracket-spacing}
   */
  '@stylistic/js/array-bracket-spacing': ArrayBracketSpacingRuleOptions
  /**
   * This rule enforces line breaks between array elements.
   * @see {@link https://eslint.style/rules/js/array-element-newline}
   */
  '@stylistic/js/array-element-newline': ArrayElementNewlineRuleOptions
  /**
   * This rule enforces parentheses around arrow function parameters regardless of arity.
   * @see {@link https://eslint.style/rules/js/arrow-parens}
   */
  '@stylistic/js/arrow-parens': ArrowParensRuleOptions
  /**
   * This rule normalize style of spacing before/after an arrow function's arrow(=>)
   * @see {@link https://eslint.style/rules/js/arrow-spacing}
   */
  '@stylistic/js/arrow-spacing': ArrowSpacingRuleOptions
  /**
   * This rule enforces consistent spacing inside an open block token and the next token on the same line.
   * This rule also enforces consistent spacing inside a close block token and previous token on the same line.
   * @see {@link https://eslint.style/rules/js/block-spacing}
   */
  '@stylistic/js/block-spacing': BlockSpacingRuleOptions
  /**
   * This rule enforces consistent brace style for blocks.
   * @see {@link https://eslint.style/rules/js/brace-style}
   */
  '@stylistic/js/brace-style': BraceStyleRuleOptions
  /**
   * This rule enforces consistent use of trailing commas in object and array literals.
   * @see {@link https://eslint.style/rules/js/comma-dangle}
   */
  '@stylistic/js/comma-dangle': CommaDangleRuleOptions
  /**
   * This rule enforces consistent spacing before and after commas in variable declarations, array literals, object literals, function parameters, and sequences.
   * @see {@link https://eslint.style/rules/js/comma-spacing}
   */
  '@stylistic/js/comma-spacing': CommaSpacingRuleOptions
  /**
   * The Comma Style rule enforces styles for comma-separated lists. There are two comma styles primarily used in JavaScript:
   * @see {@link https://eslint.style/rules/js/comma-style}
   */
  '@stylistic/js/comma-style': CommaStyleRuleOptions
  /**
   * This rule enforce consistent comma style in array literals, object literals, and variable declarations.
   * @see {@link https://eslint.style/rules/js/computed-property-spacing}
   */
  '@stylistic/js/computed-property-spacing': ComputedPropertySpacingRuleOptions
  /**
   * This rule aims to enforce newline consistency in member expressions.
   * This rule prevents the use of mixed newlines around the dot in a member expression.
   * @see {@link https://eslint.style/rules/js/dot-location}
   */
  '@stylistic/js/dot-location': DotLocationRuleOptions
  /**
   * This rule enforces at least one newline (or absence thereof) at the end of non-empty files.
   * @see {@link https://eslint.style/rules/js/eol-last}
   */
  '@stylistic/js/eol-last': EolLastRuleOptions
  /**
   * This rule requires or disallows spaces between the function name and the opening parenthesis that calls it.
   * @see {@link https://eslint.style/rules/js/func-call-spacing}
   */
  '@stylistic/js/func-call-spacing': FuncCallSpacingRuleOptions
  /**
   * This rule enforces line breaks between arguments of a function call.
   * @see {@link https://eslint.style/rules/js/function-call-argument-newline}
   */
  '@stylistic/js/function-call-argument-newline': FunctionCallArgumentNewlineRuleOptions
  /**
   * This rule enforces consistent line breaks inside parentheses of function parameters or arguments.
   * @see {@link https://eslint.style/rules/js/function-paren-newline}
   */
  '@stylistic/js/function-paren-newline': FunctionParenNewlineRuleOptions
  /**
   * This rule aims to enforce spacing around the * of generator functions.
   * @see {@link https://eslint.style/rules/js/generator-star-spacing}
   */
  '@stylistic/js/generator-star-spacing': GeneratorStarSpacingRuleOptions
  /**
   * This rule aims to enforce a consistent location for an arrow function containing an implicit return.
   * @see {@link https://eslint.style/rules/js/implicit-arrow-linebreak}
   */
  '@stylistic/js/implicit-arrow-linebreak': ImplicitArrowLinebreakRuleOptions
  /**
   * This rule enforces a consistent indentation style. The default style is 4 spaces.
   * @see {@link https://eslint.style/rules/js/indent}
   */
  '@stylistic/js/indent': IndentRuleOptions
  /**
   * This rule enforces the consistent use of either double or single quotes in JSX attributes.
   * @see {@link https://eslint.style/rules/js/jsx-quotes}
   */
  '@stylistic/js/jsx-quotes': JsxQuotesRuleOptions
  /**
   * This rule enforces consistent spacing between keys and values in object literal properties. In the case of long lines, it is acceptable to add a new line wherever whitespace is allowed.
   * @see {@link https://eslint.style/rules/js/key-spacing}
   */
  '@stylistic/js/key-spacing': KeySpacingRuleOptions
  /**
   * This rule enforces consistent spacing around keywords and keyword-like tokens.
   * @see {@link https://eslint.style/rules/js/keyword-spacing}
   */
  '@stylistic/js/keyword-spacing': KeywordSpacingRuleOptions
  /**
   * This rule enforces consistent line endings independent of operating system, VCS, or editor used across your codebase.
   * @see {@link https://eslint.style/rules/js/linebreak-style}
   */
  '@stylistic/js/linebreak-style': LinebreakStyleRuleOptions
  /**
   * This rule requires empty lines before and/or after comments. It can be enabled separately for both block (/*) and line (//) comments.
   * This rule does not apply to comments that appear on the same line as code and does not require empty lines at the beginning or end of a file.
   * @see {@link https://eslint.style/rules/js/lines-around-comment}
   */
  '@stylistic/js/lines-around-comment': LinesAroundCommentRuleOptions
  /**
   * This rule improves readability by enforcing lines between class members.
   * It will not check empty lines before the first member and after the last member, since that is already taken care of by padded-blocks.
   * @see {@link https://eslint.style/rules/js/lines-between-class-members}
   */
  '@stylistic/js/lines-between-class-members': LinesBetweenClassMembersRuleOptions
  /**
   * This rule enforces a maximum line length to increase code readability and maintainability.
   * The length of a line is defined as the number of Unicode characters in the line.
   * @see {@link https://eslint.style/rules/js/max-len}
   */
  '@stylistic/js/max-len': MaxLenRuleOptions
  /**
   * This rule enforces a maximum number of statements allowed per line.
   * @see {@link https://eslint.style/rules/js/max-statements-per-line}
   */
  '@stylistic/js/max-statements-per-line': MaxStatementsPerLineRuleOptions
  /**
   * This rule enforces or disallows newlines between operands of a ternary expression. Note: The location of the operators is not enforced by this rule.
   * Please see the {@link https://eslint.style/rules/js/operator-linebreak operator-linebreak} rule if you are interested in enforcing the location of the operators themselves.
   * @see {@link https://eslint.style/rules/js/multiline-ternary}
   */
  '@stylistic/js/multiline-ternary': MultilineTernaryRuleOptions
  /**
   * This rule can enforce or disallow parentheses when invoking a constructor with no arguments using the new keyword.
   * @see {@link https://eslint.style/rules/js/new-parens}
   */
  '@stylistic/js/new-parens': NewParensRuleOptions
  /**
   * This rule requires a newline after each call in a method chain or deep member access. Computed property accesses such as instance[something] are excluded.
   * @see {@link https://eslint.style/rules/js/newline-per-chained-call}
   */
  '@stylistic/js/newline-per-chained-call': NewlinePerChainedCallRuleOptions
  /**
   * This rule warns against using the arrow function syntax in places where it could be confused with a comparison operator.
   * @see {@link https://eslint.style/rules/js/no-confusing-arrow}
   */
  '@stylistic/js/no-confusing-arrow': NoConfusingArrowRuleOptions
  /**
   * This rule restricts the use of parentheses to only where they are necessary.
   * @see {@link https://eslint.style/rules/js/no-extra-parens}
   */
  '@stylistic/js/no-extra-parens': NoExtraParensRuleOptions
  /**
   * This rule disallows unnecessary semicolons.
   * @see {@link https://eslint.style/rules/js/no-extra-semi}
   */
  '@stylistic/js/no-extra-semi': NoExtraSemiRuleOptions
  /**
   * This rule is aimed at eliminating floating decimal points and will warn whenever a numeric value has a decimal point but is missing a number either before or after it.
   * @see {@link https://eslint.style/rules/js/no-floating-decimal}
   */
  '@stylistic/js/no-floating-decimal': NoFloatingDecimalRuleOptions
  /**
   * This rule checks BinaryExpression, LogicalExpression and ConditionalExpression.
   * This rule may conflict with {@link https://eslint.style/rules/js/no-extra-parens no-extra-parens} rule.
   * If you use both this and {@link https://eslint.style/rules/js/no-extra-parens no-extra-parens} rule together, you need to use the nestedBinaryExpressions option of {@link https://eslint.style/rules/js/no-extra-parens no-extra-parens }rule.
   * @see {@link https://eslint.style/rules/js/no-mixed-operators}
   */
  '@stylistic/js/no-mixed-operators': NoMixedOperatorsRuleOptions
  /**
   * This rule disallows mixed spaces and tabs for indentation.
   * @see {@link https://eslint.style/rules/js/no-mixed-spaces-and-tabs}
   */
  '@stylistic/js/no-mixed-spaces-and-tabs': NoMixedSpacesAndTabsRuleOptions
  /**
   * This rule aims to disallow multiple whitespace around logical expressions, conditional expressions, declarations, array elements, object properties, sequences and function parameters.
   * @see {@link https://eslint.style/rules/js/no-multi-spaces}
   */
  '@stylistic/js/no-multi-spaces': NoMultiSpacesRuleOptions
  /**
   * This rule aims to reduce the scrolling required when reading through your code. It will warn when the maximum amount of empty lines has been exceeded.
   * @see {@link https://eslint.style/rules/js/no-multiple-empty-lines}
   */
  '@stylistic/js/no-multiple-empty-lines': NoMultipleEmptyLinesRuleOptions
  /**
   * This rule looks for tabs anywhere inside a file: code, comments or anything else.
   * @see {@link https://eslint.style/rules/js/no-tabs}
   */
  '@stylistic/js/no-tabs': NoTabsRuleOptions
  /**
   * This rule disallows trailing whitespace (spaces, tabs, and other Unicode whitespace characters) at the end of lines.
   * @see {@link https://eslint.style/rules/js/no-trailing-spaces}
   */
  '@stylistic/js/no-trailing-spaces': NoTrailingSpacesRuleOptions
  /**
   * This rule disallows whitespace around the dot or before the opening bracket before properties of objects if they are on the same line.
   * This rule allows whitespace when the object and property are on separate lines, as it is common to add newlines to longer chains of properties
   * @see {@link https://eslint.style/rules/js/no-whitespace-before-property}
   */
  '@stylistic/js/no-whitespace-before-property': NoWhitespaceBeforePropertyRuleOptions
  /**
   * This rule aims to enforce a consistent location for single-line statements.
   * @see {@link https://eslint.style/rules/js/nonblock-statement-body-position}
   */
  '@stylistic/js/nonblock-statement-body-position': NonblockStatementBodyPositionRuleOptions
  /**
   * This rule requires or disallows a line break between { and its following token, and between } and its preceding token of object literals or destructuring assignments.
   * @see {@link https://eslint.style/rules/js/object-curly-newline}
   */
  '@stylistic/js/object-curly-newline': ObjectCurlyNewlineRuleOptions
  /**
   * This rule enforces consistent spacing inside braces of object literals, destructuring assignments, and import/export specifiers.
   * @see {@link https://eslint.style/rules/js/object-curly-spacing}
   */
  '@stylistic/js/object-curly-spacing': ObjectCurlySpacingRuleOptions
  /**
   * This rule permits you to restrict the locations of property specifications in object literals.
   * @see {@link https://eslint.style/rules/js/object-property-newline}
   */
  '@stylistic/js/object-property-newline': ObjectPropertyNewlineRuleOptions
  /**
   * This rule enforces a consistent newlines around variable declarations. This rule ignores variable declarations inside for loop conditionals.
   * @see {@link https://eslint.style/rules/js/one-var-declaration-per-line}
   */
  '@stylistic/js/one-var-declaration-per-line': OneVarDeclarationPerLineRuleOptions
  /**
   * This rule enforces a consistent linebreak style for operators.
   * @see {@link https://eslint.style/rules/js/operator-linebreak}
   */
  '@stylistic/js/operator-linebreak': OperatorLinebreakRuleOptions
  /**
   * This rule enforces consistent empty line padding within blocks.
   * @see {@link https://eslint.style/rules/js/padded-blocks}
   */
  '@stylistic/js/padded-blocks': PaddedBlocksRuleOptions
  /**
   * This rule does nothing if no configurations are provided.
   * @see {@link https://eslint.style/rules/js/padding-line-between-statements}
   */
  '@stylistic/js/padding-line-between-statements': PaddingLineBetweenStatementsRuleOptions
  /**
   * This rule requires quotes around object literal property names.
   * @see {@link https://eslint.style/rules/js/quote-props}
   */
  '@stylistic/js/quote-props': QuotePropsRuleOptions
  /**
   * This rule enforces the consistent use of either backticks, double, or single quotes.
   * This rule is aware of directive prologues such as "use strict" and will not flag or autofix them if doing so will change how the directive prologue is interpreted.
   * @see {@link https://eslint.style/rules/js/quotes}
   */
  '@stylistic/js/quotes': QuotesRuleOptions
  /**
   * This rule aims to enforce consistent spacing between rest and spread operators and their expressions. The rule also supports object rest and spread properties in ES2018.
   * @see {@link https://eslint.style/rules/js/rest-spread-spacing}
   */
  '@stylistic/js/rest-spread-spacing': RestSpreadSpacingRuleOptions
  /**
   * This rule aims to enforce spacing around a semicolon.
   * This rule prevents the use of spaces before a semicolon in expressions.
   * @see {@link https://eslint.style/rules/js/semi-spacing}
   */
  '@stylistic/js/semi-spacing': SemiSpacingRuleOptions
  /**
   * This rule reports line terminators around semicolons.
   * @see {@link https://eslint.style/rules/js/semi-style}
   */
  '@stylistic/js/semi-style': SemiStyleRuleOptions
  /**
   * This rule enforces consistent use of semicolons.
   * @see {@link https://eslint.style/rules/js/semi}
   */
  '@stylistic/js/semi': SemiRuleOptions
  /**
   * This rule will enforce consistency of spacing before blocks. It is only applied on blocks that don’t begin on a new line.
   * @see {@link https://eslint.style/rules/js/space-before-blocks}
   */
  '@stylistic/js/space-before-blocks': SpaceBeforeBlocksRuleOptions
  /**
   * This rule aims to enforce consistent spacing before function parentheses and as such, will warn whenever whitespace doesn't match the preferences specified.
   * @see {@link https://eslint.style/rules/js/space-before-function-paren}
   */
  '@stylistic/js/space-before-function-paren': SpaceBeforeFunctionParenRuleOptions
  /**
   * This rule will enforce consistent spacing directly inside of parentheses, by disallowing or requiring one or more spaces to the right of ( and to the left of ).
   * As long as you do not explicitly disallow empty parentheses using the "empty" exception , () will be allowed.
   * @see {@link https://eslint.style/rules/js/space-in-parens}
   */
  '@stylistic/js/space-in-parens': SpaceInParensRuleOptions
  /**
   * This rule is aimed at ensuring there are spaces around infix operators.
   * @see {@link https://eslint.style/rules/js/space-infix-ops}
   */
  '@stylistic/js/space-infix-ops': SpaceInfixOpsRuleOptions
  /**
   * This rule enforces consistency regarding the spaces after words unary operators and after/before nonwords unary operators.
   * @see {@link https://eslint.style/rules/js/space-unary-ops}
   */
  '@stylistic/js/space-unary-ops': SpaceUnaryOpsRuleOptions
  /**
   * This rule will enforce consistency of spacing after the start of a comment // or /*. It also provides several exceptions for various documentation styles.
   * @see {@link https://eslint.style/rules/js/spaced-comment}
   */
  '@stylistic/js/spaced-comment': SpacedCommentRuleOptions
  /**
   * This rule controls spacing around colons of case and default clauses in switch statements.
   * This rule does the check only if the consecutive tokens exist on the same line.
   * @see {@link https://eslint.style/rules/js/switch-colon-spacing}
   */
  '@stylistic/js/switch-colon-spacing': SwitchColonSpacingRuleOptions
  /**
   * This rule aims to maintain consistency around the spacing inside of template literals.
   * @see {@link https://eslint.style/rules/js/template-curly-spacing}
   */
  '@stylistic/js/template-curly-spacing': TemplateCurlySpacingRuleOptions
  /**
   * This rule aims to maintain consistency around the spacing between template tag functions and their template literals.
   * @see {@link https://eslint.style/rules/js/template-tag-spacing}
   */
  '@stylistic/js/template-tag-spacing': TemplateTagSpacingRuleOptions
  /**
   * This rule requires all immediately-invoked function expressions to be wrapped in parentheses.
   * @see {@link https://eslint.style/rules/js/wrap-iife}
   */
  '@stylistic/js/wrap-iife': WrapIifeRuleOptions
  /**
   * This is used to disambiguate the slash operator and facilitates more readable code.
   * @see {@link https://eslint.style/rules/js/wrap-regex}
   */
  '@stylistic/js/wrap-regex': WrapRegexRuleOptions
  /**
   * This rule enforces spacing around the * in yield* expressions.
   * @see {@link https://eslint.style/rules/js/yield-star-spacing}
   */
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
