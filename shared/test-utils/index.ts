import { ESLint } from 'eslint'
import { gte } from 'semver'

export * from './runner'

export const skipBabel = gte(ESLint.version, '10.0.0')
