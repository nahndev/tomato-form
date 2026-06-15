# Using layout of yjs

Instead using idx for Layout, we can use the order of widgets in yjs to determine the layout. This way, we don't need to store idx in yjs and can avoid potential issues with syncing idx across clients.

## Tasks

- [x] Remove idx from Layout and update related code in useTemplateYjs.ts
- [x] Create new records in yjs, save idx as array of widget ids, and use the order of ids to determine the layout
