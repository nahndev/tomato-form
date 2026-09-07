# Remove entity `TemplateVersion`

## Currently

- The system include `TemplateVersion`
- But, it don't compatible with my system.
- The my system should only a version of template.

## Flow

- Document include 2 state

1. Edition state: save value in yjs
2. Publish version: save in entity

- When click publish, instead create new `TemplateVersion` -> set data to `Template`

## Tasks

- [x] Remove `TemplateVersion`
- [x] Update code
- [x] Update current link of `TemplateVersion` to `Template` as `Board`, `Submission`
- [x] When publish new version, call [yjs-server] to get json and create `TemplateMigration` save 2 version of data.
- [x] Api return `TemplateMigration` with conflict, but current only return empty. (conflict detection is stubbed to `[]`; publish auto-applies when there's nothing to resolve)
- [x] User resolve conflict and send answers to server. (`POST /template-migrations/:id/resolve` + minimal UI wired, unexercised until real conflict detection lands)
- [x] After resolve, save new data for `template`
- [x] Update for [website] store

## Rules

- [x] Cleanup all database in database (because is test data)
- [x] Run migration
- [x] Remove all redundancy
- [x] Apply design pattern and solid, kiss, dry, ....
- [x] All update other code
