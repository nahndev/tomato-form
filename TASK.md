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

<!--
## Tasks 02 - Migration [yjs-server] to Nestjs

- Convert `yjs-server` using `Nestjs` with `createMicroservice`
- `hocuspocus/server` as gateway

## Tasks 03 - Convert `gRpc` to `RabbitMQ`

- For `server` convert `makeVersionFile` to using `RabbitMQ`
- For `yjs-server` convert `makeVersionFile` to using `RabbitMQ`

## Tasks 04 - Shared code

- -->
