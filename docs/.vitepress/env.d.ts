/// <reference types="vite/client" />

declare module 'virtual:changelog' {
  import type { VersionGroup } from '../plugins/changelog'

  const data: Record<string, VersionGroup[]>
  export default data
}
