import type { Plugin } from 'vite'
import type { CommitInfo } from '../../scripts/changelog'

const ID = 'virtual:changelog'

export function ChangelogPlugin(data: CommitInfo[]): Plugin {
  return {
    name: 'eslint-stylistic-changelog',
    resolveId(id) {
      return id === ID ? ID : null
    },
    load(id) {
      if (id !== ID)
        return null
      return `export default ${JSON.stringify(data)}`
    },
  }
}
