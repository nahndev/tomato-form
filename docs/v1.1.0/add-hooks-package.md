# Add new package for hooks

## Currently

- The monorepo (`pnpm-workspace.yaml`) currently defines shared workspace packages under `packages/*`: `@tomato/grid` (`packages/grid`), `@tomato/icon` (`packages/icon`), `@tomato/sync` (`packages/sync`), `@tomato/tailwind-config` (`packages/tailwind-config`), and `@tomato/timeline` (`packages/timeline`), each consumed by `website`/`server` via the `@tomato/*` scope.
- There is no shared `@tomato/hooks` (or similarly named) package under `packages/` yet.

## Hooks

- [x] useOptions accept list, export state, toggle

## Changelogs

### Package `packages/hooks`

- New workspace package `@tomato/hooks`, `package.json`/`tsconfig.json` mirror `packages/icon`'s conventions (no styling deps needed, unlike `packages/grid`/`packages/timeline`): `main`/`types: ./src/index.ts`, `typecheck`/`lint` scripts, `react` peer dependency.
- `src/useOptions.ts`: single-select hook per clarification - `useOptions<T>(list: T[], initial?: T | null)` returns `{ list, selected, toggle }`. `selected` is `T | null`; `toggle(value)` selects `value` if unselected, clears selection (`null`) if `value` is already selected. `list` accepts primitives (`T[]`), not `{ value, label }` objects.
- `src/index.ts`: re-exports `useOptions` and its `UseOptionsResult` type.

### Frontend (`website`)

- `website/package.json`: added `"@tomato/hooks": "workspace:*"` alongside the other `@tomato/*` workspace deps.

### Manual follow-ups (not run here, per project rules)

- Run `pnpm install` at the repo root to link the new `@tomato/hooks` workspace package and update `pnpm-lock.yaml`.
- No consumer wired up yet - `useOptions` isn't used anywhere in `website` yet; adopt it where a single-select toggle pattern is needed.
