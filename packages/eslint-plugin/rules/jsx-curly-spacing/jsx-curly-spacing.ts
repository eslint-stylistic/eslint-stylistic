import type { ASTNode, JSONSchema, RuleFixer, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const SPACING = {
  always: 'always',
  never: 'never',
} as const
const SPACING_VALUES = ['always', 'never']

const BASIC_CONFIG_SCHEMA = {
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
      additionalProperties: false,
    },
  },
  additionalProperties: false,
} satisfies JSONSchema.JSONSchema4ObjectSchema

const BASIC_CONFIG_OR_BOOLEAN_SCHEMA = {
  anyOf: [
    BASIC_CONFIG_SCHEMA,
    {
      type: 'boolean',
    },
  ],
} satisfies JSONSchema.JSONSchema4AnyOfSchema

type BasicConfig = Pick<Extract<RuleOptions[0], { when?: any }>, keyof typeof BASIC_CONFIG_SCHEMA['properties']>

interface NormalizedConfig extends BasicConfig {
  objectLiteralSpaces?: 'always' | 'never'
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-curly-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce or disallow spaces inside of curly braces in JSX attributes and expressions',
    },
    fixable: 'code',
    schema: {
      type: 'array',
      items: [{
        anyOf: [
          {
            type: 'object',
            additionalProperties: false,
            properties: {
              ...BASIC_CONFIG_SCHEMA.properties,
              attributes: BASIC_CONFIG_OR_BOOLEAN_SCHEMA,
              children: BASIC_CONFIG_OR_BOOLEAN_SCHEMA,
            },
          },
          {
            type: 'string',
            enum: SPACING_VALUES,
          },
        ],
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
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      }],
    },
    defaultOptions: [{ when: 'never', allowMultiline: true }],
    messages: {
      noNewlineAfter: 'There should be no newline after \'{{token}}\'',
      noNewlineBefore: 'There should be no newline before \'{{token}}\'',
      noSpaceAfter: 'There should be no space after \'{{token}}\'',
      noSpaceBefore: 'There should be no space before \'{{token}}\'',
      spaceNeededAfter: 'A space is required after \'{{token}}\'',
      spaceNeededBefore: 'A space is required before \'{{token}}\'',
    },
  },
  create(context, [firstOption, secondOption = {}]) {
    const {
      when: defaultWhen = 'never',
      allowMultiline: defaultAllowMultiline = true,
      spacing: defaultSpacing = {},
      attributes = true,
      children = false,
    } = typeof firstOption === 'string'
      ? {
        when: firstOption,
        ...secondOption,
      } satisfies BasicConfig
      : firstOption!

    type NonStringConfig = Exclude<RuleOptions[0], undefined | string>

    function normalizeConfig(configOrTrue: NonStringConfig | true): NormalizedConfig {
      const {
        when = defaultWhen,
        allowMultiline = defaultAllowMultiline,
        spacing = defaultSpacing,
      } = configOrTrue === true ? {} : configOrTrue

      return {
        when,
        allowMultiline,
        objectLiteralSpaces: spacing.objectLiterals ?? when,
      }
    }

    const attributesConfig = attributes ? normalizeConfig(attributes) : null
    const childrenConfig = children ? normalizeConfig(children) : null

    const sourceCode = context.sourceCode

    /**
     * Trims text of whitespace between two ranges
     * @param fixer - the eslint fixer object
     * @param fromLoc - the start location
     * @param toLoc - the end location
     * @param mode - either 'start' or 'end'
     * @param spacing - a spacing value that will optionally add a space to the removed text
     */
    function fixByTrimmingWhitespace(fixer: RuleFixer, fromLoc: number, toLoc: number, mode: string, spacing: string = '') {
      let replacementText = sourceCode.text.slice(fromLoc, toLoc)
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
    function reportNoBeginningNewline(node: ASTNode, token: Token, spacing: string) {
      context.report({
        node,
        loc: token.loc.start,
        messageId: 'noNewlineAfter',
        data: {
          token: token.value,
        },
        fix(fixer) {
          const nextToken = sourceCode.getTokenAfter(token)
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
          const previousToken = sourceCode.getTokenBefore(token)
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
        if (!sourceCode.isSpaceBetween(first, second))
          reportRequiredBeginningSpace(node, first)
        else if (!config.allowMultiline && !isTokenOnSameLine(first, second))
          reportNoBeginningNewline(node, first, spacing)

        if (!sourceCode.isSpaceBetween(penultimate, last))
          reportRequiredEndingSpace(node, last)
        else if (!config.allowMultiline && !isTokenOnSameLine(penultimate, last))
          reportNoEndingNewline(node, last, spacing)
      }
      else if (spacing === SPACING.never) {
        if (!isTokenOnSameLine(first, second)) {
          if (!config.allowMultiline)
            reportNoBeginningNewline(node, first, spacing)
        }
        else if (sourceCode.isSpaceBetween(first, second)) {
          reportNoBeginningSpace(node, first)
        }
        if (!isTokenOnSameLine(penultimate, last)) {
          if (!config.allowMultiline)
            reportNoEndingNewline(node, last, spacing)
        }
        else if (sourceCode.isSpaceBetween(penultimate, last)) {
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
