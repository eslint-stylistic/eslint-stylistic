/**
 * @fileoverview Scripts to update metadata and types.
 */

import { dirname } from 'node:path'
import fg from 'fast-glob'

import type { PackageInfo } from '../packages/metadata/src/types'
import { generateDtsFromSchema } from './update/schema-to-ts'
import { generateConfigs, generateMetadata, readPackage, updateExports, writePackageDTS, writeREADME, writeRulesIndex } from './update/utils'
import { ROOT } from './update/meta'

async function readPackages() {
  const paths = (await fg(
    './packages/*/package.json',
    {
      onlyFiles: true,
      absolute: true,
      cwd: ROOT,
      ignore: [
        'node_modules',
      ],
    },
  )).sort()

  const packages: PackageInfo[] = []
  for (const path of paths) {
    const pkg = await readPackage(dirname(path))
    packages.push(pkg)
  }

  // Generate the default package merging all rules
  const packageJs = packages.find(i => i.shortId === 'js')!
  const packageTs = packages.find(i => i.shortId === 'ts')!
  const packageJsx = packages.find(i => i.shortId === 'jsx')!
  const packagePlus = packages.find(i => i.shortId === 'plus')!

  const packageGeneral = packages.find(i => i.name === '@stylistic/eslint-plugin')!

  // merge rules
  packageGeneral.rules = [...new Set([
    ...packageJs.rules.map(i => i.name),
    ...packageTs.rules.map(i => i.name),
    ...packageJsx.rules.map(i => i.name),
    ...packagePlus.rules.map(i => i.name),
  ])]
    .map((name) => {
      const rule = packageJs.rules.find(i => i.name === name)!
        || packageTs.rules.find(i => i.name === name)!
        || packageJsx.rules.find(i => i.name === name)!
        || packagePlus.rules.find(i => i.name === name)!
      return {
        ...rule,
        ruleId: `@stylistic/${name}`,
      }
    })
  packageGeneral.shortId = 'default'
  packageGeneral.rules.sort((a, b) => a.name.localeCompare(b.name))

  return packages
}

async function run() {
  const packages = await readPackages()

  for (const pkg of packages) {
    if (pkg.shortId === 'default')
      continue
    await writeRulesIndex(pkg)
    await writeREADME(pkg)
    await writePackageDTS(pkg)
    await generateConfigs(pkg)
    await updateExports(pkg)
  }

  await generateDtsFromSchema()
  await generateMetadata(packages)
}

run()
