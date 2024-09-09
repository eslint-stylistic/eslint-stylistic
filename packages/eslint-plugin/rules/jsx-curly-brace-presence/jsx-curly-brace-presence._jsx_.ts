/**
 * @fileoverview Enforce curly braces or disallow unnecessary curly brace in JSX
 * @author Jacky Ho
 * @author Simon Lydell
 */

import { isJSX, isWhiteSpaces } from '#utils/ast/jsx'
import { createRule } from '#utils/create-rule'
import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'

const OPTION_ALWAYS = 'always'
const OPTION_NEVER = 'never'
const OPTION_IGNORE = 'ignore'

const OPTION_VALUES = [
  OPTION_ALWAYS,
  OPTION_NEVER,
  OPTION_IGNORE,
]
const DEFAULT_CONFIG = { props: OPTION_NEVER, children: OPTION_NEVER, propElementValues: OPTION_IGNORE }

const messages = {
  unnecessaryCurly: 'Curly braces are unnecessary here.',
  missingCurly: 'Need to wrap this literal in a JSX expression.',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-curly-brace-presence',
  package: 'jsx',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes',
    },
    fixable: 'code',

    messages,

    schema: [
      {
        anyOf: [
          {
            type: 'object',
            properties: {
              props: { type: 'string', enum: OPTION_VALUES },
              children: { type: 'string', enum: OPTION_VALUES },
              propElementValues: { type: 'string', enum: OPTION_VALUES },
            },
            additionalProperties: false,
          },
          {
            type: 'string',
            enum: OPTION_VALUES,
          },
        ],
      },
    ],
  },

  create(context) {
    const HTML_ENTITY_REGEX = () => /&[A-Z\d#]+;/gi
    const ruleOptions = context.options[0]

    const userConfig = typeof ruleOptions === 'string'
      ? { props: ruleOptions, children: ruleOptions, propElementValues: OPTION_IGNORE }
      : Object.assign({}, DEFAULT_CONFIG, ruleOptions)

    function containsLineTerminators(rawStringValue: string) {
      return /[\n\r\u2028\u2029]/.test(rawStringValue)
    }

    function containsBackslash(rawStringValue: string) {
      return rawStringValue.includes('\\')
    }

    function containsHTMLEntity(rawStringValue: string) {
      return HTML_ENTITY_REGEX().test(rawStringValue)
    }

    function containsOnlyHtmlEntities(rawStringValue: string) {
      return rawStringValue.replace(HTML_ENTITY_REGEX(), '').trim() === ''
    }

    function containsDisallowedJSXTextChars(rawStringValue: string) {
      return /[{<>}]/.test(rawStringValue)
    }

    function containsQuoteCharacters(value: string) {
      return /['"]/.test(value)
    }

    function containsMultilineComment(value: string) {
      return /\/\*/.test(value)
    }

    function escapeDoubleQuotes(rawStringValue: string) {
      return rawStringValue.replace(/\\"/g, '"').replace(/"/g, '\\"')
    }

    function escapeBackslashes(rawStringValue: string) {
      return rawStringValue.replace(/\\/g, '\\\\')
    }

    function needToEscapeCharacterForJSX(raw: string, node: Tree.JSXExpressionContainer) {
      return (
        containsBackslash(raw)
        || containsHTMLEntity(raw)
        || (node.parent.type !== 'JSXAttribute' && containsDisallowedJSXTextChars(raw))
      )
    }

    function containsWhitespaceExpression(child: Tree.JSXExpressionContainer) {
      if (child.type === 'JSXExpressionContainer') {
        const value = (child.expression as Tree.StringLiteral).value
        return value ? isWhiteSpaces(value) : false
      }
      return false
    }

    function isLineBreak(text: string) {
      return containsLineTerminators(text) && text.trim() === ''
    }

    function wrapNonHTMLEntities(text: string) {
      const HTML_ENTITY = '<HTML_ENTITY>'
      const withCurlyBraces = text.split(HTML_ENTITY_REGEX()).map(word => (
        word === '' ? '' : `{${JSON.stringify(word)}}`
      )).join(HTML_ENTITY)

      const htmlEntities = text.match(HTML_ENTITY_REGEX())!
      return htmlEntities.reduce((acc, htmlEntity) => (acc.replace(HTML_ENTITY, htmlEntity)
      ), withCurlyBraces)
    }

    function wrapWithCurlyBraces(rawText: string) {
      if (!containsLineTerminators(rawText))
        return `{${JSON.stringify(rawText)}}`

      return rawText.split('\n').map((line) => {
        if (line.trim() === '')
          return line

        const firstCharIndex = line.search(/\S/)
        const leftWhitespace = line.slice(0, firstCharIndex)
        const text = line.slice(firstCharIndex)

        if (containsHTMLEntity(line))
          return `${leftWhitespace}${wrapNonHTMLEntities(text)}`

        return `${leftWhitespace}{${JSON.stringify(text)}}`
      }).join('\n')
    }

    /**
     * Report and fix an unnecessary curly brace violation on a node
     * @param JSXExpressionNode - The AST node with an unnecessary JSX expression
     */
    function reportUnnecessaryCurly(JSXExpressionNode: Tree.JSXExpressionContainer) {
      context.report({
        messageId: 'unnecessaryCurly',
        node: JSXExpressionNode,
        fix(fixer) {
          const expression = JSXExpressionNode.expression as Tree.TemplateLiteral | Tree.StringLiteral

          let textToReplace
          if (isJSX(expression)) {
            const sourceCode = context.sourceCode
            textToReplace = sourceCode.getText(expression)
          }
          else {
            const parentType = JSXExpressionNode.parent.type

            if (parentType === 'JSXAttribute') {
              textToReplace = `"${expression.type === 'TemplateLiteral'
                ? expression.quasis[0].value.raw
                : expression.raw.slice(1, -1)
              }"`
            }
            else if (isJSX(expression)) {
              const sourceCode = context.sourceCode

              textToReplace = sourceCode.getText(expression)
            }
            else {
              textToReplace = expression.type === 'TemplateLiteral'
                ? (expression as Tree.TemplateLiteral).quasis[0].value.cooked : (expression as Tree.StringLiteral).value
            }
          }

          return fixer.replaceText(JSXExpressionNode, textToReplace)
        },
      })
    }

    function reportMissingCurly(literalNode: Tree.Literal | Tree.JSXText) {
      context.report({
        messageId: 'missingCurly',
        node: literalNode,
        fix(fixer) {
          if (isJSX(literalNode))
            return fixer.replaceText(literalNode, `{${context.sourceCode.getText(literalNode)}}`)

          // If a HTML entity name is found, bail out because it can be fixed
          // by either using the real character or the unicode equivalent.
          // If it contains any line terminator character, bail out as well.
          if (
            containsOnlyHtmlEntities(literalNode.raw)
            || (literalNode.parent.type === 'JSXAttribute' && containsLineTerminators(literalNode.raw))
            || isLineBreak(literalNode.raw)
          ) {
            return null
          }

          const expression = literalNode.parent.type === 'JSXAttribute'
            ? `{"${escapeDoubleQuotes(escapeBackslashes(
              literalNode.raw.slice(1, -1),
            ))}"}`
            : wrapWithCurlyBraces(literalNode.raw)

          return fixer.replaceText(literalNode, expression)
        },
      })
    }

    function isWhiteSpaceLiteral(node: Tree.StringLiteral | Tree.JSXText | Tree.JSXExpressionContainer) {
      return node.type && node.type === 'Literal' && node.value && isWhiteSpaces(node.value)
    }

    function isStringWithTrailingWhiteSpaces(value: string) {
      return /^\s|\s$/.test(value)
    }

    function isLiteralWithTrailingWhiteSpaces(node: Tree.StringLiteral | Tree.JSXText) {
      return node.type && node.type === 'Literal' && node.value && isStringWithTrailingWhiteSpaces(node.value)
    }

    // Bail out if there is any character that needs to be escaped in JSX
    // because escaping decreases readability and the original code may be more
    // readable anyway or intentional for other specific reasons
    function lintUnnecessaryCurly(JSXExpressionNode: Tree.JSXExpressionContainer) {
      const expression = (JSXExpressionNode as Tree.JSXExpression).expression as Tree.Literal | Tree.JSXText | Tree.TemplateLiteral
      const expressionType = expression.type

      const sourceCode = context.sourceCode
      // Curly braces containing comments are necessary
      if (sourceCode.getCommentsInside && sourceCode.getCommentsInside(JSXExpressionNode).length > 0)
        return

      if (
        (expressionType === 'Literal' || expressionType === 'JSXText')
        && typeof expression.value === 'string'
        && (
          (JSXExpressionNode.parent.type === 'JSXAttribute' && !isWhiteSpaceLiteral(expression))
          || !isLiteralWithTrailingWhiteSpaces(expression)
        )
        && !containsMultilineComment(expression.value)
        && !needToEscapeCharacterForJSX(expression.raw, JSXExpressionNode) && (
          isJSX(JSXExpressionNode.parent)
          || !containsQuoteCharacters(expression.value)
        )
      ) {
        reportUnnecessaryCurly(JSXExpressionNode)
      }

      else if (
        expressionType === 'TemplateLiteral'
        && expression.expressions.length === 0
        && !expression.quasis[0].value.raw.includes('\n')
        && !isStringWithTrailingWhiteSpaces(expression.quasis[0].value.raw)
        && !needToEscapeCharacterForJSX(expression.quasis[0].value.raw, JSXExpressionNode)
        && !containsQuoteCharacters(expression.quasis[0].value.cooked)
      ) {
        reportUnnecessaryCurly(JSXExpressionNode)
      }

      else if (isJSX(expression)) {
        reportUnnecessaryCurly(JSXExpressionNode)
      }
    }

    function areRuleConditionsSatisfied(parent: Tree.StringLiteral | Tree.JSXText | Tree.JSXElement | Tree.JSXAttribute, config: typeof userConfig, ruleCondition: (typeof userConfig)['props']) {
      return (
        parent.type === 'JSXAttribute'
        && typeof config.props === 'string'
        && config.props === ruleCondition
      ) || (
        isJSX(parent)
        && typeof config.children === 'string'
        && config.children === ruleCondition
      )
    }

    function getAdjacentSiblings(node: Tree.JSXExpressionContainer, children: (Tree.StringLiteral | Tree.JSXText | Tree.JSXExpressionContainer)[]) {
      for (let i = 1; i < children.length - 1; i++) {
        const child = children[i]
        if (node === child)
          return [children[i - 1], children[i + 1]]
      }
      if (node === children[0] && children[1])
        return [children[1]]

      if (node === children[children.length - 1] && children[children.length - 2])
        return [children[children.length - 2]]

      return []
    }

    function hasAdjacentJsxExpressionContainers(node: Tree.JSXExpressionContainer, children: (Tree.JSXExpressionContainer | Tree.StringLiteral | Tree.JSXText)[]) {
      if (!children)
        return false

      const childrenExcludingWhitespaceLiteral = children.filter(child => !isWhiteSpaceLiteral(child))
      const adjSiblings = getAdjacentSiblings(node, childrenExcludingWhitespaceLiteral)

      return adjSiblings.some(x => x.type && x.type === 'JSXExpressionContainer')
    }
    function hasAdjacentJsx(node: Tree.JSXExpressionContainer, children: (Tree.JSXText | Tree.StringLiteral)[]) {
      if (!children)
        return false

      const childrenExcludingWhitespaceLiteral = children.filter(child => !isWhiteSpaceLiteral(child))
      const adjSiblings = getAdjacentSiblings(node, childrenExcludingWhitespaceLiteral)

      return adjSiblings.some(x => x.type && ['JSXExpressionContainer', 'JSXElement'].includes(x.type))
    }
    function shouldCheckForUnnecessaryCurly(node: Tree.JSXExpressionContainer, config: typeof userConfig) {
      const parent = node.parent as Tree.JSXAttribute | Tree.StringLiteral | Tree.JSXText | Tree.JSXElement
      // Bail out if the parent is a JSXAttribute & its contents aren't
      // StringLiteral or TemplateLiteral since e.g
      // <App prop1={<CustomEl />} prop2={<CustomEl>...</CustomEl>} />

      if (
        parent.type && parent.type === 'JSXAttribute'
        && (node.expression
          && node.expression.type
          && node.expression.type !== 'Literal'
          && node.expression.type !== 'StringLiteral' as any // StringLiteral extends Literal, so ts think it's the same type
          && node.expression.type !== 'TemplateLiteral')
      ) {
        return false
      }

      // If there are adjacent `JsxExpressionContainer` then there is no need,
      // to check for unnecessary curly braces.
      if (isJSX(parent) && hasAdjacentJsxExpressionContainers(node, parent.children as (Tree.JSXExpressionContainer | Tree.JSXText | Tree.StringLiteral)[]))
        return false

      if (containsWhitespaceExpression(node) && hasAdjacentJsx(node, (parent as Tree.JSXElement).children as (Tree.JSXText | Tree.StringLiteral)[]))
        return false

      if (
        (parent as Tree.JSXElement).children
        && (parent as Tree.JSXElement).children.length === 1
        && containsWhitespaceExpression(node)
      ) {
        return false
      }

      return areRuleConditionsSatisfied(parent, config, OPTION_NEVER)
    }

    function shouldCheckForMissingCurly(node: Tree.Literal | Tree.JSXText | Tree.JSXElement, config: typeof userConfig): node is Tree.Literal | Tree.JSXText {
      if (isJSX(node))
        return config.propElementValues !== OPTION_IGNORE

      if (
        isLineBreak(node.raw)
        || containsOnlyHtmlEntities(node.raw)
      ) {
        return false
      }

      const parent = node.parent as Tree.JSXElement
      if (
        parent.children
        && parent.children.length === 1
        && containsWhitespaceExpression(parent.children[0] as Tree.JSXExpressionContainer)
      ) {
        return false
      }

      return areRuleConditionsSatisfied(parent, config, OPTION_ALWAYS)
    }

    return {
      'JSXAttribute > JSXExpressionContainer > JSXElement': function (node: Tree.JSXElement) {
        if (userConfig.propElementValues === OPTION_NEVER)
          reportUnnecessaryCurly(node.parent as Tree.JSXExpressionContainer)
      },

      JSXExpressionContainer(node) {
        if (shouldCheckForUnnecessaryCurly(node, userConfig))
          lintUnnecessaryCurly(node)
      },

      'JSXAttribute > JSXElement, Literal, JSXText': function (node: Tree.Literal | Tree.JSXText | Tree.JSXElement) {
        if (shouldCheckForMissingCurly(node, userConfig))
          reportMissingCurly(node)
      },
    }
  },
})
