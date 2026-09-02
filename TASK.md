# Create new component `board-table`

## Scope

- website/src/components

## Design

- [x] `BoardTable` accept `columns` and `rows`, provider `context` and render wrapper
- [x] `BoardHeader` render wrapper for header, children is (columns) => React.FC
- [x] `BoardColumnHeader` accept `column`
- [x] `BoardActionHeader`
- [x] `BoardContent` is wrapper
- [x] `BoardRow` render wrapper of a row, children is (row, columns) => React.FC
- [x] `BoardRowHeader` accept `row`
- [x] `BoardRowContent` accept `row` and `column`
- [x] `BoardRowAction` accept `row`

## Tasks 01

- Create folder `website/src/components/board-table`
- Implement all components

## Rules

- Only accept props with description, if need new column, ask me
