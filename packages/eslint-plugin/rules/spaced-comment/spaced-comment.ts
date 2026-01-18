/**
 * @fileoverview Source code for spaced-comments rule
 * @author Gyandeep Singh
 */
import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isHashbangComment, LINEBREAKS } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import escapeRegExp from 'escape-string-regexp'

/**
 * Escapes the control characters of a given string.
 * @param s A string to escape.
 * @returns An escaped string.
 */
function escape(s: string) {
  return `(?:${escapeRegExp(s)})`
}

/**
 * Escapes the control characters of a given string.
 * And adds a repeat flag.
 * @param s A string to escape.
 * @returns An escaped string.
 */
function escapeAndRepeat(s: string) {
  return `${escape(s)}+`
}

/**
 * Parses `markers` option.
 * If markers don't include `"*"`, this adds `"*"` to allow JSDoc comments.
 * @param [markers] A marker list.
 * @returns A marker list.
 */
function parseMarkersOption(markers: string[]) {
  // `*` is a marker for JSDoc comments.
  if (!markers.includes('*'))
    return markers.concat('*')

  return markers
}

/**
 * Creates string pattern for exceptions.
 * Generated pattern:
 *
 * 1. A space or an exception pattern sequence.
 * @param exceptions An exception pattern list.
 * @returns A regular expression string for exceptions.
 */
function createExceptionsPattern(exceptions: string[]) {
  let pattern = ''

  /**
   * A space or an exception pattern sequence.
   * []                 ==> "\s"
   * ["-"]              ==> "(?:\s|\-+$)"
   * ["-", "="]         ==> "(?:\s|(?:\-+|=+)$)"
   * ["-", "=", "--=="] ==> "(?:\s|(?:\-+|=+|(?:\-\-==)+)$)" ==> https://jex.im/regulex/#!embed=false&flags=&re=(%3F%3A%5Cs%7C(%3F%3A%5C-%2B%7C%3D%2B%7C(%3F%3A%5C-%5C-%3D%3D)%2B)%24)
   */
  if (exceptions.length === 0) {
    // a space.
    pattern += '\\s'
  }
  else {
    // a space or...
    pattern += '(?:\\s|'

    if (exceptions.length === 1) {
      // a sequence of the exception pattern.
      pattern += escapeAndRepeat(exceptions[0])
    }
    else {
      // a sequence of one of the exception patterns.
      pattern += '(?:'
      pattern += exceptions.map(escapeAndRepeat).join('|')
      pattern += ')'
    }
    pattern += `(?:$|[${Array.from(LINEBREAKS).join('')}]))`
  }

  return pattern
}

/**
 * Creates RegExp object for `always` mode.
 * Generated pattern for beginning of comment:
 *
 * 1. First, a marker or nothing.
 * 2. Next, a space or an exception pattern sequence.
 * @param markers A marker list.
 * @param exceptions An exception pattern list.
 * @returns A RegExp object for the beginning of a comment in `always` mode.
 */
function createAlwaysStylePattern(markers: string[], exceptions: string[]) {
  let pattern = '^'

  /**
   * A marker or nothing.
   * ["*"]            ==> "\*?"
   * ["*", "!"]       ==> "(?:\*|!)?"
   * ["*", "/", "!<"] ==> "(?:\*|\/|(?:!<))?" ==> https://jex.im/regulex/#!embed=false&flags=&re=(%3F%3A%5C*%7C%5C%2F%7C(%3F%3A!%3C))%3F
   */
  if (markers.length === 1) {
    // the marker.
    pattern += escape(markers[0])
  }
  else {
    // one of markers.
    pattern += '(?:'
    pattern += markers.map(escape).join('|')
    pattern += ')'
  }

  pattern += '?' // or nothing.
  pattern += createExceptionsPattern(exceptions)

  return new RegExp(pattern, 'u')
}

/**
 * Creates RegExp object for `never` mode.
 * Generated pattern for beginning of comment:
 *
 * 1. First, a marker or nothing (captured).
 * 2. Next, a space or a tab.
 * @param markers A marker list.
 * @returns A RegExp object for `never` mode.
 */
function createNeverStylePattern(markers: string[]) {
  const pattern = `^(${markers.map(escape).join('|')})?[ \t]+`

  return new RegExp(pattern, 'u')
}

type Style = 'block' | 'line'

interface StyleRuleRegExp {
  beginRegex: RegExp
  endRegex: RegExp
  hasExceptions: boolean
  captureMarker: RegExp
  markers: Set<string>
}

export default createRule<RuleOptions, MessageIds>({
  name: 'spaced-comment',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing after the `//` or `/*` in a comment',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          markers: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          line: {
            type: 'object',
            properties: {
              exceptions: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              markers: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            additionalProperties: false,
          },
          block: {
            type: 'object',
            properties: {
              exceptions: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              markers: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              balanced: {
                type: 'boolean',
                default: false,
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: ['always'],
    messages: {
      unexpectedSpaceAfterMarker: 'Unexpected space or tab after marker ({{refChar}}) in comment.',
      expectedExceptionAfter: 'Expected exception block, space or tab after \'{{refChar}}\' in comment.',
      unexpectedSpaceBefore: 'Unexpected space or tab before \'*/\' in comment.',
      unexpectedSpaceAfter: 'Unexpected space or tab after \'{{refChar}}\' in comment.',
      expectedSpaceBefore: 'Expected space or tab before \'*/\' in comment.',
      expectedSpaceAfter: 'Expected space or tab after \'{{refChar}}\' in comment.',
    },
  },
  create(context, [style, config = {}]) {
    const sourceCode = context.sourceCode

    const requireSpace = style !== 'never'

    /**
     * Parse the second options.
     * If markers don't include `"*"`, it's added automatically for JSDoc
     * comments.
     */
    const balanced = config.block && config.block.balanced

    const styleRules = ['block', 'line'].reduce((rule, type: string) => {
      const nodeType = type as Style
      const markers = parseMarkersOption(config[nodeType] && config[nodeType]?.markers || config.markers || [])
      const exceptions = config[nodeType] && config[nodeType]?.exceptions || config.exceptions || []
      const endNeverPattern = '[ \t]+$'

      // Create RegExp object for valid patterns.
      rule[nodeType] = {
        beginRegex: requireSpace ? createAlwaysStylePattern(markers, exceptions) : createNeverStylePattern(markers),
        endRegex: balanced && requireSpace ? new RegExp(`${createExceptionsPattern(exceptions)}$`, 'u') : new RegExp(endNeverPattern, 'u'),
        hasExceptions: exceptions.length > 0,
        captureMarker: new RegExp(`^(${markers.map(escape).join('|')})`, 'u'),
        markers: new Set(markers),
      }

      return rule
    }, {} as { [key in Style]: StyleRuleRegExp; })

    /**
     * Reports a beginning spacing error with an appropriate message.
     * @param node A comment node to check.
     * @param messageId An error message to report.
     * @param match An array of match results for markers.
     * @param refChar Character used for reference in the error message.
     */
    function reportBegin(node: Tree.Comment, messageId: MessageIds, match: RegExpExecArray | null, refChar: string) {
      const type = node.type.toLowerCase()
      const commentIdentifier = type === 'block' ? '/*' : '//'

      context.report({
        node,
        fix(fixer) {
          const start = node.range[0]
          let end = start + 2

          if (requireSpace) {
            if (match)
              end += match[0].length

            return fixer.insertTextAfterRange([start, end], ' ')
          }
          if (match)
            end += match[0].length

          return fixer.replaceTextRange([start, end], commentIdentifier + (match && match[1] ? match[1] : ''))
        },
        messageId,
        data: { refChar },
      })
    }

    /**
     * Reports an ending spacing error with an appropriate message.
     * @param node A comment node to check.
     * @param messageId An error message to report.
     * @param match An array of the matched whitespace characters.
     */
    function reportEnd(node: Tree.Comment, messageId: MessageIds, match: RegExpExecArray | null) {
      context.report({
        node,
        fix(fixer) {
          if (requireSpace)
            return fixer.insertTextAfterRange([node.range[0], node.range[1] - 2], ' ')

          const end = node.range[1] - 2
          let start = end
          if (match)
            start -= match[0].length

          return fixer.replaceTextRange([start, end], '')
        },
        messageId,
      })
    }

    /**
     * Reports a given comment if it's invalid.
     * @param node a comment node to check.
     */
    function checkCommentForSpace(node: Tree.Comment) {
      const type = node.type.toLowerCase() as Style
      const rule = styleRules[type]
      const commentIdentifier = type === 'block' ? '/*' : '//'

      // Ignores empty comments and comments that consist only of a marker.
      if (node.value.length === 0 || rule.markers.has(node.value))
        return

      // Ignores typescript triple-slash directive.
      if (type === 'line' && (node.value.startsWith('/ <reference') || node.value.startsWith('/ <amd')))
        return

      const beginMatch = rule.beginRegex.exec(node.value)
      const endMatch = rule.endRegex.exec(node.value)

      // Checks.
      if (requireSpace) {
        if (!beginMatch) {
          const hasMarker = rule.captureMarker.exec(node.value)
          const marker = hasMarker ? commentIdentifier + hasMarker[0] : commentIdentifier

          if (rule.hasExceptions)
            reportBegin(node, 'expectedExceptionAfter', hasMarker, marker)
          else
            reportBegin(node, 'expectedSpaceAfter', hasMarker, marker)
        }

        if (balanced && type === 'block' && !endMatch)
          reportEnd(node, 'expectedSpaceBefore', null)
      }
      else {
        if (beginMatch) {
          if (!beginMatch[1])
            reportBegin(node, 'unexpectedSpaceAfter', beginMatch, commentIdentifier)
          else
            reportBegin(node, 'unexpectedSpaceAfterMarker', beginMatch, beginMatch[1])
        }

        if (balanced && type === 'block' && endMatch)
          reportEnd(node, 'unexpectedSpaceBefore', endMatch)
      }
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.forEach((comment) => {
          if (!isHashbangComment(comment))
            checkCommentForSpace(comment)
        })
      },
    }
  },
})
