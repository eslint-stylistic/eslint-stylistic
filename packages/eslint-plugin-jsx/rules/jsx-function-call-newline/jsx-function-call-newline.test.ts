import { RuleTester } from 'eslint'
import { invalids, valids } from '../../test-utils/parsers'
import rule from './jsx-function-call-newline'

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
} as const

const ruleTester = new RuleTester({ parserOptions })

ruleTester.run('jsx-function-call-newline', rule, {
  valid: valids(
    {
      code: `fn(<div />)`,
    },
    {
      code: `fn(<div />, <div />)`,
    },
    {
      code: `fn(<div />,\n<div />)`,
    },
    {
      code: `fn(\n<div />, <div />)`,
    },
    {
      code: `fn(\n<div />, <div />\n)`,
    },
    {
      code: `fn(\n<div />\n)`,
      options: ['always'],
    },
    {
      code: `fn(<div />, \n<div \n style={{ color: 'red' }}\n />\n)`,
    },
    {
      code: `fn(<div />, <div />, <div />)`,
    },
    {
      code: `fn(<div />, <div />\n, <div />)`,
    },
    {
      code: `fn(\n<div />\n,\n<div />\n,\n<div />\n)`,
    },
    {
      code: `fn(\n<div />\n,\n<div />\n,\n<div />\n)`,
      options: ['always'],
    },
    {
      code: `fn(\n<div />\n,\n<div ></div>)`,
    },
    {
      code: `fn((<div style={{}} />), <div />, <div />)`,
    },
  ),
  invalid: invalids(
    {
      code: `fn(<div
        />)`,
      output: `fn(\n<div
        />\n)`,
      errors: [
        { messageId: 'missingLineBreak' },
      ],
    },
    {
      code: `fn(<div />)`,
      output: `fn(\n<div />\n)`,
      errors: [
        { messageId: 'missingLineBreak' },
      ],
      options: ['always'],
    },
    {
      code: `fn(\n<div />,<div />,\n<div />)`,
      output: `fn(\n<div />,\n<div />,\n<div />\n)`,
      errors: [
        { messageId: 'missingLineBreak' },
        { messageId: 'missingLineBreak' },
      ],
      options: ['always'],
    },
    {
      code: `fn((\n<div />),<div />,\n<div />)`,
      output: `fn((\n<div />\n),\n<div />,\n<div />\n)`,
      errors: [
        { messageId: 'missingLineBreak' },
        { messageId: 'missingLineBreak' },
        { messageId: 'missingLineBreak' },
      ],
      options: ['always'],
    },
    {
      code: `fn(<div />, <span>\n</span>)`,
      output: `fn(<div />, \n<span>\n</span>\n)`,
      errors: [
        { messageId: 'missingLineBreak' },
      ],
    },
    {
      code: `fn(<div \n />, <span>\n</span>)`,
      output: `fn(\n<div \n />, \n<span>\n</span>\n)`,
      errors: [
        { messageId: 'missingLineBreak' },
        { messageId: 'missingLineBreak' },
      ],
    },
  ),
})
