/**
 * @fileoverview Utilities to operate on strings.
 * @author Stephen Wade
 */

// eslint-disable-next-line no-control-regex -- intentionally including control characters
const ASCII_REGEX = /^[\u0000-\u007F]*$/u
let segmenter: Intl.Segmenter | undefined

/**
 * Counts graphemes in a given string.
 * @param value A string to count graphemes.
 * @returns The number of graphemes in `value`.
 */
export function getGraphemeCount(value: string) {
  if (ASCII_REGEX.test(value))
    return value.length

  if (!segmenter)
    segmenter = new Intl.Segmenter()

  return [...segmenter.segment(value)].length
}
