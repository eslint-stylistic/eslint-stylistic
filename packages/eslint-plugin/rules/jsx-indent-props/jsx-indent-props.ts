import type { ASTNode } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isNodeFirstInLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-indent-props',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce props indentation in JSX',
    },
    fixable: 'code',
    schema: [{
      anyOf: [
        {
          type: 'string',
          enum: ['tab', 'first'],
        },
        {
          type: 'integer',
        },
        {
          type: 'object',
          properties: {
            indentMode: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['tab', 'first'],
                },
                {
                  type: 'integer',
                },
              ],
            },
            ignoreTernaryOperator: {
              type: 'boolean',
            },
          },
          additionalProperties: false,
        },
      ],
    }],
    messages: {
      wrongIndent: 'Expected indentation of {{needed}} {{type}} {{characters}} but found {{gotten}}.',
    },
  },
  defaultOptions: [4],
  create(context, [options]) {
    const extraColumnStart = 0
    const line = {
      isUsingOperator: false,
      currentOperator: false,
    }

    const {
      indentMode = 4,
      ignoreTernaryOperator = false,
    } = typeof options === 'object'
      ? options
      : { indentMode: options }

    const indentType: 'space' | 'tab' = indentMode === 'tab' ? 'tab' : 'space'
    const indentSize: number | 'first' = indentMode === 'first' ? 'first' : indentMode === 'tab' ? 1 : indentMode

    /**
     * Get node indent
     * @param node Node to examine
     * @return Indent
     */
    function getNodeIndent(node: ASTNode) {
      let src = context.sourceCode.getText(node, node.loc.start.column + extraColumnStart)
      const lines = src.split('\n')
      src = lines[0]

      let regExp
      if (indentType === 'space')
        regExp = /^ +/
      else
        regExp = /^\t+/

      const indent = regExp.exec(src)
      const useOperator = /^[ \t]*:/.test(src) || /^[ \t]*\?/.test(src)
      const useBracket = /</.test(src)

      line.currentOperator = false
      if (useOperator) {
        line.isUsingOperator = true
        line.currentOperator = true
      }
      else if (useBracket) {
        line.isUsingOperator = false
      }

      return indent ? indent[0].length : 0
    }

    /**
     * Check indent for nodes list
     * @param nodes list of node objects
     * @param indent needed indent
     */
    function checkNodesIndent(nodes: ASTNode[], indent: number) {
      let nestedIndent = indent
      nodes.forEach((node) => {
        const nodeIndent = getNodeIndent(node)
        if (
          line.isUsingOperator
          && !line.currentOperator
          && indentSize !== 'first'
          && !ignoreTernaryOperator
        ) {
          nestedIndent += indentSize
          line.isUsingOperator = false
        }
        if (
          node.type !== 'ArrayExpression' && node.type !== 'ObjectExpression'
          && nodeIndent !== nestedIndent && isNodeFirstInLine(context, node)
        ) {
          context.report({
            node,
            messageId: 'wrongIndent',
            data: {
              needed: nestedIndent,
              type: indentType,
              characters: nestedIndent === 1 ? 'character' : 'characters',
              gotten: nodeIndent,
            },
            fix(fixer) {
              return fixer.replaceTextRange(
                [
                  node.range[0] - node.loc.start.column,
                  node.range[0],
                ],
                new Array(nestedIndent + 1).join(indentType === 'space' ? ' ' : '\t'),
              )
            },
          })
        }
      })
    }

    return {
      JSXOpeningElement(node) {
        if (!node.attributes.length)
          return

        let propIndent
        if (indentSize === 'first') {
          const firstPropNode = node.attributes[0]
          propIndent = firstPropNode.loc.start.column
        }
        else {
          const elementIndent = getNodeIndent(node)
          propIndent = elementIndent + indentSize
        }
        checkNodesIndent(node.attributes, propIndent)
      },
    }
  },
})
