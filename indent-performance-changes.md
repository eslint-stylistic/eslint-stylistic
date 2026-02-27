# Indent Performance Changes (Summary)

This file records the **final, retained** performance-related changes made to the indent rule.
It is intended as a checklist for manual review or adjustment.

Benchmark context (2026-02-27):

- `TIMING=10 npx eslint --quiet` in `/Users/hyoban/i/dify/web`
- Baseline (origin/main `indent.ts`): **3063.804 ms**
- Final (current optimized): **1727.778 ms** (~43.6% faster, **-1336.026 ms**)

Per-optimization revert results (baseline **1727.778 ms**, 2026-02-27):

| Optimization                                         | Reverted `style/indent` | Δ vs baseline            |
| ---------------------------------------------------- | ----------------------- | ------------------------ |
| 1) Reduce `ast_exports` getter overhead              | **2537.556 ms**         | **+809.778 ms** (+46.9%) |
| 2) Early return for single-line element lists        | **1826.473 ms**         | **+98.695 ms** (+5.7%)   |
| 3) `IndexMap` dense storage using `Int32Array`       | **2425.315 ms**         | **+697.537 ms** (+40.4%) |
| 4) `OffsetStorage` uses descriptor arrays            | **2425.315 ms**         | **+697.537 ms** (+40.4%) |
| 5) TypedArray token index acceleration               | **1807.322 ms**         | **+79.544 ms** (+4.6%)   |
| 6) `parameterParens` uses `Uint8Array`               | **1821.220 ms**         | **+93.442 ms** (+5.4%)   |
| 7) `isIndentMatchRange` avoids substring allocations | **1813.355 ms**         | **+85.577 ms** (+5.0%)   |
| 8) `TokenInfo` array-based storage                   | **1842.216 ms**         | **+114.438 ms** (+6.6%)  |
| 9) `addParensIndent` scope reduction                 | **1780.468 ms**         | **+52.690 ms** (+3.0%)   |

Notes:

- #3 and #4 are tightly coupled; measured together by reverting both to the origin/main-style `IndexMap` + `OffsetStorage` implementation.
- #5 was measured by swapping `Uint32Array`/`Int32Array` to plain arrays while keeping the same algorithm, so the delta reflects TypedArray gains specifically.

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

---

## Analysis (Profiling & Hotspots)

- Bench command: `TIMING=10 npx eslint --quiet` in `/Users/hyoban/i/dify/web`.
- CPU profiling command: `node --cpu-prof --cpu-prof-dir=/tmp ./node_modules/eslint/bin/eslint.js --quiet`.
- Profile focus: `packages/eslint-plugin/dist/rules/indent.js`.
- Hotspots found:
  - `addParensIndent` dominated self time.
  - `Program:exit` large inclusive time.
  - Significant self time inside `rolldown-runtime.js` getter logic from `ast_exports` access.
- Conclusion:
  - Repeated `ast_exports` property getter calls in hot paths were causing large constant overhead.
  - Reducing getter access in hot loops would likely yield the biggest gains.

---

## Modifications (From Analysis to Fix)

1. **Avoid `ast_exports` getters in hot paths**
   - Aliased frequent AST helpers in `packages/eslint-plugin/rules/indent/indent.ts` to local `const` bindings.
   - This removed repeated getter access when calling `isOpeningParenToken`, `isClosingParenToken`, etc.

2. **`addElementListIndent` single-line early return**
   - Skip work when start/end tokens are on the same line.

3. **`IndexMap` dense storage + descriptor arrays**
   - `IndexMap` moved to `Int32Array` with `fillRange`.
   - `OffsetStorage` descriptor data moved to parallel arrays for faster lookups.

4. **TypedArray indices**
   - `sourceTokenIndexByStart` and `nextTokenIndex` moved to typed arrays.

5. **`parameterParens` to `Uint8Array`**
   - Fast membership marking.

6. **`isIndentMatchRange` direct text comparison**
   - Avoid substring allocations.

7. **`TokenInfo` array storage**
   - Reduce object overhead for per-token access.

8. **`addParensIndent` scope reduction**
   - Skip same-line pairs; apply only for first-token-of-line/base-token.

---

## Verification (Bench/Test/Lint/Typecheck)

- **Performance benchmark**
  - Baseline `style/indent` (origin/main, 2026-02-27): **3063.804 ms**
  - Final `style/indent` (current optimized, 2026-02-27): **1727.778 ms**
  - Improvement: **~43.6%**

- **Tests**
  - `pnpm test` ✅
  - Note: Deprecation warnings about `TSEnumMember.computed` (pre-existing).

- **Lint**
  - `pnpm lint` ✅
  - Note: `baseline-browser-mapping` warning (pre-existing).

- **Typecheck**
  - `pnpm typecheck` ✅
  - Fixes applied:
    - `NonCommentToken` type added to distinguish comment vs non-comment tokens.
    - `getTokenBeforeToken` / `getTokenAfterToken` accept `Token` but return `NonCommentToken | null`.
    - `resolveTokenBefore` helper ensures preceding/following tokens for comments are non-comment tokens.
    - `ignoreNode` handles `null` dependency safely.

---

## Required Optimization Workflow (per user instructions)

- Always run **baseline performance** before any code changes:
  - Command: `TIMING=10 npx eslint --quiet` in `/Users/hyoban/i/dify/web`.
- Make code changes to the indent rule.
- Run **post-change benchmark** with the same command and environment.
- Ensure **tests** and **lint** pass after changes:
  - `pnpm test`
  - `pnpm lint` (warning about `baseline-browser-mapping` is acceptable as pre-existing)
- Typecheck must pass:
  - `pnpm typecheck`
- Profiling requirements when asked:
  - Use CPU profiling: `node --cpu-prof --cpu-prof-dir=/tmp ./node_modules/eslint/bin/eslint.js --quiet`.
  - Analyze `packages/eslint-plugin/dist/rules/indent.js` for hotspots.
- Performance targets requested during the process (historical):
  - Must not regress below **4.5%** improvement.
  - Must reach **≥5%**, then **≥20%**, then **≥30%** improvement before reporting.
