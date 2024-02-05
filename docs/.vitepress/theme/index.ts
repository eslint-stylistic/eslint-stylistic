// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import TwoSlash from '@shikijs/vitepress-twoslash/client'

import '@shikijs/vitepress-twoslash/style.css'
import 'uno.css'
import './style.css'
import './custom.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {})
  },
  enhanceApp({ app }: any) {
    app.use(TwoSlash)
  },
}
