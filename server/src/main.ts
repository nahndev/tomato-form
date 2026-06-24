import { GlobalExceptionFilter } from "@/common/filters/http-exception.filter";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { EnvironmentVariables } from "./config/env.schema";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  app.setGlobalPrefix("api");

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const corsOrigins = config.get("CORS_ORIGIN", { infer: true }).split(",");
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Tomato Form API")
    .setDescription("REST API for the Tomato Form Service")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = config.get("PORT", { infer: true });
  await app.listen(port);
  console.log(`Server running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
