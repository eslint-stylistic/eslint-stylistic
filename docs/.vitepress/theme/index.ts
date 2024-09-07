// https://vitepress.dev/guide/custom-theme
import TwoSlash from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import { h } from 'vue'

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
