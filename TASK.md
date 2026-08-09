# Template support version control

## Tasks 01 - Add version entity

- [x] Add `TemplateVersion` with (`id`, `template`, `version`)
- [x] When get `template` (getOne, getMany) -> include `templateVersions`

## Tasks 02 - Enhance yjs

- [x] `yjs-server` update `filename` -> `public/{template-id}/default.yjs`
- [x] `yjs-server` support `rRPC` with
  - Accept a `version` and `template-id` -> copy `public/{template-id}/default.ys` into `public/{template-id}/{version}.yjs` -> return `json`

## Tasks 03 - Update UI support version controls

- [x] Update `TemplateDocProvider` accept a `version` -> access `default` or `version`
- [x] Add `website/src/features/template/components/toolbar/version` is `VersionSetting`, which include `list version of template` and `button` to publish current version is new `TemplateVersion`

## Tasks 04 - Enhance version using `semver`

- [x] Using library `semver` instead integer

## Tasks 05 - Using @grpc/grpc-js

- In `yjs-server`
- Install `@grpc/grpc-js`
- Refactoring using `@grpc/grpc-js`

## Tasks 06 - Enhance `yjs-server`

- Update `yjs-server` using `typescript`

## Tasks 07 - Enhance some `server`

- [x] Rename `./server/src/template-version/template-publish.client.ts` -> `template.client.ts`
- [x] Rename `./server/src/template-version/proto/template-publish.proto` -> `template.proto`

## Tasks 08 - New design for `yjs-server` communicate

- [x] Change `template.client.ts` -> into `template-file.client.ts`

```typescript

TemplateClientVersion {
  makeVersionFile(id: string, version: string): String // return new path
}


```

- [x] Update package-name, filename, ... of `yjs-server` and `server` related with this `proto`

## Tasks 09 - Apply keepCase:false to my proto

- [x] Apply `keepCase:false` for `server`
- [x] Apply `keepCase:false` for `yjs-server`
