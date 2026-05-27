import semver from 'semver'
import { x } from 'tinyexec'
import { version } from '../package.json'

const parsed = semver.parse(version)
const tag = parsed?.prerelease?.[0] || undefined

const args = ['-r', 'publish', '--access', 'public', '--no-git-checks']
if (typeof tag === 'string')
  args.push('--tag', tag)

console.log(`Publishing: pnpm ${args.join(' ')}`)

await x('pnpm', args, {
  nodeOptions: {
    stdio: 'inherit',
  },
  throwOnError: true,
})
