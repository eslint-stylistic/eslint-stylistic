import fs from 'node:fs/promises'
import fg from 'fast-glob'
import graymatter from 'gray-matter'

const files = fg.sync('packages/*/rules/**/*.md', {
  ignore: ['**/node_modules/**'],
})

for (const file of files) {
  const content = await fs.readFile(file, 'utf-8')
  const matter = graymatter(content)
  if (matter.content.trim().startsWith('# '))
    continue

  const name = file.split('/').at(-2)
  const ns = file.split('/').at(-4)?.replace('eslint-plugin-', '')
  matter.content = `# ${ns}/${name}\n${matter.content}`
  await fs.writeFile(file, graymatter.stringify(matter.content, matter.data))
}
