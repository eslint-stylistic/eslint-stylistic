/**
 * @fileoverview Tests for curly-newline rule.
 * @author Toru Nagashima
 */

import type { InvalidTestCase, ValidTestCase } from '#test'
import type { RuleOptions } from './types'
import { run } from '#test'
import rule from '.'

const valid: ValidTestCase<RuleOptions>[] = []
const invalid: InvalidTestCase<RuleOptions>[] = []

function test(options: RuleOptions[0], code: string, output?: null | string, ...errors: any[]) {
  if (output === undefined) {
    valid.push({ code, options: options !== undefined ? [options] : [] })
  }
  else {
    invalid.push({
      code,
      output,
      options: options !== undefined ? [options] : [],
      errors,
    })
  }
}

// valid

// default ------------------------------------------------------------
test(undefined, '{}')
test(undefined, '{\n}')
test(undefined, '{void {foo}}')
test(undefined, '{\nvoid {foo}\n}')

test(undefined, '{void {foo}\n}', '{void {foo}}', { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test(undefined, '{\nvoid {foo}}', '{void {foo}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' })

// "always" -----------------------------------------------------------
test('always', '{\n}')
test('always', '{\nvoid {foo}\n}')
test('always', '{\nvoid {foo};void {foo}\n}')
test('always', '{\nvoid {foo}\nvoid {foo}\n}')

test('always', '{}', '{\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 1, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' })
test('always', '{void {foo}}', '{\nvoid {foo}\n}', { line: 1, column: 1, endLine: 1, endColumn: 2, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 1, column: 12, endLine: 1, endColumn: 13, messageId: 'expectedLinebreakBeforeClosingBrace' })
test('always', '{void {foo};void {foo}}', '{\nvoid {foo};void {foo}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 1, column: 23, messageId: 'expectedLinebreakBeforeClosingBrace' })
test('always', '{void {foo};\n  void {foo}}', '{\nvoid {foo};\n  void {foo}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 13, messageId: 'expectedLinebreakBeforeClosingBrace' })
test('always', '{void {\n}}', '{\nvoid {\n}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' })
test('always', '{ void {foo} }', '{\n void {foo} \n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 1, column: 14, messageId: 'expectedLinebreakBeforeClosingBrace' })

// "never" ------------------------------------------------------------
test('never', '{}')
test('never', '{void {foo}}')
test('never', '{void {foo};void {foo}}')
test('never', '{void {foo}\nvoid {foo}}')
test('never', '{void {\nfoo\n}}')

test('never', '{\n}', '{}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test('never', '{\nvoid {foo}}', '{void {foo}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' })
test('never', '{void {foo}\n}', '{void {foo}}', { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test('never', '{\nvoid {foo}\n}', '{void {foo}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test('never', '{\nvoid {foo}\nvoid {foo}\n}', '{void {foo}\nvoid {foo}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 4, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test('never', '{\nvoid {\nfoo\n}\n}', '{void {\nfoo\n}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 5, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })

// "multiline" --------------------------------------------------------
test({ multiline: true }, '{}')
test({ multiline: true }, '{void {}}')
test({ multiline: true }, '{void {}; void {}}')
test({ multiline: true }, '{\nvoid {}\nvoid {}\n}')
test({ multiline: true }, '{\nvoid {\nfoo\n}\n}')
test({ multiline: true }, '{\n// comment\nvoid {}\n}')
test({ multiline: true }, '{ // comment\nvoid {}\n}')

test({ multiline: true }, '{\n}', '{}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{\n/*comment*/\n}', null, { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{// comment\n}', null, { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{\nvoid {}\n}', '{void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{\nvoid {} // comment\n}', '{void {} // comment\n}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{\nvoid {};void {}\n}', '{void {};void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{\nvoid {};void {} // comment\n}', '{void {};void {} // comment\n}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{void {}\n  void {}}', '{\nvoid {}\n  void {}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 10, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{void {\n}}', '{\nvoid {\n}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{void {} // comment\n  void {}}', '{\nvoid {} // comment\n  void {}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 10, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{void {\nfoo\n}}', '{\nvoid {\nfoo\n}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 3, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{void { // comment\nfoo\n}}', '{\nvoid { // comment\nfoo\n}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 3, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true }, '{void {} /* comment */\nvoid {}\n}', '{\nvoid {} /* comment */\nvoid {}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' })
test({ multiline: true }, '{/* comment */void {}\nvoid {}\n}', null, { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' })
test({ multiline: true }, '{\n/* comment */\nvoid {}}', '{\n/* comment */\nvoid {}\n}', { line: 3, column: 8, messageId: 'expectedLinebreakBeforeClosingBrace' })

// "minElements" ------------------------------------------------------
test({ minElements: 2 }, '{}')
test({ minElements: 2 }, '{void 0}')
test({ minElements: 2 }, '{\nvoid 0;void 0\n}')

test({ minElements: 2 }, '{\n}', '{}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ minElements: 2 }, '{\nvoid {}\n}', '{void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ minElements: 2 }, '{void {};void {}}', '{\nvoid {};void {}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 1, column: 17, messageId: 'expectedLinebreakBeforeClosingBrace' })

// "multiline" and "minElements" --------------------------------------
test({ multiline: true, minElements: 2 }, '{}')
test({ multiline: true, minElements: 2 }, '{void 0}')
test({ multiline: true, minElements: 2 }, '{\nvoid 0; void 0\n}')
test({ multiline: true, minElements: 2 }, '{\nvoid 0\nvoid 0\n}')
test({ multiline: true, minElements: 2 }, '{\nvoid {\nfoo\n}\n}')

test({ multiline: true, minElements: 2 }, '{\n}', '{}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true, minElements: 2 }, '{\nvoid {}\n}', '{void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' }, { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true, minElements: 2 }, '{void {};void {}}', '{\nvoid {};void {}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 1, column: 17, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true, minElements: 2 }, '{void {};\n  void {}}', '{\nvoid {};\n  void {}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 10, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true, minElements: 2 }, '{void {\n}}', '{\nvoid {\n}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' })

// "consistent" -------------------------------------------------------
test({ consistent: true }, `{\nvoid 0\n}`)
test({ consistent: true }, `{\nvoid 0\nvoid 0\n}`)
test({ consistent: true }, `{void {foo}}`)
test({ consistent: true }, `{\nvoid {foo}\n}`)
test({ consistent: true }, `{\nvoid {\nfoo\n}\n}`)
test({ consistent: true }, `{void 0;void 0}`)

test({ consistent: true }, '{void {}\n}', '{void {}}', { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ consistent: true }, '{\nvoid {}}', '{void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' })
test({ consistent: true }, '{void {};void {}\n}', '{void {};void {}}', { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ consistent: true }, '{\nvoid {};void {}}', '{void {};void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' })
test({ consistent: true }, '{\nvoid {}\nvoid {}}', '{void {}\nvoid {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' })

// "multiline" and "consistent" -------------------------------------

test({ multiline: true, consistent: true }, '{void {}\n}', '{void {}}', { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true, consistent: true }, '{\nvoid {}}', '{void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' })
test({ multiline: true, consistent: true }, '{void {};void {}\n}', '{void {};void {}}', { line: 2, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' })
test({ multiline: true, consistent: true }, '{\nvoid {};void {}}', '{void {};void {}}', { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' })
test({ multiline: true, consistent: true }, '{void {}\n  void {}}', '{\nvoid {}\n  void {}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 10, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true, consistent: true }, '{void {\n}}', '{\nvoid {\n}\n}', { line: 1, column: 1, messageId: 'expectedLinebreakAfterOpeningBrace' }, { line: 2, column: 2, messageId: 'expectedLinebreakBeforeClosingBrace' })
test({ multiline: true, consistent: true }, '{\nvoid {}\nvoid {}}', '{\nvoid {}\nvoid {}\n}', { line: 3, column: 8, messageId: 'expectedLinebreakBeforeClosingBrace' })

// "consistent" and "minElements" -------------------------------------
test({ multiline: true, consistent: true, minElements: 2 }, `{void 0}`)
test({ multiline: true, consistent: true, minElements: 2 }, `{\nvoid 0\n}`)
test({ multiline: true, consistent: true, minElements: 2 }, `{\nvoid 0;void 0\n}`)

// specializations

type SpecializationOption = keyof Extract<RuleOptions[0], object>

function specializationTest(specialization: SpecializationOption, code: string): void
function specializationTest(specialization: SpecializationOption, code: string, output: string, openingBraceColumn: number, closingBraceColumn: number): void
function specializationTest(specialization: SpecializationOption, code: string, output?: string, openingBraceColumn?: number, closingBraceColumn?: number) {
  invalid.push({
    code: `{\n${code}\n}`,
    output: `{${output ?? code}}`,
    options: [{ [specialization]: 'always' }],
    errors: [
      { line: 1, column: 1, messageId: 'unexpectedLinebreakAfterOpeningBrace' },
      ...output != null
        ? [
            { line: 2, column: openingBraceColumn, messageId: 'expectedLinebreakAfterOpeningBrace' },
            { line: 2, column: closingBraceColumn, messageId: 'expectedLinebreakBeforeClosingBrace' },
          ]
        : [],
      { line: 3, column: 1, messageId: 'unexpectedLinebreakBeforeClosingBrace' },
    ],
  })
}

test({ BlockStatement: 'always' }, 'for(;;){{}}', 'for(;;){{\n}}', 9, 10)
specializationTest('IfStatementConsequent', `if(true){}`, `if(true){\n}`, 9, 10)
specializationTest('IfStatementAlternative', `if(true){}else{}`, `if(true){}else{\n}`, 15, 16)
specializationTest('DoWhileStatement', `do{}while(true)`, `do{\n}while(true)`, 3, 4)
specializationTest('ForInStatement', `for(const {} in {}){}`, `for(const {} in {}){\n}`, 20, 21)
specializationTest('ForOfStatement', `for(const {} of {}){}`, `for(const {} of {}){\n}`, 20, 21)
specializationTest('ForStatement', `for(;;){}`, `for(;;){\n}`, 8, 9)
specializationTest('WhileStatement', `while({}){}`, `while({}){\n}`, 10, 11)
specializationTest('SwitchStatement', `switch({}){}`, `switch({}){\n}`, 11, 12)
specializationTest('SwitchStatement', `switch({}){case {}:}`, `switch({}){\ncase {}:\n}`, 11, 20)
specializationTest('SwitchCase', `switch({}){case {}:}`)
specializationTest('SwitchCase', `switch({}){case {}: {}break}`)
specializationTest('SwitchCase', `switch({}){case {}: {}}`, `switch({}){case {}: {\n}}`, 21, 22)
specializationTest('TryStatementBlock', `try{}finally{}`, `try{\n}finally{}`, 4, 5)
specializationTest('TryStatementHandler', `try{}catch(_){}`, `try{}catch(_){\n}`, 14, 15)
specializationTest('TryStatementFinalizer', `try{}finally{}`, `try{}finally{\n}`, 13, 14)
specializationTest('ArrowFunctionExpression', `(() => {})`, `(() => {\n})`, 8, 9)
specializationTest('FunctionDeclaration', `function _() {}`, `function _() {\n}`, 14, 15)
specializationTest('FunctionExpression', `(function() {})`, `(function() {\n})`, 13, 14)
specializationTest('Property', `void {_: function(){}}`)
specializationTest('Property', `void {_(){}}`, `void {_(){\n}}`, 10, 11)
specializationTest('ClassBody', `(class {})`, `(class {\n})`, 8, 9)
specializationTest('StaticBlock', `(class {static{}})`, `(class {static{\n}})`, 15, 16)
specializationTest('WithStatement', `with({}){}`, `with({}){\n}`, 9, 10)
specializationTest('TSEnumBody', `enum _{}`, `enum _{\n}`, 7, 8)
specializationTest('TSInterfaceBody', `interface _{}`, `interface _{\n}`, 12, 13)
specializationTest('TSModuleBlock', `module _{}`, `module _{\n}`, 9, 10)

run<RuleOptions>({
  name: 'curly-newline',
  rule,
  valid,
  invalid,
})
