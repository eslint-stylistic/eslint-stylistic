/**
 * @fileoverview Scripts to update metadata and types.
 */

import { basename, join } from 'node:path'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import fg from 'fast-glob'

import type { PackageInfo } from '../packages/metadata/src/types'
import { generateDtsFromSchema } from './update/schema-to-ts'
import { generateConfigs, generateMetadata, resolveAlias, updateExports, writePackageDTS, writeREADME, writeRulesIndex } from './update/utils'
import { RULE_ORIGINAL_ID_MAP } from './update/meta'

async function readPackages() {
  const RULES_DIR = './packages/eslint-plugin/rules/'
  const PACKAGES = [
    'js',
    'jsx',
    'ts',
    'plus',
  ]

  const ruleDirs = await fg('*', {
    cwd: RULES_DIR,
    onlyDirectories: true,
    absolute: true,
  })

  const rulesMeta = await Promise.all(ruleDirs.map(async (path) => {
    const name = basename(path)

    const packages = [...PACKAGES].reverse().filter(pkg => existsSync(join(path, `${name}._${pkg}_.ts`)))

    return {
      path,
      name,
      packages,
    }
  }))

  async function createPackageInfo(
    pkg: string,
    rules: typeof rulesMeta,
  ): Promise<PackageInfo> {
    const pkgId = pkg
      ? `@stylistic/${pkg}`
      : '@stylistic'
    const shortId = pkg || 'default'
    const path = `packages/eslint-plugin${pkg ? `-${pkg}` : ''}`

    return {
      name: pkg ? `@stylistic/eslint-plugin-${pkg}` : '@stylistic/eslint-plugin',
      shortId,
      pkgId,
      path,
      rules: await Promise.all(
        rules
          .map(async (i) => {
            const realName = i.name
            const name = resolveAlias(realName)

            const entry = join(RULES_DIR, name, pkg ? `${name}._${pkg}_.ts` : 'index.ts')
            const url = pathToFileURL(entry).href
            const mod = await import(url)
            const meta = mod.default?.meta
            const originalId = shortId === 'js'
              ? name
              : shortId === 'ts'
                ? `@typescript-eslint/${name}`
                : shortId === 'jsx'
                  ? `react/${name}`
                  : ''
            return {
              name: realName,
              ruleId: pkg ? `${pkgId}/${realName}` : realName,
              originalId: RULE_ORIGINAL_ID_MAP[originalId] || originalId,
              entry,
              docsEntry: join(RULES_DIR, i.name, pkg ? `README._${pkg}_.md` : 'README.md'),
              meta: {
                fixable: meta?.fixable,
                docs: {
                  description: meta?.docs?.description,
                  // TODO:
                  // recommended: rulesInSharedConfig.has(`@stylistic/${realName}`),
                },
              },
            }
          }),
      ),
    }
  }

  const mainPackage = await createPackageInfo('', rulesMeta)
  const subPackages = await Promise.all(PACKAGES.map(pkg => createPackageInfo(pkg, rulesMeta.filter(i => i.packages.includes(pkg)))))

  return [...subPackages, mainPackage]
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
