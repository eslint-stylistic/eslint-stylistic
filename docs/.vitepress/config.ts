import { fileURLToPath } from 'node:url'
import { basename, dirname, join } from 'node:path'
import fs from 'node:fs/promises'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import MarkdownItContainer from 'markdown-it-container'
import { transformerRenderWhitespace } from '@shikijs/transformers'
import type { ESLint, Linter } from 'eslint'
import stylistic from '@stylistic/eslint-plugin'
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import stylisticPlus from '@stylistic/eslint-plugin-plus'
import * as parserTs from '@typescript-eslint/parser'
import { createTwoslasher } from 'twoslash-eslint'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { packages } from '../../packages/metadata/src'
import vite from './vite.config'

const mainPackages = packages.filter(p => p.rules.length)
const defaultPackage = packages.find(p => p.shortId === 'default')!
const jsPackage = packages.find(p => p.shortId === 'js')!
const tsPackage = packages.find(p => p.shortId === 'ts')!
const projectRoot = fileURLToPath(new URL('../..', import.meta.url))
const version = JSON.parse(await fs.readFile(join(projectRoot, 'package.json'), 'utf-8')).version

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/getting-started' },
  { text: 'Why', link: '/guide/why' },
  { text: 'Shared Configs', link: '/guide/config-presets' },
  { text: 'Migration', link: '/guide/migration' },
  { text: 'FAQ', link: '/guide/faq' },
]

const CONTRIBUTES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Project Progress', link: '/contribute/project-progress' },
  { text: 'Contributing', link: '/contribute/guide' },
]

const PACKAGES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Default', link: '/packages/default' },
  { text: 'JavaScript', link: '/packages/js' },
  { text: 'TypeScript', link: '/packages/ts' },
  { text: 'JSX', link: '/packages/jsx' },
  { text: 'Additional', link: '/packages/plus' },
]

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/eslint-stylistic/eslint-stylistic/releases' },
  { text: `Contributing`, link: '/contribute/guide' },
]

const packageNames: Record<string, string> = {
  default: 'All Rules',
  js: 'JavaScript Rules',
  ts: 'TypeScript Rules',
  jsx: 'JSX Rules',
  extra: 'Additional Rules',
}

// Because VitePress does not support rewrite single source to multiple targets,
// we have to duplicate the markdown files for the aliases.
await Promise.all(
  defaultPackage.rules.map(async (rule) => {
    const newPath = join(
      dirname(rule.docsEntry),
      `${basename(rule.docsEntry, '.md').replace(/\._\w+_$/, '')}._merged_.md`,
    )
    const jsEntry = jsPackage.rules.find(r => r.name === rule.name)
    const tsEntry = tsPackage.rules.find(r => r.name === rule.name)
    if (tsEntry && jsEntry) {
      const tsContent = (await fs.readFile(
        join(projectRoot, tsEntry.docsEntry),
        'utf-8',
      ))
        // Remove frontmatter
        .replace(/^---[\s\S]*?\n---\n/, '')
        .trim()
        .split(/\r?\n/g)
        // Remove lines redirecting to the JS rule, as we already have them above
        .filter(l => !l.startsWith('This rule extends the base') && !l.startsWith('It adds support for '))
        // Adding one level of heading
        .map(i => i.startsWith('#') ? `#${i}` : i)
        .join('\n')
        .trim()
      if (tsContent) {
        const jsContent = await fs.readFile(
          join(projectRoot, jsEntry.docsEntry),
          'utf-8',
        )
        const content = [
          jsContent,
          '',
          '## TypeScript Specific',
          '',
          tsContent,
        ]
        await fs.writeFile(
          join(projectRoot, newPath),
          content.join('\n'),
        )
      }
      else {
        await fs.copyFile(
          join(projectRoot, jsEntry.docsEntry),
          join(projectRoot, newPath),
        )
      }
    }
    else {
      // console.log('No JS or TS entry found for', rule.name)
      await fs.copyFile(
        join(projectRoot, rule.docsEntry),
        join(projectRoot, newPath),
      )
    }
    rule.docsEntry = newPath
  }),
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ESLint Stylistic',
  description: 'Stylistic & Formatting Rules for ESLint',
  rewrites: {
    // rewrite rules to /rules/js/:name
    ...Object.fromEntries(
      packages
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
                '@stylistic/js': stylisticJs as ESLint.Plugin,
                '@stylistic/jsx': stylisticJsx as ESLint.Plugin,
                '@stylistic/ts': stylisticTs as ESLint.Plugin,
                '@stylistic/plus': stylisticPlus as ESLint.Plugin,
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
        text: 'Packages',
        items: PACKAGES,
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
      {},
      ...mainPackages.map((pkg) => {
        return {
          [`/rules/${pkg.shortId}/`]: [
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
          {
            text: 'Packages',
            items: PACKAGES,
          },
        ],
      },
    ),

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
