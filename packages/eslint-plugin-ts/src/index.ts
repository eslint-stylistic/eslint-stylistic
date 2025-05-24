import { configs } from '../configs'
import plugin from './plugin'

export type * from '../dts'

const index = Object.assign(plugin, { configs })

export {
  index as default,
  index as 'module.exports',
}

// eslint-disable-next-line no-console
console.log('[@eslint-stylistic/eslint-plugin-ts] This package is deprecated in favor of the unified @eslint-stylistic/eslint-plugin, please consider migrating to the main package')
