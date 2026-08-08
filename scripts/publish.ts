import { x } from 'tinyexec'
import { tryParse } from 'verkit'
import { version } from '../package.json'

const parsed = tryParse(version)
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
