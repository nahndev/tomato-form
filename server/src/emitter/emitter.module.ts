import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CronEventRegistry } from "./cron-event.registry";
import {
  EmitterRegistration,
  EmitterRegistrationSchema,
  EmitterService,
} from "./emitter.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmitterRegistration.name, schema: EmitterRegistrationSchema },
    ]),
  ],
  providers: [EmitterService, CronEventRegistry],
  exports: [EmitterService, CronEventRegistry],
})
export class EmitterModule {}
