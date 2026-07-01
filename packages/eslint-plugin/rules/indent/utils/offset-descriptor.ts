import type { Token } from '#types'

/**
 * Stores offset descriptor payloads in parallel arrays.
 * `IndexMap` keeps only dense descriptor ids, and this storage resolves each id back to its offset metadata.
 * Index `0` is reserved so real descriptor ids can start at `1`.
 */
export class OffsetDescriptorStorage {
  _offsets: number[] = [0]
  _fromTokens: (Token | null)[] = [null]
  _forces: boolean[] = [false]

  create(offset: number, from: Token | null | undefined, force: boolean) {
    this._offsets.push(offset)
    this._fromTokens.push(from ?? null)
    this._forces.push(force)

    return this._offsets.length - 1
  }

  getOffset(index: number) {
    return this._offsets[index]
  }

  getFromToken(index: number) {
    return this._fromTokens[index]
  }

  getForce(index: number) {
    return this._forces[index]
  }
}
