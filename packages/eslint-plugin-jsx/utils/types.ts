import type { AST } from 'eslint'
import type { TSESTree } from '@typescript-eslint/utils'
import type * as ESTree from 'estree'

export type ASTNode = TSESTree.Node

export type ESNode = ESTree.Node

export type Token = AST.Token
