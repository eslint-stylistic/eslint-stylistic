import { createAllConfigs } from '#utils/configs-all'
import plugin from '../src/plugin'
import disableLegacy from './disable-legacy'

export const configs = {
  'disable-legacy': disableLegacy,
  'all-flat': createAllConfigs(plugin, '@stylistic/js', true),
  'all-extends': createAllConfigs(plugin, '@stylistic/js', false),
}
