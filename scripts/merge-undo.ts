import { exec } from 'tinyexec'

// Reset changes under `packages/*` directory
await exec('git', ['checkout', '--', 'packages'])
await exec('git', ['clean', '-fd', 'packages'])
