/* eslint-disable antfu/no-top-level-await */
import type { ESLint, Linter } from 'eslint'
import type { DefaultTheme } from 'vitepress'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformerRenderWhitespace } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import stylistic from '@stylistic/eslint-plugin'
import * as parserTs from '@typescript-eslint/parser'
import MarkdownItContainer from 'markdown-it-container'
import { createTwoslasher } from 'twoslash-eslint'
import { defineConfig } from 'vitepress'
import { packages } from '../../packages/metadata/src'
import vite from './vite.config'

const mainPackages = packages[0]
const projectRoot = fileURLToPath(new URL('../..', import.meta.url))
const version = JSON.parse(await fs.readFile(join(projectRoot, 'package.json'), 'utf-8')).version

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/getting-started' },
  { text: 'Why', link: '/guide/why' },
  { text: 'Shared Configs', link: '/guide/config-presets' },
  { text: 'Rules', link: '/rules' },
  { text: 'Migration', link: '/guide/migration' },
  { text: 'FAQ', link: '/guide/faq' },
  { text: 'Troubleshooting', link: '/guide/troubleshooting' },
]

const CONTRIBUTES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Project Progress', link: '/contribute/project-progress' },
  { text: 'Contributing', link: '/contribute/guide' },
]

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `v4.x`, link: 'https://v4.eslint.style/', target: '_blank' },
  { text: `Release Notes`, link: 'https://github.com/eslint-stylistic/eslint-stylistic/releases' },
  { text: 'Changelog', link: 'https://github.com/eslint-stylistic/eslint-stylistic/blob/main/CHANGELOG.md' },
  { text: `Contributing`, link: '/contribute/guide' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ESLint Stylistic',
  description: 'Stylistic & Formatting Rules for ESLint',
  rewrites: {
    ...Object.fromEntries(
      packages
        .flatMap(pkg => pkg.rules
          .map(r => [r.docsEntry, `rules/${r.name}.md`])),
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
        render(tokens: any[], idx: number) {
          if (tokens[idx].nesting === 1) {
            const next = tokens[idx + 1]
            if (next.type === 'fence')
              next.info = [next.info, 'eslint-check'].filter(Boolean).join(' ')
            return '<CustomWrapper type="correct">'
          }
          else { return '</CustomWrapper>\n' }
        },
      })
      MarkdownItContainer(md, 'incorrect', {
        render(tokens: any[], idx: number) {
          if (tokens[idx].nesting === 1) {
            const next = tokens[idx + 1]
            if (next.type === 'fence')
              next.info = [next.info, 'eslint-check'].filter(Boolean).join(' ')
            return '<CustomWrapper type="incorrect">'
          }
          else {
            return '</CustomWrapper>\n'
          }
        },
      })
    },
    codeTransformers: [
      transformerRenderWhitespace({
        position: 'boundary',
      }),
      transformerTwoslash({
        errorRendering: 'hover',
        explicitTrigger: /\beslint-check\b/,
        twoslasher: createTwoslasher({
          eslintCodePreprocess: (code) => {
            // Remove trailing newline and presentational `⏎` characters
            return code.replace(/⏎(?=\n)/gu, '').replace(/⏎$/gu, '\n')
          },
          eslintConfig: [
            {
              files: ['**'],
              plugins: {
                '@stylistic': stylistic as ESLint.Plugin,
              },
              languageOptions: {
                parser: parserTs as Linter.Parser,
              },
            },
          ],
        }),

      }),
    ],
  },

  srcDir: fileURLToPath(new URL('../..', import.meta.url)),
  cleanUrls: true,

  vite,

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES,
          },
          {
            items: CONTRIBUTES,
          },
        ],
      },
      {
        text: 'Rules',
        link: '/rules',
      },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: Object.assign(
      {
        '/rules/': mainPackages.rules.map((rule): DefaultTheme.SidebarItem => ({
          text: rule.name,
          link: `/rules/${rule.name}`,
        })),
      },
      {
        '/': [
          {
            text: 'Guide',
            items: GUIDES,
          },
          {
            text: 'Contribute',
            items: CONTRIBUTES,
          },
        ],
      },
    ),
    outline: 'deep',
    editLink: {
      // don't add docs/:path, missing tsconfig file
      pattern: 'https://github.com/eslint-stylistic/eslint-stylistic/edit/main/:path',
      text: 'Suggest changes to this page',
    },
    search: {
      provider: 'local',
      options: {
        _render(src, env, md) {
          if (env.relativePath.endsWith('.alias.md'))
            return ''
          if (env.relativePath.endsWith('rules.md'))
            return ''
          const html = md.render(src, env)
          return html
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/eslint-stylistic/eslint-stylistic' },
      { icon: 'discord', link: 'https://eslint.style/chat' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright OpenJS Foundation and other contributors, www.openjsf.org.<br>Copyright © 2023-PRESENT ESLint Stylistic contributors.',
    },
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
