import type { Element, ElementContent, Text } from 'hast'
import { addClassToHast } from 'shikiji'
import type { ShikijiTransformer, ShikijiTransformerContextMeta } from 'shikiji'
import { Linter } from 'eslint'
import stylistic from '@stylistic/eslint-plugin'
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import stylisticPlus from '@stylistic/eslint-plugin-plus'
import * as parserTs from '@typescript-eslint/parser'

interface Context {
  messages: Linter.LintMessage[]
  code: string
}
interface Location {
  line: number
  column: number
}

const shouldTransformUsingESLint = new Set<string>()
export function addShouldTransformUsingESLint(code: string): void {
  shouldTransformUsingESLint.add(code.trimEnd())
}

export function transformerESLint(): ShikijiTransformer {
  shouldTransformUsingESLint.clear()

  const contextMap = new WeakMap<ShikijiTransformerContextMeta, Context>()
  const linter = new Linter({ configType: 'flat' })
  return {
    name: 'shikiji-eslint',
    preprocess(code) {
      if (!shouldTransformUsingESLint.has(code.trimEnd()))
        return
      shouldTransformUsingESLint.delete(code)
      const messages = linter.verify(
        // Remove trailing newline and presentational `⏎` characters
        code.replace(/⏎(?=\n)/gu, '').replace(/⏎$/gu, '\n'),
        [
          {
            files: ['**'],
            plugins: {
              // @ts-expect-error -- `config` types do not strictly match.
              '@stylistic': stylistic,
              // @ts-expect-error -- `config` types do not strictly match.
              '@stylistic/js': stylisticJs,
              // @ts-expect-error -- `config` types do not strictly match.
              '@stylistic/jsx': stylisticJsx,
              // @ts-expect-error -- `config` types do not strictly match.
              '@stylistic/ts': stylisticTs,
              '@stylistic/plus': stylisticPlus,
            },
            languageOptions: {
              // @ts-expect-error -- The result types do not strictly match.
              parser: parserTs,
            },
          },
        ],
      )
      contextMap.set(this.meta, { messages, code })
    },
    line(node, line) {
      const ctx = contextMap.get(this.meta)
      if (!ctx)
        return

      for (const message of ctx.messages) {
        const start: Location = { line: message.line, column: message.column - 1 }
        const end = message.endLine != null && message.endColumn != null
          ? { line: message.endLine, column: message.endColumn - 1 }
          : { line: start.line, column: start.column }
        if (line < start.line || end.line < line)
          continue

        const startColumn = line === start.line ? start.column : 0
        const endColumn = line === end.line ? Math.max(end.column, startColumn + 1) : Infinity
        markMessageRangeInLine(node.children, [startColumn, endColumn], message)
      }

      return node
    },
  }
}

function markMessageRangeInLine(elements: ElementContent[], range: [number, number], message: Linter.LintMessage): void {
  const dataMessage = `${message.message}${message.ruleId ? `(${message.ruleId})` : ''}`

  let currentIdx = 0

  let marked = false

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    if (element.type !== 'element' || element.tagName !== 'span')
      continue
    const textNode = element.children[0]
    if (textNode.type !== 'text')
      continue

    // check if it is overlapped with highlight range
    if (hasOverlap([currentIdx, currentIdx + textNode.value.length - 1], range)) {
      const start = Math.max(0, range[0] - currentIdx)
      const length = (range[1] - range[0]) - Math.max(0, currentIdx - range[0])

      if (length === 0)
        continue

      const separated = separateToken(element, textNode, start, length)
      addClassToHast(separated[1], 'eslint-error')
      separated[1].properties['data-eslint-message'] = dataMessage
      marked = true

      // insert
      const output = separated.filter(Boolean) as Element[]
      elements.splice(i, 1, ...output)
      i += output.length - 1
    }

    currentIdx += textNode.value.length
  }
  if (!marked && currentIdx <= range[0]) {
    elements.push({
      type: 'element',
      tagName: 'span',
      children: [{
        type: 'text',
        value: '',
      }],
      properties: {
        'className': ['eslint-error-on-eol'],
        'data-eslint-message': dataMessage,
      },
    })
  }
}

function hasOverlap(range1: [number, number], range2: [ number, number]): boolean {
  return (range1[0] <= range2[1]) && (range1[1]) >= range2[0]
}

function separateToken(span: Element, textNode: Text, index: number, len: number): [
    before: Element | undefined,
    med: Element,
    after: Element | undefined,
] {
  const text = textNode.value

  const createNode = (value: string) => inheritElement(span, {
    children: [
      {
        type: 'text',
        value,
      },
    ],
  })

  return [
    index > 0 ? createNode(text.slice(0, index)) : undefined,
    createNode(text.slice(index, index + len)),
    index + len < text.length ? createNode(text.slice(index + len)) : undefined,
  ]
}

function inheritElement(original: Element, overrides: Partial<Element>): Element {
  return {
    ...original,
    properties: {
      ...original.properties,
    },
    ...overrides,
  }
}
