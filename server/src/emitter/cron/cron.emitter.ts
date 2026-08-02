import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Prisma } from "@/database/prisma-client";
import { CronJob as CronTimer } from "cron";
import { isPrismaNotFoundError } from "../../common/utils/prisma.util";
import { PrismaService } from "../../database/prisma.service";
import { EventCodec, EventDescriptor } from "../../shared/utils/event-codec.util";
import { Emitter } from "../emitter.interface";

@Injectable()
export class CronEmitter
  implements
    Emitter<[expression: string, event: object]>,
    OnApplicationBootstrap
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const crons = await this.prisma.cron.findMany();
    for (const { key, expression, event } of crons) {
      const descriptor = event as unknown as EventDescriptor;
      if (this.schedulerRegistry.doesExist("cron", key)) {
        this.schedulerRegistry.deleteCronJob(key);
      }

      const timer = new CronTimer(expression, () => {
        this.eventEmitter.emit(descriptor.type, EventCodec.decode(descriptor));
      });
      this.schedulerRegistry.addCronJob(key, timer);
      timer.start();
    }
  }

  async register(
    key: string,
    expression: string,
    event: object,
  ): Promise<void> {
    const descriptor = EventCodec.encode(event);

    await this.prisma.cron.upsert({
      where: { key },
      update: { expression, event: descriptor as unknown as Prisma.InputJsonValue },
      create: {
        key,
        expression,
        event: descriptor as unknown as Prisma.InputJsonValue,
      },
    });

    if (this.schedulerRegistry.doesExist("cron", key)) {
      this.schedulerRegistry.deleteCronJob(key);
    }

    const timer = new CronTimer(expression, () => {
      this.eventEmitter.emit(descriptor.type, EventCodec.decode(descriptor));
    });
    this.schedulerRegistry.addCronJob(key, timer);
    timer.start();
  }

  async remove(key: string): Promise<void> {
    try {
      await this.prisma.cron.delete({ where: { key } });
    } catch (err) {
      if (!isPrismaNotFoundError(err)) throw err;
    }

    if (this.schedulerRegistry.doesExist("cron", key)) {
      this.schedulerRegistry.deleteCronJob(key);
    }
  }
}
