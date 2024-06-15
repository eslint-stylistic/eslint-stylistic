/* GENERATED, DO NOT EDIT DIRECTLY */

export type Schema0 =
  | []
  | ['starred-block' | 'bare-block']
  | []
  | ['separate-lines']
  | [
    'separate-lines',
    {
      checkJSDoc?: boolean
    },
  ]

export type RuleOptions = Schema0
export type MessageIds = 'expectedBlock' | 'expectedBareBlock' | 'startNewline' | 'endNewline' | 'missingStar' | 'alignment' | 'expectedLines'
