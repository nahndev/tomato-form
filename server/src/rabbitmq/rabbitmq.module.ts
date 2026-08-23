import { EnvironmentVariables } from "@/config/env.schema";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RABBITMQ_CLIENT } from "./rabbitmq.constants";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_CLIENT,
        useFactory: (
          configService: ConfigService<EnvironmentVariables, true>,
        ) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get("RABBITMQ_URL", { infer: true })],
            queue: "tomato_form_queue",
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitmqModule {}
