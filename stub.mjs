/**
 * Stub file for `@stylistic/eslint-plugin`
 * Importing this file will directly load from source,
 * so no build process is needed, and it always stays up-to-date.
 */
import JITI from 'jiti'
import { alias } from './alias.mjs'

const jiti = JITI(import.meta.url, { alias })

export const pluginDefault = jiti('@stylistic/eslint-plugin').default
export const pluginJS = jiti('@stylistic/eslint-plugin-js').default
export const pluginJSX = jiti('@stylistic/eslint-plugin-jsx').default
export const pluginTS = jiti('@stylistic/eslint-plugin-ts').default
export const pluginPlus = jiti('@stylistic/eslint-plugin-plus').default
export const metadata = jiti('@eslint-stylistic/metadata').default

export default pluginDefault
