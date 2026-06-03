/// <reference types="vite/client" />

declare module 'virtual:changelog' {
  import type { CommitInfo } from '../../scripts/changelog'

  const data: CommitInfo[]
  export default data
}
