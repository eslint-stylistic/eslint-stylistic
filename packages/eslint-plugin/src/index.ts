import { configs } from '../configs'
import plugin from './plugin'

export type * from '../dts'
export type * from '../configs'

export default Object.assign(plugin, { configs })
