import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CronEmitter } from "./cron/cron.emitter";
import { Cron, CronSchema } from "./cron/cron.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Cron.name, schema: CronSchema }])],
  providers: [CronEmitter],
  exports: [CronEmitter],
})
export class EmitterModule {}
