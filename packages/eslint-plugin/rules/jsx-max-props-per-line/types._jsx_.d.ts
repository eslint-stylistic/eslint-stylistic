/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: AEJDXmY4az */

export type Schema0 =
  | {
    maximum?: {
      single?: number
      multi?: number
      [k: string]: unknown
    }
  }
  | {
    maximum?: number
    when?: 'always' | 'multiline'
  }

export type RuleOptions = [Schema0?]
export type MessageIds = 'newLine'
