# Create useMovingInOver

- Current, moving with x and y base on the delta and it is default over.
- When drag move to other session (over), that result will don't correct.

## Tasks

- [x] Create new hooks `useMovingInSession`, base on over and active, return position of current moving widget on over session.
- [x] Using `useMovingInSession` instead of `useTemplateLayoutcontext` in `SessionLayoutProvider`
