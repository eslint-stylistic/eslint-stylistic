import type { AST } from 'eslint'
import type { AST_NODE_TYPES, TSESLint, TSESTree } from '@typescript-eslint/utils'
import type * as ESTree from 'estree'

// TypeScript Enabled Types (recommended, should be used in most cases)
export type ASTNode = TSESTree.Node
export type Token = TSESTree.Token
export { TSESTree as Tree }
export type RuleFixer = TSESLint.RuleFixer
export type ReportFixFunction = TSESLint.ReportFixFunction
export type NodeTypes = AST_NODE_TYPES
export { JSONSchema } from '@typescript-eslint/utils'
export type { RuleFunction } from '@typescript-eslint/utils/ts-eslint'

// Basic ESLint Types (only contains JS tokens)
export type ESToken = AST.Token
export type ESNode = ESTree.Node
export { ESTree }
