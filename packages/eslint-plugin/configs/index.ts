import type { Linter } from 'eslint'
import { createAllConfigs } from '../../shared/utils/configs-all'
import plugin from '../src/plugin'
import { customize } from './customize'
import disableLegacy from './disable-legacy'
import type { Configs } from '../dts/configs'

export type * from './customize'

const recommendedExtends: Linter.BaseConfig = /* #__PURE__ */ customize({ flat: false })

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
  'all-flat': createAllConfigs(plugin, '@stylistic', true, name => !name.startsWith('jsx-')) as Linter.Config,

  /**
   * Enable all rules, in Legacy Config Format
   */
  'all-extends': createAllConfigs(plugin, '@stylistic', false, name => !name.startsWith('jsx-')) as Linter.BaseConfig,

  /**
   * @deprecated Use `recommended-extends` instead
   */
  'recommended-legacy': recommendedExtends,
}
