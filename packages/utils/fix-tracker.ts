/**
 * @fileoverview Helper class to aid in constructing fix commands.
 * @author Alan Pierce
 */

import type { AST } from 'eslint'
import type { ASTNode, ESToken, RuleFixer, SourceCode, Token, Tree } from '@shared/types'
import { getUpperFunction } from './ast'

/**
 * A helper class to combine fix options into a fix command. Currently, it
 * exposes some "retain" methods that extend the range of the text being
 * replaced so that other fixes won't touch that region in the same pass.
 */
export class FixTracker {
  retainedRange: number[] | null

  /**
   * Create a new FixTracker.
   * @param fixer A ruleFixer instance.
   * @param sourceCode A SourceCode object for the current code.
   */
  constructor(
    public fixer: RuleFixer,
    public sourceCode: SourceCode,
  ) {
    this.retainedRange = null
  }

  /**
   * Mark the given range as "retained", meaning that other fixes may not
   * may not modify this region in the same pass.
   * @param range The range to retain.
   * @returns The same RuleFixer, for chained calls.
   */
  retainRange(range: number[]) {
    this.retainedRange = range
    return this
  }

  /**
   * Given a node, find the function containing it (or the entire program) and
   * mark it as retained, meaning that other fixes may not modify it in this
   * pass. This is useful for avoiding conflicts in fixes that modify control
   * flow.
   * @param node The node to use as a starting point.
   * @returns The same RuleFixer, for chained calls.
   */
  retainEnclosingFunction(node: ASTNode) {
    const functionNode = getUpperFunction(node)

    return this.retainRange(functionNode ? functionNode.range : this.sourceCode.ast.range)
  }

  /**
   * Given a node or token, find the token before and afterward, and mark that
   * range as retained, meaning that other fixes may not modify it in this
   * pass. This is useful for avoiding conflicts in fixes that make a small
   * change to the code where the AST should not be changed.
   * @param nodeOrToken The node or token to use as a starting
   *      point. The token to the left and right are use in the range.
   * @returns The same RuleFixer, for chained calls.
   */
  retainSurroundingTokens(nodeOrToken: Tree.Token | ASTNode) {
    const tokenBefore = this.sourceCode.getTokenBefore(nodeOrToken) || nodeOrToken
    const tokenAfter = this.sourceCode.getTokenAfter(nodeOrToken) || nodeOrToken

    return this.retainRange([tokenBefore.range[0], tokenAfter.range[1]])
  }

  /**
   * Create a fix command that replaces the given range with the given text,
   * accounting for any retained ranges.
   * @param range The range to remove in the fix.
   * @param text The text to insert in place of the range.
   * @returns The fix command.
   */
  replaceTextRange(range: [number, number], text: string) {
    let actualRange: AST.Range

    if (this.retainedRange) {
      actualRange = [
        Math.min(this.retainedRange[0], range[0]),
        Math.max(this.retainedRange[1], range[1]),
      ]
    }
    else {
      actualRange = range
    }

    return this.fixer.replaceTextRange(
      actualRange,
      this.sourceCode.text.slice(actualRange[0], range[0])
      + text
      + this.sourceCode.text.slice(range[1], actualRange[1]),
    )
  }

  /**
   * Create a fix command that removes the given node or token, accounting for
   * any retained ranges.
   * @param nodeOrToken The node or token to remove.
   * @returns The fix command.
   */
  remove(nodeOrToken: ASTNode | ESToken | Token | ASTNode) {
    return this.replaceTextRange(nodeOrToken.range, '')
  }
}
