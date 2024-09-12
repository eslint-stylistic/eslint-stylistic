// https://vitepress.dev/guide/custom-theme
import type { Theme as ThemeType } from 'vitepress'
import TwoSlash from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import { h } from 'vue'
import Layout from '../components/Layout.vue'

import '@shikijs/vitepress-twoslash/style.css'
import 'uno.css'
import './style.css'
import './custom.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Layout, null, {})
  },
  enhanceApp({ app }) {
    app.use(TwoSlash)
  },
} satisfies ThemeType
