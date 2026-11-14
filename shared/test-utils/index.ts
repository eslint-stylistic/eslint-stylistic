import { ESLint } from 'eslint'
import { isGreaterThanOrEqual } from 'verkit'

export * from './runner'

export const skipBabel = isGreaterThanOrEqual(ESLint.version, '10.0.0')
