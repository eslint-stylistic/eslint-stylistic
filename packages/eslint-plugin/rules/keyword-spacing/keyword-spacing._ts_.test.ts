import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './keyword-spacing'
import { BOTH, expectedAfter, expectedBefore, NEITHER, override, unexpectedAfter, unexpectedBefore } from './keyword-spacing._js_.test'

run<RuleOptions, MessageIds>({
  name: 'keyword-spacing',
  rule,
  valid: [
    // ----------------------------------------------------------------------
    // as (typing)
    // ----------------------------------------------------------------------
    {
      code: 'const foo = {} as {};',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'const foo = {}as{};',
      options: [NEITHER],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'const foo = {} as {};',
      options: [override('as', BOTH)],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'const foo = {}as{};',
      options: [override('as', NEITHER)],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'const foo = {} as {};',
      options: [{ overrides: { as: {} } }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    'const foo = {} satisfies {}',
    {
      code: 'const foo = {}satisfies{};',
      options: [NEITHER],
    },
    {
      code: 'const foo = {} satisfies {};',
      options: [override('satisfies', BOTH)],
    },
    {
      code: 'const foo = {}satisfies{};',
      options: [override('satisfies', NEITHER)],
    },
    {
      code: 'const foo = {} satisfies {};',
      options: [override('satisfies', BOTH)],
    },
    {
      code: 'const a = 1 as any',
      options: [NEITHER],
    },
    {
      code: 'const a = true as any',
      options: [NEITHER],
    },
    {
      code: 'const a = b as any',
      options: [NEITHER],
    },
    {
      code: 'const a = 1 satisfies any',
      options: [NEITHER],
    },
    {
      code: 'const a = true satisfies any',
      options: [NEITHER],
    },
    {
      code: 'const a = b satisfies any',
      options: [NEITHER],
    },
    {
      code: 'import type { foo } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type * as Foo from \'foo\'',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type { SavedQueries } from "./SavedQueries.js";',
      options: [
        {
          before: true,
          after: false,
          overrides: {
            else: { after: true },
            return: { after: true },
            try: { after: true },
            catch: { after: false },
            case: { after: true },
            const: { after: true },
            throw: { after: true },
            let: { after: true },
            do: { after: true },
            of: { after: true },
            as: { after: true },
            finally: { after: true },
            from: { after: true },
            import: { after: true },
            export: { after: true },
            default: { after: true },
            // The new option:
            type: { after: true },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      // Space after import is not configurable from option since it's invalid syntax with import type
      code: 'import type { SavedQueries } from "./SavedQueries.js";',
      options: [
        {
          before: true,
          after: true,
          overrides: {
            import: { after: false },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type{SavedQueries} from \'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
          overrides: {
            from: { after: true },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type{SavedQueries} from\'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type http from \'node:http\';',
      options: [
        {
          before: true,
          after: false,
          overrides: {
            from: { after: true },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type http from\'node:http\';',
      options: [
        {
          before: true,
          after: false,
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type {} from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type { foo1, foo2 } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type { foo1 as _foo1, foo2 as _foo2 } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type { foo as bar } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'class A { delete() {} }',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'class C { @readonly accessor foo = 1 }',
      options: [NEITHER],
    },
    {
      code: 'export type { foo } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type * as Foo from \'foo\'',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type { SavedQueries } from "./SavedQueries.js";',
      options: [
        {
          before: true,
          after: false,
          overrides: {
            else: { after: true },
            return: { after: true },
            try: { after: true },
            catch: { after: false },
            case: { after: true },
            const: { after: true },
            throw: { after: true },
            let: { after: true },
            do: { after: true },
            of: { after: true },
            as: { after: true },
            finally: { after: true },
            from: { after: true },
            import: { after: true },
            export: { after: true },
            default: { after: true },
            // The new option:
            type: { after: true },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      // Space after export is not configurable from option since it's invalid syntax with export type
      code: 'export type { SavedQueries } from "./SavedQueries.js";',
      options: [
        {
          before: true,
          after: true,
          overrides: {
            export: { after: false },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type{SavedQueries} from \'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
          overrides: {
            from: { after: true },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type{SavedQueries} from\'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type {} from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type { foo1, foo2 } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type { foo1 as _foo1, foo2 as _foo2 } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export type { foo as bar } from "foo";',
      options: [BOTH],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import type{}from"foo";',
      options: [NEITHER],
    },
    {
      code: 'export type{}from"foo";',
      options: [NEITHER],
    },
  ],
  invalid: [
    // ----------------------------------------------------------------------
    // as (typing)
    // ----------------------------------------------------------------------
    {
      code: 'const foo = {}as {};',
      output: 'const foo = {} as {};',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedBefore('as'),
    },
    {
      code: 'const foo = {} as{};',
      output: 'const foo = {}as{};',
      options: [NEITHER],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedBefore('as'),
    },
    {
      code: 'const foo = {} as{};',
      output: 'const foo = {} as {};',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedAfter('as'),
    },
    {
      code: 'const foo = {}as {};',
      output: 'const foo = {}as{};',
      options: [NEITHER],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedAfter('as'),
    },
    {
      code: 'const foo = {} as{};',
      output: 'const foo = {} as {};',
      options: [{ overrides: { as: {} } }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedAfter('as'),
    },
    {
      code: 'const foo = {}satisfies {};',
      output: 'const foo = {} satisfies {};',
      errors: expectedBefore('satisfies'),
    },
    {
      code: 'const foo = {} satisfies{};',
      output: 'const foo = {}satisfies{};',
      options: [NEITHER],
      errors: unexpectedBefore('satisfies'),
    },
    {
      code: 'const foo = {} satisfies{};',
      output: 'const foo = {} satisfies {};',
      errors: expectedAfter('satisfies'),
    },
    {
      code: 'const foo = {}satisfies {};',
      output: 'const foo = {}satisfies{};',
      options: [NEITHER],
      errors: unexpectedAfter('satisfies'),
    },
    {
      code: 'const foo = {} satisfies{};',
      output: 'const foo = {} satisfies {};',
      options: [{ overrides: { satisfies: {} } }],
      errors: expectedAfter('satisfies'),
    },
    {
      code: 'class C { @readonly() accessor foo = 1 }',
      output: 'class C { @readonly()accessor foo = 1 }',
      options: [NEITHER],
      errors: unexpectedBefore('accessor'),
    },
    {
      code: 'import type{ foo } from "foo";',
      output: 'import type { foo } from "foo";',
      options: [{ after: true, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedAfter('type'),
    },
    {
      code: 'import type { foo } from"foo";',
      output: 'import type{ foo } from"foo";',
      options: [{ after: false, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedAfter('type'),
    },
    {
      code: 'import type* as foo from "foo";',
      output: 'import type * as foo from "foo";',
      options: [{ after: true, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedAfter('type'),
    },
    {
      code: 'import type * as foo from"foo";',
      output: 'import type* as foo from"foo";',
      options: [{ after: false, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedAfter('type'),
    },
    {
      code: 'import type {SavedQueries} from \'./SavedQueries.js\';',
      output: 'import type{SavedQueries} from \'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
          overrides: {
            from: { after: true },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedAfter('type'),
    },
    {
      code: 'import type {SavedQueries} from \'./SavedQueries.js\';',
      output: 'import type{SavedQueries} from\'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        { messageId: 'unexpectedAfter', data: { value: 'type' } },
        { messageId: 'unexpectedAfter', data: { value: 'from' } },
      ],
    },
    {
      code: 'export type{ foo } from "foo";',
      output: 'export type { foo } from "foo";',
      options: [{ after: true, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedAfter('type'),
    },
    {
      code: 'export type { foo } from"foo";',
      output: 'export type{ foo } from"foo";',
      options: [{ after: false, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedAfter('type'),
    },
    {
      code: 'export type* as foo from "foo";',
      output: 'export type * as foo from "foo";',
      options: [{ after: true, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: expectedAfter('type'),
    },
    {
      code: 'export type * as foo from"foo";',
      output: 'export type* as foo from"foo";',
      options: [{ after: false, before: true }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedAfter('type'),
    },
    {
      code: 'export type {SavedQueries} from \'./SavedQueries.js\';',
      output: 'export type{SavedQueries} from \'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
          overrides: {
            from: { after: true },
          },
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: unexpectedAfter('type'),
    },
    {
      code: 'export type {SavedQueries} from \'./SavedQueries.js\';',
      output: 'export type{SavedQueries} from\'./SavedQueries.js\';',
      options: [
        {
          before: true,
          after: false,
        },
      ],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        { messageId: 'unexpectedAfter', data: { value: 'type' } },
        { messageId: 'unexpectedAfter', data: { value: 'from' } },
      ],
    },
    {
      code: 'import type {} from "foo";',
      output: 'import type{}from"foo";',
      options: [NEITHER],
      errors: [
        { messageId: 'unexpectedAfter', data: { value: 'type' } },
        { messageId: 'unexpectedBefore', data: { value: 'from' } },
        { messageId: 'unexpectedAfter', data: { value: 'from' } },
      ],
    },
    {
      code: 'export type {} from "foo";',
      output: 'export type{}from"foo";',
      options: [NEITHER],
      errors: [
        { messageId: 'unexpectedAfter', data: { value: 'type' } },
        { messageId: 'unexpectedBefore', data: { value: 'from' } },
        { messageId: 'unexpectedAfter', data: { value: 'from' } },
      ],
    },

    // ----------------------------------------------------------------------
    // using
    // ----------------------------------------------------------------------

    {
      code: '{}using a = b',
      output: '{} using a = b',
      errors: expectedBefore('using'),
    },
    {
      code: '{} using a = b',
      output: '{}using a = b',
      options: [NEITHER],
      errors: unexpectedBefore('using'),
    },
    {
      code: '{}using a = b',
      output: '{} using a = b',
      options: [override('using', BOTH)],
      errors: expectedBefore('using'),
    },
    {
      code: '{} using a = b',
      output: '{}using a = b',
      options: [override('using', NEITHER)],
      errors: unexpectedBefore('using'),
    },
    {
      code: '{}await using a = b',
      output: '{} await using a = b',
      parserOptions: { ecmaVersion: 2026 },
      errors: expectedBefore('await'),
    },
    {
      code: '{} await using a = b',
      output: '{}await using a = b',
      options: [NEITHER],
      parserOptions: { ecmaVersion: 2026 },
      errors: unexpectedBefore('await'),
    },
    {
      code: '{}await using a = b',
      output: '{} await using a = b',
      options: [override('await', BOTH)],
      parserOptions: { ecmaVersion: 2026 },
      errors: expectedBefore('await'),
    },
    {
      code: '{} await using a = b',
      output: '{}await using a = b',
      options: [override('await', NEITHER)],
      parserOptions: { ecmaVersion: 2026 },
      errors: unexpectedBefore('await'),
    },
  ],
})
