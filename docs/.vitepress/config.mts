import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import rewrites from './rewrite.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ESLint Stylistic',
  description: 'Stylistic & Formatting Rules for ESLint',
  rewrites: {
    ...rewrites,
    'docs/:name(.+).md': ':name.md',
  },

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },

  srcDir: fileURLToPath(new URL('../..', import.meta.url)),
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Rules', link: '/rules/arrow-spacing' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/eslint-stylistic/eslint-stylistic' },
    ],
  },
})
