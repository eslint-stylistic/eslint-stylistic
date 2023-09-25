export interface RuleInfo {
  name: string
  ruleId: string
  originalId?: string

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
  fixable?: 'code' | 'whitespace'
  docs?: {
    description?: string
    recommended?: boolean
  }
}
