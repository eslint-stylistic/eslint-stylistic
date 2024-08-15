import plugin from '../src/plugin'
import disableLegacy from './disable-legacy'
import { createAllConfigs } from '#utils/configs-all'

export const configs = {
  'disable-legacy': disableLegacy,
  'all-flat': createAllConfigs(plugin, '@stylistic/js', true),
  'all-extends': createAllConfigs(plugin, '@stylistic/js', false),
}
