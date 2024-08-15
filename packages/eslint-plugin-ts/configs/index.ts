import plugin from '../src/plugin'
import disableLegacy from './disable-legacy'
import { createAllConfigs } from '#utils/configs-all'

export const configs = {
  'disable-legacy': disableLegacy,
  'all-flat': createAllConfigs(plugin, '@stylistic/ts', true),
  'all-extends': createAllConfigs(plugin, '@stylistic/ts', false),
}
