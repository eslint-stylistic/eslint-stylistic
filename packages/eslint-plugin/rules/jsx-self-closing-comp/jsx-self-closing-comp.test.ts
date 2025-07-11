/**
 * @fileoverview Prevent extra closing tags for components without children
 * @author Yannick Croissant
 */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import { invalids, valids } from '#test/parsers-jsx'
import rule from './jsx-self-closing-comp'

run<RuleOptions, MessageIds>({
  name: 'self-closing-comp',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: valids<RuleOptions>(
    {
      code: 'var HelloJohn = <Hello name="John" />;',
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John" />;',
    },
    {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
    },
    {
      code: 'var Profile = <Hello.Compound name="John"><img src="picture.png" /></Hello.Compound>;',
    },
    {
      code: `
        <Hello>
          <Hello name="John" />
        </Hello>
      `,
    },
    {
      code: `
        <Hello.Compound>
          <Hello.Compound name="John" />
        </Hello.Compound>
      `,
    },
    {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John"> </Hello.Compound>;',
    },
    {
      code: 'var HelloJohn = <Hello name="John">        </Hello>;',
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John">        </Hello.Compound>;',
    },
    {
      code: 'var HelloJohn = <div>&nbsp;</div>;',
    },
    {
      code: 'var HelloJohn = <div>{\' \'}</div>;',
    },
    {
      code: 'var HelloJohn = <Hello name="John">&nbsp;</Hello>;',
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John">&nbsp;</Hello.Compound>;',
    },
    {
      code: 'var HelloJohn = <Hello name="John" />;',
      options: [],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John" />;',
      options: [],
    },
    {
      code: 'var Profile = <Hello name="John"><img src="picture.png" /></Hello>;',
      options: [],
    },
    {
      code: 'var Profile = <Hello.Compound name="John"><img src="picture.png" /></Hello.Compound>;',
      options: [],
    },
    {
      code: `
        <Hello>
          <Hello name="John" />
        </Hello>
      `,
      options: [],
    },
    {
      code: `
        <Hello.Compound>
          <Hello.Compound name="John" />
        </Hello.Compound>
      `,
      options: [],
    },
    {
      code: 'var HelloJohn = <div> </div>;',
      options: [],
    },
    {
      code: 'var HelloJohn = <div>        </div>;',
      options: [],
    },
    {
      code: 'var HelloJohn = <div>&nbsp;</div>;',
      options: [],
    },
    {
      code: 'var HelloJohn = <div>{\' \'}</div>;',
      options: [],
    },
    {
      code: 'var HelloJohn = <Hello name="John">&nbsp;</Hello>;',
      options: [],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John">&nbsp;</Hello.Compound>;',
      options: [],
    },
    {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      options: [{ component: false }],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John"></Hello.Compound>;',
      options: [{ component: false }],
    },
    {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      options: [{ component: false }],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John">\n</Hello.Compound>;',
      options: [{ component: false }],
    },
    {
      code: 'var HelloJohn = <Hello name="John"> </Hello>;',
      options: [{ component: false }],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John"> </Hello.Compound>;',
      options: [{ component: false }],
    },
    {
      code: 'var contentContainer = <div className="content" />;',
      options: [{ html: true }],
    },
    {
      code: 'var contentContainer = <div className="content"><img src="picture.png" /></div>;',
      options: [{ html: true }],
    },
    {
      code: `
        <div>
          <div className="content" />
        </div>
      `,
      options: [{ html: true }],
    },
  ),

  invalid: invalids<RuleOptions, MessageIds>(
    {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [],
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var CompoundHelloJohn = <Hello.Compound name="John"></Hello.Compound>;',
      output: 'var CompoundHelloJohn = <Hello.Compound name="John" />;',
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John">\n</Hello.Compound>;',
      output: 'var HelloJohn = <Hello.Compound name="John" />;',
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var HelloJohn = <Hello name="John"></Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John"></Hello.Compound>;',
      output: 'var HelloJohn = <Hello.Compound name="John" />;',
      options: [],
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var HelloJohn = <Hello name="John">\n</Hello>;',
      output: 'var HelloJohn = <Hello name="John" />;',
      options: [],
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var HelloJohn = <Hello.Compound name="John">\n</Hello.Compound>;',
      output: 'var HelloJohn = <Hello.Compound name="John" />;',
      options: [],
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var contentContainer = <div className="content"></div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{ html: true }],
      errors: [{ messageId: 'notSelfClosing' }],
    },
    {
      code: 'var contentContainer = <div className="content">\n</div>;',
      output: 'var contentContainer = <div className="content" />;',
      options: [{ html: true }],
      errors: [{ messageId: 'notSelfClosing' }],
    },
  ),
})
