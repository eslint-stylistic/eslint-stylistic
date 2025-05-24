import rules from '../rules'

export type * from '../dts'

const index = { rules }

export {
  index as default,
  index as 'module.exports',
}

// eslint-disable-next-line no-console
console.log('[@eslint-stylistic/eslint-plugin-plus] This package is deprecated in favor of the unified @eslint-stylistic/eslint-plugin, please consider migrating to the main package')
