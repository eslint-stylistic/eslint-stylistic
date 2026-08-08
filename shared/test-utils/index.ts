import { ESLint } from 'eslint'
import { isGreaterOrEqual } from 'verkit'

export * from './runner'

export const skipBabel = isGreaterOrEqual(ESLint.version, '10.0.0')
