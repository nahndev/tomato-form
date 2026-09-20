# Only show floating toolbar when editor is focused

## Currently

- `FloatingToolbarPlugin` always rendered the floating formatting toolbar, even when the editor was never focused or interacted with.
- This kept a fixed, full-width toolbar bar visible on screen at all times, unrelated to whether the user was editing.

## Acceptance Criteria

- [x] Floating toolbar only shows while the editor is focused
- [x] Toolbar hides on blur
- [x] Focus tracking logic lives in its own reusable hook, not inline in the component

## Solutions

- [x] Track editor focus via Lexical's `FOCUS_COMMAND` / `BLUR_COMMAND`
- [x] `FloatingToolbarPlugin` renders `null` when the editor isn't focused
- [x] Extract the tracking hook into its own file, following the `useSyncEditorState.ts` pattern

## Changelogs

- Added `useEditorFocus` hook (`website/src/components/lexical/useEditorFocus.ts`) that tracks editor focus state via Lexical's `FOCUS_COMMAND`/`BLUR_COMMAND`, registered with `mergeRegister`.
- Updated `FloatingToolbarPlugin` (`website/src/components/lexical/FloatingToolbarPlugin.tsx`) to use `useEditorFocus` and return `null` when the editor isn't focused, instead of always rendering the toolbar.
