/**
 * @fileoverview A rule to choose between single and double quote marks
 * @author Matt DuVall <http://www.mattduvall.com/>, Brandon Payton
 */

import type { ASTNode, Tree } from '@shared/types'
import { LINEBREAKS, hasOctalOrNonOctalDecimalEscapeSequence, isParenthesised, isSurroundedBy, isTopLevelExpressionStatement } from '../../utils/ast-utils'
import { createRule } from '../../../utils'
import type { MessageIds, RuleOptions } from './types'

/**
 * Switches quoting of javascript string between ' " and `
 * escaping and unescaping as necessary.
 * Only escaping of the minimal set of characters is changed.
 * Note: escaping of newlines when switching from backtick to other quotes is not handled.
 * @param str A string to convert.
 * @returns The string with changed quotes.
 * @private
 */
function switchQuote(this: { quote: string }, str: string) {
  const newQuote = this.quote
  const oldQuote = str[0]

  if (newQuote === oldQuote)
    return str

  return newQuote + str.slice(1, -1).replace(/\\(\$\{|\r\n?|\n|.)|["'`]|\$\{|(\r\n?|\n)/gu, (match, escaped, newline) => {
    if (escaped === oldQuote || oldQuote === '`' && escaped === '${')
      return escaped // unescape

    if (match === newQuote || newQuote === '`' && match === '${')
      return `\\${match}` // escape

    if (newline && oldQuote === '`')
      return '\\n' // escape newlines

    return match
  }) + newQuote
}

const QUOTE_SETTINGS = {
  double: {
    quote: '"',
    alternateQuote: '\'',
    description: 'doublequote',
    convert: switchQuote,
  },
  single: {
    quote: '\'',
    alternateQuote: '"',
    description: 'singlequote',
    convert: switchQuote,
  },
  backtick: {
    quote: '`',
    alternateQuote: '"',
    description: 'backtick',
    convert: switchQuote,
  },
}

// An unescaped newline is a newline preceded by an even number of backslashes.
const UNESCAPED_LINEBREAK_PATTERN = new RegExp(String.raw`(^|[^\\])(\\\\)*[${Array.from(LINEBREAKS).join('')}]`, 'u')

const AVOID_ESCAPE = 'avoid-escape'

export default createRule<RuleOptions, MessageIds>({
  name: 'quotes',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce the consistent use of either backticks, double, or single quotes',
    },

    fixable: 'code',

    schema: [
      {
        type: 'string',
        enum: ['single', 'double', 'backtick'],
      },
      {
        anyOf: [
          {
            type: 'string',
            enum: ['avoid-escape'],
          },
          {
            type: 'object',
            properties: {
              avoidEscape: {
                type: 'boolean',
              },
              allowTemplateLiterals: {
                type: 'boolean',
              },
              ignoreStringLiterals: {
                type: 'boolean',
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],

    messages: {
      wrongQuotes: 'Strings must use {{description}}.',
    },
  },

  create(context) {
    const quoteOption = context.options[0]
    const settings = QUOTE_SETTINGS[quoteOption || 'double']
    const options = context.options[1]
    const allowTemplateLiterals = options && typeof (options) === 'object' && options.allowTemplateLiterals === true
    const ignoreStringLiterals = options && typeof (options) === 'object' && options.ignoreStringLiterals === true
    const sourceCode = context.sourceCode
    let avoidEscape = options && typeof (options) === 'object' && options.avoidEscape === true

    // deprecated
    if (options === AVOID_ESCAPE)
      avoidEscape = true

    /**
     * Determines if a given node is part of JSX syntax.
     *
     * This function returns `true` in the following cases:
     *
     * - `<div className="foo"></div>` ... If the literal is an attribute value, the parent of the literal is `JSXAttribute`.
     * - `<div>foo</div>` ... If the literal is a text content, the parent of the literal is `JSXElement`.
     * - `<>foo</>` ... If the literal is a text content, the parent of the literal is `JSXFragment`.
     *
     * In particular, this function returns `false` in the following cases:
     *
     * - `<div className={"foo"}></div>`
     * - `<div>{"foo"}</div>`
     *
     * In both cases, inside of the braces is handled as normal JavaScript.
     * The braces are `JSXExpressionContainer` nodes.
     * @param node The Literal node to check.
     * @returns True if the node is a part of JSX, false if not.
     * @private
     */
    function isJSXLiteral(node: ASTNode) {
      if (!node.parent)
        return false

      return node.parent.type === 'JSXAttribute' || node.parent.type === 'JSXElement' || node.parent.type === 'JSXFragment'
    }

    /**
     * Checks whether or not a given node is a directive.
     * The directive is a `ExpressionStatement` which has only a string literal not surrounded by
     * parentheses.
     * @param node A node to check.
     * @returns Whether or not the node is a directive.
     * @private
     */
    function isDirective(node: ASTNode) {
      return (
        node.type === 'ExpressionStatement'
        && node.expression.type === 'Literal'
        && typeof node.expression.value === 'string'
        && !isParenthesised(sourceCode, node.expression)
      )
    }

    /**
     * Checks whether a specified node is either part of, or immediately follows a (possibly empty) directive prologue.
     * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-directive-prologues-and-the-use-strict-directive}
     * @param node A node to check.
     * @returns Whether a specified node is either part of, or immediately follows a (possibly empty) directive prologue.
     * @private
     */
    function isExpressionInOrJustAfterDirectivePrologue(node: ASTNode) {
      if (!node.parent)
        return false

      if (!isTopLevelExpressionStatement(node.parent))
        return false

      const block = node.parent.parent
      if (!block || !('body' in block) || !Array.isArray(block.body))
        return false

      // Check the node is at a prologue.
      for (let i = 0; i < block.body.length; ++i) {
        const statement = block.body[i]

        if (statement === node.parent)
          return true

        if (!isDirective(statement))
          break
      }

      return false
    }

    /**
     * Checks whether or not a given node is allowed as non backtick.
     * @param node A node to check.
     * @returns Whether or not the node is allowed as non backtick.
     * @private
     */
    function isAllowedAsNonBacktick(node: ASTNode) {
      const parent = node.parent
      if (!parent)
        return false

      switch (parent.type) {
        // Directive Prologues.
        case 'ExpressionStatement':
          return !isParenthesised(sourceCode, node) && isExpressionInOrJustAfterDirectivePrologue(node)

          // LiteralPropertyName.
        case 'Property':
        case 'PropertyDefinition':
        case 'MethodDefinition':
          return parent.key === node && !parent.computed

          // ModuleSpecifier.
        case 'ImportDeclaration':
        case 'ExportNamedDeclaration':
          return parent.source === node

          // ModuleExportName or ModuleSpecifier.
        case 'ExportAllDeclaration':
          return parent.exported === node || parent.source === node

          // ModuleExportName.
        case 'ImportSpecifier':
          return parent.imported === node

          // ModuleExportName.
        case 'ExportSpecifier':
          return parent.local === node || parent.exported === node

        case 'ImportAttribute':
          return parent.value === node

          // Others don't allow.
        default:
          return false
      }
    }

    /**
     * Checks whether or not a given TemplateLiteral node is actually using any of the special features provided by template literal strings.
     * @param node A TemplateLiteral node to check.
     * @returns Whether or not the TemplateLiteral node is using any of the special features provided by template literal strings.
     * @private
     */
    function isUsingFeatureOfTemplateLiteral(node: Tree.TemplateLiteral) {
      const hasTag = node.parent.type === 'TaggedTemplateExpression' && node === node.parent.quasi

      if (hasTag)
        return true

      const hasStringInterpolation = node.expressions.length > 0

      if (hasStringInterpolation)
        return true

      const isMultilineString = node.quasis.length >= 1 && UNESCAPED_LINEBREAK_PATTERN.test(node.quasis[0].value.raw)

      if (isMultilineString)
        return true

      return false
    }

    return {

      Literal(node) {
        if (ignoreStringLiterals)
          return

        const val = node.value
        const rawVal = node.raw

        if (settings && typeof val === 'string') {
          let isValid = (quoteOption === 'backtick' && isAllowedAsNonBacktick(node))
            || isJSXLiteral(node)
            || isSurroundedBy(rawVal, settings.quote)

          if (!isValid && avoidEscape)
            isValid = isSurroundedBy(rawVal, settings.alternateQuote) && rawVal.includes(settings.quote)

          if (!isValid) {
            context.report({
              node,
              messageId: 'wrongQuotes',
              data: {
                description: settings.description,
              },
              fix(fixer) {
                if (quoteOption === 'backtick' && hasOctalOrNonOctalDecimalEscapeSequence(rawVal)) {
                  /**
                   * An octal or non-octal decimal escape sequence in a template literal would
                   * produce syntax error, even in non-strict mode.
                   */
                  return null
                }

                return fixer.replaceText(node, settings.convert(node.raw))
              },
            })
          }
        }
      },

      TemplateLiteral(node) {
        // Don't throw an error if backticks are expected or a template literal feature is in use.
        if (
          allowTemplateLiterals
          || quoteOption === 'backtick'
          || isUsingFeatureOfTemplateLiteral(node)
        ) {
          return
        }

        if (avoidEscape && sourceCode.getText(node).includes(settings.quote))
          return

        context.report({
          node,
          messageId: 'wrongQuotes',
          data: {
            description: settings.description,
          },
          fix(fixer) {
            if (isTopLevelExpressionStatement(node.parent) && !isParenthesised(sourceCode, node)) {
              /**
               * TemplateLiterals aren't actually directives, but fixing them might turn
               * them into directives and change the behavior of the code.
               */
              return null
            }
            return fixer.replaceText(node, settings.convert(sourceCode.getText(node)))
          },
        })
      },
    }
  },
})
