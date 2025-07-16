import type { Linter } from 'eslint'
import type { Configs } from '../dts/configs'
import { warnDeprecation } from '#utils/index'
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

export const configs = new Proxy<Configs>({
  'disable-legacy': disableLegacy,
  'customize': customize,
  'recommended': recommended,
  'recommended-flat': recommended,
  'all': all,
  'all-flat': all,
}, {
  get(target, p, receiver) {
    const prop = p.toString()
    if (prop.endsWith('-flat'))
      warnDeprecation(`config("${prop}")`, `"${prop.replace('-flat', '')}"`)

    return Reflect.get(target, p, receiver)
  },
})
