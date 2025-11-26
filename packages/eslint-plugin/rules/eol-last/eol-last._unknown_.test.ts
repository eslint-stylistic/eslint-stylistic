import type { BinarySourceCode } from '@eslint/core'
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import { VisitNodeStep } from '@eslint/plugin-kit'
import rule from './eol-last'

run<RuleOptions, MessageIds>({
  name: 'eol-last',
  rule,
  configs: {
    plugins: {
      // Fake plugin for testing non-text source code
      test: {
        languages: {
          x: {
            fileType: 'text',
            lineStart: 1,
            columnStart: 0,
            nodeTypeKey: 'type',
            validateLanguageOptions() {},
            parse(file) {
              return {
                ok: true,
                ast: {
                  type: 'X',
                  range: [0, file.body.length],
                },
              }
            },
            createSourceCode(file, ast): BinarySourceCode {
              const encoder = new TextEncoder()
              const body = typeof file.body === 'string' ? encoder.encode(file.body) : file.body
              return {
                ast,
                body,
                getLoc() {
                  return {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: body.length },
                  }
                },
                getRange() {
                  return [0, body.length]
                },
                * traverse() {
                  yield new VisitNodeStep({
                    target: ast,
                    phase: 1,
                    args: [ast],
                  })
                },
              }
            },

          },
        },
      },
    },
    language: 'test/x',
  },

  valid: [
    '\n',
    '\r\n',
    'x\nx',
    'x\r\nx',
  ],
})
