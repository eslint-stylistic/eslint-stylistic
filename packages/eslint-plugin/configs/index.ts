import type { Linter } from 'eslint'
import type { Configs } from '../dts/configs'
import { createAllConfigs } from '../../shared/utils/configs-all'
import plugin from '../src/plugin'
import { customize } from './customize'
import disableLegacy from './disable-legacy'

export type * from './customize'

const allConfigsIgnore = [
  // Exclude all JSX rules
  /^jsx-/,
  // https://github.com/eslint-stylistic/eslint-stylistic/pull/548
  /^curly-newline$/,
]

const all = /* @__PURE__ */ createAllConfigs(plugin, '@stylistic', name => !allConfigsIgnore.some(re => re.test(name))) as Linter.Config
const recommended = /* #__PURE__ */ customize()

export const configs: Configs = {
  'disable-legacy': disableLegacy,
  'customize': customize,
  'recommended': recommended,
  'all': all,
}
