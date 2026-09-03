import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AccessTokenModule } from "./access-token/access-token.module";
import { validateEnv } from "./config/env.schema";
import { DatabaseModule } from "./database/database.module";
import { FileModule } from "./file/file.module";
import { HealthModule } from "./health/health.module";
import { ImageModule } from "./image/image.module";
import { ResourceModule } from "./resource/resource.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validate: validateEnv,
    }),
    DatabaseModule,
    HealthModule,
    ImageModule,
    FileModule,
    AccessTokenModule,
    ResourceModule,
  ],
})
export class AppModule {}
