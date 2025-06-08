/**
 * @fileoverview Scripts to update metadata and types.
 */

import type { PackageInfo } from '../packages/metadata/src/types'
import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { generateDtsFromSchema } from './update/schema-to-ts'
import { generateConfigs, generateMetadata, normalizePath, rulesInSharedConfig, updateExports, writePackageDTS, writeREADME, writeRulesIndex } from './update/utils'

async function readPackages() {
  const RULES_DIR = './packages/eslint-plugin/rules/'

  const ruleDirs = await fg('*', {
    cwd: RULES_DIR,
    onlyDirectories: true,
    absolute: true,
  })

  const rulesMeta = await Promise.all(ruleDirs.map(async (path) => {
    const name = basename(path)
    return {
      path,
      name,
    }
  }))

  async function createPackageInfo(
    pkg: string,
    rules: typeof rulesMeta,
  ): Promise<PackageInfo> {
    const pkgId = '@stylistic'
    const shortId = pkg || 'default'
    const path = `packages/eslint-plugin`

    const resolvedRules = await Promise.all(
      rules
        .map(async (i) => {
          const name = i.name

          await fs.rm(join(RULES_DIR, i.name, 'index.ts'), { force: true })

          const entry = join(RULES_DIR, name, `${name}.ts`)
          const url = pathToFileURL(entry).href
          const mod = await import(url)
          const meta = mod.default?.meta

          const docsBase = join(RULES_DIR, i.name)
          const docs = join(docsBase, `README.md`)

          return {
            name,
            ruleId: `${pkgId}/${name}`,
            entry: normalizePath(entry),
            docsEntry: normalizePath(docs),
            meta: {
              fixable: meta?.fixable,
              docs: {
                description: meta?.docs?.description,
                recommended: rulesInSharedConfig.has(`@stylistic/${name}`),
              },
            },
          }
        }),
    )

    resolvedRules.sort((a, b) => a.name.localeCompare(b.name))

    return {
      name: '@stylistic/eslint-plugin',
      shortId,
      pkgId,
      path,
      rules: resolvedRules,
    }
  }

  const mainPackage = await createPackageInfo('', rulesMeta)

  return [mainPackage]
}

async function run() {
  const packages = await readPackages()

  for (const pkg of packages) {
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
