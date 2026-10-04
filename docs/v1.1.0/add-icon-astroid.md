# Add icon astroid for tomato/icon

## Currently

- `@tomato/icon` ([packages/icon/](../../packages/icon/)) is the icon package used by the web app (`"@tomato/icon": "workspace:*"` in `website/package.json`). It wraps `lucide-react` (v0.378.0) so callers never depend on the library directly.
- Icons are registered in [packages/icon/src/icons.ts](../../packages/icon/src/icons.ts):
  - `TomatoIconKey` is the list of stable, kebab-case keys (e.g. `Star: "star"`, `CircleDot: "circle-dot"`). They are persisted on entities, so they are decoupled from the library names.
  - `TOMATO_ICON_MAP` maps each key to a `LucideIcon` and is checked with `satisfies Record<TomatoIconKey, LucideIcon>`.
  - `DEFAULT_TOMATO_ICON_KEY` is `Clock`.
- `TomatoIcon` ([packages/icon/src/TomatoIcon.tsx](../../packages/icon/src/TomatoIcon.tsx)) renders an icon by key and shows "Icon not found" for an unknown key. `src/index.ts` exports `TomatoIconKey` and `TomatoIcon`.
- There is no "astroid" icon in `TomatoIconKey` or `TOMATO_ICON_MAP`.
- The installed `lucide-react` has no icon with that name either. The closest space-related ones it ships are `orbit`, `rocket`, `satellite`, `moon-star`, `stars` and `sparkles`.

## Acceptance Criteria

- [x] Add new icon

## Solutions

- [x] Add new icon `astroid` with key and display

## Changelogs

- `packages/icon/src/icons.ts`: new key `TomatoIconKey.Astroid = "astroid"`, mapped in `TOMATO_ICON_MAP` to lucide `Loader` (the installed `lucide-react` has no asteroid icon). Import list re-sorted (`Paperclip` after `PanelRight`).
- Not run: lint, typecheck (per project rules).
