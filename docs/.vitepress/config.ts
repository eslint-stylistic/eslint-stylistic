import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import MarkdownItContainer from 'markdown-it-container'
import { packages } from '../../packages/metadata/src'
import vite from './vite.config'

const mainPackages = packages.filter(p => p.rules.length)

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/getting-started' },
  { text: 'Why', link: '/guide/why' },
  { text: 'Migration', link: '/guide/migration' },
  { text: 'FAQ', link: '/guide/faq' },
]

const CONTRIBUTES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Project Progress', link: '/contribute/project-progress' },
]

const PACKAGES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Default', link: '/packages/default' },
  { text: 'JavaScript', link: '/packages/js' },
  { text: 'TypeScript', link: '/packages/ts' },
]

const packageNames: Record<string, string> = {
  js: 'JavaScript Rules',
  ts: 'TypeScript Rules',
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ESLint Stylistic',
  description: 'Stylistic & Formatting Rules for ESLint',
  rewrites: {
    // rewrite rules to /rules/js/:name
    ...Object.fromEntries(
      packages
        .filter(i => i.shortId !== 'default')
        .flatMap(pkg => pkg.rules
          .map(r => [r.docsEntry, `rules/${pkg.shortId}/${r.name}.md`])),
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
      { text: 'Guide', items: GUIDES },
      {
        text: 'Contribute',
        items: CONTRIBUTES,
      },
      {
        text: 'Packages',
        items: PACKAGES,
      },
    ],

    sidebar: {
      ...mainPackages.map((pkg) => {
        return {
          [`/rules/${pkg.shortId}`]: [
            {
              text: 'Packages',
              items: PACKAGES,
            },
            {
              text: packageNames[pkg.shortId] || pkg.name,
              items: pkg.rules.map((rule): DefaultTheme.SidebarItem => ({
                text: rule.name,
                link: `/rules/${pkg.shortId}/${rule.name}`,
              })),
            },
          ],
        }
      }),
      '/': [
        {
          text: 'Guide',
          items: GUIDES,
        },
        {
          text: 'Contribute',
          items: CONTRIBUTES,
        },
        {
          text: 'Packages',
          items: PACKAGES,
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/eslint-stylistic/eslint-stylistic' },
    ],
  },

  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'ESLint Stylistic Team' }],
    ['meta', { property: 'og:title', content: 'ESLint Stylistic' }],
    ['meta', { property: 'og:image', content: 'https://eslint.style/og.png' }],
    ['meta', { property: 'og:description', content: 'Stylistic Formatting for ESLint' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://eslint.style/og.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
