# Add `Job` feature

## Currently

- The `job` feature is sub-feature of `board`
- The `job` feature will expand coming soon

## Tasks 01 - Split feature

- [x] Add folder `./website/src/features/job`
- [x] Keep features of `job`

## Tasks 02 - Enhance `job` in `board`

- [x] Update `./website/src/features/board/components/BoardTab.tsx`, job only should list only
- [x] Update `job` ui into page
- [x] When create `job` from `BoardTab`, then navigate to `job/new`
- [x] When view `job` from `BoardTab`, then navigate to `job/{id}?mode=view`
- [x] When update `job` from `BoardTab`, then navigate to `job/{id}?mode=edit`
- [x] When remove `job` from `job/{id}?mode=view`, then navigate back.
- [x] Design of `job` dialog -> `JobCreationPage`
- [x] Design of detail page (create/edit/view) `List steps` - `Edition for target step`

## Tasks 03 - Update `job` - detail page

- [x] Update `job` detail page include `setup`, `status`
