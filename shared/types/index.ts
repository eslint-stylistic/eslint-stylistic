import type { AST_NODE_TYPES } from '#utils/ast'
import type { TextSourceCodeBase } from '@eslint/plugin-kit'
import type { TSESTree } from '@typescript-eslint/utils'
import type { AST } from 'eslint'
import type * as ESTree from 'estree'

export type { TextSourceCodeBase }

// TypeScript Enabled Types (recommended, should be used in most cases)
export type ASTNode = TSESTree.Node
export type Token = TSESTree.Token
export type { TSESTree as Tree }
export type NodeTypes = `${AST_NODE_TYPES}`
export type { JSONSchema } from '@typescript-eslint/utils'
export type {
  RuleWithMetaAndName,
} from '@typescript-eslint/utils/eslint-utils'
export type {
  EcmaVersion,
  ReportDescriptor,
  ReportFixFunction,
  RuleContext,
  RuleFix,
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

export type Arrayable<T> = T | T[]
