import fs from 'node:fs'
import process from 'node:process'

const version = process.argv[2]

if (!version)
  throw new Error('No version specified')

if (version !== 'default') {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  packageJson.resolutions ||= {}
  packageJson.resolutions.eslint = version
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
}
