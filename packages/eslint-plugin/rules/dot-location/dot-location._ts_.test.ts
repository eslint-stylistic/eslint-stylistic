import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './dot-location'

run<RuleOptions, MessageIds>({
  name: 'dot-location',
  rule,
  lang: 'ts',
  valid: [
    // TSImportType
    `type Foo = import('foo')`,
    {
      code: `type Foo = import('foo').\nProp`,
      options: ['object'],
    },
    {
      code: `type Foo = import('foo')\n.Prop`,
      options: ['property'],
    },

    // TSQualifiedName
    {
      code: 'type Foo = Obj.\nProp',
      options: ['object'],
    },
    {
      code: 'type Foo = Obj\n.Prop',
      options: ['property'],
    },
  ],
  invalid: [
    // TSImportType
    {
      code: `type Foo = import('foo')\n.Prop`,
      output: `type Foo = import('foo').\nProp`,
      options: ['object'],
      errors: [{ messageId: 'expectedDotAfterObject' }],
    },
    {
      code: `type Foo = import('foo').\nProp`,
      output: `type Foo = import('foo')\n.Prop`,
      options: ['property'],
      errors: [{ messageId: 'expectedDotBeforeProperty' }],
    },

    // TSQualifiedName
    {
      code: 'type Foo = Obj\n.Prop',
      output: 'type Foo = Obj.\nProp',
      options: ['object'],
      errors: [{ messageId: 'expectedDotAfterObject' }],
    },
    {
      code: 'type Foo = Obj.\nProp',
      output: 'type Foo = Obj\n.Prop',
      options: ['property'],
      errors: [{ messageId: 'expectedDotBeforeProperty' }],
    },
  ],
})
