# Create provider for some components.

## Tasks 01: Create TemplateProvider

- [x] Create TemplateProvider, props is state (useTemplateYjs)
- [x] Create hooks allow access state (without null)

## Tasks 02: Create SessionProvider

- [x] Create SessionProvider, props is session `Session`
- [x] Create hooks useSession return `session` and `layouts`, `widget` in this session

## Rules

- Don't using context in `grid`, it is incorrect, only using `gridv2`

## Changes

- [x] TemplateProvider: props should is `template: Template` instead of `UseTemplateYjsReturn`
- [x] TemplateProvider: load state from yjs and value of context is `state`.
