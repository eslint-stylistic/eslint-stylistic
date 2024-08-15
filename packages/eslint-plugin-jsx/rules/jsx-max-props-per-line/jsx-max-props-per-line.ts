/**
 * @fileoverview Limit maximum of props on a single line in JSX
 * @author Yannick Croissant
 */

import type { ReportDescriptor, RuleContext, Tree } from '@shared/types'
import { createRule } from '../../../utils'
import type { MessageIds, RuleOptions } from './types'

function getPropName(context: RuleContext<MessageIds, RuleOptions>, propNode: Tree.JSXAttribute | Tree.JSXSpreadAttribute) {
  if (propNode.type === 'JSXSpreadAttribute')
    return context.sourceCode.getText(propNode.argument)

  return propNode.name.name
}

const messages = {
  newLine: 'Prop `{{prop}}` must be placed on a new line',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-max-props-per-line',
  package: 'jsx',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce maximum of props on a single line in JSX',
    },
    fixable: 'code',

    messages,

    schema: [{
      anyOf: [{
        type: 'object',
        properties: {
          maximum: {
            type: 'object',
            properties: {
              single: {
                type: 'integer',
                minimum: 1,
              },
              multi: {
                type: 'integer',
                minimum: 1,
              },
            },
          },
        },
        additionalProperties: false,
      }, {
        type: 'object',
        properties: {
          maximum: {
            type: 'number',
            minimum: 1,
          },
          when: {
            type: 'string',
            enum: ['always', 'multiline'],
          },
        },
        additionalProperties: false,
      }],
    }],
  },

  create(context) {
    const configuration = context.options[0] || {}
    const maximum = configuration.maximum || 1

    type InferSchemaByKey<K extends string> = Extract<RuleOptions[0], Record<K, any> | Partial<Record<K, any>>>

    const maxConfig = typeof maximum === 'number'
      ? {
          single: (configuration as InferSchemaByKey<'when'>).when === 'multiline' ? Infinity : maximum,
          multi: maximum,
        }
      : {
          single: maximum.single || Infinity,
          multi: maximum.multi || Infinity,
        }

    function generateFixFunction(line: (Tree.JSXAttribute | Tree.JSXSpreadAttribute)[], max: number): ReportDescriptor<MessageIds>['fix'] {
      const sourceCode = context.sourceCode
      const output = []
      const front = line[0].range[0]
      const back = line[line.length - 1].range[1]

      for (let i = 0; i < line.length; i += max) {
        const nodes = line.slice(i, i + max)
        output.push(nodes.reduce((prev, curr) => {
          if (prev === '')
            return sourceCode.getText(curr)

          return `${prev} ${sourceCode.getText(curr)}`
        }, ''))
      }

      const code = output.join('\n')

      return function fix(fixer) {
        return fixer.replaceTextRange([front, back], code)
      }
    }

    return {
      JSXOpeningElement(node) {
        if (!node.attributes.length)
          return

        const isSingleLineTag = node.loc.start.line === node.loc.end.line

        if ((isSingleLineTag ? maxConfig.single : maxConfig.multi) === Infinity)
          return

        const firstProp = node.attributes[0]
        const linePartitionedProps = [[firstProp]]

        node.attributes.reduce((last, decl) => {
          if (last.loc.end.line === decl.loc.start.line)
            linePartitionedProps[linePartitionedProps.length - 1].push(decl)
          else
            linePartitionedProps.push([decl])

          return decl
        })

        linePartitionedProps.forEach((propsInLine) => {
          const maxPropsCountPerLine = isSingleLineTag && propsInLine[0].loc.start.line === node.loc.start.line
            ? maxConfig.single
            : maxConfig.multi

          if (propsInLine.length > maxPropsCountPerLine) {
            const name = getPropName(context, propsInLine[maxPropsCountPerLine])

            context.report({
              messageId: 'newLine',
              node: propsInLine[maxPropsCountPerLine],
              data: {
                prop: name,
              },
              fix: generateFixFunction(propsInLine, maxPropsCountPerLine),
            })
          }
        })
      },
    }
  },
})
