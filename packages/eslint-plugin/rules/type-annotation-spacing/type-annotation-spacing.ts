import type { Tree } from '#types'
import type { MessageIds, RuleOptions, TypeAnnotationSpacingSchema0 } from './types'
import {
  isClassOrTypeElement,
  isFunction,
  isFunctionOrFunctionType,
  isIdentifier,
  isNotOpeningParenToken,
  isVariableDeclarator,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

type OverrideOptions = Required<Required<TypeAnnotationSpacingSchema0>['overrides']>

function createRules(options: TypeAnnotationSpacingSchema0 | undefined): OverrideOptions {
  const globals = {
    ...(options?.before !== undefined ? { before: options.before } : {}),
    ...(options?.after !== undefined ? { after: options.after } : {}),
  }
  const override = options?.overrides ?? {}
  const colon = {
    ...{ before: false, after: true },
    ...globals,
    ...override?.colon,
  }

  return {
    colon,
    variable: { ...colon, ...override?.variable },
    property: { ...colon, ...override?.property },
    parameter: { ...colon, ...override?.parameter },
    returnType: { ...colon, ...override?.returnType },
  }
}

function getIdentifierRules(
  rules: OverrideOptions,
  node: Tree.Identifier,
) {
  const scope = node?.parent

  if (isVariableDeclarator(scope))
    return rules.variable
  else if (isFunctionOrFunctionType(scope))
    return rules.parameter

  return rules.colon
}

function getRules(
  rules: OverrideOptions,
  node: Tree.TypeNode,
) {
  const scope = node?.parent?.parent

  if (isIdentifier(scope))
    return getIdentifierRules(rules, scope)
  else if (isClassOrTypeElement(scope))
    return rules.property
  else if (isFunction(scope))
    return rules.returnType

  return rules.colon
}

export default createRule<RuleOptions, MessageIds>({
  name: 'type-annotation-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require consistent spacing around type annotations',
    },
    fixable: 'whitespace',
    messages: {
      expectedSpaceAfter: 'Expected a space after the \'{{type}}\'.',
      expectedSpaceBefore: 'Expected a space before the \'{{type}}\'.',
      unexpectedSpaceAfter: 'Unexpected space after the \'{{type}}\'.',
      unexpectedSpaceBefore: 'Unexpected space before the \'{{type}}\'.',
      unexpectedSpaceBetween:
        'Unexpected space between the \'{{previousToken}}\' and the \'{{type}}\'.',
    },
    schema: [
      {
        $defs: {
          spacingConfig: {
            type: 'object',
            properties: {
              before: { type: 'boolean' },
              after: { type: 'boolean' },
            },
            additionalProperties: false,
          },
        },
        type: 'object',
        properties: {
          before: { type: 'boolean' },
          after: { type: 'boolean' },
          overrides: {
            type: 'object',
            properties: {
              colon: { $ref: '#/items/0/$defs/spacingConfig' },
              variable: { $ref: '#/items/0/$defs/spacingConfig' },
              parameter: { $ref: '#/items/0/$defs/spacingConfig' },
              property: { $ref: '#/items/0/$defs/spacingConfig' },
              returnType: { $ref: '#/items/0/$defs/spacingConfig' },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [
    // technically there is a default, but the overrides mean
    // that if we apply them here, it will break the no override case.
    {},
  ],
  create(context, [options]) {
    const sourceCode = context.sourceCode

    const ruleSet = createRules(options)

    /**
     * Checks if there's proper spacing around type annotations (no space
     * before colon, one space after).
     */
    function checkTypeAnnotationSpacing(
      typeAnnotation: Tree.TypeNode,
    ): void {
      /** : */
      const punctuatorTokenEnd = sourceCode.getTokenBefore(typeAnnotation, isNotOpeningParenToken)!
      let type = punctuatorTokenEnd.value

      if (type !== ':')
        return

      /** :, ?() */
      let punctuatorTokenStart = punctuatorTokenEnd
      let previousToken = sourceCode.getTokenBefore(punctuatorTokenEnd)!

      const { before, after } = getRules(ruleSet, typeAnnotation)

      if (previousToken.value === '?') {
        // space between ? and :
        if (sourceCode.isSpaceBetween(previousToken, punctuatorTokenStart)) {
          context.report({
            node: punctuatorTokenStart,
            messageId: 'unexpectedSpaceBetween',
            data: {
              type,
              previousToken: previousToken.value,
            },
            fix(fixer) {
              return fixer.removeRange([
                previousToken.range[1],
                punctuatorTokenStart.range[0],
              ])
            },
          })
        }

        // shift the start to the ?
        type = '?:'
        punctuatorTokenStart = previousToken
        previousToken = sourceCode.getTokenBefore(previousToken)!

        // handle the +/- modifiers for optional modification operators
        if (previousToken.value === '+' || previousToken.value === '-') {
          type = `${previousToken.value}?:`
          punctuatorTokenStart = previousToken
          previousToken = sourceCode.getTokenBefore(previousToken)!
        }
      }

      const hasNextSpace = sourceCode.isSpaceBetween(punctuatorTokenEnd, typeAnnotation)

      if (after && !hasNextSpace) {
        context.report({
          node: punctuatorTokenEnd,
          messageId: 'expectedSpaceAfter',
          data: {
            type,
          },
          fix(fixer) {
            return fixer.insertTextAfter(punctuatorTokenEnd, ' ')
          },
        })
      }
      else if (!after && hasNextSpace) {
        context.report({
          node: punctuatorTokenEnd,
          messageId: 'unexpectedSpaceAfter',
          data: {
            type,
          },
          fix(fixer) {
            return fixer.removeRange([
              punctuatorTokenEnd.range[1],
              typeAnnotation.range[0],
            ])
          },
        })
      }

      const hasPrevSpace = sourceCode.isSpaceBetween(previousToken, punctuatorTokenStart)

      if (before && !hasPrevSpace) {
        context.report({
          node: punctuatorTokenStart,
          messageId: 'expectedSpaceBefore',
          data: {
            type,
          },
          fix(fixer) {
            return fixer.insertTextAfter(previousToken, ' ')
          },
        })
      }
      else if (!before && hasPrevSpace) {
        context.report({
          node: punctuatorTokenStart,
          messageId: 'unexpectedSpaceBefore',
          data: {
            type,
          },
          fix(fixer) {
            return fixer.removeRange([
              previousToken.range[1],
              punctuatorTokenStart.range[0],
            ])
          },
        })
      }
    }

    return {
      TSMappedType(node): void {
        if (node.typeAnnotation)
          checkTypeAnnotationSpacing(node.typeAnnotation)
      },
      TSTypeAnnotation(node): void {
        checkTypeAnnotationSpacing(node.typeAnnotation)
      },
    }
  },
})
