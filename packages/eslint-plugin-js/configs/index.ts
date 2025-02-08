import { createAllConfigs } from '#utils/configs-all'
import plugin from '../src/plugin'
import disableLegacy from './disable-legacy'

const all = /* @__PURE__ */ createAllConfigs(plugin, '@stylistic/js')

export const configs = {
  'disable-legacy': disableLegacy,
  all,
  /**
   * @deprecated use `all` instead.
   */
  'all-flat': all,
}
