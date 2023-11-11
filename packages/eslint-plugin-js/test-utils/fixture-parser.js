'use strict'

import path from 'node:path'

/**
 * Gets the path to the specified parser.
 *
 * @param {string[]} arguments - The path containing the parser.
 * @returns {string} The path to the specified parser.
 */
module.exports = function parser(...args) {
  const name = args.pop()
  return path.resolve(__dirname, 'parsers', args.join(path.sep), `${name}.js`)
}
