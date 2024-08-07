/**
 * @fileoverview Limit to one expression per line in JSX
 * @author Mark Ivan Allen <Vydia.com>
 */

import type { ASTNode, Token, Tree } from '@shared/types'
import { createRule } from '../../utils/createRule'
import { docsUrl } from '../../utils/docsUrl'
import { isWhiteSpaces } from '../../utils/jsx'
import type { MessageIds, RuleOptions } from './types'

const optionDefaults = {
  allow: 'none',
}

const messages = {
  moveToNewLine: '`{{descriptor}}` must be placed on a new line',
}

type Child = Tree.JSXChild | Tree.JSXText | Tree.Literal

export default createRule<RuleOptions, MessageIds>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Require one JSX element per line',
      url: docsUrl('jsx-one-expression-per-line'),
    },

    fixable: 'whitespace',

    messages,

    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'string',
            enum: ['none', 'literal', 'single-child', 'single-line', 'non-jsx'],
          },
        },
        default: optionDefaults,
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options: NonNullable<RuleOptions[0]> = Object.assign({}, optionDefaults, context.options[0])

    function nodeKey(node: ASTNode) {
      return `${node.loc.start.line},${node.loc.start.column}`
    }

    function nodeDescriptor(n: Child): string {
      return ('openingElement' in n && n.openingElement && 'name' in n.openingElement.name)
        ? String(n.openingElement.name.name)
        : context.sourceCode.getText(n).replace(/\n/g, '')
    }

    function handleJSX(node: Tree.JSXElement | Tree.JSXFragment) {
      const children = node.children as Child[]

      if (!children || !children.length)
        return

      if (
        options.allow === 'non-jsx'
        && !children.find(child => (child.type === 'JSXFragment' || child.type === 'JSXElement'))
      ) {
        return
      }

      const openingElement = (<Tree.JSXElement>node).openingElement || (<Tree.JSXFragment>node).openingFragment
      const closingElement = (<Tree.JSXElement>node).closingElement || (<Tree.JSXFragment>node).closingFragment
      const openingElementStartLine = openingElement.loc.start.line
      const openingElementEndLine = openingElement.loc.end.line
      const closingElementStartLine = closingElement.loc.start.line
      const closingElementEndLine = closingElement.loc.end.line

      if (children.length === 1) {
        const child = children[0]
        if (
          openingElementStartLine === openingElementEndLine
          && openingElementEndLine === closingElementStartLine
          && closingElementStartLine === closingElementEndLine
          && closingElementEndLine === child.loc.start.line
          && child.loc.start.line === child.loc.end.line
        ) {
          if (
            options.allow === 'single-child'
            || (options.allow === 'literal' && (child.type === 'Literal' || child.type === 'JSXText'))
            || (options.allow === 'single-line')
          ) {
            return
          }
        }
      }

      if (options.allow === 'single-line') {
        const firstChild = children[0]
        const lastChild = children[children.length - 1]
        const lineDifference = lastChild.loc.end.line - firstChild.loc.start.line
        let lineBreaks = 0
        if (firstChild.type === 'Literal' || firstChild.type === 'JSXText') {
          if (/^\s*?\n/.test(firstChild.raw))
            lineBreaks += 1
        }
        if (lastChild.type === 'Literal' || lastChild.type === 'JSXText') {
          if (/\n\s*$/.test(lastChild.raw))
            lineBreaks += 1
        }
        if (lineDifference === 0 && lineBreaks === 0 || lineDifference === 2 && lineBreaks === 2)
          return
      }

      const childrenGroupedByLine: Record<number, Child[]> = {}
      const fixDetailsByNode: Record<string, {
        node: Child | Tree.JSXOpeningElement | Tree.JSXClosingElement | Tree.JSXClosingFragment
        source: string
        descriptor: string
        leadingSpace?: boolean
        trailingSpace?: boolean
        leadingNewLine?: boolean
        trailingNewLine?: boolean
      }> = {}

      children.forEach((child) => {
        let countNewLinesBeforeContent = 0
        let countNewLinesAfterContent = 0

        if (child.type === 'Literal' || child.type === 'JSXText') {
          if (isWhiteSpaces(child.raw))
            return

          countNewLinesBeforeContent = (child.raw.match(/^\s*\n/g) || []).length
          countNewLinesAfterContent = (child.raw.match(/\n\s*$/g) || []).length
        }

        const startLine = child.loc.start.line + countNewLinesBeforeContent
        const endLine = child.loc.end.line - countNewLinesAfterContent

        if (startLine === endLine) {
          if (!childrenGroupedByLine[startLine])
            childrenGroupedByLine[startLine] = []

          childrenGroupedByLine[startLine].push(child)
        }
        else {
          if (!childrenGroupedByLine[startLine])
            childrenGroupedByLine[startLine] = []

          childrenGroupedByLine[startLine].push(child)
          if (!childrenGroupedByLine[endLine])
            childrenGroupedByLine[endLine] = []

          childrenGroupedByLine[endLine].push(child)
        }
      })

      Object.keys(childrenGroupedByLine).forEach((_line) => {
        const line = parseInt(_line, 10)
        const firstIndex = 0
        const lastIndex = childrenGroupedByLine[line].length - 1

        childrenGroupedByLine[line].forEach((child, i) => {
          let prevChild: Child | Tree.JSXOpeningElement | Tree.JSXClosingElement | Tree.JSXClosingFragment | undefined
          let nextChild: Child | Tree.JSXOpeningElement | Tree.JSXClosingElement | Tree.JSXClosingFragment | undefined

          if (i === firstIndex) {
            if (line === openingElementEndLine)
              prevChild = openingElement
          }
          else {
            prevChild = childrenGroupedByLine[line][i - 1]
          }

          if (i === lastIndex) {
            if (line === closingElementStartLine)
              nextChild = closingElement
          }
          else {
            // We don't need to append a trailing because the next child will prepend a leading.
            // nextChild = childrenGroupedByLine[line][i + 1];
          }

          if (!prevChild && !nextChild)
            return

          const spaceBetweenPrev = () => {
            return ((prevChild!.type === 'Literal' || prevChild!.type === 'JSXText') && prevChild!.raw.endsWith(' '))
              || ((child.type === 'Literal' || child.type === 'JSXText') && child.raw.startsWith(' '))
              || context.sourceCode.isSpaceBetweenTokens(prevChild as unknown as Token, child as unknown as Token)
          }

          const spaceBetweenNext = () => {
            return ((nextChild!.type === 'Literal' || nextChild!.type === 'JSXText') && nextChild!.raw.startsWith(' '))
              || ((child.type === 'Literal' || child.type === 'JSXText') && child.raw.endsWith(' '))
              || context.sourceCode.isSpaceBetweenTokens(child as unknown as Token, nextChild as unknown as Token)
          }

          const source = context.sourceCode.getText(child)
          const leadingSpace = !!(prevChild && spaceBetweenPrev())
          const trailingSpace = !!(nextChild && spaceBetweenNext())
          const leadingNewLine = !!prevChild
          const trailingNewLine = !!nextChild

          const key = nodeKey(child)

          if (!fixDetailsByNode[key]) {
            fixDetailsByNode[key] = {
              node: child,
              source,
              descriptor: nodeDescriptor(child),
            }
          }

          if (leadingSpace)
            fixDetailsByNode[key].leadingSpace = true

          if (leadingNewLine)
            fixDetailsByNode[key].leadingNewLine = true

          if (trailingNewLine)
            fixDetailsByNode[key].trailingNewLine = true

          if (trailingSpace)
            fixDetailsByNode[key].trailingSpace = true
        })
      })

      Object.keys(fixDetailsByNode).forEach((key) => {
        const details = fixDetailsByNode[key]

        const nodeToReport = details.node
        const descriptor = details.descriptor
        const source = details.source.replace(/(^ +| +$)/g, '')

        const leadingSpaceString = details.leadingSpace ? '\n{\' \'}' : ''
        const trailingSpaceString = details.trailingSpace ? '{\' \'}\n' : ''
        const leadingNewLineString = details.leadingNewLine ? '\n' : ''
        const trailingNewLineString = details.trailingNewLine ? '\n' : ''

        const replaceText = `${leadingSpaceString}${leadingNewLineString}${source}${trailingNewLineString}${trailingSpaceString}`

        context.report({
          messageId: 'moveToNewLine',
          node: nodeToReport,
          data: {
            descriptor,
          },
          fix(fixer) {
            return fixer.replaceText(nodeToReport, replaceText)
          },
        })
      })
    }

    return {
      JSXElement: handleJSX,
      JSXFragment: handleJSX,
    }
  },
})
