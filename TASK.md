# Simplify the operation for job and emitter

## Tasks 01

- [x] Schema of `job` va schema cua `cron-emitter` should independent
- [x] Module `emitter` don't shared type, interface, ...
- [x] Remove `CronEventRegistry`
- [x] Simplify the module `Emitter`, instead using strategy, this module should export all emitter, every `emitter` should has interface only required `register`, `remove`.
- [x] `CronEmitter` register should accepts simple params as `key`, `expression` and `event`, don't using complex params.
- [x] Keep every simplify.

## Tasks 02

- [x] `CronEmitter` async register(key: string, expression: string, event: object): should saving data to database, when app-start then auto register
      [x] `CronEmitter` don't using type, interface, .... from `JobModule`

## Tasks 03 - Loose coupling between `ModuleEmitter` and `JobModule`

- [x] Unused `nestjs/cqrs` because it coupling.
- [x] Update logic, using `EventEmitter` instead of `nestjs/cqrs`.

## Tasks 04 - Eliminate data types when communicating between modules

- [x] Instead of using events, and without functions to serialize and un-serialize, update `register` into (...., type: string, payload: any)

## Tasks 05

- [x] Remove too small function in `JobService`

## Tasks 06

- [x] Moving `CronEventUtil` to shared utils and rename it
- [x] Suggest and rename functions of `CronEventUtil`
