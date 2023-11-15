import fg from 'fast-glob'

const files = fg.sync(['packages/**/*.js'], {
  ignore: ['**/node_modules/**', '**/dist/**', '**/test-utils/parsers/**'],
}).sort()

console.log(files.map(i => `./${i}`).join('\n'))

console.log(`\n${files.length} files remaining`)
