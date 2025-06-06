/**
 * @fileoverview Scripts to update metadata and types.
 */

import type { PackageInfo } from '../packages/metadata/src/types'
import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { RULE_ALIAS } from './update/meta'
import { generateDtsFromSchema } from './update/schema-to-ts'
import { generateConfigs, generateMetadata, normalizePath, resolveAlias, rulesInSharedConfig, updateExports, writePackageDTS, writeREADME, writeRulesIndex } from './update/utils'

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
          const realName = i.name
          const name = resolveAlias(realName)

          await fs.rm(join(RULES_DIR, i.name, 'index.ts'), { force: true })

          const entry = join(RULES_DIR, name, `${name}.ts`)
          const url = pathToFileURL(entry).href
          const mod = await import(url)
          const meta = mod.default?.meta

          const docsBase = join(RULES_DIR, i.name)
          const docs = join(docsBase, `README.md`)

          return {
            name: realName,
            ruleId: `${pkgId}/${realName}`,
            entry: normalizePath(entry),
            docsEntry: docs,
            meta: {
              fixable: meta?.fixable,
              docs: {
                description: meta?.docs?.description,
                recommended: rulesInSharedConfig.has(`@stylistic/${realName}`),
              },
            },
          }
        }),
    )

    for (const [alias, source] of Object.entries(RULE_ALIAS)) {
      const rule = resolvedRules.find(i => i.name === source)
      if (rule) {
        resolvedRules.push({
          ...rule,
          name: alias,
          ruleId: `${pkgId}/${alias}`,
        })
      }
    }

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
