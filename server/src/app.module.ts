import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { validateEnv } from "./config/env.schema";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { JobModule } from "./job/job.module";
import { TemplateModule } from "./template/template.module";
import { UserModule } from "./user/user.module";
import { BoardModule } from "./board/board.module";
import { SubmissionModule } from "./submission/submission.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validate: validateEnv,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    TemplateModule,
    UserModule,
    BoardModule,
    SubmissionModule,
    JobModule,
  ],
})
export class AppModule {}
