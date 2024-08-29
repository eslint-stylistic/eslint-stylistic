import rule from './jsx-function-call-newline._jsx_'
import { invalids, valids } from '#test/parsers-jsx'
import { run } from '#test'

run({
  name: 'jsx-function-call-newline',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

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
    {
      code: `new OBJ((<div style={{}} />), <div />, <div />)`,
    },
    {
      code: `new OBJ(<div />, <div />, <div />)`,
    },
    {
      code: `new OBJ(<div />, <div />\n, <div />)`,
    },
    {
      code: `new OBJ(\n<div />\n,\n<div />\n,\n<div />\n)`,
    },
    {
      code: `new OBJ(\n<div />\n,\n<div />\n,\n<div />\n)`,
      options: ['always'],
    },
    {
      code: `new OBJ(\n<div />\n,\n<div ></div>)`,
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
      code: `new OBJ(<div
        />)`,
      output: `new OBJ(\n<div
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
      code: `new OBJ(\n<div />,<div />,\n<div />)`,
      output: `new OBJ(\n<div />,\n<div />,\n<div />\n)`,
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
