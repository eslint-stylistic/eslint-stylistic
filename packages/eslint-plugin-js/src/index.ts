import { configs } from '../configs'
import plugin from './plugin'

export type * from '../dts'

const index = Object.assign(plugin, { configs })

export {
  index as default,
  index as 'module.exports',
}

// eslint-disable-next-line no-console
console.log('[@stylistic/eslint-plugin-js] This package is deprecated in favor of the unified @stylistic/eslint-plugin, please consider migrating to the main package')
