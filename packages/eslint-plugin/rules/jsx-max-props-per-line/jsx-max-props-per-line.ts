import type { ReportDescriptor, RuleContext, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isSingleLine, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

function getPropName(context: RuleContext<MessageIds, RuleOptions>, propNode: Tree.JSXAttribute | Tree.JSXSpreadAttribute) {
  if (propNode.type === 'JSXSpreadAttribute')
    return context.sourceCode.getText(propNode.argument)

  return propNode.name.name
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-max-props-per-line',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce maximum of props on a single line in JSX',
    },
    fixable: 'code',
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
            additionalProperties: false,
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
    messages: {
      newLine: 'Prop `{{prop}}` must be placed on a new line',
    },
  },
  defaultOptions: [{ maximum: 1 }],
  create(context, [configuration]) {
    const {
      maximum,
    } = configuration!

    type InferSchemaByKey<K extends string> = Extract<RuleOptions[0], Record<K, any> | Partial<Record<K, any>>>

    const {
      single = Infinity,
      multi = Infinity,
    } = typeof maximum === 'number'
      ? {
          single: (configuration as InferSchemaByKey<'when'>).when === 'multiline' ? Infinity : maximum,
          multi: maximum,
        }
      : maximum!

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

        const isSingleLineTag = isSingleLine(node)

        if ((isSingleLineTag ? single : multi) === Infinity)
          return

        const firstProp = node.attributes[0]
        const linePartitionedProps = [[firstProp]]

        node.attributes.reduce((last, decl) => {
          if (isTokenOnSameLine(last, decl))
            linePartitionedProps[linePartitionedProps.length - 1].push(decl)
          else
            linePartitionedProps.push([decl])

          return decl
        })

        linePartitionedProps.forEach((propsInLine) => {
          const maxPropsCountPerLine = isSingleLineTag && propsInLine[0].loc.start.line === node.loc.start.line
            ? single
            : multi

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
