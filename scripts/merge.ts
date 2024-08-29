import fs from 'node:fs/promises'
import { basename, join } from 'node:path'
import { existsSync } from 'node:fs'
import fg from 'fast-glob'
import { RULE_ALIAS } from './update/meta'

await import('./merge-undo')

const packages = {
  ts: './packages/eslint-plugin-ts/rules',
  js: './packages/eslint-plugin-js/rules',
  jsx: './packages/eslint-plugin-jsx/rules',
  plus: './packages/eslint-plugin-plus/rules',
}

for (const [key, path] of Object.entries(packages)) {
  const rules = await fg(`${path}/*`, {
    onlyDirectories: true,
    absolute: true,
  })

  for (const rule of rules) {
    const name = basename(rule)
    const files = await fg('*', {
      onlyFiles: true,
      cwd: rule,
      ignore: [
        '*.alias.*',
      ],
    })

    if (RULE_ALIAS[name]) {
      continue
    }

    const targetDir = join('./packages/eslint-plugin/rules', name)
    await fs.mkdir(targetDir, { recursive: true })

    for (const file of files) {
      const targetFile = `${file.split('.')[0]}._${key}_.${file.split('.').slice(1).join('.')}`
      const sourcePath = join(rule, file)
      console.log(`${file} -> ${targetFile}`)
      if (file.endsWith('.d.ts') || file.endsWith('.md')) {
        await fs.rename(
          sourcePath,
          join(targetDir, targetFile),
        )
      }
      else {
        let content = await fs.readFile(sourcePath, 'utf-8')

        content = content
          .replaceAll(`'./${name}'`, `'./${name}._${key}_'`)
          .replaceAll(`'./${name}.test'`, `'./${name}._${key}_.test'`)
          .replaceAll(`'./types'`, `'./types._${key}_'`)

        await fs.writeFile(
          join(targetDir, targetFile),
          content,
          'utf-8',
        )

        if (file === `${name}.ts`)
          await fs.writeFile(sourcePath, `export { default } from '../../../eslint-plugin/rules/${name}/${name}._${key}_'\n`, 'utf-8')
        else
          await fs.rm(sourcePath)
      }
    }
  }
}

const rules = await fg('./packages/eslint-plugin/rules/*', {
  onlyDirectories: true,
  absolute: true,
})

for (const rule of rules) {
  const name = basename(rule)
  const ext = [
    'ts',
    'jsx',
    'plus',
    'js',
  ].find(ext => existsSync(join(rule, `${name}._${ext}_.ts`)))

  await fs.writeFile(
    join(rule, `index.ts`),
    `export { default } from './${name}._${ext}_'\n`,
    'utf-8',
  )
}
