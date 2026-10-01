export interface RuleInfo {
  name: string
  ruleId: string
  entry: string
  docsEntry: string
  meta?: RuleMeta
}

export interface PackageInfo {
  name: string
  pkgId: string
  shortId: string
  rules: RuleInfo[]
  path: string
}

export interface RuleMeta {
  fixable?: 'code' | 'whitespace' | null
  languages?: string[]
  docs?: {
    description?: string
    experimental?: boolean
    recommended?: boolean
  }
}
