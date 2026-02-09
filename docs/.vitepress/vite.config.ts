import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { alias } from '../../alias.mjs'
import { MarkdownTransform } from './plugins/markdown-transform'

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
  ],
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
})
