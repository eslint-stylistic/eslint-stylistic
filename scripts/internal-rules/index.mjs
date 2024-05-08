import JITI from 'jiti'

const jiti = JITI(import.meta.url)
const mod = jiti('./index.ts')

export const config = mod.config
