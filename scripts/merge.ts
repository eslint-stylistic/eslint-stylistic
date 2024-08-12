import fs from 'node:fs/promises'
import { basename, join } from 'node:path'
import fg from 'fast-glob'
import { exec } from 'tinyexec'

// Reset changes under `packages/*` directory
await exec('git', ['checkout', '--', 'packages'])
await exec('git', ['clean', '-fd', 'packages'])

/**
 * TODO:
 *
 * Main branch:
 * - 1. Rewrite `createRule` order
 * - 2. Unified `utils`
 * - 3. Update `types.d.ts` convention
 *
 * This branch:
 * - 1. Entry file for `eslint-plugin`
 * - 2. Update docs alias
 * - 3. Docs for contributors
 * - 4. Soft deprecate other packages
 */

const packages = {
  ts: './packages/eslint-plugin-ts/rules',
  js: './packages/eslint-plugin-js/rules',
  jsx: './packages/eslint-plugin-jsx/rules',
  plus: './packages/eslint-plugin-plus/rules',
}

await fs.cp('./packages/eslint-plugin-ts/utils', './packages/eslint-plugin/utils', { recursive: true })
await fs.cp('./packages/eslint-plugin-js/utils', './packages/eslint-plugin/utils', { recursive: true })
await fs.cp('./packages/eslint-plugin-jsx/utils', './packages/eslint-plugin/utils', { recursive: true })

await fs.rm('./packages/eslint-plugin-ts/utils', { recursive: true })
await fs.rm('./packages/eslint-plugin-js/utils', { recursive: true })
await fs.rm('./packages/eslint-plugin-jsx/utils', { recursive: true })

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
