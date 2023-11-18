import { createAllConfigs } from '../../shared/configs-all'
import plugin from '../src/plugin'
import disableLegacy from './disable-legacy'

export const configs = {
  'disable-legacy': disableLegacy,
  'all-flat': createAllConfigs(plugin, '@stylistic/ts', true),
  'all-extends': createAllConfigs(plugin, '@stylistic/ts', false),
}
