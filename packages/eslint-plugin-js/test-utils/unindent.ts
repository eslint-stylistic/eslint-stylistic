/**
 * @fileoverview Utilities used in tests
 */

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param strings The strings in the template literal
 * @param values The interpolation values in the template literal.
 * @returns The template literal, with spaces removed from all lines
 */
export function unIndent(strings: TemplateStringsArray, ...values: any[]): string {
  const text = strings
    .map((s, i) => (i === 0 ? s : values[i - 1] + s))
    .join('')
  const lines = text.replace(/^\n/u, '').replace(/\n\s*$/u, '').split('\n')
  const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */u)![0].length)
  const minLineIndent = Math.min(...lineIndents)

  return lines.map(line => line.slice(minLineIndent)).join('\n')
}
