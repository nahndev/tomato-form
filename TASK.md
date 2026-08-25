# Build setting column for board

## Currently

- The board only show the submission is simply
- User need view some data in board
- User need custom column list of board

## Tasks 01 - Add display-type for widgets [x]

- Every widget (base on type) will has multiple display type.
  Ex: Date -> as text, as date, as number
  Ex: Signature -> as text (name signer)
  Ex: Text -> as text

## Tasks 02 - Add design [x] (DB migration for `Board.columns` still needs to be run)

- Add columns to board
- Columns include `type`, `id`, `items` is list of `widget` in `template`
- List items show `<template-name/session-name>/<widget-name>`
- The column default don't show type, when choice first widget, auto add `type`

- Design:
  [ ] [ column] [column] [column] [button add column]
  [ template 01] [widget] [ widget] [widget] ....
  [ template 02] [widget] [ widget] [widget] ....
  [size] [ size of column] ....

- Flow
  - Click add column
  - New column all empty widget picker (border focus)
  - Select first colum (any template) - update display type for column
  - All widget picker same column only show same display type
  - Add size
  - When form validated -> save
- Add constant for `display_type` include `enum` of key and `map` of { name, icon, color, ....}

## Tasks 03 - Add display for board [x]

- In board page, show same design <name> <list columns> for every submission.
- The display of column only using mockup [will implement later]
