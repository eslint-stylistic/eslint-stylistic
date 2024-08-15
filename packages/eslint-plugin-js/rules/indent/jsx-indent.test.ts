/**
 * @fileoverview Validate JSX indentation
 * @author Yannick Croissant
 */

import semver from 'semver'
import { version as eslintVersion } from 'eslint/package.json'
import rule from './indent'
import { expectedErrors } from './indent.test'
import { invalids as _invalids, valids as _valids } from '#test/parsers-jsx'
import { $, run } from '#test'

function valids(...tests: Parameters<typeof _valids>) {
  tests.forEach((test) => {
    if (test !== false && !Array.isArray(test) && test?.code)
      test.code = $(test.code)
  })
  return _valids(...tests)
}

function invalids(...tests: Parameters<typeof _invalids>) {
  tests.forEach((test) => {
    if (test !== false && !Array.isArray(test)) {
      if (test?.code)
        test.code = $(test.code)

      if (test?.output)
        test.output = $(test.output as string)
    }
  })
  return _invalids(...tests)
}

run({
  name: 'jsx-indent',
  rule,
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  valid: valids(
    {
      code: `
        <App></App>
      `,
    },
    {
      code: `
        <></>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <App>
        </App>
      `,
    },
    {
      code: `
        <>
        </>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <App>
          <Foo />
        </App>
      `,
      options: [2],
    },
    {
      code: `
        <App>
          <></>
        </App>
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        <>
          <Foo />
        </>
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        <App>
        <Foo />
        </App>
      `,
      options: [0],
    },
    {
      code: `
<App>
\t<Foo />
</App>
`,
      options: ['tab'],
    },
    {
      code: `
        function App() {
          return <App>
            <Foo />
          </App>;
        }
      `,
      options: [2],
    },
    {
      code: `
        function App() {
          return <App>
            <></>
          </App>;
        }
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        function App() {
          return (<App>
            <Foo />
          </App>);
        }
      `,
      options: [2],
    },
    {
      code: `
        function App() {
          return (<App>
            <></>
          </App>);
        }
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        function App() {
          return (
            <App>
              <Foo />
            </App>
          );
        }
      `,
      options: [2],
    },
    {
      code: `
        function App() {
          return (
            <App>
              <></>
            </App>
          );
        }
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        it(
          (
            <div>
              <span />
            </div>
          )
        )
      `,
      options: [2],
    },
    {
      code: `
        it(
          (
            <div>
              <></>
            </div>
          )
        )
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        it(
          (<div>
            <span />
            <span />
            <span />
          </div>)
        )
      `,
      options: [2],
    },
    {
      code: `
        (
          <div>
            <span />
          </div>
        )
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title &&
          <h1>
            {head.title}
          </h1>
        }
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title &&
            <>
              {head.title}
            </>
        }
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        {
          head.title &&
            <h1>
              {head.title}
            </h1>
        }
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title && (
            <h1>
              {head.title}
            </h1>)
        }
      `,
      options: [2],
    },
    {
      code: `
        {
          head.title && (
            <h1>
              {head.title}
            </h1>
          )
        }
      `,
      options: [2],
    },
    {
      code: `
        [
          <div />,
          <div />
        ]
      `,
      options: [2],
    },
    {
      code: `
        [
          <></>,
          <></>
        ]
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        <div>
            {
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
    },
    {
      code: `
        <div>
            {foo &&
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
    },
    {
      code: `
        <div>
            {foo &&
                [
                    <></>,
                    <></>
                ]
            }
        </div>
      `,
      features: ['fragment'],
    },
    {
      code: `
        <div>
            bar <div>
                bar
                bar {foo}
                bar </div>
        </div>
      `,
    },
    {
      code: `
        <>
            bar <>
                bar
                bar {foo}
                bar </>
        </>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression)
      code: `
        foo ?
            <Foo /> :
            <Bar />
      `,
    },
    {
      code: `
        foo ?
            <></> :
            <></>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon at the start of the second expression)
      code: `
        foo ?
            <Foo />
            : <Bar />
      `,
    },
    {
      code: `
        foo ?
            <></>
            : <></>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon on its own line)
      code: `
        foo ?
            <Foo />
            :
            <Bar />
      `,
    },
    {
      code: `
        foo ?
            <></>
            :
            <></>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (multiline JSX, colon on its own line)
      code: `
        {!foo ?
            <Foo
                onClick={this.onClick}
            />
            :
            <Bar
                onClick={this.onClick}
            />
        }
      `,
    },
    {
      // Multiline ternary
      // (first expression on test line, colon at the end of the first expression)
      code: `
        foo ? <Foo /> :
            <Bar />
      `,
    },
    {
      code: `
        foo ? <></> :
            <></>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      // Multiline ternary
      // (first expression on test line, colon at the start of the second expression)
      code: `
        foo ? <Foo />
            : <Bar />
      `,
    },
    {
      code: `
        foo ? <></>
            : <></>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      // Multiline ternary
      // (first expression on test line, colon on its own line)
      code: `
        foo ? <Foo />
            :
            <Bar />
      `,
    },
    {
      code: `
        foo ? <></>
            :
            <></>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        ) :
            <Bar />
      `,
    },
    {
      code: `
        foo ? (
            <></>
        ) :
            <></>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon at the start of the second expression, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        )
            : <Bar />
      `,
    },
    {
      code: `
        foo ? (
            <></>
        )
            : <></>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon on its own line, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        )
            :
            <Bar />
      `,
    },
    {
      code: `
        foo ? (
            <></>
        )
            :
            <></>
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ?
            <Foo /> : (
                <Bar />
            )
      `,
    },
    {
      code: `
        foo ?
            <></> : (
                <></>
            )
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
            : (
                <Bar />
            )
      `,
    },
    {
      code: `
        foo ?
            <></>
            : (
                <></>
            )
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon indented on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
            : (
                <Bar />
            )
      `,
    },
    {
      code: `
        foo ?
            <></>
            : (
                <></>
            )
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression, both expression parenthesized)
      code: `
        foo ? (
            <Foo />
        ) : (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ? (
            <></>
        ) : (
            <></>
        )
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
            <Foo />
        )
            : (
                <Bar />
            )
      `,
    },
    {
      code: `
        foo ? (
            <></>
        )
            : (
                <></>
            )
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
            <Foo />
        )
            :
            (
                <Bar />
            )
      `,
    },
    {
      // Multiline ternary
      // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ? <Foo /> : (
            <Bar />
        )
      `,
    },
    {
      code: `
        foo ? <></> : (
            <></>
        )
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (first expression on test line, colon at the start of the second expression, parenthesized second expression)
      code: `
        foo ? <Foo />
            : (<Bar />)
      `,
    },
    {
      code: `
        foo ? <></>
            : (<></>)
      `,
      features: ['fragment'],
    },
    {
      // Multiline ternary
      // (first expression on test line, colon on its own line, parenthesized second expression)
      code: `
        foo ? <Foo />
            : (
                <Bar />
            )
      `,
    },
    {
      code: `
        foo ? <></>
            : (
                <></>
            )
      `,
      features: ['fragment'],
    },
    {
      code: `
        <span>
          {condition ?
            <Thing
              foo={\`bar\`}
            /> :
            <Thing/>
          }
        </span>
      `,
      options: [2],
    },
    {
      code: `
        <span>
          {condition ?
            <Thing
              foo={"bar"}
            /> :
            <Thing/>
          }
        </span>
      `,
      options: [2],
    },
    {
      code: `
        function foo() {
          <span>
            {condition ?
              <Thing
                foo={superFoo}
              /> :
              <Thing/>
            }
          </span>
        }
      `,
      options: [2],
    },
    {
      code: `
        function foo() {
          <span>
            {condition ?
              <Thing
                foo={superFoo}
              /> :
              <></>
            }
          </span>
        }
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        <span>
            {do {
                const num = rollDice();
                <Thing num={num} />;
            }}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {(do {
                const num = rollDice();
                <Thing num={num} />;
            })}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {do {
                const purposeOfLife = getPurposeOfLife();
                if (purposeOfLife == 42) {
                    <Thing />;
                } else {
                    <AnotherThing />;
                }
            }}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {(do {
                const purposeOfLife = getPurposeOfLife();
                if (purposeOfLife == 42) {
                    <Thing />;
                } else {
                    <AnotherThing />;
                }
            })}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {do {
                <Thing num={rollDice()} />;
            }}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {(do {
                <Thing num={rollDice()} />;
            })}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {do {
                <Thing num={rollDice()} />;
                <Thing num={rollDice()} />;
            }}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {(do {
                <Thing num={rollDice()} />;
                <Thing num={rollDice()} />;
            })}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {do {
                const purposeOfLife = 42;
                <Thing num={purposeOfLife} />;
                <Thing num={purposeOfLife} />;
            }}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        <span>
            {(do {
                const purposeOfLife = 42;
                <Thing num={purposeOfLife} />;
                <Thing num={purposeOfLife} />;
            })}
        </span>
      `,
      features: ['do expressions'],
    },
    {
      code: `
        class Test extends React.Component {
          render() {
            return (
              <div>
                <div />
                <div />
              </div>
            );
          }
        }
      `,
      options: [2],
    },
    {
      code: `
        class Test extends React.Component {
          render() {
            return (
              <>
                <></>
                <></>
              </>
            );
          }
        }
      `,
      features: ['fragment'],
      options: [2],
    },
    {
      code: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
            )}
          />
        );
      `,
      options: [2],
    },
    {
      code: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
            )}
          />
        );
      `,
      options: [2],
    },
    {
      code: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
\t\t)}
\t/>
);
    `,
      options: ['tab'],
    },
    {
      code: `
        function Foo() {
          return (
            <input
              type="radio"
              defaultChecked
            />
          );
        }
      `,
      options: [2],
    },
    {
      code: `
        function Foo() {
          return (
            <div>
              {condition && (
                <p>Bar</p>
              )}
            </div>
          );
        }
      `,
      options: [2],
    },
    {
      code: `
        <App>
            text
        </App>
      `,
    },
    {
      code: `
        <App>
            text
            text
            text
        </App>
      `,
    },
    {
      code: `
<App>
\ttext
</App>
`,
      options: ['tab'],
    },
    {
      code: `
<App>
\t{undefined}
\t{null}
\t{true}
\t{false}
\t{42}
\t{NaN}
\t{"foo"}
</App>
`,
      options: ['tab'],
    },
    {
      code: `
        function App() {
          return (
            <App />
          );
        }
      `,
      options: [2],
    },
    {
      code: `
        function App() {
          return <App>
            <Foo />
          </App>;
        }
      `,
      options: [2],
    },
    {
      code: `
        const myFunction = () => (
          [
            <Tag
              {...properties}
            />,
            <Tag
              {...properties}
            />,
            <Tag
              {...properties}
            />,
          ]
        )
      `,
      options: [2],
    },
    {
      code: `
        const Item = ({ id, name, onSelect }) => <div onClick={onSelect}>
          {id}: {name}
        </div>;
      `,
      options: [2],
    },
    {
      code: `
        type Props = {
          email: string,
          password: string,
          error: string,
        }

        const SomeFormComponent = ({
          email,
          password,
          error,
        }: Props) => (
          // JSX
        );
      `,
      features: ['flow'].concat(semver.satisfies(eslintVersion, '< 8') ? 'no-babel-old' : []),
    },
    {
      code: `
        <a role={'button'}
          className={\`navbar-burger \${open ? 'is-active' : ''}\`}
          href={'#'}
          aria-label={'menu'}
          aria-expanded={false}
          onClick={openMenu}>
          <span aria-hidden={'true'}/>
          <span aria-hidden={'true'}/>
          <span aria-hidden={'true'}/>
        </a>
      `,
      options: [2],
    },
    {
      code: `
        export default class App extends React.Component {
          state = {
            name: '',
          }

          componentDidMount() {
            this.fetchName()
              .then(name => {
                this.setState({name})
              });
          }

          fetchName = () => {
            const url = 'https://api.github.com/users/job13er'
            return fetch(url)
              .then(resp => resp.json())
              .then(json => json.name)
          }

          render() {
            const {name} = this.state
            return (
              <h1>Hello, {name}</h1>
            )
          }
        }
      `,
      features: ['class fields'],
      options: [2],
    },
    {
      code: `
        function test (foo) {
          return foo != null
            ? <div>foo</div>
            : <div>bar</div>
        }
      `,
      options: [2],
    },
    {
      options: [2],
      code: `
      <>
        <div
          foo={
            condition
              ? [
                'bar'
              ]
              : [
                'baz',
                'qux'
              ]
          }
        />
        <div
          style={
            true
              ? {
                color: 'red',
              }
              : {
                height: 1,
              }
          }
        />
      </>
      `,
    },
  ),

  invalid: invalids(
    {
      code: `
        <App>
          <Foo />
        </App>
      `,
      output: `
        <App>
            <Foo />
        </App>
      `,
      errors: expectedErrors([2, 4, 2, 'Punctuator']),
    },
    {
      code: `
        <App>
          <></>
        </App>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        <App>
            <></>
        </App>
      `,
      errors: expectedErrors([2, 4, 2, 'Punctuator']),
    },
    {
      code: `
        <>
          <Foo />
        </>
      `,
      features: ['fragment'],
      output: `
        <>
            <Foo />
        </>
      `,
      errors: expectedErrors([2, 4, 2, 'Punctuator']),
    },
    {
      code: `
        <App>
            <Foo />
        </App>
      `,
      output: `
        <App>
          <Foo />
        </App>
      `,
      options: [2],
      errors: expectedErrors([2, 2, 4, 'Punctuator']),
    },
    {
      code: `
        <App>
            <Foo />
        </App>
      `,
      output: `
        <App>
        \t<Foo />
        </App>
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [2, 1, '4 spaces', 'Punctuator']),
    },
    {
      code: `
        function App() {
          return <App>
            <Foo />
                 </App>;
        }
      `,
      output: `
        function App() {
          return <App>
            <Foo />
          </App>;
        }
      `,
      options: [2],
      errors: expectedErrors([4, 2, 9, 'Punctuator']),
    },
    {
      code: `
        function App() {
          return (<App>
            <Foo />
            </App>);
        }
      `,
      output: `
        function App() {
          return (<App>
            <Foo />
          </App>);
        }
      `,
      options: [2],
      errors: expectedErrors([4, 2, 4, 'Punctuator']),
    },
    {
      code: `
        function App() {
          return (
        <App>
          <Foo />
        </App>
          );
        }
      `,
      // The detection logic only thinks <App> is indented wrong, not the other
      // two lines following. I *think* because it incorrectly uses <App>'s indention
      // as the baseline for the next two, instead of the realizing the entire three
      // lines are wrong together. See #608
      output: `
        function App() {
          return (
            <App>
              <Foo />
            </App>
          );
        }
      `,
      options: [2],
      errors: expectedErrors([
        [3, 4, 0, 'Punctuator'],
        [4, 6, 2, 'Punctuator'],
        [5, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: `
        <App>
           {test}
        </App>
      `,
      output: `
        <App>
            {test}
        </App>
      `,
      errors: expectedErrors([2, 4, 3, 'Punctuator']),
    },
    {
      code: `
        <App>
            {options.map((option, index) => (
                <option key={index} value={option.key}>
                   {option.name}
                </option>
            ))}
        </App>
      `,
      output: `
        <App>
            {options.map((option, index) => (
                <option key={index} value={option.key}>
                    {option.name}
                </option>
            ))}
        </App>
      `,
      errors: expectedErrors([4, 12, 11, 'Punctuator']),
    },
    {
      code: `
        <App>
        {test}
        </App>
      `,
      output: `
        <App>
        \t{test}
        </App>
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [2, 1, 0, 'Punctuator']),
    },
    {
      code: `
<App>
\t{options.map((option, index) => (
\t\t<option key={index} value={option.key}>
\t\t{option.name}
\t\t</option>
\t))}
</App>
`,
      output: `
<App>
\t{options.map((option, index) => (
\t\t<option key={index} value={option.key}>
\t\t\t{option.name}
\t\t</option>
\t))}
</App>
`,
      options: ['tab'],
      errors: expectedErrors('tab', [4, 3, 2, 'Punctuator']),
    },
    {
      code: `
<App>\n
<Foo />\n
</App>
`,
      output: `
<App>\n
\t<Foo />\n
</App>
`,
      options: ['tab'],
      errors: expectedErrors('tab', [3, 1, 0, 'Punctuator']),
    },
    {
      code: `
        [
          <div />,
            <div />
        ]
      `,
      output: `
        [
          <div />,
          <div />
        ]
      `,
      options: [2],
      errors: expectedErrors([3, 2, 4, 'Punctuator']),
    },
    {
      code: `
        [
          <div />,
            <></>
        ]
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        [
          <div />,
          <></>
        ]
      `,
      options: [2],
      errors: expectedErrors([3, 2, 4, 'Punctuator']),
    },
    {
      code: `
        <App>

         <Foo />

        </App>
      `,
      output: `
        <App>

        \t<Foo />

        </App>
      `,
      options: ['tab'],
      errors: expectedErrors('tab', [3, '1 tab', '1 space', 'Punctuator']),
    },
    {
      code: `
        <App>

        \t<Foo />

        </App>
      `,
      output: `
        <App>

          <Foo />

        </App>
      `,
      options: [2],
      errors: expectedErrors([3, 2, '1 tab', 'Punctuator']),
    },
    {
      code: `
        <div>
            {
                [
                    <Foo />,
                <Bar />
                ]
            }
        </div>
      `,
      output: `
        <div>
            {
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
      errors: expectedErrors([5, 12, 8, 'Punctuator']),
    },
    {
      code: `
        <div>
            {foo &&
                [
                    <Foo />,
                <Bar />
                ]
            }
        </div>
      `,
      output: `
        <div>
            {foo &&
                [
                    <Foo />,
                    <Bar />
                ]
            }
        </div>
      `,
      errors: expectedErrors([5, 12, 8, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression)
      code: `
        foo ?
            <Foo /> :
        <Bar />
      `,
      output: `
        foo ?
            <Foo /> :
            <Bar />
      `,
      errors: expectedErrors([3, 4, 0, 'Punctuator']),
    },
    {
      code: `
        foo ?
            <Foo /> :
        <></>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ?
            <Foo /> :
            <></>
      `,
      errors: expectedErrors([3, 4, 0, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon on its own line)
      code: `
        foo ?
            <Foo />
            :
        <Bar />
      `,
      output: `
        foo ?
            <Foo />
            :
            <Bar />
      `,
      errors: expectedErrors([4, 4, 0, 'Punctuator']),
    },
    {
      code: `
        foo ?
            <Foo />
            :
        <></>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ?
            <Foo />
            :
            <></>
      `,
      errors: expectedErrors([4, 4, 0, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (first expression on test line, colon on its own line)
      code: `
        foo ? <Foo />
            :
              <Bar />
      `,
      output: `
        foo ? <Foo />
            :
            <Bar />
      `,
      errors: expectedErrors([3, 4, 6, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        ) :
        <Bar />
      `,
      output: `
        foo ? (
            <Foo />
        ) :
            <Bar />
      `,
      errors: expectedErrors([4, 4, 0, 'Punctuator']),
    },
    {
      code: `
        foo ? (
            <Foo />
        ) :
        <></>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ? (
            <Foo />
        ) :
            <></>
      `,
      errors: expectedErrors([4, 4, 0, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon on its own line, parenthesized first expression)
      code: `
        foo ? (
            <Foo />
        )
            :
        <Bar />
      `,
      output: `
        foo ? (
            <Foo />
        )
            :
            <Bar />
      `,
      errors: expectedErrors([5, 4, 0, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ?
            <Foo /> : (
            <Bar />
            )
      `,
      output: `
        foo ?
            <Foo /> : (
                <Bar />
            )
      `,
      errors: expectedErrors([3, 8, 4, 'Punctuator']),
    },
    {
      code: `
        foo ?
            <Foo /> : (
            <></>
            )
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ?
            <Foo /> : (
                <></>
            )
      `,
      errors: expectedErrors([3, 8, 4, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
            : (
        <Bar />
            )
      `,
      output: `
        foo ?
            <Foo />
            : (
                <Bar />
            )
      `,
      errors: expectedErrors([4, 8, 0, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon indented on its own line, parenthesized second expression)
      code: `
        foo ?
            <Foo />
            : (
            <Bar />
            )
      `,
      output: `
        foo ?
            <Foo />
            : (
                <Bar />
            )
      `,
      errors: expectedErrors([4, 8, 4, 'Punctuator']),
    },
    {
      code: `
        foo ?
            <Foo />
            : (
            <></>
            )
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ?
            <Foo />
            : (
                <></>
            )
      `,
      errors: expectedErrors([4, 8, 4, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (colon at the end of the first expression, both expression parenthesized)
      code: `
        foo ? (
        <Foo />
        ) : (
        <Bar />
        )
      `,
      output: `
        foo ? (
            <Foo />
        ) : (
            <Bar />
        )
      `,
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [4, 4, 0, 'Punctuator'],
      ]),
    },
    {
      code: `
        foo ? (
        <></>
        ) : (
        <></>
        )
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ? (
            <></>
        ) : (
            <></>
        )
      `,
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [4, 4, 0, 'Punctuator'],
      ]),
    },
    {
      // Multiline ternary
      // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
        <Foo />
        )
            : (
        <Bar />
            )
      `,
      output: `
        foo ? (
            <Foo />
        )
            : (
                <Bar />
            )
      `,
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [5, 8, 0, 'Punctuator'],
      ]),
    },
    {
      // Multiline ternary
      // (colon on its own line, both expression parenthesized)
      code: `
        foo ? (
        <Foo />
        )
            :
            (
        <Bar />
            )
      `,
      output: `
        foo ? (
            <Foo />
        )
            :
            (
                <Bar />
            )
      `,
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [6, 8, 0, 'Punctuator'],
      ]),
    },
    {
      code: `
        foo ? (
        <></>
        )
            :
            (
        <></>
            )
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ? (
            <></>
        )
            :
            (
                <></>
            )
      `,
      errors: expectedErrors([
        [2, 4, 0, 'Punctuator'],
        [6, 8, 0, 'Punctuator'],
      ]),
    },
    {
      // Multiline ternary
      // (first expression on test line, colon at the end of the first expression, parenthesized second expression)
      code: `
        foo ? <Foo /> : (
        <Bar />
        )
      `,
      output: `
        foo ? <Foo /> : (
            <Bar />
        )
      `,
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      code: `
        foo ? <Foo /> : (
        <></>
        )
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ? <Foo /> : (
            <></>
        )
      `,
      errors: expectedErrors([2, 4, 0, 'Punctuator']),
    },
    {
      // Multiline ternary
      // (first expression on test line, colon on its own line, parenthesized second expression)
      code: `
        foo ? <Foo />
            : (
        <Bar />
            )
      `,
      output: `
        foo ? <Foo />
            : (
                <Bar />
            )
      `,
      errors: expectedErrors([3, 8, 0, 'Punctuator']),
    },
    {
      code: `
        foo ? <Foo />
            : (
        <></>
            )
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      output: `
        foo ? <Foo />
            : (
                <></>
            )
      `,
      errors: expectedErrors([3, 8, 0, 'Punctuator']),
    },
    {
      code: `
        <p>
            <div>
                <SelfClosingTag />Text
          </div>
        </p>
      `,
      output: `
        <p>
            <div>
                <SelfClosingTag />Text
            </div>
        </p>
      `,
      errors: expectedErrors([4, 4, 2, 'Punctuator']),
    },
    {
      code: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
        )}
          />
        );
      `,
      output: `
        const Component = () => (
          <View
            ListFooterComponent={(
              <View
                rowSpan={3}
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
              />
            )}
          />
        );
      `,
      options: [2],
      errors: expectedErrors([8, 4, 0, 'Punctuator']),
    },
    {
      code: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
)}
\t/>
);
    `,
      output: `
const Component = () => (
\t<View
\t\tListFooterComponent={(
\t\t\t<View
\t\t\t\trowSpan={3}
\t\t\t\tplaceholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"
\t\t\t/>
\t\t)}
\t/>
);
    `,
      options: ['tab'],
      errors: expectedErrors('tab', [8, 2, 0, 'Punctuator']),
    },
    {
      code: `
        function Foo() {
          return (
            <div>
              {condition && (
              <p>Bar</p>
              )}
            </div>
          );
        }
      `,
      output: `
        function Foo() {
          return (
            <div>
              {condition && (
                <p>Bar</p>
              )}
            </div>
          );
        }
      `,
      options: [2],
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: `${8} spaces`,
            actual: 6,
          },
        },
      ],
    },
    {
      code: `
        <span>
            {do {
                const num = rollDice();
                    <Thing num={num} />;
            }}
        </span>
      `,
      output: `
        <span>
            {do {
                const num = rollDice();
                <Thing num={num} />;
            }}
        </span>
      `,
      features: ['do expressions'],
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: `${8} spaces`,
            actual: 12,
          },
        },
      ],
    },
    {
      code: `
        <span>
            {(do {
                const num = rollDice();
                    <Thing num={num} />;
            })}
        </span>
      `,
      output: `
        <span>
            {(do {
                const num = rollDice();
                <Thing num={num} />;
            })}
        </span>
      `,
      features: ['do expressions'],
      errors: [
        {
          messageId: 'wrongIndentation',
          data: {
            expected: `${8} spaces`,
            actual: 12,
          },
        },
      ],
    },
    {
      code: `
        <span>
            {do {
            <Thing num={getPurposeOfLife()} />;
            }}
        </span>
      `,
      features: ['do expressions'],
      output: `
        <span>
            {do {
                <Thing num={getPurposeOfLife()} />;
            }}
        </span>
      `,
      errors: expectedErrors([3, 8, 4, 'Punctuator']),
    },
    {
      code: `
        <span>
            {(do {
            <Thing num={getPurposeOfLife()} />;
            })}
        </span>
      `,
      output: `
        <span>
            {(do {
                <Thing num={getPurposeOfLife()} />;
            })}
        </span>
      `,
      features: ['do expressions'],
      errors: expectedErrors([3, 8, 4, 'Punctuator']),
    },
    {
      code: `
        <div>
        text
        </div>
      `,
      output: `
        <div>
            text
        </div>
      `,
      errors: expectedErrors([1, 4, 0, 'JSXText']),
    },
    {
      code: `
        <div>
        \t\ttext
        </div>
      `,
      options: ['tab'],
      output: `
        <div>
        \ttext
        </div>
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
        },
      ],
    },
    {
      code: `
        <>
        aaa
        </>
      `,
      features: ['fragment'],
      output: `
        <>
            aaa
        </>
      `,
      errors: expectedErrors([1, 4, 0, 'JSXText']),
    },
    {
      code: `
        const StatelessComponent = () => {
            if (new Date() % 2) {
                return (
          <div>Hello</div>
                );
            }
            return null;
        };
      `,
      output: `
        const StatelessComponent = () => {
            if (new Date() % 2) {
                return (
                    <div>Hello</div>
                );
            }
            return null;
        };
      `,
      errors: [
        {
          messageId: 'wrongIndentation',
        },
      ],
    },
    {
      code: `
        function App() {
          return (
            <App />
            );
        }
      `,
      output: `
        function App() {
          return (
            <App />
          );
        }
      `,
      options: [2],
      errors: [{ message: 'Expected indentation of 2 spaces but found 4.' }],
    },
    {
      code: `
        function App() {
          return (
            <App />
        );
        }
      `,
      output: `
        function App() {
          return (
            <App />
          );
        }
      `,
      options: [2],
      errors: [{ message: 'Expected indentation of 2 spaces but found 0.' }],
    },
    {
      code: `
        {condition && [
            <Tag key="a" onClick={() => {
              // some code
            }} />,
            <Tag key="b" onClick={() => {
              // some code
            }} />,
        ]}
      `,
      output: `
        {condition && [
          <Tag key="a" onClick={() => {
            // some code
          }} />,
          <Tag key="b" onClick={() => {
            // some code
          }} />,
        ]}
      `,
      options: [2],
      errors: [
        {
          message: 'Expected indentation of 2 spaces but found 4.',
          line: 2,
        },
        {
          message: 'Expected indentation of 4 spaces but found 6.',
          line: 3,
        },
        {
          message: 'Expected indentation of 2 spaces but found 4.',
          line: 4,
        },
        {
          message: 'Expected indentation of 2 spaces but found 4.',
          line: 5,
        },
        {
          message: 'Expected indentation of 4 spaces but found 6.',
          line: 6,
        },
        {
          message: 'Expected indentation of 2 spaces but found 4.',
          line: 7,
        },
      ],
    },
    {
      code: `
        const IndexPage = () => (
          <h1>
        {"Hi people"}
        <button/>
        </h1>
        );
      `,
      output: `
        const IndexPage = () => (
          <h1>
            {"Hi people"}
            <button/>
          </h1>
        );
      `,
      options: [2],
      errors: expectedErrors([
        [3, 4, 0, 'Punctuator'],
        [4, 4, 0, 'Punctuator'],
        [5, 2, 0, 'Punctuator'],
      ]),
    },
    // Would be nice to handle in one pass, but multipass works fine.
    {
      code: `
        const IndexPage = () => (
          <h1>
        Hi people
        <button/>
        </h1>
        );
      `,

      output: `
        const IndexPage = () => (
          <h1>
            Hi people
        <button/>
          </h1>
        );
      `,
      options: [2],
      errors: expectedErrors([
        [2, 4, 0, 'JSXText'],
        [4, 4, 0, 'Punctuator'],
        [5, 2, 0, 'Punctuator'],
      ]),
    },
    {
      code: `
        const IndexPage = () => (
          <h1>
            Hi people
        <button/>
          </h1>
        );
      `,

      output: `
        const IndexPage = () => (
          <h1>
            Hi people
            <button/>
          </h1>
        );
      `,
      options: [2],
      errors: expectedErrors([4, 4, 0, 'Punctuator']),
    },
    semver.satisfies(eslintVersion, '> 4') ? {
      code: `
        import React from 'react';

        export default function () {
            return (
                <div>
                            Test1

                      <p>Test2</p>
                </div>
            );
        }
      `,
      // TODO: remove two spaces from the Test2 output line
      output: `
        import React from 'react';

        export default function () {
            return (
                <div>
                    Test1

                      <p>Test2</p>
                </div>
            );
        }
      `,
      options: [4],
      errors: [
        { messageId: 'wrongIndentation', line: 5 },
        { messageId: 'wrongIndentation', line: 8 },
      ],
    } : [],
  ),
})
