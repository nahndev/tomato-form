import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CollaborationModule } from "@/collaboration/collaboration.module";
import { validateEnv } from "@/config/env.schema";
import { TemplateFileModule } from "@/template-file/template-file.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validate: validateEnv,
    }),
    CollaborationModule,
    TemplateFileModule,
  ],
})
export class AppModule {}
