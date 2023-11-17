import { createAllConfigs } from '../../shared/configs-all'
import plugin from '../src/plugin'

export const configs = {
  'all-flat': createAllConfigs(plugin, '@stylistic/ts', true),
  'all-extends': createAllConfigs(plugin, '@stylistic/ts', false),
}
