/// <reference types="vite/client" />

declare module 'virtual:changelog' {
  import type { CommitInfo } from '../plugins/changelog'

  const data: CommitInfo[]
  export default data
}
