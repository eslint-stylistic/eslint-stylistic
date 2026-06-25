/**
 * A mutable map that stores descriptor ids keyed by numeric indices.
 * The dense typed-array backing keeps the hot range-update path compact.
 */
export class IndexMap {
  _values: Int32Array

  /**
   * Creates an empty map
   * @param maxKey The maximum key
   */
  constructor(maxKey: number) {
    // Initializing the array with the maximum expected size avoids dynamic reallocations that could degrade performance.
    this._values = new Int32Array(maxKey + 1)
  }

  /**
   * Inserts an entry into the map.
   * @param key The entry's key
   * @param value The entry's value
   */
  insert(key: number, value: number) {
    this._values[key] = value
  }

  /**
   * Finds the descriptor id of the entry with the largest key less than or equal to the provided key.
   * @param key The provided key
   * @returns The found descriptor id, or `0` when no descriptor has been inserted at or before this key.
   * Actual descriptor ids start at `1`, so `0` can be used as the empty-slot sentinel in `_values`.
   */
  findLastNotAfter(key: number): number {
    const values = this._values

    for (let index = key; index >= 0; index--) {
      const value = values[index]

      if (value !== 0)
        return value
    }

    return 0
  }

  /**
   * Deletes all of the keys in the interval [start, end)
   * @param start The start of the range
   * @param end The end of the range
   */
  deleteRange(start: number, end: number) {
    this._values.fill(0, start, end)
  }
}
