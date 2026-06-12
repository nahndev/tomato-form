import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Template, TemplateSchema } from "./template.schema";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
