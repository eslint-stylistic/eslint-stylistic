/* eslint-disable antfu/no-top-level-await */
/**
 * Stub file for `@stylistic/eslint-plugin`
 * Importing this file will directly load from source,
 * so no build process is needed, and it always stays up-to-date.
 */
import { createJiti } from 'jiti'
import { alias } from './alias.mjs'

const jiti = createJiti(import.meta.url, { alias })

export const pluginDefault = await jiti.import('@stylistic/eslint-plugin').then(m => m.default)
export const pluginJS = await jiti.import('@stylistic/eslint-plugin-js').then(m => m.default)
export const pluginJSX = await jiti.import('@stylistic/eslint-plugin-jsx').then(m => m.default)
export const pluginTS = await jiti.import('@stylistic/eslint-plugin-ts').then(m => m.default)
export const pluginPlus = await jiti.import('@stylistic/eslint-plugin-plus').then(m => m.default)
export const metadata = await jiti.import('@eslint-stylistic/metadata').then(m => m.default)

export default pluginDefault
