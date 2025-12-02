import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './dot-location'

run<RuleOptions, MessageIds>({
  name: 'dot-location',
  rule,
  lang: 'ts',
  valid: [
    `type Foo = import('foo')`,
    {
      code: `type Foo = import('foo').\nProp`,
      options: ['object'],
    },
    {
      code: `type Foo = import('foo')\n.Prop`,
      options: ['property'],
    },
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
