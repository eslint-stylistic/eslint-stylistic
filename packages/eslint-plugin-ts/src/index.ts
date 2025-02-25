import { configs } from '../configs'
import plugin from './plugin'

export type * from '../dts'

const index = Object.assign(plugin, { configs })

export {
  index as default,
  index as 'module.exports',
}
