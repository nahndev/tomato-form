import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "@/app.module";
import { EnvironmentVariables } from "@/config/env.schema";
import { CopilotService } from "@/copilot/copilot.service";

/**
 * Body parsing is off and the CopilotKit router is mounted directly: it reads
 * the raw request stream and applies its own CORS, so Nest's JSON parser and
 * `enableCors` must stay out of its way.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const config = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  app.use(app.get(CopilotService).router);
  app.enableShutdownHooks();

  const port = config.get("PORT", { infer: true });
  await app.listen(port);
  console.log(`copilot-server listening on :${port}`);
}

bootstrap();
