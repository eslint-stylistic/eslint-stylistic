import fs from 'node:fs/promises'
import fg from 'fast-glob'
import { dump, load } from 'js-yaml'

const files = await fg('packages/**/package.json', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
})

const json: any = load(await fs.readFile('.github/workflows/release-please.yml', 'utf8'))

json.jobs['release-please'].steps[0].with['extra-files'] = JSON.stringify(files
  .sort()
  .map((file) => {
    return {
      type: 'json',
      path: file,
      jsonpath: '$.version',
    }
  }), null, 2)

await fs.writeFile('.github/workflows/release-please.yml', dump(json), 'utf-8')
