import { basename, dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import fs from 'node:fs/promises'
import fg from 'fast-glob'

interface RuleInfo {
  name: string
  ruleId: string
  entry: string
  docsEntry: string
  meta?: RuleMeta
}

interface PackageInfo {
  name: string
  pkgId: string
  rules: RuleInfo[]
  path: string
}

interface RuleMeta {
  description?: string
  fixable?: 'code' | 'whitespace'
}

const cwd = process.cwd()

async function run() {
  const paths = await fg('./packages/**/package.json', {
    onlyFiles: true,
    absolute: true,
  })

  const packages = await Promise.all(paths.map(i => readPackage(dirname(i))))

  await Promise.all(packages.map(i => writeRulesIndex(i)))

  await writeVitePressRewrite(packages)
}

run()

async function readPackage(path: string): Promise<PackageInfo> {
  const pkgId = relative(join(cwd, 'packages'), path).replace('eslint-plugin-', '')
  const pkgJSON = JSON.parse(await fs.readFile(join(path, 'package.json'), 'utf-8'))
  console.log(`Preparing ${path}`)
  const rulesDir = await fg('rules/*', {
    cwd: path,
    onlyDirectories: true,
  })

  const rules = await Promise.all(
    rulesDir.map(async (ruleDir) => {
      const name = basename(ruleDir)
      const rule: RuleInfo = {
        name,
        ruleId: `${pkgId}/${name}`,
        // TODO: check if entry exists
        entry: resolve(path, ruleDir, `${name}.js`),
        // TODO: check if entry exists
        docsEntry: resolve(path, ruleDir, `${name}.md`),
        // TODO: read meta file
      }
      return rule
    }))

  return {
    name: pkgJSON.name,
    pkgId,
    path,
    rules,
  }
}

async function writeRulesIndex(pkg: PackageInfo) {
  const ruleDir = join(pkg.path, 'rules')

  const index = `module.exports = {\n${pkg.rules.map(i => `  '${i.name}': () => require('./${relative(ruleDir, i.entry)}'),`).join('\n')}\n}\n`

  await fs.mkdir(ruleDir, { recursive: true })
  await fs.writeFile(join(ruleDir, '/index.js'), index, 'utf-8')
}

async function writeVitePressRewrite(packages: PackageInfo[]) {
  const rules = packages.flatMap(i => i.rules)

  const index = `export default {\n${rules.map(i => `  '${relative(cwd, i.docsEntry)}': 'rules/${i.name}.md',`).join('\n')}\n}\n`

  await fs.writeFile(join(cwd, 'docs', '.vitepress', 'rewrite.mts'), index, 'utf-8')
}
