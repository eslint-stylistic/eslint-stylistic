import type { Linter } from 'eslint'
import { createAllConfigs } from '../../shared/configs-all'
import plugin from '../src/plugin'
import disableLegacy from './disable-legacy'
import { customize } from './customize'

export type * from './customize'

export const configs = {
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
  'recommended-legacy': /* #__PURE__ */ customize({ flat: false }),
  /**
   * Enable all rules, in Flat Config Format
   */
  'all-flat': createAllConfigs(plugin, '@stylistic', true) as Linter.FlatConfig,
  /**
   * Enable all rules, in Legacy Config Format
   */
  'all-extends': createAllConfigs(plugin, '@stylistic', false) as Linter.BaseConfig,
}
