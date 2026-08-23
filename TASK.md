# Migration gRpc to RabbitMQ

## Tasks 01 - Add docker composer [x]

- [x] On `./docker-compose.yaml`
- [x] Add docker for rabbitQR
- [x] Add module for [server]

## Tasks 02 - Add `@tomato/icon` for project [x]

- [x] Using `turbo`, create package `@tomato/icon`
- [x] Add <TomatoIcon icon="<name>"/>
- [x] Add `TomatoIconKey` is list all icons, which my system support it.
- [x] Add `TomatoIcon` is react composer, allow using this icon.

-> Why: The system current using `lexical`, but it don't save on backend is good and decouple with library.

## Tasks 03 - Migration `lexical-react` to `@tomato/icon` [x]

- [x] Found all `lexical-react` in [website]
- [x] Revert to using `@tomato/icon`

-> Already done: all persisted icon-key usages (icon-picker, SessionHeader, SubmissionSessionHeader, template.ts types) were migrated to `@tomato/icon` as part of the Task 02 package extraction. Remaining `lucide-react` imports elsewhere are decorative, static icons unrelated to the persisted-icon-key concept `@tomato/icon` decouples.

## Tasks 04 - Migration [yjs-sever] to `NestJs` and migration `gRpc` to `RabbitMQ`

- [ ] Convert [yjs-server] to `NestJs`
- [ ] Migration communicate with [server] by `RabbitMQ` instead of `gRpc`
- [ ] Cleanup source code related.
