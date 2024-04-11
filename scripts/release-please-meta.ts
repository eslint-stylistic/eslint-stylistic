import fs from 'node:fs/promises'
import fg from 'fast-glob'

const files = await fg('packages/**/package.json', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
})

const json = JSON.parse(await fs.readFile('release-please-config.json', 'utf8'))

json['extra-files'] = files
  .sort()
  .map((file) => {
    return {
      type: 'json',
      path: file,
      jsonpath: '$.version',
    }
  })

await fs.writeFile('release-please-config.json', `${JSON.stringify(json, null, 2)}\n`, 'utf-8')
