# New solution of `useTemplateYjs`

## Problems

- `useTemplateYjs` export both `state` and `action`
- `useTemplateYjs` alway need context to using
- `useTemplateYjs` with other hook using mixin, hard refactoring and maintenance

## Rules

- Keep everything separate and decoupling.
- Should a `Provider` to pass `doc` (yjs)
- Should a `hook` to pass `template` - action only
- Should a `hook` to pass `session` - action only using `observe`
- Should a `hook` to pass `widget` - action only using `observer`
- should a `hook` to pass `widget` - state only
- Should a `hook` to pass `template` - state only
- Should a `hook` to pass `session` - state only
- `hook` of state should don't dependency in `doc` (yjs), allow using without doc.

## Tasks

- [x] Create hook and update all component in `./website/src/features/template`
- [x] Separate and refactoring `useTemplateYjs`
