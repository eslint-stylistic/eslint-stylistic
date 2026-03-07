import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-closing-bracket-location',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce closing bracket location in JSX',
    },
    fixable: 'code',
    schema: [{
      anyOf: [
        {
          type: 'string',
          enum: ['after-props', 'props-aligned', 'tag-aligned', 'line-aligned'],
        },
        {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              enum: ['after-props', 'props-aligned', 'tag-aligned', 'line-aligned'],
            },
          },
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            nonEmpty: {
              oneOf: [
                {
                  type: 'string',
                  enum: ['after-props', 'props-aligned', 'tag-aligned', 'line-aligned'],
                },
                {
                  type: 'boolean',
                  enum: [false],
                },
              ],
            },
            selfClosing: {
              oneOf: [
                {
                  type: 'string',
                  enum: ['after-props', 'props-aligned', 'tag-aligned', 'line-aligned'],
                },
                {
                  type: 'boolean',
                  enum: [false],
                },
              ],
            },
          },
          additionalProperties: false,
        },
      ],
    }],
    defaultOptions: ['tag-aligned'],
    messages: {
      bracketLocation: 'The closing bracket must be {{location}}{{details}}',
    },
  },
  create(context, [config]) {
    const MESSAGE_LOCATION = {
      'after-props': 'placed after the last prop',
      'after-tag': 'placed after the opening tag',
      'props-aligned': 'aligned with the last prop',
      'tag-aligned': 'aligned with the opening tag',
      'line-aligned': 'aligned with the line containing the opening tag',
    } as const

    const {
      nonEmpty = 'tag-aligned',
      selfClosing = 'tag-aligned',
    } = typeof config === 'string'
      ? {
          nonEmpty: config,
          selfClosing: config,
        }
      : 'location' in config!
        ? {
            nonEmpty: config.location,
            selfClosing: config.location,
          }
        : config as Extract<RuleOptions[0], { nonEmpty: string }>

    /**
     * Get expected location for the closing bracket
     * @param tokens Locations of the opening bracket, closing bracket and last prop
     * @return Expected location for the closing bracket
     */
    function getExpectedLocation(tokens: Tokens) {
      let location
      // Is always after the opening tag if there is no props
      if (typeof tokens.lastProp === 'undefined')
        location = 'after-tag'
      // Is always after the last prop if this one is on the same line as the opening bracket
      else if (tokens.opening.line === (tokens.lastProp as LastPropLocation).lastLine)
        location = 'after-props'
      // Else use configuration dependent on selfClosing property
      else
        location = tokens.selfClosing ? selfClosing : nonEmpty

      return location
    }

    /**
     * Get the correct 0-indexed column for the closing bracket, given the
     * expected location.
     * @param tokens Locations of the opening bracket, closing bracket and last prop
     * @param expectedLocation Expected location for the closing bracket
     * @return The correct column for the closing bracket, or null
     */
    function getCorrectColumn(tokens: Tokens, expectedLocation: string | false | undefined): number | null {
      switch (expectedLocation) {
        case 'props-aligned':
          return (tokens.lastProp as LastPropLocation).column
        case 'tag-aligned':
          return tokens.opening.column
        case 'line-aligned':
          return tokens.openingStartOfLine.column!
        default:
          return null
      }
    }

    /**
     * Check if the closing bracket is correctly located
     * @param tokens Locations of the opening bracket, closing bracket and last prop
     * @param expectedLocation Expected location for the closing bracket
     * @return True if the closing bracket is correctly located, false if not
     */
    function hasCorrectLocation(tokens: Tokens, expectedLocation: string | false | undefined): boolean {
      switch (expectedLocation) {
        case 'after-tag':
          return tokens.tag.line === tokens.closing.line
        case 'after-props':
          return (tokens.lastProp as LastPropLocation).lastLine === tokens.closing.line
        case 'props-aligned':
        case 'tag-aligned':
        case 'line-aligned': {
          const correctColumn = getCorrectColumn(tokens, expectedLocation)
          return correctColumn === tokens.closing.column
        }
        default:
          return true
      }
    }

    /**
     * Get the characters used for indentation on the line to be matched
     * @param tokens Locations of the opening bracket, closing bracket and last prop
     * @param expectedLocation Expected location for the closing bracket
     * @param [correctColumn] Expected column for the closing bracket. Default to 0
     * @return The characters used for indentation
     */
    function getIndentation(tokens: Tokens, expectedLocation: string, correctColumn: number): string {
      const newColumn = correctColumn || 0
      let indentation
      let spaces: string[] = []
      switch (expectedLocation) {
        case 'props-aligned':
          indentation = /^\s*/.exec(context.sourceCode.lines[(tokens.lastProp as LastPropLocation).firstLine - 1])![0]
          break
        case 'tag-aligned':
        case 'line-aligned':
          indentation = /^\s*/.exec(context.sourceCode.lines[tokens.opening.line - 1])![0]
          break
        default:
          indentation = ''
      }
      if (indentation.length + 1 < newColumn) {
        // Non-whitespace characters were included in the column offset
        spaces = Array.from({ length: +correctColumn + 1 - indentation.length })
      }
      return indentation + spaces.join(' ')
    }

    interface LastPropLocation {
      column: number
      firstLine: number
      lastLine: number
    }

    type LastProp = LastPropLocation | undefined | Tree.JSXOpeningElement['attributes'][number]

    type Tokens = ReturnType<typeof getTokensLocations>

    /**
     * Get the locations of the opening bracket, closing bracket, last prop, and
     * start of opening line.
     * @param node The node to check
     * @return Locations of the opening bracket, closing bracket, last
     * prop and start of opening line.
     */
    function getTokensLocations(node: Tree.JSXOpeningElement) {
      const sourceCode = context.sourceCode
      const opening = sourceCode.getFirstToken(node)!.loc.start
      const closing = sourceCode.getLastTokens(node, node.selfClosing ? 2 : 1)[0].loc.start
      const tag = sourceCode.getFirstToken(node.name)!.loc.start
      let lastProp: LastProp
      if (node.attributes.length) {
        lastProp = node.attributes[node.attributes.length - 1]
        lastProp = {
          column: sourceCode.getFirstToken(lastProp)!.loc.start.column,
          firstLine: sourceCode.getFirstToken(lastProp)!.loc.start.line,
          lastLine: sourceCode.getLastToken(lastProp)!.loc.end.line,
        }
      }
      const openingLine = sourceCode.lines[opening.line - 1]
      const closingLine = sourceCode.lines[closing.line - 1]
      const isTab = {
        openTab: /^\t/.test(openingLine),
        closeTab: /^\t/.test(closingLine),
      }
      const openingStartOfLine = {
        column: /^\s*/.exec(openingLine)?.[0].length,
        line: opening.line,
      }
      return {
        isTab,
        tag,
        opening,
        closing,
        lastProp,
        selfClosing: node.selfClosing,
        openingStartOfLine,
      }
    }

    return {
      'JSXOpeningElement:exit': function (node) {
        const lastAttributeNode = node.attributes.at(-1)
        const cachedLastAttributeEndPos = lastAttributeNode ? lastAttributeNode.range[1] : null

        let expectedNextLine: boolean | undefined
        const tokens = getTokensLocations(node)
        let expectedLocation = getExpectedLocation(tokens)
        let usingSameIndentation = true

        if (expectedLocation === 'tag-aligned')
          usingSameIndentation = tokens.isTab.openTab === tokens.isTab.closeTab

        const lastComment = context.sourceCode.getCommentsInside(node).at(-1)
        // when last prop(or start tag) need to be on the same line with closing tag
        // but have comment between last prop and closing tag. change to 'line-aligned'
        const hasTrailingComment = lastComment && lastComment.range[0] > (lastAttributeNode ?? node.name).range[1]
        if (
          (expectedLocation === 'after-props' || expectedLocation === 'after-tag')
          && !(hasCorrectLocation(tokens, expectedLocation) && usingSameIndentation)
          && hasTrailingComment
        ) {
          expectedLocation = 'line-aligned'
        }

        if (hasCorrectLocation(tokens, expectedLocation) && usingSameIndentation)
          return

        const data: {
          location: string
          details?: string
        } = {
          location: MESSAGE_LOCATION[expectedLocation as keyof typeof MESSAGE_LOCATION],
          details: '',
        }
        const correctColumn = getCorrectColumn(tokens, expectedLocation)

        if (correctColumn !== null) {
          expectedNextLine = tokens.lastProp
            && ((tokens.lastProp as LastPropLocation).lastLine === tokens.closing.line)
          data.details = ` (expected column ${correctColumn + 1}${expectedNextLine ? ' on the next line)' : ')'}`
        }

        context.report({
          node,
          messageId: 'bracketLocation',
          loc: tokens.closing,
          data,
          fix(fixer) {
            const closingTag = tokens.selfClosing ? '/>' : '>'
            switch (expectedLocation) {
              case 'after-tag':
                if (cachedLastAttributeEndPos)
                  return fixer.replaceTextRange([cachedLastAttributeEndPos, node.range[1]], (expectedNextLine ? '\n' : '') + closingTag)

                return fixer.replaceTextRange([node.name.range[1], node.range[1]], (expectedNextLine ? '\n' : ' ') + closingTag)
              case 'after-props':
                return fixer.replaceTextRange([cachedLastAttributeEndPos!, node.range[1]], (expectedNextLine ? '\n' : '') + closingTag)
              case 'props-aligned':
              case 'tag-aligned':
              case 'line-aligned': {
                const rangeStart = hasTrailingComment ? lastComment.range[1] : cachedLastAttributeEndPos
                return fixer.replaceTextRange([rangeStart!, node.range[1]], `\n${getIndentation(tokens, expectedLocation, correctColumn!)}${closingTag}`)
              }
            }
            return null
          },
        })
      },
    }
  },
})
