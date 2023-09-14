import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import Components from 'unplugin-vue-components/vite'
import { packages } from '../../packages/metadata'

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

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },

  srcDir: fileURLToPath(new URL('../..', import.meta.url)),
  cleanUrls: true,

  vite: {
    plugins: [
      Components({
        dirs: [
          fileURLToPath(new URL('./components', import.meta.url)),
        ],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        extensions: ['vue', 'md'],
      }),
    ],
  },

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
