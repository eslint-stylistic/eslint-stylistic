import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'

const rulesDir = fileURLToPath(new URL('../packages/eslint-plugin/rules', import.meta.url))

const rules = await fg('*', {
  onlyDirectories: true,
  absolute: true,
  cwd: rulesDir,
})

for (const dir of rules) {
  const versions = new Set<string>()
  const files = await fs.readdir(dir)
  const targetFiles = files.filter((file) => {
    const match = file.match(/\._(\w+)_\./)
    if (match && match[1] !== 'merged') {
      versions.add(match[1])
      return true
    }
    return false
  })
  if (versions.size === 0 || versions.size > 1)
    continue

  targetFiles.push('index.ts')
  const version = [...versions][0]
  for (const file of targetFiles) {
    let content = await fs.readFile(join(dir, file), 'utf-8')
    content = content.replaceAll(`._${version}_`, '')
    await fs.rm(join(dir, file))
    await fs.writeFile(join(dir, file.replace(`._${version}_`, '')), content, 'utf-8')
  }
}

const packages = [
  'js',
  'jsx',
  'ts',
  'plus',
]

for (const pkg of packages) {
  const dirs = await fg(`*`, {
    onlyDirectories: true,
    absolute: true,
    cwd: fileURLToPath(new URL(`../packages/eslint-plugin-${pkg}/rules`, import.meta.url)),
  })

  for (const dir of dirs) {
    const name = basename(dir)
    const redirectFile = [
      `${name}._${pkg}_.ts`,
      `${name}.ts`,
    ].find(file => existsSync(join(rulesDir, name, file)))
    if (!redirectFile) {
      console.warn(`Redirect file not found for ${name}`)
      continue
    }
    await fs.writeFile(
      join(dir, `${name}.ts`),
      `export { default } from '../../../eslint-plugin/rules/${name}/${redirectFile.replace('.ts', '')}'\n`,
      'utf-8',
    )
  }
}
