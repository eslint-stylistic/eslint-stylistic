import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)

/**
 * Gets the path to the specified parser.
 *
 * @param arguments - The path containing the parser.
 * @returns The path to the specified parser.
 */
export default function parserResolver(...args: string[]) {
  const name = args.pop()
  return require(join(__dirname, 'parsers', ...args, `${name}.js`))
}

export function createParserResolver(...pre: string[]) {
  return (...args: string[]) => parserResolver(...pre, ...args)
}
