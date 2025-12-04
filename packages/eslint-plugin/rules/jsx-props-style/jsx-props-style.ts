import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-props-style',
  meta: {
    type: 'layout',
    docs: {
      experimental: true,
      description: 'Enforce consistent line break styles for JSX props',
    },
    fixable: 'code',
    messages: {
      newLine: 'Prop `{{prop}}` must be placed on a new line',
    },
    schema: [{
      type: 'object',
      additionalProperties: false,
      properties: {
        singleLine: {
          type: 'object',
          additionalProperties: false,
          properties: {
            maxItems: {
              type: 'integer',
              minimum: 0,
            },
          },
        },
        multiLine: {
          type: 'object',
          additionalProperties: false,
          properties: {
            minItems: {
              type: 'integer',
              minimum: 0,
            },
          },
        },
      },
    }],
  },
  defaultOptions: [{
    singleLine: {
      maxItems: Number.POSITIVE_INFINITY,
    },
    multiLine: {
      minItems: 0,
    },
  }],
  create(context, [option]) {
    return {
      JSXOpeningElement(node) {
        if (!node.attributes.length)
          return
      },
    }
  },
})
