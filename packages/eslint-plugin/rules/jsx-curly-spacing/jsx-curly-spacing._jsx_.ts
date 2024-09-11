/**
 * @fileoverview Enforce or disallow spaces inside of curly braces in JSX attributes.
 * @author Jamund Ferguson
 * @author Brandyn Bennett
 * @author Michael Ficarra
 * @author Vignesh Anand
 * @author Jamund Ferguson
 * @author Yannick Croissant
 * @author Erik Wendel
 */

import { createRule } from '#utils/create-rule'
import type { ASTNode, RuleFixer, Token, Tree } from '#types'
import type { BasicConfig, MessageIds, RuleOptions } from './types'

const SPACING = {
  always: 'always',
  never: 'never',
} as const
const SPACING_VALUES = [SPACING.always, SPACING.never]

const messages = {
  noNewlineAfter: 'There should be no newline after \'{{token}}\'',
  noNewlineBefore: 'There should be no newline before \'{{token}}\'',
  noSpaceAfter: 'There should be no space after \'{{token}}\'',
  noSpaceBefore: 'There should be no space before \'{{token}}\'',
  spaceNeededAfter: 'A space is required after \'{{token}}\'',
  spaceNeededBefore: 'A space is required before \'{{token}}\'',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-curly-spacing',
  package: 'jsx',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce or disallow spaces inside of curly braces in JSX attributes and expressions',
    },
    fixable: 'code',

    messages,

    schema: {
      definitions: {
        basicConfig: {
          type: 'object',
          properties: {
            when: {
              type: 'string',
              enum: SPACING_VALUES,
            },
            allowMultiline: {
              type: 'boolean',
            },
            spacing: {
              type: 'object',
              properties: {
                objectLiterals: {
                  type: 'string',
                  enum: SPACING_VALUES,
                },
              },
            },
          },
        },
        basicConfigOrBoolean: {
          anyOf: [{
            $ref: '#/definitions/basicConfig',
          }, {
            type: 'boolean',
          }],
        },
      },
      type: 'array',
      items: [{
        anyOf: [{
          allOf: [{
            $ref: '#/definitions/basicConfig',
          }, {
            type: 'object',
            properties: {
              attributes: {
                $ref: '#/definitions/basicConfigOrBoolean',
              },
              children: {
                $ref: '#/definitions/basicConfigOrBoolean',
              },
            },
          }],
        }, {
          type: 'string',
          enum: SPACING_VALUES,
        }],
      }, {
        type: 'object',
        properties: {
          allowMultiline: {
            type: 'boolean',
          },
          spacing: {
            type: 'object',
            properties: {
              objectLiterals: {
                type: 'string',
                enum: SPACING_VALUES,
              },
            },
          },
        },
        additionalProperties: false,
      }],
    },
  },

  create(context) {
    function normalizeConfig(configOrTrue: RuleOptions[0] | true, defaults: BasicConfig, lastPass: boolean = false) {
      const config = configOrTrue === true ? {} : configOrTrue as NonStringConfig
      const when = (config as BasicConfig).when || defaults.when
      const allowMultiline = 'allowMultiline' in config ? config.allowMultiline : defaults.allowMultiline
      const spacing = (config as BasicConfig).spacing || {}
      let objectLiteralSpaces = spacing.objectLiterals || defaults.objectLiteralSpaces
      if (lastPass) {
        // On the final pass assign the values that should be derived from others if they are still undefined
        objectLiteralSpaces = objectLiteralSpaces || when
      }

      return {
        when,
        allowMultiline,
        objectLiteralSpaces,
      }
    }

    type NonStringConfig = Exclude<RuleOptions[0], undefined | string>

    const DEFAULT_WHEN = SPACING.never
    const DEFAULT_ALLOW_MULTILINE = true
    const DEFAULT_ATTRIBUTES = true
    const DEFAULT_CHILDREN = false

    let originalConfig = context.options[0] || {}
    if (SPACING_VALUES.includes(originalConfig as keyof typeof SPACING))
      originalConfig = Object.assign({ when: context.options[0] }, context.options[1]) as BasicConfig

    originalConfig = originalConfig as NonStringConfig
    const defaultConfig = normalizeConfig(originalConfig, {
      when: DEFAULT_WHEN,
      allowMultiline: DEFAULT_ALLOW_MULTILINE,
    })
    const attributes = 'attributes' in originalConfig ? originalConfig.attributes : DEFAULT_ATTRIBUTES
    const attributesConfig = attributes ? normalizeConfig(attributes, defaultConfig, true) : null
    const children = 'children' in originalConfig ? originalConfig.children : DEFAULT_CHILDREN
    const childrenConfig = children ? normalizeConfig(children, defaultConfig, true) : null

    /**
     * Determines whether two adjacent tokens have a newline between them.
     * @param - The left token object.
     * @param right - The right token object.
     * @returns Whether or not there is a newline between the tokens.
     */
    function isMultiline(left: Tree.Token, right: Tree.Token) {
      return left.loc.end.line !== right.loc.start.line
    }

    /**
     * Trims text of whitespace between two ranges
     * @param fixer - the eslint fixer object
     * @param fromLoc - the start location
     * @param toLoc - the end location
     * @param mode - either 'start' or 'end'
     * @param spacing - a spacing value that will optionally add a space to the removed text
     */
    function fixByTrimmingWhitespace(fixer: RuleFixer, fromLoc: number, toLoc: number, mode: string, spacing: string = '') {
      let replacementText = context.sourceCode.text.slice(fromLoc, toLoc)
      if (mode === 'start')
        replacementText = replacementText.replace(/^\s+/gm, '')
      else
        replacementText = replacementText.replace(/\s+$/gm, '')

      if (spacing === SPACING.always) {
        if (mode === 'start')
          replacementText += ' '
        else
          replacementText = ` ${replacementText}`
      }
      return fixer.replaceTextRange([fromLoc, toLoc], replacementText)
    }

    /**
     * Reports that there shouldn't be a newline after the first token
     * @param node - The node to report in the event of an error.
     * @param token - The token to use for the report.
     * @param spacing
     */
    function reportNoBeginningNewline(node: ASTNode, token: Tree.Token, spacing: string) {
      context.report({
        node,
        loc: token.loc.start,
        messageId: 'noNewlineAfter',
        data: {
          token: token.value,
        },
        fix(fixer) {
          const nextToken = context.sourceCode.getTokenAfter(token)
          return fixByTrimmingWhitespace(fixer, token.range[1], nextToken!.range[0], 'start', spacing)
        },
      })
    }

    /**
     * Reports that there shouldn't be a newline before the last token
     * @param node - The node to report in the event of an error.
     * @param token - The token to use for the report.
     * @param spacing
     */
    function reportNoEndingNewline(node: ASTNode, token: Token, spacing: string) {
      context.report({
        node,
        loc: token.loc.start,
        messageId: 'noNewlineBefore',
        data: {
          token: token.value,
        },
        fix(fixer) {
          const previousToken = context.sourceCode.getTokenBefore(token)
          return fixByTrimmingWhitespace(fixer, previousToken!.range[1], token.range[0], 'end', spacing)
        },
      })
    }

    /**
     * Reports that there shouldn't be a space after the first token
     * @param node - The node to report in the event of an error.
     * @param token - The token to use for the report.
     */
    function reportNoBeginningSpace(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc.start,
        messageId: 'noSpaceAfter',
        data: {
          token: token.value,
        },
        fix(fixer) {
          const sourceCode = context.sourceCode
          const nextToken = sourceCode.getTokenAfter(token)!
          const nextComment = sourceCode.getCommentsAfter(token)

          // Take comments into consideration to narrow the fix range to what is actually affected. (See #1414)
          if (nextComment.length > 0)
            return fixByTrimmingWhitespace(fixer, token.range[1], Math.min(nextToken.range[0], nextComment[0]!.range[0]), 'start')

          return fixByTrimmingWhitespace(fixer, token.range[1], nextToken.range[0], 'start')
        },
      })
    }

    /**
     * Reports that there shouldn't be a space before the last token
     * @param node - The node to report in the event of an error.
     * @param token - The token to use for the report.
     */
    function reportNoEndingSpace(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc.start,
        messageId: 'noSpaceBefore',
        data: {
          token: token.value,
        },
        fix(fixer) {
          const sourceCode = context.sourceCode
          const previousToken = sourceCode.getTokenBefore(token)!
          const previousComment = sourceCode.getCommentsBefore(token)

          // Take comments into consideration to narrow the fix range to what is actually affected. (See #1414)
          if (previousComment.length > 0)
            return fixByTrimmingWhitespace(fixer, Math.max(previousToken.range[1], previousComment[0]!.range[1]), token.range[0], 'end')

          return fixByTrimmingWhitespace(fixer, previousToken.range[1], token.range[0], 'end')
        },
      })
    }

    /**
     * Reports that there should be a space after the first token
     * @param node - The node to report in the event of an error.
     * @param token - The token to use for the report.
     */
    function reportRequiredBeginningSpace(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc.start,
        messageId: 'spaceNeededAfter',
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.insertTextAfter(token, ' ')
        },
      })
    }

    /**
     * Reports that there should be a space before the last token
     * @param node - The node to report in the event of an error.
     * @param token - The token to use for the report.
     */
    function reportRequiredEndingSpace(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc.start,
        messageId: 'spaceNeededBefore',
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.insertTextBefore(token, ' ')
        },
      })
    }

    /**
     * Determines if spacing in curly braces is valid.
     * @param node The AST node to check.
     */
    function validateBraceSpacing(node: ASTNode) {
      let config
      switch (node.parent?.type) {
        case 'JSXAttribute':
        case 'JSXOpeningElement':
          config = attributesConfig
          break

        case 'JSXElement':
        case 'JSXFragment':
          config = childrenConfig
          break

        default:
          return
      }
      if (config === null)
        return

      const sourceCode = context.sourceCode
      const first = sourceCode.getFirstToken(node)!
      const last = sourceCode.getLastToken(node)!
      let second = sourceCode.getTokenAfter(first, { includeComments: true })!
      let penultimate = sourceCode.getTokenBefore(last, { includeComments: true })!

      if (!second) {
        second = sourceCode.getTokenAfter(first)!
        const leadingComments = sourceCode.getCommentsBefore(second)
        second = leadingComments ? leadingComments[0] : second
      }
      if (!penultimate) {
        penultimate = sourceCode.getTokenBefore(last)!
        const trailingComments = sourceCode.getCommentsAfter(penultimate)
        penultimate = trailingComments ? trailingComments[trailingComments.length - 1] : penultimate
      }

      const isObjectLiteral = first.value === second.value
      const spacing = isObjectLiteral ? config.objectLiteralSpaces : config.when
      if (spacing === SPACING.always) {
        if (!sourceCode.isSpaceBetweenTokens(first, second))
          reportRequiredBeginningSpace(node, first)
        else if (!config.allowMultiline && isMultiline(first, second))
          reportNoBeginningNewline(node, first, spacing)

        if (!sourceCode.isSpaceBetweenTokens(penultimate, last))
          reportRequiredEndingSpace(node, last)
        else if (!config.allowMultiline && isMultiline(penultimate, last))
          reportNoEndingNewline(node, last, spacing)
      }
      else if (spacing === SPACING.never) {
        if (isMultiline(first, second)) {
          if (!config.allowMultiline)
            reportNoBeginningNewline(node, first, spacing)
        }
        else if (sourceCode.isSpaceBetweenTokens(first, second)) {
          reportNoBeginningSpace(node, first)
        }
        if (isMultiline(penultimate, last)) {
          if (!config.allowMultiline)
            reportNoEndingNewline(node, last, spacing)
        }
        else if (sourceCode.isSpaceBetweenTokens(penultimate, last)) {
          reportNoEndingSpace(node, last)
        }
      }
    }

    return {
      JSXExpressionContainer: validateBraceSpacing,
      JSXSpreadAttribute: validateBraceSpacing,
    }
  },
})
