/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */

import { invalids, skipDueToMultiErrorSorting, valids } from '../../../test-utils/parsers-jsx'
import rule from './jsx-equals-spacing'
import { run } from '#test'

run({
  name: 'jsx-equals-spacing',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: valids(
    {
      code: '<App />',
    },
    {
      code: '<App foo />',
    },
    {
      code: '<App foo="bar" />',
    },
    {
      code: '<App foo={e => bar(e)} />',
    },
    {
      code: '<App {...props} />',
    },
    {
      code: '<App />',
      options: ['never'],
    },
    {
      code: '<App foo />',
      options: ['never'],
    },
    {
      code: '<App foo="bar" />',
      options: ['never'],
    },
    {
      code: '<App foo={e => bar(e)} />',
      options: ['never'],
    },
    {
      code: '<App {...props} />',
      options: ['never'],
    },
    {
      code: '<App />',
      options: ['always'],
    },
    {
      code: '<App foo />',
      options: ['always'],
    },
    {
      code: '<App foo = "bar" />',
      options: ['always'],
    },
    {
      code: '<App foo = {e => bar(e)} />',
      options: ['always'],
    },
    {
      code: '<App {...props} />',
      options: ['always'],
    },
  ),

  invalid: invalids(
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      errors: [
        { messageId: 'noSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBefore', type: 'JSXAttribute' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceAfter', type: 'JSXAttribute' }],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo= {bar} bar = {baz} />',
      output: '<App foo={bar} bar={baz} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
        { messageId: 'noSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'noSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'needSpaceAfter', type: 'JSXAttribute' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceAfter', type: 'JSXAttribute' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceBefore', type: 'JSXAttribute' }],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo={bar} bar ={baz} />',
      output: '<App foo = {bar} bar = {baz} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore', type: 'JSXAttribute' },
        { messageId: 'needSpaceAfter', type: 'JSXAttribute' },
        { messageId: 'needSpaceAfter', type: 'JSXAttribute' },
      ],
    },
  ),
})
