import css from '@eslint/css'
import parserTs from '@typescript-eslint/parser'
import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'
import parserVue from 'vue-eslint-parser'
import { configs } from '../configs'
import eolLast from './eol-last/eol-last'
import indent from './indent/indent'
import linebreakStyle from './linebreak-style/linebreak-style'
import listStyle from './list-style/list-style'
import noTrailingSpaces from './no-trailing-spaces/no-trailing-spaces'

function getLanguages(rule: { meta?: unknown }) {
  return (rule.meta as { languages?: string[] } | undefined)?.languages
}

describe('rule language metadata', () => {
  it.each(['js', 'cjs', 'mjs', 'ts', 'cts', 'mts', 'jsx', 'tsx'])('applies shared rules to configured .%s files', (extension) => {
    for (const preset of [configs.recommended, configs.all, configs.customize()]) {
      const messages = new Linter().verify('const value=1\n', [
        {
          files: [`**/*.${extension}`],
          languageOptions: { parser: parserTs },
        },
        preset,
      ], { filename: `example.${extension}` })

      expect(messages.some(message => message.fatal)).toBe(false)
      expect(messages.some(message => message.ruleId === '@stylistic/space-infix-ops')).toBe(true)
    }
  })

  it('applies shared rules to Vue files with a configured parser', () => {
    for (const preset of [configs.recommended, configs.all, configs.customize()]) {
      const messages = new Linter().verify('<script>const value=1</script>', [
        { files: ['**/*.vue'], languageOptions: { parser: parserVue } },
        preset,
      ], { filename: 'example.vue' })

      expect(messages.some(message => message.fatal)).toBe(false)
      expect(messages.some(message => message.ruleId === '@stylistic/space-infix-ops')).toBe(true)
    }
  })

  it('can scope shared presets alongside another language', () => {
    for (const preset of [configs.recommended, configs.all, configs.customize()]) {
      const messages = new Linter().verify('a { color: red; }\n', [
        { ...preset, files: ['**/*.js'] },
        { files: ['**/*.css'], plugins: { css }, language: 'css/css' },
      ], { filename: 'example.css' })

      expect(messages).toEqual([])
    }
  })

  it('limits syntax-aware rules to JavaScript-family languages', () => {
    expect(getLanguages(indent)).toEqual(['js/*'])
  })

  it('includes JSON for the list-style rule', () => {
    expect(getLanguages(listStyle)).toEqual(['js/*', 'jsonc/*'])
  })

  it('allows text-only rules in any language', () => {
    for (const rule of [eolLast, linebreakStyle, noTrailingSpaces])
      expect(getLanguages(rule)).toEqual(['*'])
  })
})
