/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import { invalids, skipDueToMultiErrorSorting, valids } from '#test/parsers-jsx'
import rule from './jsx-equals-spacing'

run<RuleOptions, MessageIds>({
  name: 'jsx-equals-spacing',
  rule,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  valid: valids<RuleOptions>(
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

  invalid: invalids<RuleOptions, MessageIds>(
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      errors: [
        { messageId: 'noSpaceBefore' },
        { messageId: 'noSpaceAfter' },
      ],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo = {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceBefore' },
        { messageId: 'noSpaceAfter' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceBefore' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo={bar} />',
      options: ['never'],
      errors: [{ messageId: 'noSpaceAfter' }],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo= {bar} bar = {baz} />',
      output: '<App foo={bar} bar={baz} />',
      options: ['never'],
      errors: [
        { messageId: 'noSpaceAfter' },
        { messageId: 'noSpaceBefore' },
        { messageId: 'noSpaceAfter' },
      ],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore' },
        { messageId: 'needSpaceAfter' },
      ],
    },
    {
      code: '<App foo ={bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceAfter' }],
    },
    {
      code: '<App foo= {bar} />',
      output: '<App foo = {bar} />',
      options: ['always'],
      errors: [{ messageId: 'needSpaceBefore' }],
    },
    skipDueToMultiErrorSorting ? [] : {
      code: '<App foo={bar} bar ={baz} />',
      output: '<App foo = {bar} bar = {baz} />',
      options: ['always'],
      errors: [
        { messageId: 'needSpaceBefore' },
        { messageId: 'needSpaceAfter' },
        { messageId: 'needSpaceAfter' },
      ],
    },
  ),
})
