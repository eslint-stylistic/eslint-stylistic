/**
 * @fileoverview Limit to one expression per line in JSX
 * @author Mark Ivan Allen <Vydia.com>
 */

import { RuleTester } from 'eslint'
import { invalids, valids } from '../../test-utils/parsers'
import rule from './jsx-one-expression-per-line'

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
} as const

const ruleTester = new RuleTester({ languageOptions: { parserOptions } })
ruleTester.run('jsx-one-expression-per-line', rule, {
  valid: valids(
    {
      code: '<App />',
    },
    {
      code: `
\t\t\t\t<AllTabs>
\t\t\t\t\tFail
\t\t\t\t</AllTabs>
      `,
    },
    {
      code: `
\t\t\t\t<TagsWithTabs>
          Fail
\t\t\t\t</TagsWithTabs>
      `,
    },
    {
      code: `
        <ClosedTagWithTabs>
          Fail
\t\t\t\t</ClosedTagWithTabs>
      `,
    },
    {
      code: `
\t\t\t\t<OpenTagWithTabs>
          OK
        </OpenTagWithTabs>
      `,
    },
    {
      code: `
        <TextWithTabs>
\t\t\t\t\t\tOK
        </TextWithTabs>
      `,
    },
    {
      code: `
        <AllSpaces>
          OK
        </AllSpaces>
      `,
    },
    {
      code: '<App></App>',
    },
    {
      code: '<App foo="bar" />',
    },
    {
      code: `
        <App>
          <Foo />
        </App>
      `,
    },
    {
      code: `
        <App>
          <Foo />
          <Bar />
        </App>
      `,
    },
    {
      code: `
        <App>
          <Foo></Foo>
        </App>
      `,
    },
    {
      code: `
        <App>
          foo bar baz  whatever
        </App>
      `,
    },
    {
      code: `
        <App>
          <Foo>
          </Foo>
        </App>
      `,
    },
    {
      code: `
        <App
          foo="bar"
        >
        <Foo />
        </App>
      `,
    },
    {
      code: `
        <
        App
        >
          <
            Foo
          />
        </
        App
        >
      `,
    },
    {
      code: '<App>foo</App>',
      options: [{ allow: 'literal' }],
    },
    {
      code: '<App>123</App>',
      options: [{ allow: 'literal' }],
    },
    {
      code: '<App>foo</App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<App>{"foo"}</App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<App>{foo && <Bar />}</App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<App><Foo /></App>',
      options: [{ allow: 'single-child' }],
    },
    {
      code: '<></>',
      features: ['fragment'],
    },
    {
      code: `
        <>
          <Foo />
        </>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
    {
      code: `
        <>
          <Foo />
          <Bar />
        </>
      `,
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
    },
  ),

  invalid: invalids(
    {
      code: `
        <App>{"foo"}</App>
      `,
      output: `
        <App>
{"foo"}
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>foo</App>
      `,
      output: `
        <App>
foo
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          foo {"bar"}
        </div>
      `,
      output: `
        <div>
          foo${' '/* intentional trailing space */}
{' '}
{"bar"}
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          {"foo"} bar
        </div>
      `,
      output: `
        <div>
          {"foo"}
{' '}
bar
</div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' bar        ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo /><Bar />
        </App>
      `,
      output: `
        <App>
          <Foo />
<Bar />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          <span />foo
        </div>
      `,
      output: `
        <div>
          <span />
foo
</div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo        ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          <span />{"foo"}
        </div>
      `,
      output: `
        <div>
          <span />
{"foo"}
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          {"foo"} { I18n.t('baz') }
        </div>
      `,
      output: `
        <div>
          {"foo"}${' '/* intentional trailing space */}
{' '}
{ I18n.t('baz') }
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ I18n.t(\'baz\') }' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Text style={styles.foo}>{ bar } <Text/> { I18n.t('baz') }</Text>
      `,
      output: `
        <Text style={styles.foo}>
{ bar }${' '/* intentional trailing space */}
{' '}
<Text/>${' '/* intentional trailing space */}
{' '}
{ I18n.t('baz') }
</Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ bar }' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Text' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ I18n.t(\'baz\') }' },
        },
      ],
      languageOptions: { parserOptions },

    },
    {
      code: `
        <Text style={styles.foo}> <Bar/> <Baz/></Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar/>${' '/* intentional trailing space */}
{' '}
<Baz/>
</Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Baz' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Text style={styles.foo}> <Bar/> <Baz/> <Bunk/> <Bruno/> </Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar/>${' '/* intentional trailing space */}
{' '}
<Baz/>${' '/* intentional trailing space */}
{' '}
<Bunk/>${' '/* intentional trailing space */}
{' '}
<Bruno/>
{' '}
 </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Baz' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bunk' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bruno' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Text style={styles.foo}> <Bar /></Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar />
</Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Text style={styles.foo}> <Bar />
        </Text>
      `,
      output: `
        <Text style={styles.foo}>${' '/* intentional trailing space */}
{' '}
<Bar />
        </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Text style={styles.foo}>
          <Bar /> <Baz />
        </Text>
      `,
      output: `
        <Text style={styles.foo}>
          <Bar />${' '/* intentional trailing space */}
{' '}
<Baz />
        </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Baz' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Text style={styles.foo}>
          { bar } { I18n.t('baz') }
        </Text>
      `,
      output: `
        <Text style={styles.foo}>
          { bar }${' '/* intentional trailing space */}
{' '}
{ I18n.t('baz') }
        </Text>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{ I18n.t(\'baz\') }' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          foo<input />
        </div>
      `,
      output: `
        <div>
          foo
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          {"foo"}<span />
        </div>
      `,
      output: `
        <div>
          {"foo"}
<span />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'span' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          foo <input />
        </div>
      `,
      output: `
        <div>
          foo${' '/* intentional trailing space */}
{' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          <input /> foo
        </div>
      `,
      output: `
        <div>
          <input />
{' '}
foo
</div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' foo        ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          <span /> <input />
        </div>
      `,
      output: `
        <div>
          <span />${' '/* intentional trailing space */}
{' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          <span />
        {' '}<input />
        </div>
      `,
      output: `
        <div>
          <span />
        {' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          {"foo"} <input />
        </div>
      `,
      output: `
        <div>
          {"foo"}${' '/* intentional trailing space */}
{' '}
<input />
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'input' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
          <input /> {"foo"}
        </div>
      `,
      output: `
        <div>
          <input />${' '/* intentional trailing space */}
{' '}
{"foo"}
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo></Foo><Bar></Bar>
        </App>
      `,
      output: `
        <App>
          <Foo></Foo>
<Bar></Bar>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
        <Foo></Foo></App>
      `,
      output: `
        <App>
        <Foo></Foo>
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App><Foo />
        </App>
      `,
      output: `
        <App>
<Foo />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
        <Foo/></App>
      `,
      output: `
        <App>
        <Foo/>
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App><Foo
        />
        </App>
      `,
      output: `
        <App>
<Foo
        />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App
        >
        <Foo /></App>
      `,
      output: `
        <App
        >
        <Foo />
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App
        >
        <Foo
        /></App>
      `,
      output: `
        <App
        >
        <Foo
        />
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App
        ><Foo />
        </App>
      `,
      output: `
        <App
        >
<Foo />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo></Foo
        ></App>
      `,
      output: `
        <App>
          <Foo></Foo
        >
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo></
        Foo></App>
      `,
      output: `
        <App>
          <Foo></
        Foo>
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo></
        Foo><Bar />
        </App>
      `,
      output: `
        <App>
          <Foo></
        Foo>
<Bar />
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo>
            <Bar /></Foo>
        </App>
      `,
      output: `
        <App>
          <Foo>
            <Bar />
</Foo>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Bar' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo>
            <Bar> baz </Bar>
          </Foo>
        </App>
      `,
      output: `
        <App>
          <Foo>
            <Bar>
{' '}
baz
{' '}
</Bar>
          </Foo>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>
          foo {"bar"} baz
        </App>
      `,
      output: `
        <App>
          foo${' '/* intentional trailing space */}
{' '}
{"bar"} baz
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>
          foo {"bar"}
        </App>
      `,
      output: `
        <App>
          foo${' '/* intentional trailing space */}
{' '}
{"bar"}
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>
          foo
        {' '}
        {"bar"} baz
        </App>
      `,
      output: `
        <App>
          foo
        {' '}
        {"bar"}
{' '}
baz
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>

          foo {"bar"} baz

        </App>
      `,
      output: `
        <App>

          foo${' '/* intentional trailing space */}
{' '}
{"bar"} baz

        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"bar"}' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
    // Would be nice to handle in one pass, but multipass works fine.
      code: `
        <App>

          foo
        {' '}
        {"bar"} baz

        </App>
      `,
      output: `
        <App>

          foo
        {' '}
        {"bar"}
{' '}
baz

</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: ' baz        ' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>{
          foo
        }</App>
      `,
      output: `
        <App>
{
          foo
        }
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{          foo        }' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App> {
          foo
        } </App>
      `,
      output: `
        <App>${' '/* intentional trailing space */}
{' '}
{
          foo
        }
{' '}
 </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{          foo        }' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
        {' '}
        {
          foo
        } </App>
      `,
      output: `
        <App>
        {' '}
        {
          foo
        }
{' '}
 </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{          foo        }' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App><Foo /></App>
      `,
      output: `
        <App>
<Foo />
</App>
      `,
      options: [{ allow: 'none' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
    },
    {
      code: `
        <App>foo</App>
      `,
      output: `
        <App>
foo
</App>
      `,
      options: [{ allow: 'none' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo' },
        },
      ],
    },
    {
      code: `
        <App>{"foo"}</App>
      `,
      output: `
        <App>
{"foo"}
</App>
      `,
      options: [{ allow: 'none' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
    },
    {
      code: `
        <App>foo
        </App>
      `,
      output: `
        <App>
foo
</App>
      `,
      options: [{ allow: 'literal' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo        ' },
        },
      ],
    },
    {
      code: `
        <App><Foo /></App>
      `,
      output: `
        <App>
<Foo />
</App>
      `,
      options: [{ allow: 'literal' }],
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
    },
    {
      code: `
        <App
          foo="1"
          bar="2"
        >baz</App>
      `,
      options: [{ allow: 'literal' }],
      output: `
        <App
          foo="1"
          bar="2"
        >
baz
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'baz' },
        },
      ],
    },
    {
      code: `
        <App>foo
        bar
        </App>
      `,
      options: [{ allow: 'literal' }],
      output: `
        <App>
foo
        bar
</App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'foo        bar        ' },
        },
      ],
    },
    {
      code: `
        <>{"foo"}</>
      `,
      output: `
        <>
{"foo"}
</>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"foo"}' },
        },
      ],
      features: ['fragment', 'no-ts-old'], // TODO: FIXME: remove no-ts-old and fix
      languageOptions: { parserOptions },
    },
    {
      code: `
        <App>
          <Foo /><></>
        </App>
      `,
      output: `
        <App>
          <Foo />
<></>
        </App>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '<></>' },
        },
      ],
      features: ['fragment'],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <
        ><Foo />
        </>
      `,
      output: `
        <
        >
<Foo />
        </>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Foo' },
        },
      ],
      features: ['fragment', 'no-ts-old'],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <div>
        <MyComponent>a</MyComponent>
        <MyOther>{a}</MyOther>
        </div>
      `,
      output: `
        <div>
        <MyComponent>
a
</MyComponent>
        <MyOther>
{a}
</MyOther>
        </div>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'a' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{a}' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
    // TODO: handle in a single pass
      code: `
        const IndexPage = () => (
          <h1>{"Hi people"}<button/></h1>
        );
      `,
      output: `
        const IndexPage = () => (
          <h1>
{"Hi people"}<button/></h1>
        );
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: '{"Hi people"}' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'button' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        const IndexPage = () => (
          <h1>
{"Hi people"}<button/></h1>
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
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'button' },
        },
      ],
      languageOptions: { parserOptions },
    },
    // TODO: handle in a single pass (see above)
    {
      code: `
        <Layout>
        <p>Welcome to your new Gatsby site.</p>
        <p>Now go build something great.</p>
        <h1>Hi people<button/></h1>
        </Layout>
      `,
      output: `
        <Layout>
        <p>
Welcome to your new Gatsby site.
</p>
        <p>
Now go build something great.
</p>
        <h1>
Hi people<button/></h1>
        </Layout>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Welcome to your new Gatsby site.' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Now go build something great.' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Hi people' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'button' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Layout>
        <p>
Welcome to your new Gatsby site.
</p>
        <p>
Now go build something great.
</p>
        <h1>
Hi people<button/></h1>
        </Layout>
      `,
      output: `
        <Layout>
        <p>
Welcome to your new Gatsby site.
</p>
        <p>
Now go build something great.
</p>
        <h1>
Hi people
<button/>
</h1>
        </Layout>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'button' },
        },
      ],
      languageOptions: { parserOptions },
    },
    // TODO: handle in a single pass
    {
      code: `
        <Layout>
          <div style={{ maxWidth: \`300px\`, marginBottom: \`1.45rem\` }}>
            <Image />
          </div><Link to="/page-2/">Go to page 2</Link>
        </Layout>
      `,
      output: `
        <Layout>
          <div style={{ maxWidth: \`300px\`, marginBottom: \`1.45rem\` }}>
            <Image />
          </div>
<Link to="/page-2/">Go to page 2</Link>
        </Layout>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Link' },
        },
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Go to page 2' },
        },
      ],
      languageOptions: { parserOptions },
    },
    {
      code: `
        <Layout>
          <div style={{ maxWidth: \`300px\`, marginBottom: \`1.45rem\` }}>
            <Image />
          </div>
<Link to="/page-2/">Go to page 2</Link>
        </Layout>
      `,
      output: `
        <Layout>
          <div style={{ maxWidth: \`300px\`, marginBottom: \`1.45rem\` }}>
            <Image />
          </div>
<Link to="/page-2/">
Go to page 2
</Link>
        </Layout>
      `,
      errors: [
        {
          messageId: 'moveToNewLine',
          data: { descriptor: 'Go to page 2' },
        },
      ],
      languageOptions: { parserOptions },
    },
  ),
})
