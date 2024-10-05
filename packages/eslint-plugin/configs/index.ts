import type { Linter } from 'eslint'
import type { Configs } from '../dts/configs'
import { createAllConfigs } from '../../shared/utils/configs-all'
import plugin from '../src/plugin'
import { customize } from './customize'
import disableLegacy from './disable-legacy'

export type * from './customize'

const recommendedExtends: Linter.BaseConfig = /* #__PURE__ */ customize({ flat: false })

const allConfigsIgnore = [
  // Exclude all JSX rules
  /^jsx-/,
  // https://github.com/eslint-stylistic/eslint-stylistic/pull/548
  /^curly-newline$/,
]

export const configs: Configs = {
  /**
   * Disable all legacy rules from `eslint`, `@typescript-eslint` and `eslint-plugin-react`
   *
   * This config works for both flat and legacy config format
   */
  'disable-legacy': disableLegacy,
  /**
   * A factory function to customize the recommended config
   */
  'customize': customize,
  /**
   * The default recommended config in Flat Config Format
   */
  'recommended-flat': /* #__PURE__ */ customize(),
  /**
   * The default recommended config in Legacy Config Format
   */
  'recommended-extends': recommendedExtends,

  /**
   * Enable all rules, in Flat Config Format
   */
  'all-flat': createAllConfigs(plugin, '@stylistic', true, name => !allConfigsIgnore.some(re => re.test(name))) as Linter.Config,

  /**
   * Enable all rules, in Legacy Config Format
   */
  'all-extends': createAllConfigs(plugin, '@stylistic', false, name => !allConfigsIgnore.some(re => re.test(name))) as Linter.BaseConfig,

  /**
   * @deprecated Use `recommended-extends` instead
   */
  'recommended-legacy': recommendedExtends,
}
