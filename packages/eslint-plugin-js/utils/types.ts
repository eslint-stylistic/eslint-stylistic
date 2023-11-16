import type { AST } from 'eslint'
import type { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import type * as ESTree from 'estree'

// TypeScript Enabled Types (recommended, should be used in most cases)
export type ASTNode = TSESTree.Node
export type Token = TSESTree.Token
export { TSESTree as Tree }
export type NodeTypes = `${AST_NODE_TYPES}`
export { RuleFunction, RuleListener, SourceCode, RuleFixer, ReportFixFunction, RuleContext, EcmaVersion } from '@typescript-eslint/utils/ts-eslint'
export { JSONSchema } from '@typescript-eslint/utils'

// Basic ESLint Types (only contains JS tokens)
export type ESToken = AST.Token
export type ESNode = ESTree.Node
export { ESTree }
