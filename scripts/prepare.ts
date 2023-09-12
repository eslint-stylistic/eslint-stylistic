import { basename, dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import fs from 'node:fs/promises'
import fg from 'fast-glob'

interface RuleInfo {
  name: string
  ruleId: string
  entry: string
  meta?: RuleMeta
}

interface RuleMeta {
  description?: string
  fixable?: 'code' | 'whitespace'
}

async function run() {
  const cwd = process.cwd()
  const packages = (await fg('./packages/**/package.json', {
    onlyFiles: true,
    absolute: true,
  })).map(i => dirname(i))

  for (const pkg of packages) {
    const pkgId = relative(join(cwd, 'packages'), pkg).replace('eslint-plugin-', '')
    console.log(`Preparing ${pkg}`)
    const rulesDir = await fg('rules/*', {
      cwd: pkg,
      onlyDirectories: true,
    })

    const rules = await Promise.all(
      rulesDir.map(async (ruleDir) => {
        const name = basename(ruleDir)
        const rule: RuleInfo = {
          name,
          ruleId: `${pkgId}/${name}`,
          // TODO: check if entry exists
          entry: resolve(pkg, ruleDir, `${name}.js`),
          // TODO: read meta file
        }
        return rule
      }))

    const ruleDir = join(pkg, 'rules')

    const index = `module.exports = {\n${rules.map(i => `  '${i.name}': () => require('./${relative(ruleDir, i.entry)}'),`).join('\n')}\n}\n`

    await fs.mkdir(ruleDir, { recursive: true })
    await fs.writeFile(join(ruleDir, '/index.js'), index, 'utf-8')
  }
}

run()
