import { fileURLToPath } from 'node:url'
import { createConfig } from '../../tsdown.config.base.ts'

export default createConfig(fileURLToPath(new URL('.', import.meta.url)))
