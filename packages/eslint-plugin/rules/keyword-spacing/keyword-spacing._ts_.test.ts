// this rule tests the spacing, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { TestCaseError } from '#test'
import type { RuleOptions } from './types._ts_'
import { run } from '#test'
import rule from '.'

const BOTH = { before: true, after: true }
const NEITHER = { before: false, after: false }

/**
 * Creates an option object to test an 'overrides' option.
 *
 * e.g.
 *
 *     override('as', BOTH)
 *
 * returns
 *
 *     {
 *         before: false,
 *         after: false,
 *         overrides: {as: {before: true, after: true}}
 *     }
 * @param keyword A keyword to be overridden.
 * @param value A value to override.
 * @returns An option object to test an 'overrides' option.
 */
function overrides(keyword: string, value: RuleOptions[0] = {}): RuleOptions[0] {
  return {
    before: value.before === false,
    after: value.after === false,
    overrides: { [keyword]: value },
  }
}

/**
 * Gets an error message that expected space(s) before a specified keyword.
 * @param keyword A keyword.
 * @returns An error message.
 */
function expectedBefore(keyword: string): TestCaseError[] {
  return [{ messageId: 'expectedBefore', data: { value: keyword } }]
}

/**
 * Gets an error message that expected space(s) after a specified keyword.
 * @param keyword A keyword.
 * @returns An error message.
 */
function expectedAfter(keyword: string): TestCaseError[] {
  return [{ messageId: 'expectedAfter', data: { value: keyword } }]
}

/**
 * Gets an error message that unexpected space(s) before a specified keyword.
 * @param keyword A keyword.
 * @returns An error message.
 */
function unexpectedBefore(
  keyword: string,
): TestCaseError[] {
  return [{ messageId: 'unexpectedBefore', data: { value: keyword } }]
}

/**
 * Gets an error message that unexpected space(s) after a specified keyword.
 * @param keyword A keyword.
 * @returns An error message.
 */
function unexpectedAfter(
  keyword: string,
): TestCaseError[] {
  return [{ messageId: 'unexpectedAfter', data: { value: keyword } }]
}

run<RuleOptions>({
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
      options: [overrides('as', BOTH)],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'const foo = {}as{};',
      options: [overrides('as', NEITHER)],
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
      options: [overrides('satisfies', BOTH)],
    },
    {
      code: 'const foo = {}satisfies{};',
      options: [overrides('satisfies', NEITHER)],
    },
    {
      code: 'const foo = {} satisfies {};',
      options: [overrides('satisfies', BOTH)],
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
  ],
})
