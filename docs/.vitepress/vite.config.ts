import type { Plugin } from 'vite'
import { basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import graymatter from 'gray-matter'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { packages } from '../../packages/metadata/src'

export default defineConfig({
  resolve: {
    alias: {
      '@eslint-stylistic/metadata': fileURLToPath(new URL('../../packages/metadata/src/index.ts', import.meta.url)),
    },
  },
  plugins: [
    Components({
      dirs: [
        fileURLToPath(new URL('./components', import.meta.url)),
      ],
      dts: fileURLToPath(new URL('../components.d.ts', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ['vue', 'md'],
    }),
    UnoCSS(
      fileURLToPath(new URL('./uno.config.ts', import.meta.url)),
    ),
    MarkdownTransform(),
  ],
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
})

function MarkdownTransform(): Plugin {
  return {
    name: 'local:markdown-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('README.md'))
        return null

      const shortId = 'default'

      const ruleName = basename(dirname(id))

      const pkg = packages.find(p => p.shortId === shortId)!

      const ruleMapping = Object.groupBy(pkg.rules, rule => rule.name)
      const rule = ruleMapping[ruleName]?.[0]

      if (!rule)
        return null

      let {
        data,
        content,
      } = graymatter(code)

      function resolveLink(link: string) {
        if (!URL.canParse(link) && !ruleMapping[link]) {
          return `https://eslint.org/docs/latest/rules/${link}`
        }

        return link
      }

      function extraLinks(title: string, links?: string[]) {
        if (!links?.length)
          return

        return [
          `## ${title}`,
          ...links.map(link => `- [${link}](${resolveLink(link)})`),
        ].join('\n')
      }

      content = [
        `# <samp>${rule.name}</samp>`,
        content.trimStart().replace(/^# .*\n/, ''),
        extraLinks('Related Rules', data.related_rules),
        extraLinks('Further Reading', data.further_reading),
      ].join('\n')

      return graymatter.stringify(content, { data })
    },
  }
}
