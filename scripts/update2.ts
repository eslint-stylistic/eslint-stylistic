/**
 * @fileoverview Scripts to update metadata and types.
 */

import { basename, join } from 'node:path'
import { existsSync } from 'node:fs'
import fg from 'fast-glob'

import type { PackageInfo } from '../packages/metadata/src/types'
import { generateDtsFromSchema } from './update/schema-to-ts'
import { generateConfigs, generateMetadata, updateExports, writePackageDTS, writeREADME, writeRulesIndex } from './update/utils'

async function readPackages() {
  const RULES_DIR = './packages/eslint-plugin/rules/'
  const PACKAGES = [
    'ts',
    'js',
    'jsx',
    'plus',
  ]

  const ruleDirs = await fg('*', {
    cwd: RULES_DIR,
    onlyDirectories: true,
    absolute: true,
  })

  const rulesMeta = await Promise.all(ruleDirs.map(async (path) => {
    const name = basename(path)

    const packages = PACKAGES.filter(pkg => existsSync(join(path, `${name}._${pkg}_.ts`)))

    return {
      path,
      name,
      packages,
    }
  }))

  function createPackageInfo(
    name: string,
    rules: typeof rulesMeta,
  ): PackageInfo {
    const pkgId = name
      ? `@stylistic/eslint-plugin-${name}`
      : '@stylistic/eslint-plugin'
    const shortId = name || 'default'
    const path = `packages/eslint-plugin${name ? `-${name}` : ''}`

    return {
      name: pkgId,
      shortId,
      pkgId,
      path,
      rules: rules
        .map(i => ({
          name: i.name,
          ruleId: name ? `${pkgId}/${i.name}` : i.name,
          entry: join(RULES_DIR, i.name, name ? `${i.name}._${shortId}_.ts` : 'index.ts'),
          docsEntry: join(RULES_DIR, i.name, name ? `README._${shortId}_.md` : 'README.md'),
        })),
    }
  }

  const mainPackage = createPackageInfo('', rulesMeta)
  const subPackages = PACKAGES.map(pkg => createPackageInfo(pkg, rulesMeta.filter(i => i.packages.includes(pkg))))

  return [mainPackage, ...subPackages]
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
