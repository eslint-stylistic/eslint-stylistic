import alias from '@rollup/plugin-alias'
import { aliasVirtual } from './alias.mjs'

export function aliasPlugin() {
  return alias({
    customResolver: (source) => {
      if (!source.endsWith('.ts'))
        return `${source}.ts`
    },
    entries: aliasVirtual,
  })
}
