import { EnvironmentVariables } from "@/config/env.schema";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, RmqOptions, Transport } from "@nestjs/microservices";
import { SERVER_CLIENT } from "./rabbitmq.constants";

/** Client for emitting events onto `server_queue`, the queue `server`'s microservice listener consumes. */
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVER_CLIENT,
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
              queue: "server_queue",
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
