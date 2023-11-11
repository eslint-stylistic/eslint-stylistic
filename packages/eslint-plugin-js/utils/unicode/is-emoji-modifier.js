/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

/**
 * Check whether a given character is an emoji modifier.
 * @param {number} code The character code to check.
 * @returns {boolean} `true` if the character is an emoji modifier.
 */
export function isEmojiModifier(code) {
  return code >= 0x1F3FB && code <= 0x1F3FF
}
