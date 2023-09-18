import { fileURLToPath } from 'node:url'
import { basename, dirname } from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import graymatter from 'gray-matter'
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
})

function MarkdownTransform(): Plugin {
  return {
    name: 'local:markdown-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('README.md'))
        return null

      const ruleName = basename(dirname(id))
      const pkgName = basename(dirname(dirname(dirname(id))))

      const pkg = packages.find(p => p.name.includes(pkgName))
      const rule = pkg?.rules.find(r => r.name === ruleName)

      if (!pkg || !rule)
        return null

      let {
        data,
        content,
      } = graymatter(code)

      content = content
        .replaceAll(
          `eslint ${rule.name}:`,
          `eslint ${rule.ruleId}:`,
        )
        .replace(
          /> 🛑.*(\n>.*)*/,
          '',
        )
        .replaceAll(
          '@typescript-eslint/',
          '@stylistic/ts/',
        )

      content = [
        `<a href="/packages#${pkg.name}" class="font-mono no-underline!">${rule.ruleId.slice(0, -rule.name.length)}</a>`,
        `<h1 class="font-mono mt--4">${rule.name}</h1>`,
        '',
        '\n',
        content,
      ].join('\n')

      return graymatter.stringify(content, { data })
    },
  }
}
