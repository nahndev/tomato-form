# Improve algorithm of GridLayoutProvider

- Currently, the algorithm is accurate but many problems exist about performance and code complexity.
- Too many redundant calculations and data types are used.
- The algorithm is not easy to understand and maintain.

## Current algorithm need improvement.

- [ ] Class GridItemDef is unnecessary. We can use Layout instead of GridItemDef.

## Expected algorithm

- [ ] Keep heightsRef
- [ ] Create yRef to keep y of each item.
- [ ] When items, base on { x, width, idx} and heightsRef, computeLayouts and keep it as a state.
- [ ] computeLayouts should is { id, x, width, idx, y}.
- [ ] When moving, create hook to get { id, x, width, idx, y }(A) of moving item. with x is current col (col), y is current position (px).
- [ ] Base on hook value, computeLayouts
  - [ ] with keep value { id, x, width, y, height} of moving item. don't effect to result.
  - [ ] with overlay item value { id, x, width, idx, y}(A), it should effect to result.
  - [ ] base on idx, return new idx for moving item before compute new y for all items.
- [ ] When moving end, update idx of moving item using fractional indexing.

## Critical rules

- [ ] Don't just fix it, consider a complete refactoring.
- [ ] When moving, only overlay item should effect to result (but don't effect in result). other items should not effect to result (but exist in result).
- [ ] Read current algorithm, it is correct behavior.
      `
