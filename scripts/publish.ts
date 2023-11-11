import { execa } from 'execa'
import semver from 'semver'
import { version } from '../package.json'

const parsed = semver.parse(version)
const tag = parsed?.prerelease?.[0] || undefined

const args = ['-r', 'publish', '--access', 'public']
if (typeof tag === 'string')
  args.push('--tag', tag)

console.log(`Publishing: pnpm ${args.join(' ')}`)

await execa('pnpm', args, {
  stdio: 'inherit',
})
