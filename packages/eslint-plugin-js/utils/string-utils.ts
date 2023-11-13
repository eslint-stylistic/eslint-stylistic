/**
 * @fileoverview Utilities to operate on strings.
 * @author Stephen Wade
 */

import Graphemer from 'graphemer'

// eslint-disable-next-line no-control-regex -- intentionally including control characters
const ASCII_REGEX = /^[\u0000-\u007F]*$/u
let splitter: Graphemer | undefined

/**
 * Counts graphemes in a given string.
 * @param value A string to count graphemes.
 * @returns The number of graphemes in `value`.
 */
export function getGraphemeCount(value: string) {
  if (ASCII_REGEX.test(value))
    return value.length
  if (!splitter)
    splitter = new Graphemer()
  return splitter.countGraphemes(value)
}
