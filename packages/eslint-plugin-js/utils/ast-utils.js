/**
 * @fileoverview Common utils for AST.
 * @author Gyandeep Singh
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import { KEYS as eslintVisitorKeys } from 'eslint-visitor-keys'
import { latestEcmaVersion, tokenize } from 'espree'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

const anyFunctionPattern = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/u

export const COMMENTS_IGNORE_PATTERN = /^\s*(?:eslint|jshint\s+|jslint\s+|istanbul\s+|globals?\s+|exported\s+|jscs)/u

export const LINEBREAKS = /* @__PURE__ */ new Set(['\r\n', '\r', '\n', '\u2028', '\u2029'])
export const LINEBREAK_MATCHER = /\r\n|[\r\n\u2028\u2029]/u

// A set of node types that can contain a list of statements
export const STATEMENT_LIST_PARENTS = /* @__PURE__ */ new Set(['Program', 'BlockStatement', 'StaticBlock', 'SwitchCase'])

export const DECIMAL_INTEGER_PATTERN = /^(?:0|0[0-7]*[89]\d*|[1-9](?:_?\d)*)$/u

// Tests the presence of at least one LegacyOctalEscapeSequence or NonOctalDecimalEscapeSequence in a raw string
export const OCTAL_OR_NON_OCTAL_DECIMAL_ESCAPE_PATTERN = /^(?:[^\\]|\\.)*\\(?:[1-9]|0[0-9])/su

/**
 * Creates a version of the `lineBreakPattern` regex with the global flag.
 * Global regexes are mutable, so this needs to be a function instead of a constant.
 * @returns {RegExp} A global regular expression that matches line terminators
 */
export function createGlobalLinebreakMatcher() {
  return new RegExp(LINEBREAK_MATCHER.source, 'gu')
}

/**
 * Finds a function node from ancestors of a node.
 * @param {ASTNode} node A start node to find.
 * @returns {Node|null} A found function node.
 */
export function getUpperFunction(node) {
  for (let currentNode = node; currentNode; currentNode = currentNode.parent) {
    if (anyFunctionPattern.test(currentNode.type))
      return currentNode
  }
  return null
}

/**
 * Checks whether a given node is a function node or not.
 * The following types are function nodes:
 *
 * - ArrowFunctionExpression
 * - FunctionDeclaration
 * - FunctionExpression
 * @param {ASTNode|null} node A node to check.
 * @returns {boolean} `true` if the node is a function node.
 */
export function isFunction(node) {
  return Boolean(node && anyFunctionPattern.test(node.type))
}

/**
 * Determines whether the given node is a `null` literal.
 * @param {ASTNode} node The node to check
 * @returns {boolean} `true` if the node is a `null` literal
 */
export function isNullLiteral(node) {
  /*
     * Checking `node.value === null` does not guarantee that a literal is a null literal.
     * When parsing values that cannot be represented in the current environment (e.g. unicode
     * regexes in Node 4), `node.value` is set to `null` because it wouldn't be possible to
     * set `node.value` to a unicode regex. To make sure a literal is actually `null`, check
     * `node.regex` instead. Also see: https://github.com/eslint/eslint/issues/8020
     */
  return node.type === 'Literal' && node.value === null && !node.regex && !node.bigint
}

/**
 * Returns the result of the string conversion applied to the evaluated value of the given expression node,
 * if it can be determined statically.
 *
 * This function returns a `string` value for all `Literal` nodes and simple `TemplateLiteral` nodes only.
 * In all other cases, this function returns `null`.
 * @param {ASTNode} node Expression node.
 * @returns {string|null} String value if it can be determined. Otherwise, `null`.
 */
export function getStaticStringValue(node) {
  switch (node.type) {
    case 'Literal':
      if (node.value === null) {
        if (isNullLiteral(node))
          return String(node.value) // "null"

        if (node.regex)
          return `/${node.regex.pattern}/${node.regex.flags}`

        if (node.bigint)
          return node.bigint

        // Otherwise, this is an unknown literal. The function will return null.
      }
      else {
        return String(node.value)
      }
      break
    case 'TemplateLiteral':
      if (node.expressions.length === 0 && node.quasis.length === 1)
        return node.quasis[0].value.cooked

      break

            // no default
  }

  return null
}

/**
 * Gets the property name of a given node.
 * The node can be a MemberExpression, a Property, or a MethodDefinition.
 *
 * If the name is dynamic, this returns `null`.
 *
 * For examples:
 *
 *     a.b           // => "b"
 *     a["b"]        // => "b"
 *     a['b']        // => "b"
 *     a[`b`]        // => "b"
 *     a[100]        // => "100"
 *     a[b]          // => null
 *     a["a" + "b"]  // => null
 *     a[tag`b`]     // => null
 *     a[`${b}`]     // => null
 *
 *     let a = {b: 1}            // => "b"
 *     let a = {["b"]: 1}        // => "b"
 *     let a = {['b']: 1}        // => "b"
 *     let a = {[`b`]: 1}        // => "b"
 *     let a = {[100]: 1}        // => "100"
 *     let a = {[b]: 1}          // => null
 *     let a = {["a" + "b"]: 1}  // => null
 *     let a = {[tag`b`]: 1}     // => null
 *     let a = {[`${b}`]: 1}     // => null
 * @param {ASTNode} node The node to get.
 * @returns {string|null} The property name if static. Otherwise, null.
 */
export function getStaticPropertyName(node) {
  let prop

  switch (node && node.type) {
    case 'ChainExpression':
      return getStaticPropertyName(node.expression)

    case 'Property':
    case 'PropertyDefinition':
    case 'MethodDefinition':
      prop = node.key
      break

    case 'MemberExpression':
      prop = node.property
      break

            // no default
  }

  if (prop) {
    if (prop.type === 'Identifier' && !node.computed)
      return prop.name

    return getStaticStringValue(prop)
  }

  return null
}

/**
 * Retrieve `ChainExpression#expression` value if the given node a `ChainExpression` node. Otherwise, pass through it.
 * @param {ASTNode} node The node to address.
 * @returns {ASTNode} The `ChainExpression#expression` value if the node is a `ChainExpression` node. Otherwise, the node.
 */
export function skipChainExpression(node) {
  return node && node.type === 'ChainExpression' ? node.expression : node
}

/**
 * Creates the negate function of the given function.
 * @param {Function} f The function to negate.
 * @returns {Function} Negated function.
 */
export function negate(f) {
  return token => !f(token)
}

/**
 * Determines if a node is surrounded by parentheses.
 * @param {SourceCode} sourceCode The ESLint source code object
 * @param {ASTNode} node The node to be checked.
 * @returns {boolean} True if the node is parenthesised.
 * @private
 */
export function isParenthesised(sourceCode, node) {
  const previousToken = sourceCode.getTokenBefore(node)
  const nextToken = sourceCode.getTokenAfter(node)

  return Boolean(previousToken && nextToken)
        && previousToken.value === '(' && previousToken.range[1] <= node.range[0]
        && nextToken.value === ')' && nextToken.range[0] >= node.range[1]
}

/**
 * Checks if the given token is a `=` token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a `=` token.
 */
export function isEqToken(token) {
  return token.value === '=' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is an arrow token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is an arrow token.
 */
export function isArrowToken(token) {
  return token.value === '=>' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a comma token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comma token.
 */
export function isCommaToken(token) {
  return token.value === ',' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a `?.` token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a `?.` token.
 */
export function isQuestionDotToken(token) {
  return token.value === '?.' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a semicolon token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a semicolon token.
 */
export function isSemicolonToken(token) {
  return token.value === ';' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a colon token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a colon token.
 */
export function isColonToken(token) {
  return token.value === ':' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is an opening parenthesis token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is an opening parenthesis token.
 */
export function isOpeningParenToken(token) {
  return token.value === '(' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a closing parenthesis token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a closing parenthesis token.
 */
export function isClosingParenToken(token) {
  return token.value === ')' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is an opening square bracket token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is an opening square bracket token.
 */
export function isOpeningBracketToken(token) {
  return token.value === '[' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a closing square bracket token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a closing square bracket token.
 */
export function isClosingBracketToken(token) {
  return token.value === ']' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is an opening brace token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is an opening brace token.
 */
export function isOpeningBraceToken(token) {
  return token.value === '{' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a closing brace token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a closing brace token.
 */
export function isClosingBraceToken(token) {
  return token.value === '}' && token.type === 'Punctuator'
}

/**
 * Checks if the given token is a comment token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
export function isCommentToken(token) {
  return token.type === 'Line' || token.type === 'Block' || token.type === 'Shebang'
}

/**
 * Checks if the given token is a keyword token or not.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a keyword token.
 */
export function isKeywordToken(token) {
  return token.type === 'Keyword'
}

/**
 * Check if the given node is a true logical expression or not.
 *
 * The three binary expressions logical-or (`||`), logical-and (`&&`), and
 * coalesce (`??`) are known as `ShortCircuitExpression`.
 * But ESTree represents those by `LogicalExpression` node.
 *
 * This function rejects coalesce expressions of `LogicalExpression` node.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is `&&` or `||`.
 * @see https://tc39.es/ecma262/#prod-ShortCircuitExpression
 */
export function isLogicalExpression(node) {
  return (
    node.type === 'LogicalExpression'
            && (node.operator === '&&' || node.operator === '||')
  )
}

/**
 * Check if the given node is a nullish coalescing expression or not.
 *
 * The three binary expressions logical-or (`||`), logical-and (`&&`), and
 * coalesce (`??`) are known as `ShortCircuitExpression`.
 * But ESTree represents those by `LogicalExpression` node.
 *
 * This function finds only coalesce expressions of `LogicalExpression` node.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is `??`.
 */
export function isCoalesceExpression(node) {
  return node.type === 'LogicalExpression' && node.operator === '??'
}

/**
 * Check if given two nodes are the pair of a logical expression and a coalesce expression.
 * @param {ASTNode} left A node to check.
 * @param {ASTNode} right Another node to check.
 * @returns {boolean} `true` if the two nodes are the pair of a logical expression and a coalesce expression.
 */
export function isMixedLogicalAndCoalesceExpressions(left, right) {
  return (
    (isLogicalExpression(left) && isCoalesceExpression(right))
            || (isCoalesceExpression(left) && isLogicalExpression(right))
  )
}

/**
 * Get the colon token of the given SwitchCase node.
 * @param {ASTNode} node The SwitchCase node to get.
 * @param {SourceCode} sourceCode The source code object to get tokens.
 * @returns {Token} The colon token of the node.
 */
export function getSwitchCaseColonToken(node, sourceCode) {
  if (node.test)
    return sourceCode.getTokenAfter(node.test, isColonToken)

  return sourceCode.getFirstToken(node, 1)
}

/**
 * Checks whether a node is an ExpressionStatement at the top level of a file or function body.
 * A top-level ExpressionStatement node is a directive if it contains a single unparenthesized
 * string literal and if it occurs either as the first sibling or immediately after another
 * directive.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} Whether or not the node is an ExpressionStatement at the top level of a
 * file or function body.
 */
export function isTopLevelExpressionStatement(node) {
  if (node.type !== 'ExpressionStatement')
    return false

  const parent = node.parent

  return parent.type === 'Program' || (parent.type === 'BlockStatement' && isFunction(parent.parent))
}

/**
 * Check whether the given node is a part of a directive prologue or not.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is a part of directive prologue.
 */
export function isDirective(node) {
  return node.type === 'ExpressionStatement' && typeof node.directive === 'string'
}

/**
 * Determines whether two adjacent tokens are on the same line.
 * @param {object} left The left token object.
 * @param {object} right The right token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 * @public
 */
export function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line
}

export const isNotClosingParenToken = negate(isClosingParenToken)
export const isNotCommaToken = negate(isCommaToken)
export const isNotQuestionDotToken = negate(isQuestionDotToken)
export const isNotOpeningParenToken = negate(isOpeningParenToken)
export const isNotSemicolonToken = negate(isSemicolonToken)

/**
 * Checks whether or not a given node is a string literal.
 * @param {ASTNode} node A node to check.
 * @returns {boolean} `true` if the node is a string literal.
 */
export function isStringLiteral(node) {
  return (
    (node.type === 'Literal' && typeof node.value === 'string')
          || node.type === 'TemplateLiteral'
  )
}

/**
 * Validate that a string passed in is surrounded by the specified character
 * @param {string} val The text to check.
 * @param {string} character The character to see if it's surrounded by.
 * @returns {boolean} True if the text is surrounded by the character, false if not.
 * @private
 */
export function isSurroundedBy(val, character) {
  return val[0] === character && val[val.length - 1] === character
}

/**
 * Get the precedence level based on the node type
 * @param {ASTNode} node node to evaluate
 * @returns {int} precedence level
 * @private
 */
export function getPrecedence(node) {
  switch (node.type) {
    case 'SequenceExpression':
      return 0

    case 'AssignmentExpression':
    case 'ArrowFunctionExpression':
    case 'YieldExpression':
      return 1

    case 'ConditionalExpression':
      return 3

    case 'LogicalExpression':
      switch (node.operator) {
        case '||':
        case '??':
          return 4
        case '&&':
          return 5

                    // no default
      }

      /* falls through */

    case 'BinaryExpression':

      switch (node.operator) {
        case '|':
          return 6
        case '^':
          return 7
        case '&':
          return 8
        case '==':
        case '!=':
        case '===':
        case '!==':
          return 9
        case '<':
        case '<=':
        case '>':
        case '>=':
        case 'in':
        case 'instanceof':
          return 10
        case '<<':
        case '>>':
        case '>>>':
          return 11
        case '+':
        case '-':
          return 12
        case '*':
        case '/':
        case '%':
          return 13
        case '**':
          return 15

                    // no default
      }

      /* falls through */

    case 'UnaryExpression':
    case 'AwaitExpression':
      return 16

    case 'UpdateExpression':
      return 17

    case 'CallExpression':
    case 'ChainExpression':
    case 'ImportExpression':
      return 18

    case 'NewExpression':
      return 19

    default:
      if (node.type in eslintVisitorKeys)
        return 20

      /*
                 * if the node is not a standard node that we know about, then assume it has the lowest precedence
                 * this will mean that rules will wrap unknown nodes in parentheses where applicable instead of
                 * unwrapping them and potentially changing the meaning of the code or introducing a syntax error.
                 */
      return -1
  }
}

/**
 * Determines whether this node is a decimal integer literal. If a node is a decimal integer literal, a dot added
 * after the node will be parsed as a decimal point, rather than a property-access dot.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if this node is a decimal integer.
 * @example
 *
 * 0         // true
 * 5         // true
 * 50        // true
 * 5_000     // true
 * 1_234_56  // true
 * 08        // true
 * 0192      // true
 * 5.        // false
 * .5        // false
 * 5.0       // false
 * 5.00_00   // false
 * 05        // false
 * 0x5       // false
 * 0b101     // false
 * 0b11_01   // false
 * 0o5       // false
 * 5e0       // false
 * 5e1_000   // false
 * 5n        // false
 * 1_000n    // false
 * "5"       // false
 *
 */
export function isDecimalInteger(node) {
  return node.type === 'Literal' && typeof node.value === 'number'
            && DECIMAL_INTEGER_PATTERN.test(node.raw)
}

/**
 * Determines whether this token is a decimal integer numeric token.
 * This is similar to isDecimalInteger(), but for tokens.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if this token is a decimal integer.
 */
export function isDecimalIntegerNumericToken(token) {
  return token.type === 'Numeric' && DECIMAL_INTEGER_PATTERN.test(token.value)
}

/**
 * Gets next location when the result is not out of bound, otherwise returns null.
 *
 * Assumptions:
 *
 * - The given location represents a valid location in the given source code.
 * - Columns are 0-based.
 * - Lines are 1-based.
 * - Column immediately after the last character in a line (not incl. linebreaks) is considered to be a valid location.
 * - If the source code ends with a linebreak, `sourceCode.lines` array will have an extra element (empty string) at the end.
 *   The start (column 0) of that extra line is considered to be a valid location.
 *
 * Examples of successive locations (line, column):
 *
 * code: foo
 * locations: (1, 0) -> (1, 1) -> (1, 2) -> (1, 3) -> null
 *
 * code: foo<LF>
 * locations: (1, 0) -> (1, 1) -> (1, 2) -> (1, 3) -> (2, 0) -> null
 *
 * code: foo<CR><LF>
 * locations: (1, 0) -> (1, 1) -> (1, 2) -> (1, 3) -> (2, 0) -> null
 *
 * code: a<LF>b
 * locations: (1, 0) -> (1, 1) -> (2, 0) -> (2, 1) -> null
 *
 * code: a<LF>b<LF>
 * locations: (1, 0) -> (1, 1) -> (2, 0) -> (2, 1) -> (3, 0) -> null
 *
 * code: a<CR><LF>b<CR><LF>
 * locations: (1, 0) -> (1, 1) -> (2, 0) -> (2, 1) -> (3, 0) -> null
 *
 * code: a<LF><LF>
 * locations: (1, 0) -> (1, 1) -> (2, 0) -> (3, 0) -> null
 *
 * code: <LF>
 * locations: (1, 0) -> (2, 0) -> null
 *
 * code:
 * locations: (1, 0) -> null
 * @param {SourceCode} sourceCode The sourceCode
 * @param {{line: number, column: number}} location The location
 * @returns {{line: number, column: number} | null} Next location
 */
export function getNextLocation(sourceCode, { column, line }) {
  if (column < sourceCode.lines[line - 1].length) {
    return {
      column: column + 1,
      line,
    }
  }

  if (line < sourceCode.lines.length) {
    return {
      column: 0,
      line: line + 1,
    }
  }

  return null
}

/**
 * Check if a given node is a numeric literal or not.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is a number or bigint literal.
 */
export function isNumericLiteral(node) {
  return (
    node.type === 'Literal'
            && (typeof node.value === 'number' || Boolean(node.bigint))
  )
}

/**
 * Determines whether two tokens can safely be placed next to each other without merging into a single token
 * @param {Token|string} leftValue The left token. If this is a string, it will be tokenized and the last token will be used.
 * @param {Token|string} rightValue The right token. If this is a string, it will be tokenized and the first token will be used.
 * @returns {boolean} If the tokens cannot be safely placed next to each other, returns `false`. If the tokens can be placed
 * next to each other, behavior is undefined (although it should return `true` in most cases).
 */
export function canTokensBeAdjacent(leftValue, rightValue) {
  const espreeOptions = {
    comment: true,
    ecmaVersion: latestEcmaVersion,
    range: true,
  }

  let leftToken

  if (typeof leftValue === 'string') {
    let tokens

    try {
      tokens = tokenize(leftValue, espreeOptions)
    }
    catch {
      return false
    }

    const comments = tokens.comments

    leftToken = tokens[tokens.length - 1]
    if (comments.length) {
      const lastComment = comments[comments.length - 1]

      if (!leftToken || lastComment.range[0] > leftToken.range[0])
        leftToken = lastComment
    }
  }
  else {
    leftToken = leftValue
  }

  /*
         * If a hashbang comment was passed as a token object from SourceCode,
         * its type will be "Shebang" because of the way ESLint itself handles hashbangs.
         * If a hashbang comment was passed in a string and then tokenized in this function,
         * its type will be "Hashbang" because of the way Espree tokenizes hashbangs.
         */
  if (leftToken.type === 'Shebang' || leftToken.type === 'Hashbang')
    return false

  let rightToken

  if (typeof rightValue === 'string') {
    let tokens

    try {
      tokens = tokenize(rightValue, espreeOptions)
    }
    catch {
      return false
    }

    const comments = tokens.comments

    rightToken = tokens[0]
    if (comments.length) {
      const firstComment = comments[0]

      if (!rightToken || firstComment.range[0] < rightToken.range[0])
        rightToken = firstComment
    }
  }
  else {
    rightToken = rightValue
  }

  if (leftToken.type === 'Punctuator' || rightToken.type === 'Punctuator') {
    if (leftToken.type === 'Punctuator' && rightToken.type === 'Punctuator') {
      const PLUS_TOKENS = new Set(['+', '++'])
      const MINUS_TOKENS = new Set(['-', '--'])

      return !(
        PLUS_TOKENS.has(leftToken.value) && PLUS_TOKENS.has(rightToken.value)
                    || MINUS_TOKENS.has(leftToken.value) && MINUS_TOKENS.has(rightToken.value)
      )
    }
    if (leftToken.type === 'Punctuator' && leftToken.value === '/')
      return !['Block', 'Line', 'RegularExpression'].includes(rightToken.type)

    return true
  }

  if (
    leftToken.type === 'String' || rightToken.type === 'String'
            || leftToken.type === 'Template' || rightToken.type === 'Template'
  )
    return true

  if (leftToken.type !== 'Numeric' && rightToken.type === 'Numeric' && rightToken.value.startsWith('.'))
    return true

  if (leftToken.type === 'Block' || rightToken.type === 'Block' || rightToken.type === 'Line')
    return true

  if (rightToken.type === 'PrivateIdentifier')
    return true

  return false
}

/**
 * Determines whether the given raw string contains an octal escape sequence
 * or a non-octal decimal escape sequence ("\8", "\9").
 *
 * "\1", "\2" ... "\7", "\8", "\9"
 * "\00", "\01" ... "\07", "\08", "\09"
 *
 * "\0", when not followed by a digit, is not an octal escape sequence.
 * @param {string} rawString A string in its raw representation.
 * @returns {boolean} `true` if the string contains at least one octal escape sequence
 * or at least one non-octal decimal escape sequence.
 */
export function hasOctalOrNonOctalDecimalEscapeSequence(rawString) {
  return OCTAL_OR_NON_OCTAL_DECIMAL_ESCAPE_PATTERN.test(rawString)
}
