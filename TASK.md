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

## Tasks 04 - Migration [yjs-sever] to `NestJs` and migration `gRpc` to `RabbitMQ` [x]

- [x] Convert [yjs-server] to `NestJs`
- [x] Migration communicate with [server] by `RabbitMQ` instead of `gRpc`
- [x] Cleanup source code related.

-> yjs-server is now a NestJS microservice (RMQ transport on the existing `tomato_form_queue`) with the Hocuspocus WS server kept alive via a `CollaborationService` lifecycle hook. `MakeVersionFile` moved from a gRPC unary RPC to a `@MessagePattern`/`ClientProxy.send()` request-reply pair. Removed: `.proto` files (both sides), `server/src/common/utils/grpc-client.util.ts`, `server/scripts/proto-gen.sh`, grpc deps, `YJS_RPC_URL`/`RPC_PORT` env vars, the stray `dev-yjs-server` turbo task. Not run/verified in this session (per project convention) — needs `pnpm install` to pick up yjs-server's new deps, then a manual publish-flow + WS collab check (see plan at `/home/dev/.claude/plans/harmonic-herding-charm.md`).

## Tasks 05 - Don't handle
