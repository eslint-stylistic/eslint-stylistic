import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import MarkdownItContainer from 'markdown-it-container'
import { packages } from '../../packages/metadata'
import vite from './vite.config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ESLint Stylistic',
  description: 'Stylistic & Formatting Rules for ESLint',
  rewrites: {
    // rewrite rules to /rules/js/:name
    ...Object.fromEntries(
      packages.flatMap(pkg => pkg.rules
        .map(r => [r.docsEntry, `rules/${pkg.shortId}/${r.name}.md`]),
      ),
    ),
    // rewrite docs markdown because we set the `srcDir` to the root of the monorepo
    'docs/:name(.+).md': ':name.md',
  },

  ignoreDeadLinks: true,

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    config(md) {
      MarkdownItContainer(md, 'correct', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1)
            return '<CustomWrapper type="correct">'
          else
            return '</CustomWrapper>\n'
        },
      })
      MarkdownItContainer(md, 'incorrect', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1)
            return '<CustomWrapper type="incorrect">'
          else
            return '</CustomWrapper>\n'
        },
      })
    },
  },

  srcDir: fileURLToPath(new URL('../..', import.meta.url)),
  cleanUrls: true,

  vite,

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Rules', link: '/packages' },
    ],

    sidebar: Object.assign(
      // @ts-expect-error anyway
      ...packages.map((pkg) => {
        return {
          [`/rules/${pkg.shortId}`]: [
            {
              text: pkg.name,
              items: pkg.rules.map((rule): DefaultTheme.SidebarItem => ({
                text: rule.name,
                link: `/rules/${pkg.shortId}/${rule.name}`,
              })),
            },
          ],
        }
      }),
    ),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/eslint-stylistic/eslint-stylistic' },
    ],
  },
})
