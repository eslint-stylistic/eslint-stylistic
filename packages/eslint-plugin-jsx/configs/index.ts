import plugin from '../src/plugin'
import disableLegacy from './disable-legacy'
import { createAllConfigs } from '#utils/configs-all'

export const configs = {
  'disable-legacy': disableLegacy,
  'all-flat': createAllConfigs(plugin, '@stylistic/jsx', true),
  'all-extends': createAllConfigs(plugin, '@stylistic/jsx', false),
}
