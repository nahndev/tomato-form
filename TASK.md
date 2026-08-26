# Improve structure of system [website]

## Tasks 01 - For `./website/src/features/template`

- Create folder system type with a module, should include `constants`, `component`, `hooks`, `utils`, .... [x]
- Structure all file and constants, variable, .... in module [x]

Ex:
Currently, `WidgetDefinition` mix between data and react component. It is ineffective, should separate

- WIDGET_REGISTRY should move to constants and change name [x]
- WIDGET_REGISTRY should move to `WidgetItems` [x]

## Tasks 02 - Apply for all other modules

- Apply for all other modules [x]
  - `board`: extracted `MOCK_VALUE` into `constants/column/mockValues.ts`
  - `setting`: split `SETTING_TABS` (data+component mix) into `constants/settingTabs.ts` (`SettingTabItems`) + `components/content/registry.ts` (`SettingTabComponents`)
  - `user`: extracted `USER_SORT_OPTIONS`/`UserSortOption` into `constants/userSortOptions.ts`
  - `submission`, `workspace`: reviewed, nothing warranted extraction (no data/component mixing, no scattered constants)
