import type { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils'
import type { AST } from 'eslint'
import type * as ESTree from 'estree'

// TypeScript Enabled Types (recommended, should be used in most cases)
export type ASTNode = TSESTree.Node
export type Token = TSESTree.Token
export { TSESTree as Tree }
export type NodeTypes = `${AST_NODE_TYPES}`
export { JSONSchema } from '@typescript-eslint/utils'
export {
  RuleWithMetaAndName,
} from '@typescript-eslint/utils/eslint-utils'
export {
  EcmaVersion,
  ReportDescriptor,
  ReportFixFunction,
  RuleContext,
  RuleFixer,
  RuleFunction,
  RuleListener,
  RuleModule,
  Scope,
  SourceCode,
} from '@typescript-eslint/utils/ts-eslint'

// Basic ESLint Types (only contains JS tokens)
export type ESToken = AST.Token
export type ESNode = ESTree.Node
export { ESTree }
