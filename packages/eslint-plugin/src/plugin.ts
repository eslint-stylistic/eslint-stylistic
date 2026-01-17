import { name, version } from '../package.json' with { type: 'json' }
import rules from '../rules'

const plugin = {
  meta: {
    name,
    version,
    namespace: '@stylistic',
  },
  rules,
}

export default plugin
