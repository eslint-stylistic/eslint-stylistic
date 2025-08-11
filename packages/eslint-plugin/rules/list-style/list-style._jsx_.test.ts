import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './list-style'

run<RuleOptions, MessageIds>({
  name: 'list-style',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  valid: [
    // https://github.com/antfu/eslint-plugin-antfu/issues/14
    {
      code: $`
        const a = (
          <div>
            {text.map((item, index) => (
              <p>
              </p>
            ))}
          </div>
        )
      `,
    },
    // https://github.com/antfu/eslint-plugin-antfu/issues/16
    {
      code: $`
        function TodoList() {
          const { data, isLoading } = useSwrInfinite(
            (page) => ['/api/todo/list', { page }],
            ([, params]) => getToDoList(params),
          )
          return <div></div>
        }
      `,
    },
    {
      code: $`
        function Foo() {
          return (
            <div 
              className="text-white" onClick="bar"
              style={{
                color: 'red' 
              }}
            >
              hi
            </div>
          );
        }
      `,
    },
  ],
  invalid: [
    // https://github.com/antfu/eslint-plugin-antfu/issues/14
    {
      code: $`
        const a = (
          <div>
            {text.map((
              item, index) => (
              <p>
              </p>
            ))}
          </div>
        )
      `,
      output: $`
        const a = (
          <div>
            {text.map((
              item, 
        index
        ) => (
              <p>
              </p>
            ))}
          </div>
        )
      `,
    },
    {
      code: $`
        function Foo() {
          return (
            <div className="text-white"
              onClick="bar"
              style={{ color: 'red' }}
            >
              hi
            </div>
          );
        }
      `,
      output: $`
        function Foo() {
          return (
            <div className="text-white"      onClick="bar"      style={{ color: 'red' }}    >
              hi
            </div>
          );
        }
      `,
    },
    {
      code: $`
        function Foo() {
          return (
            <div 
              className="text-white" onClick="bar"
              style={{ color: 'red' }}
            >
              hi
            </div>
          );
        }
      `,
      output: $`
        function Foo() {
          return (
            <div 
              className="text-white" 
        onClick="bar"
              style={{ color: 'red' }}
            >
              hi
            </div>
          );
        }
      `,
    },
  ],
})
