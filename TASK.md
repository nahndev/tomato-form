# Adjust board column settings

## Tasks 01 - Rename and split component

- [x] Rename `website/src/features/board/components/column/BoardColumnsSetting.tsx` into `BoardColumnsSettingContent`
- [x] Split every column into new component
- [x] Split cell into component

## Tasks 02 - add label

- [x] Add `label` to `BoardColumn` (website/src/types/board.ts)
- [x] Add component and display for `label`

## Tasks 03 - Merge setting template with column settings

- [x] Remove `TemplateSetting`
- [x] In `BoardColumnSettingContent`, in bottom add button allow add `template` to list

## Tasks 04 - Update structure of board

- [x] Adjust `website/src/features/board/components/column`

```md
- BoardSetting
  - BoardSettingContent
    - BoardTemplate
      - TemplateBadge
      - AddTemplateButton
    - BoardColumn
      - BoardSizeBadge
      - BoardLabelInput
      - BoardTypeBadge
      - WidgetSelector
    - BoardColumnCreation
      - AddColumnButton
      - ColumnSkeleton
```
