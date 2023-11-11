/**
 * @fileoverview Utilities to operate on strings.
 * @author Stephen Wade
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import Graphemer from 'graphemer'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// eslint-disable-next-line no-control-regex -- intentionally including control characters
const ASCII_REGEX = /^[\u0000-\u007F]*$/u

/** @type {Graphemer | undefined} */
let splitter

/**
 * Counts graphemes in a given string.
 * @param {string} value A string to count graphemes.
 * @returns {number} The number of graphemes in `value`.
 */
export function getGraphemeCount(value) {
  if (ASCII_REGEX.test(value))
    return value.length

  if (!splitter)
    splitter = new Graphemer()

  return splitter.countGraphemes(value)
}
