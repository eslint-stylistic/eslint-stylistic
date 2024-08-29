import { execa } from 'execa'

// Reset changes under `packages/*` directory
await execa('git', ['checkout', '--', 'packages'])
await execa('git', ['clean', '-fd', 'packages'])
