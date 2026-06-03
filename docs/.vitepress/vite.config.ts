import process from 'node:process'
import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { alias } from '../../alias.mjs'
import { getChangeLog } from '../../scripts/changelog'
import { ChangelogPlugin } from './plugins/changelog'
import { MarkdownTransform } from './plugins/markdown-transform'

const changeLogData = await getChangeLog(process.env.CI ? 1000 : 100)

export default defineConfig({
  resolve: {
    alias,
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
    ChangelogPlugin(changeLogData),
  ],
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
})
