import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { ES3_KEYWORDS, isNumericLiteral, isStringLiteral } from '#utils/ast'
import { createRule } from '#utils/create-rule'
// @ts-expect-error missing types
import { tokenize } from 'espree'

export default createRule<RuleOptions, MessageIds>({
  name: 'quote-props',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require quotes around object literal, type literal, interfaces and enums property names',
    },
    fixable: 'code',
    schema: {
      anyOf: [
        {
          type: 'array',
          items: [
            {
              type: 'string',
              enum: ['always', 'as-needed', 'consistent', 'consistent-as-needed'],
            },
          ],
          minItems: 0,
          maxItems: 1,
        },
        {
          type: 'array',
          items: [
            {
              type: 'string',
              enum: ['always', 'as-needed', 'consistent', 'consistent-as-needed'],
            },
            {
              type: 'object',
              properties: {
                keywords: {
                  type: 'boolean',
                },
                unnecessary: {
                  type: 'boolean',
                },
                numbers: {
                  type: 'boolean',
                },
              },
              additionalProperties: false,
            },
          ],
          minItems: 0,
          maxItems: 2,
        },
      ],
    },
    messages: {
      requireQuotesDueToReservedWord: 'Properties should be quoted as \'{{property}}\' is a reserved word.',
      inconsistentlyQuotedProperty: 'Inconsistently quoted property \'{{key}}\' found.',
      unnecessarilyQuotedProperty: 'Unnecessarily quoted property \'{{property}}\' found.',
      unquotedReservedProperty: 'Unquoted reserved word \'{{property}}\' used as key.',
      unquotedNumericProperty: 'Unquoted number literal \'{{property}}\' used as key.',
      unquotedPropertyFound: 'Unquoted property \'{{property}}\' found.',
      redundantQuoting: 'Properties shouldn\'t be quoted as all quotes are redundant.',
    },
  },
  defaultOptions: ['always'],
  create(context) {
    const MODE = context.options[0]
    const KEYWORDS = (context.options[1] && context.options[1].keywords)!
    const CHECK_UNNECESSARY = !context.options[1] || context.options[1].unnecessary !== false
    const NUMBERS = (context.options[1] && context.options[1].numbers)!

    const sourceCode = context.sourceCode

    /**
     * Checks whether a certain string constitutes an ES3 token
     * @param tokenStr The string to be checked.
     * @returns `true` if it is an ES3 token.
     */
    function isKeyword(tokenStr: string): boolean {
      return ES3_KEYWORDS.includes(tokenStr)
    }

    /**
     * Checks if an espree-tokenized key has redundant quotes (i.e. whether quotes are unnecessary)
     * @param rawKey The raw key value from the source
     * @param tokens The espree-tokenized node key
     * @param [skipNumberLiterals] Indicates whether number literals should be checked
     * @returns Whether or not a key has redundant quotes.
     * @private
     */
    function areQuotesRedundant(rawKey: string, tokens: any, skipNumberLiterals: boolean = false): boolean {
      return tokens.length === 1 && tokens[0].start === 0 && tokens[0].end === rawKey.length
        && (['Identifier', 'Keyword', 'Null', 'Boolean'].includes(tokens[0].type)
          || (tokens[0].type === 'Numeric' && !skipNumberLiterals && String(+tokens[0].value) === tokens[0].value))
    }

    /**
     * Returns a string representation of a property node with quotes removed
     * @param key Key AST Node, which may or may not be quoted
     * @returns A replacement string for this property
     */
    function getUnquotedKey(key: Tree.StringLiteral | Tree.Identifier): string {
      return key.type === 'Identifier' ? key.name : key.value
    }

    /**
     * Returns a string representation of a property node with quotes added
     * @param key Key AST Node, which may or may not be quoted
     * @returns A replacement string for this property
     */
    function getQuotedKey(key: Tree.Literal | Tree.Identifier): string {
      if (isStringLiteral(key)) {
        // If the key is already a string literal, don't replace the quotes with double quotes.
        return sourceCode.getText(key)
      }

      // Otherwise, the key is either an identifier or a number literal.
      return `"${key.type === 'Identifier' ? key.name : key.value}"`
    }

    /**
     * Ensures that a property's key is quoted only when necessary
     * @param node Property AST node
     */
    function checkUnnecessaryQuotes(node: Tree.Property | Tree.ImportAttribute | Tree.TSPropertySignature | Tree.TSEnumMember): void {
      if (node.type === 'Property' && (node.method || node.computed || node.shorthand))
        return
      if (node.type !== 'ImportAttribute' && node.computed)
        return

      const key = node.type === 'TSEnumMember' ? node.id : node.key
      if (key.type === 'Literal' && typeof key.value === 'string') {
        let tokens

        try {
          tokens = tokenize(key.value)
        }
        catch {
          return
        }

        if (tokens.length !== 1)
          return

        const isKeywordToken = isKeyword(tokens[0].value)

        if (isKeywordToken && KEYWORDS)
          return

        if (CHECK_UNNECESSARY && areQuotesRedundant(key.value, tokens, NUMBERS)) {
          context.report({
            node,
            messageId: 'unnecessarilyQuotedProperty',
            data: { property: key.value },
            fix: fixer => fixer.replaceText(key, getUnquotedKey(key)),
          })
        }
      }
      else if (KEYWORDS && key.type === 'Identifier' && isKeyword(key.name)) {
        context.report({
          node,
          messageId: 'unquotedReservedProperty',
          data: { property: key.name },
          fix: fixer => fixer.replaceText(key, getQuotedKey(key)),
        })
      }
      else if (NUMBERS && isNumericLiteral(key)) {
        context.report({
          node,
          messageId: 'unquotedNumericProperty',
          data: { property: key.value },
          fix: fixer => fixer.replaceText(key, getQuotedKey(key)),
        })
      }
    }

    /**
     * Ensures that a property's key is quoted
     * @param node Property AST node
     */
    function checkOmittedQuotes(node: Tree.Property | Tree.ImportAttribute | Tree.TSPropertySignature | Tree.TSEnumMember): void {
      if (node.type === 'Property' && (node.method || node.computed || node.shorthand))
        return
      if (node.type !== 'ImportAttribute' && node.computed)
        return

      const key = node.type === 'TSEnumMember' ? node.id : node.key
      if (key.type === 'Literal' && typeof key.value === 'string')
        return

      context.report({
        node,
        messageId: 'unquotedPropertyFound',
        data: { property: (key as Tree.Identifier).name || (key as Tree.Literal).value },
        fix: fixer => fixer.replaceText(key, getQuotedKey(key)),
      })
    }

    /**
     * Ensures that an object's keys are consistently quoted, optionally checks for redundancy of quotes
     * @param properties ObjectLiteralElement AST node
     * @param checkQuotesRedundancy Whether to check quotes' redundancy
     */
    function checkConsistencyForObject(properties: Tree.ObjectLiteralElement[], checkQuotesRedundancy: boolean): void {
      checkConsistency(
        properties.filter((property): property is Tree.PropertyNonComputedName =>
          property.type !== 'SpreadElement'
          // When called from `quote-props._ts_.ts`, it may be a `TypeElement`.
          // Therefore, we need to check whether the `key` exists.
          && property.key
          && !property.method && !property.computed && !property.shorthand,
        ),
        checkQuotesRedundancy,
      )
    }

    /**
     * Ensures that an import/export's attribute keys are consistently quoted.
     * @param attributes Import attribute AST node array
     */
    function checkImportAttributes(attributes: Tree.ImportAttribute[] | undefined): void {
      if (!attributes)
        return
      if (MODE === 'consistent')
        checkConsistency(attributes, false)

      if (MODE === 'consistent-as-needed')
        checkConsistency(attributes, true)
    }

    /**
     * Ensures these property keys are consistently quoted, optionally checks for redundancy of quotes
     * @param properties Property AST node array
     * @param checkQuotesRedundancy Whether to check quotes' redundancy
     */
    function checkConsistency<P extends Tree.PropertyNonComputedName | Tree.ImportAttribute>(
      properties: P[],
      checkQuotesRedundancy: boolean,
    ): void {
      const quotedProps: P[] = []
      const unquotedProps: P[] = []
      let keywordKeyName: string | null = null
      let necessaryQuotes = false

      properties.forEach((property) => {
        const key = property.key

        if (key.type === 'Literal' && typeof key.value === 'string') {
          quotedProps.push(property)

          if (checkQuotesRedundancy) {
            let tokens

            try {
              tokens = tokenize(key.value)
            }
            catch {
              necessaryQuotes = true
              return
            }

            necessaryQuotes = necessaryQuotes || !areQuotesRedundant(key.value, tokens) || KEYWORDS && isKeyword(tokens[0].value)
          }
        }
        else if (KEYWORDS && checkQuotesRedundancy && key.type === 'Identifier' && isKeyword(key.name)) {
          unquotedProps.push(property)
          necessaryQuotes = true
          keywordKeyName = key.name
        }
        else {
          unquotedProps.push(property)
        }
      })

      if (checkQuotesRedundancy && quotedProps.length && !necessaryQuotes) {
        quotedProps.forEach((property) => {
          const key = property.key as Tree.StringLiteral | Tree.Identifier
          context.report({
            node: property,
            messageId: 'redundantQuoting',
            fix: fixer => fixer.replaceText(key, getUnquotedKey(key)),
          })
        })
      }
      else if (unquotedProps.length && keywordKeyName) {
        unquotedProps.forEach((property) => {
          context.report({
            node: property,
            messageId: 'requireQuotesDueToReservedWord',
            data: { property: keywordKeyName },
            fix: fixer => fixer.replaceText(property.key, getQuotedKey(property.key)),
          })
        })
      }
      else if (quotedProps.length && unquotedProps.length) {
        unquotedProps.forEach((property) => {
          context.report({
            node: property,
            messageId: 'inconsistentlyQuotedProperty',
            data: { key: (property.key as Tree.Identifier).name || (property.key as Tree.Literal).value },
            fix: fixer => fixer.replaceText(property.key, getQuotedKey(property.key)),
          })
        })
      }
    }

    return {
      Property(node) {
        if (MODE === 'always' || !MODE)
          checkOmittedQuotes(node)

        if (MODE === 'as-needed')
          checkUnnecessaryQuotes(node)
      },
      ObjectExpression(node) {
        if (MODE === 'consistent')
          checkConsistencyForObject(node.properties, false)

        if (MODE === 'consistent-as-needed')
          checkConsistencyForObject(node.properties, true)
      },
      ImportAttribute(node) {
        if (MODE === 'always' || !MODE)
          checkOmittedQuotes(node)

        if (MODE === 'as-needed')
          checkUnnecessaryQuotes(node)
      },
      ImportDeclaration(node) {
        checkImportAttributes(node.attributes)
      },
      ExportAllDeclaration(node) {
        checkImportAttributes(node.attributes)
      },
      ExportNamedDeclaration(node) {
        checkImportAttributes(node.attributes)
      },
      TSPropertySignature(node) {
        if (MODE === 'always' || !MODE)
          checkOmittedQuotes(node)

        if (MODE === 'as-needed')
          checkUnnecessaryQuotes(node)
      },
      TSEnumMember(node) {
        if (MODE === 'always' || !MODE)
          checkOmittedQuotes(node)

        if (MODE === 'as-needed')
          checkUnnecessaryQuotes(node)
      },
      TSTypeLiteral(node) {
        if (MODE === 'consistent')
          checkConsistencyForObject(node.members as any, false)

        if (MODE === 'consistent-as-needed')
          checkConsistencyForObject(node.members as any, true)
      },
      TSInterfaceBody(node) {
        if (MODE === 'consistent')
          checkConsistencyForObject(node.body as any, false)

        if (MODE === 'consistent-as-needed')
          checkConsistencyForObject(node.body as any, true)
      },
      TSEnumDeclaration(node) {
        const members = (node.body?.members || node.members).map(member => ({ ...member, key: member.id })) as any

        if (MODE === 'consistent')
          checkConsistencyForObject(members, false)

        if (MODE === 'consistent-as-needed')
          checkConsistencyForObject(members, true)
      },
    }
  },
})
