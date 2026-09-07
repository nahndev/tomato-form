import { RabbitmqModule } from "@/rabbitmq/rabbitmq.module";
import { Module } from "@nestjs/common";
import { TemplateMigrationController } from "./template-migration.controller";
import { TemplateMigrationService } from "./template-migration.service";
import { TemplateSnapshotClient } from "./template-snapshot.client";

@Module({
  imports: [RabbitmqModule],
  controllers: [TemplateMigrationController],
  providers: [TemplateMigrationService, TemplateSnapshotClient],
  exports: [TemplateMigrationService],
})
export class TemplateMigrationModule {}
