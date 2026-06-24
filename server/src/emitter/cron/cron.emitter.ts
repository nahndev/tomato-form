import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob as CronTimer } from "cron";
import { Model } from "mongoose";
import { Emitter } from "../emitter.interface";
import { EventCodec } from "../../shared/utils/event-codec.util";
import { Cron, CronDocument } from "./cron.schema";

@Injectable()
export class CronEmitter
  implements Emitter<[expression: string, event: object]>, OnApplicationBootstrap
{
  constructor(
    @InjectModel(Cron.name)
    private readonly cronModel: Model<CronDocument>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const crons = await this.cronModel.find().exec();
    for (const { key, expression, event } of crons) {
      if (this.schedulerRegistry.doesExist("cron", key)) {
        this.schedulerRegistry.deleteCronJob(key);
      }

      const timer = new CronTimer(expression, () => {
        this.eventEmitter.emit(event.type, EventCodec.decode(event));
      });
      this.schedulerRegistry.addCronJob(key, timer);
      timer.start();
    }
  }

  async register(key: string, expression: string, event: object): Promise<void> {
    const descriptor = EventCodec.encode(event);

    await this.cronModel
      .findOneAndUpdate(
        { key },
        { $set: { key, expression, event: descriptor } },
        { upsert: true },
      )
      .exec();

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
    await this.cronModel.deleteOne({ key }).exec();
    if (this.schedulerRegistry.doesExist("cron", key)) {
      this.schedulerRegistry.deleteCronJob(key);
    }
  }
}
