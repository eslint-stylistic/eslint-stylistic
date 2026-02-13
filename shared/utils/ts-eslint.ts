export function isESTreeSourceCode(sourceCode: unknown) {
  return (
    typeof sourceCode === 'object'
    && sourceCode !== null
    && 'isESTree' in sourceCode
    && sourceCode.isESTree === true
  )
}
