# Indent Performance Changes (Summary)

This file records the **final, retained** performance-related changes made to the indent rule.
It is intended as a checklist for manual review or adjustment.

Baseline used for comparisons:

- `TIMING=10 npx eslint --quiet` in `/Users/hyoban/i/dify/web`
- Baseline `style/indent`: **3360.041 ms**

Final result after changes:

- `style/indent`: **1621.734 ms** (~51.7% faster)

---

## 1) Reduce `ast_exports` getter overhead (largest win)

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Import high-frequency AST helpers with alias names and assign them to local `const` references.
- Example:
  - `isOpeningParenToken as _isOpeningParenToken`
  - `const isOpeningParenToken = _isOpeningParenToken`

**Why:** In the bundled `dist`, these are exported via getters. Repeated access in hot paths triggers getter overhead. Local const avoids that.

**Touched areas:**

- Top-level imports and new local const bindings.

---

## 2) Early return for single-line element lists

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- In `addElementListIndent`, if `startToken` and `endToken` are on the same line, return early.

**Why:** Single-line lists do not need complex indentation logic; avoids expensive `getFirstToken`/`setDesiredOffsets` work.

---

## 3) `IndexMap` dense storage using `Int32Array`

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Replace sparse map/object with dense `Int32Array`.
- `findLastNotAfter` becomes O(1) index lookup.
- `fillRange` used instead of insert/delete range operations.
- `freeze` becomes no-op.

**Why:** reduces allocations and per-access overhead in hot lookup paths.

---

## 4) `OffsetStorage` uses descriptor arrays

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Store descriptor data in parallel arrays:
  - `_descriptorOffsets`, `_descriptorFrom`, `_descriptorForce`
- `setDesiredOffsets` writes descriptor ids via `fillRange`.
- Cache computed desired indent string/number.

**Why:** Less object churn, faster lookup and assignment.

---

## 5) TypedArray token index acceleration

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Introduce `sourceTokenIndexByStart` and `nextTokenIndex` via TypedArray.

**Why:** Faster token position lookup and cheaper iteration.

---

## 6) `parameterParens` uses `Uint8Array`

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Replace `Set`/`Map` with `Uint8Array` for paren marking.

**Why:** Lower memory, faster membership checks.

---

## 7) `isIndentMatchRange` avoids substring allocations

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Compare indentation directly via `sourceCode.text` without slicing.

**Why:** Avoids string allocations and copies.

---

## 8) `TokenInfo` array-based storage

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Use array storage and manual scan for end-line checks.

**Why:** Reduce object overhead and method indirections.

---

## 9) `addParensIndent` scope reduction

**File:** `packages/eslint-plugin/rules/indent/indent.ts`

**Change:**

- Skip paren pairs on same line.
- Apply indentation only on first token of line or base tokens.

**Why:** Avoids applying indentation to most tokens; reduces `setDesiredOffset` calls.

---

## Notes / Warnings

- Tests and lint were run after final changes.
- Lint warning about `baseline-browser-mapping` still appears but is pre-existing.
- Deprecation warnings about `TSEnumMember.computed` appear in tests (pre-existing).
