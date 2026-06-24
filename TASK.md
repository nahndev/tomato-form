# Enhance

- [ ] Merge `JobTriggeredListener` and `JobRunner` into `JobHandler`, unwrap folder.
- [ ] `import { Cron, CronSchema } from "@/job/schemas/cron.schema";` nest schema should same file with main schema. And should is `CronEmitter` instead of `Cron`.
- [ ] `EmitterService::register` - `emitter` should is interface, base on class-type return correct model.
- [ ] `EmitterRegistration` -> replace by `CronRegistration`.
- [ ] `EmitterRegistration` -> don't unwrap `event`.
- [ ] `Emitter` will have multiple emitter include `CronEmitter`, `EventEmitter`, `ApiEmitter`, ....
- [ ] `EmitterModule` should re-structure.
- [ ] `JobService` don't known structure of `emitter`.
