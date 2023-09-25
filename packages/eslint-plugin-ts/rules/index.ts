import blockSpacing from './block-spacing/block-spacing'
import braceStyle from './brace-style/brace-style'
import commaDangle from './comma-dangle/comma-dangle'
import commaSpacing from './comma-spacing/comma-spacing'
import funcCallSpacing from './func-call-spacing/func-call-spacing'
import indent from './indent/indent'
import keySpacing from './key-spacing/key-spacing'
import keywordSpacing from './keyword-spacing/keyword-spacing'
import linesAroundComment from './lines-around-comment/lines-around-comment'
import linesBetweenClassMembers from './lines-between-class-members/lines-between-class-members'
import memberDelimiterStyle from './member-delimiter-style/member-delimiter-style'
import objectCurlySpacing from './object-curly-spacing/object-curly-spacing'
import paddingLineBetweenStatements from './padding-line-between-statements/padding-line-between-statements'
import quotes from './quotes/quotes'
import semi from './semi/semi'
import spaceBeforeBlocks from './space-before-blocks/space-before-blocks'
import spaceBeforeFunctionParen from './space-before-function-paren/space-before-function-paren'
import spaceInfixOps from './space-infix-ops/space-infix-ops'
import typeAnnotationSpacing from './type-annotation-spacing/type-annotation-spacing'

export default {
  'block-spacing': blockSpacing,
  'brace-style': braceStyle,
  'comma-dangle': commaDangle,
  'comma-spacing': commaSpacing,
  'func-call-spacing': funcCallSpacing,
  'indent': indent,
  'key-spacing': keySpacing,
  'keyword-spacing': keywordSpacing,
  'lines-around-comment': linesAroundComment,
  'lines-between-class-members': linesBetweenClassMembers,
  'member-delimiter-style': memberDelimiterStyle,
  'object-curly-spacing': objectCurlySpacing,
  'padding-line-between-statements': paddingLineBetweenStatements,
  'quotes': quotes,
  'semi': semi,
  'space-before-blocks': spaceBeforeBlocks,
  'space-before-function-paren': spaceBeforeFunctionParen,
  'space-infix-ops': spaceInfixOps,
  'type-annotation-spacing': typeAnnotationSpacing,
}
