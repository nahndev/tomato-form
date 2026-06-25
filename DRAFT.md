# New design for `UserManager`

## Design - From top left to bottom right

- Back navigator
- Title `UserManager`
- Subtitle `....`
- Right is avatar and name of current user (only layout)
- `All users` - `count(users)` - <space> - `Search name` - `Filter` - `Create button`
- List all user (page 01)
- Pagination

## Tasks

- [ ] Add new folder in `./website/src/features/user`
- [ ] Design `User management` with this design
- [ ] Using `shadcn/ui`
- [ ] Update `./website/src/app/(main)/users`

# Enhance provider of `template` feature.

- `useTemplateYjs` return state and callbacks
- Currently, providers `Template`, `Session`, `Widget` return both value and callback. It's being used haphazardly, both to retrieve display values ​​and to update them (like changing their position).
- I want to build separate edit-only and display components, with two review and edit modes that will either use or ignore edit-only components.

## Tasks

- [ ] Reorganize providers; template, session, and widget providers should only provide state.
- [ ] Update operations should be accessed directly in the `useTemplateYjs` hook.
- [ ] Build `wrappers` that allow update operations within the wrapper without affecting display.
