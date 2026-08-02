import { Module } from "@nestjs/common";
import { CronEmitter } from "./cron/cron.emitter";

@Module({
  providers: [CronEmitter],
  exports: [CronEmitter],
})
export class EmitterModule {}
