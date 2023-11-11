import fs from 'node:fs'
import fg from 'fast-glob'

const files = fg.sync('**/*.js', {
  ignore: ['**/node_modules/**', '**/dist/**'],
})

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8')
  const imports = new Set<string>()
  let replaced = content.replaceAll(/\bastUtils\.([\w_]+)\b/g, (_, name) => {
    imports.add(name)
    return name
  })
  if (imports.size === 0)
    continue
  replaced = replaced.replace('import astUtils ', `import { ${[...imports].join(', ')} }`)
  fs.writeFileSync(file, replaced, 'utf-8')
}
