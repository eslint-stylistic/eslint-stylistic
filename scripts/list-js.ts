import fg from 'fast-glob'

const files = fg.sync(['packages/**/*.js'], {
  ignore: ['**/node_modules/**', '**/dist/**'],
}).sort()

console.log(files.map(i => `./${i}`).join('\n'))
