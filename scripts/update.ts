/**
 * @fileoverview Scripts to update metadata and types.
 */

import { generateDtsFromSchema } from './update/schema-to-ts'
import { generateMetadata, readPackages, updateExports, writePackageDTS, writeREADME, writeRulesIndex } from './update/utils'

async function run() {
  const packages = await readPackages()

  for (const pkg of packages) {
    await writeRulesIndex(pkg)
    await writeREADME(pkg)
    await writePackageDTS(pkg)
    await updateExports(pkg)
  }

  await generateDtsFromSchema()
  await generateMetadata(packages)
}

run()
