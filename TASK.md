# Adjust Submission

## Tasks 01 - Convert Submission using TemplateVersion

[server]

### schema.prisma

- [x] `Template` remove `widgets`, `layouts`, `properties`, `widgetToSession`
- [x] `TemplateVersion` add `widgets`, `layouts`, `sessions`, `properties`, `widgetToSession`
- [x] `Submission` add `templateVersionId`
- [x] Add api `/template-versions/{id}`

[yjs-server]

- [x] When `makeVersionFile` return those records (using `google.protobuf.Struct`)
- [x] On success -> `makeVersionFile` set to `TemplateVersion`

[website]

- [x] `SubmissionPage` -> add hooks `useTemplateVersion`
- [x] `SubmissionPage` -> using `ContainerLayout` to render UI
- [x] `ContainerLayout` -> adjust `onMove` and `onResize` to optional
