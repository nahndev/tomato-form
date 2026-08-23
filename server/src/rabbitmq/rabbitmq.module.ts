import { EnvironmentVariables } from "@/config/env.schema";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, RmqOptions, Transport } from "@nestjs/microservices";
import { RABBITMQ_CLIENT } from "./rabbitmq.constants";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_CLIENT,
        useFactory: (
          configService: ConfigService<EnvironmentVariables, true>,
        ): RmqOptions => {
          const url: string = configService.get("RABBITMQ_URL", {
            infer: true,
          });

          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: "tomato_form_queue",
              queueOptions: { durable: true },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitmqModule {}
