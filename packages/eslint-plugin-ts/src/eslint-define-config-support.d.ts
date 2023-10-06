declare module 'eslint-define-config' {
  export interface CustomRuleOptions {
    '@stylistic/ts/block-spacing': [( ("always" | "never")
)?]
    '@stylistic/ts/brace-style': [( ("1tbs" | "stroustrup" | "allman")
)?, ({
allowSingleLine?: boolean
}
)?]
    '@stylistic/ts/comma-dangle': [( []|[(Value | {
arrays?: ValueWithIgnore
objects?: ValueWithIgnore
imports?: ValueWithIgnore
exports?: ValueWithIgnore
functions?: ValueWithIgnore
enums?: ValueWithIgnore
generics?: ValueWithIgnore
tuples?: ValueWithIgnore
})]
export type Value = ("always-multiline" | "always" | "never" | "only-multiline")
export type ValueWithIgnore = ("always-multiline" | "always" | "never" | "only-multiline" | "ignore")
)?]
    '@stylistic/ts/comma-spacing': [({
before?: boolean
after?: boolean
}
)?]
    '@stylistic/ts/func-call-spacing': [( ([]|["never"] | []|["always"]|["always", {
allowNewlines?: boolean
}])
)?]
    '@stylistic/ts/indent': [( ("tab" | number)
)?, ({
SwitchCase?: number
VariableDeclarator?: ((number | ("first" | "off")) | {
var?: (number | ("first" | "off"))
let?: (number | ("first" | "off"))
const?: (number | ("first" | "off"))
})
outerIIFEBody?: (number | "off")
MemberExpression?: (number | "off")
FunctionDeclaration?: {
parameters?: (number | ("first" | "off"))
body?: number
}
FunctionExpression?: {
parameters?: (number | ("first" | "off"))
body?: number
}
StaticBlock?: {
body?: number
}
CallExpression?: {
arguments?: (number | ("first" | "off"))
}
ArrayExpression?: (number | ("first" | "off"))
ObjectExpression?: (number | ("first" | "off"))
ImportDeclaration?: (number | ("first" | "off"))
flatTernaryExpressions?: boolean
offsetTernaryExpressions?: boolean
ignoredNodes?: string[]
ignoreComments?: boolean
}
)?]
    '@stylistic/ts/key-spacing': [( ({
align?: (("colon" | "value") | {
mode?: ("strict" | "minimum")
on?: ("colon" | "value")
beforeColon?: boolean
afterColon?: boolean
})
mode?: ("strict" | "minimum")
beforeColon?: boolean
afterColon?: boolean
} | {
singleLine?: {
mode?: ("strict" | "minimum")
beforeColon?: boolean
afterColon?: boolean
}
multiLine?: {
align?: (("colon" | "value") | {
mode?: ("strict" | "minimum")
on?: ("colon" | "value")
beforeColon?: boolean
afterColon?: boolean
})
mode?: ("strict" | "minimum")
beforeColon?: boolean
afterColon?: boolean
}
} | {
singleLine?: {
mode?: ("strict" | "minimum")
beforeColon?: boolean
afterColon?: boolean
}
multiLine?: {
mode?: ("strict" | "minimum")
beforeColon?: boolean
afterColon?: boolean
}
align?: {
mode?: ("strict" | "minimum")
on?: ("colon" | "value")
beforeColon?: boolean
afterColon?: boolean
}
})
)?]
    '@stylistic/ts/keyword-spacing': [({
before?: boolean
after?: boolean
overrides?: {
abstract?: {
before?: boolean
after?: boolean
}
as?: {
before?: boolean
after?: boolean
}
async?: {
before?: boolean
after?: boolean
}
await?: {
before?: boolean
after?: boolean
}
boolean?: {
before?: boolean
after?: boolean
}
break?: {
before?: boolean
after?: boolean
}
byte?: {
before?: boolean
after?: boolean
}
case?: {
before?: boolean
after?: boolean
}
catch?: {
before?: boolean
after?: boolean
}
char?: {
before?: boolean
after?: boolean
}
class?: {
before?: boolean
after?: boolean
}
const?: {
before?: boolean
after?: boolean
}
continue?: {
before?: boolean
after?: boolean
}
debugger?: {
before?: boolean
after?: boolean
}
default?: {
before?: boolean
after?: boolean
}
delete?: {
before?: boolean
after?: boolean
}
do?: {
before?: boolean
after?: boolean
}
double?: {
before?: boolean
after?: boolean
}
else?: {
before?: boolean
after?: boolean
}
enum?: {
before?: boolean
after?: boolean
}
export?: {
before?: boolean
after?: boolean
}
extends?: {
before?: boolean
after?: boolean
}
false?: {
before?: boolean
after?: boolean
}
final?: {
before?: boolean
after?: boolean
}
finally?: {
before?: boolean
after?: boolean
}
float?: {
before?: boolean
after?: boolean
}
for?: {
before?: boolean
after?: boolean
}
from?: {
before?: boolean
after?: boolean
}
function?: {
before?: boolean
after?: boolean
}
get?: {
before?: boolean
after?: boolean
}
goto?: {
before?: boolean
after?: boolean
}
if?: {
before?: boolean
after?: boolean
}
implements?: {
before?: boolean
after?: boolean
}
import?: {
before?: boolean
after?: boolean
}
in?: {
before?: boolean
after?: boolean
}
instanceof?: {
before?: boolean
after?: boolean
}
int?: {
before?: boolean
after?: boolean
}
interface?: {
before?: boolean
after?: boolean
}
let?: {
before?: boolean
after?: boolean
}
long?: {
before?: boolean
after?: boolean
}
native?: {
before?: boolean
after?: boolean
}
new?: {
before?: boolean
after?: boolean
}
null?: {
before?: boolean
after?: boolean
}
of?: {
before?: boolean
after?: boolean
}
package?: {
before?: boolean
after?: boolean
}
private?: {
before?: boolean
after?: boolean
}
protected?: {
before?: boolean
after?: boolean
}
public?: {
before?: boolean
after?: boolean
}
return?: {
before?: boolean
after?: boolean
}
set?: {
before?: boolean
after?: boolean
}
short?: {
before?: boolean
after?: boolean
}
static?: {
before?: boolean
after?: boolean
}
super?: {
before?: boolean
after?: boolean
}
switch?: {
before?: boolean
after?: boolean
}
synchronized?: {
before?: boolean
after?: boolean
}
this?: {
before?: boolean
after?: boolean
}
throw?: {
before?: boolean
after?: boolean
}
throws?: {
before?: boolean
after?: boolean
}
transient?: {
before?: boolean
after?: boolean
}
true?: {
before?: boolean
after?: boolean
}
try?: {
before?: boolean
after?: boolean
}
typeof?: {
before?: boolean
after?: boolean
}
var?: {
before?: boolean
after?: boolean
}
void?: {
before?: boolean
after?: boolean
}
volatile?: {
before?: boolean
after?: boolean
}
while?: {
before?: boolean
after?: boolean
}
with?: {
before?: boolean
after?: boolean
}
yield?: {
before?: boolean
after?: boolean
}
type?: {
before?: boolean
after?: boolean
}
}
}
)?]
    '@stylistic/ts/lines-around-comment': [({
beforeBlockComment?: boolean
afterBlockComment?: boolean
beforeLineComment?: boolean
afterLineComment?: boolean
allowBlockStart?: boolean
allowBlockEnd?: boolean
allowClassStart?: boolean
allowClassEnd?: boolean
allowObjectStart?: boolean
allowObjectEnd?: boolean
allowArrayStart?: boolean
allowArrayEnd?: boolean
allowInterfaceStart?: boolean
allowInterfaceEnd?: boolean
allowTypeStart?: boolean
allowTypeEnd?: boolean
allowEnumStart?: boolean
allowEnumEnd?: boolean
allowModuleStart?: boolean
allowModuleEnd?: boolean
ignorePattern?: string
applyDefaultIgnorePatterns?: boolean
}
)?]
    '@stylistic/ts/lines-between-class-members': [( ("always" | "never")
)?, ({
exceptAfterSingleLine?: boolean
exceptAfterOverload?: boolean
}
)?]
    '@stylistic/ts/member-delimiter-style': [unknown?]
    '@stylistic/ts/object-curly-spacing': [( ("always" | "never")
)?, ({
arraysInObjects?: boolean
objectsInObjects?: boolean
}
)?]
    '@stylistic/ts/padding-line-between-statements': [( ("any" | "never" | "always")
export type StatementType = (("*" | "block-like" | "exports" | "require" | "directive" | "expression" | "iife" | "multiline-block-like" | "multiline-expression" | "multiline-const" | "multiline-let" | "multiline-var" | "singleline-const" | "singleline-let" | "singleline-var" | "block" | "empty" | "function" | "break" | "case" | "class" | "const" | "continue" | "debugger" | "default" | "do" | "export" | "for" | "if" | "import" | "let" | "return" | "switch" | "throw" | "try" | "var" | "while" | "with" | "interface" | "type") | [("*" | "block-like" | "exports" | "require" | "directive" | "expression" | "iife" | "multiline-block-like" | "multiline-expression" | "multiline-const" | "multiline-let" | "multiline-var" | "singleline-const" | "singleline-let" | "singleline-var" | "block" | "empty" | "function" | "break" | "case" | "class" | "const" | "continue" | "debugger" | "default" | "do" | "export" | "for" | "if" | "import" | "let" | "return" | "switch" | "throw" | "try" | "var" | "while" | "with" | "interface" | "type"), ...(("*" | "block-like" | "exports" | "require" | "directive" | "expression" | "iife" | "multiline-block-like" | "multiline-expression" | "multiline-const" | "multiline-let" | "multiline-var" | "singleline-const" | "singleline-let" | "singleline-var" | "block" | "empty" | "function" | "break" | "case" | "class" | "const" | "continue" | "debugger" | "default" | "do" | "export" | "for" | "if" | "import" | "let" | "return" | "switch" | "throw" | "try" | "var" | "while" | "with" | "interface" | "type"))[]])
export type PaddingLineBetweenStatements = {
blankLine: PaddingType
prev: StatementType
next: StatementType
}[]
)?]
    '@stylistic/ts/quotes': [( ("single" | "double" | "backtick")
)?, ( ("avoid-escape" | {
avoidEscape?: boolean
allowTemplateLiterals?: boolean
})
)?]
    '@stylistic/ts/semi': [( ([]|["never"]|["never", {
beforeStatementContinuationChars?: ("always" | "any" | "never")
}] | []|["always"]|["always", {
omitLastInOneLineBlock?: boolean
omitLastInOneLineClassBody?: boolean
}])
)?]
    '@stylistic/ts/space-before-blocks': [( (("always" | "never") | {
keywords?: ("always" | "never" | "off")
functions?: ("always" | "never" | "off")
classes?: ("always" | "never" | "off")
})
)?]
    '@stylistic/ts/space-before-function-paren': [( (("always" | "never") | {
anonymous?: ("always" | "never" | "ignore")
named?: ("always" | "never" | "ignore")
asyncArrow?: ("always" | "never" | "ignore")
})
)?]
    '@stylistic/ts/space-infix-ops': [({
int32Hint?: boolean
}
)?]
    '@stylistic/ts/type-annotation-spacing': [unknown?]
  }
}

export {}
