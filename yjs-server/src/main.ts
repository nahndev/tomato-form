import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import dotenv from "dotenv";
import { AppModule } from "@/app.module";

dotenv.config();

/**
 * Bootstraps as a pure Nest microservice (no HTTP server) listening on the
 * same RabbitMQ queue `server`'s `RabbitmqModule` sends to. The Collaboration
 * module's Hocuspocus WS server still starts on its own port via its
 * `onModuleInit` hook - Nest builds the full module graph either way.
 */
async function bootstrap() {
  const rabbitMqUrl = process.env.RABBITMQ_URL;
  if (!rabbitMqUrl) {
    throw new Error("RABBITMQ_URL environment variable is required");
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: "yjs_server_queue",
      queueOptions: { durable: true },
    },
  });

  app.enableShutdownHooks();

  await app.listen();
  console.log("yjs-server microservice listening on RabbitMQ");
}

bootstrap();
