import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";
import { EventBus } from "@nestjs/cqrs";
import { CronJob as CronTimer } from "cron";
import { Document, Model } from "mongoose";
import { CronEventRegistry } from "./cron-event.registry";
import { CronEmitter } from "./cron/cron.emitter";

@Schema({ timestamps: true, collection: "emitter_registrations" })
export class EmitterRegistration {
  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ required: true })
  expression!: string;

  @Prop({ required: true })
  eventType!: string;

  @Prop({ type: Object, required: true })
  eventPayload!: Record<string, unknown>;
}

export type EmitterRegistrationDocument = EmitterRegistration & Document;
export const EmitterRegistrationSchema =
  SchemaFactory.createForClass(EmitterRegistration);
EmitterRegistrationSchema.index({ key: 1 }, { unique: true });

@Injectable()
export class EmitterService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(EmitterRegistration.name)
    private readonly emitterModel: Model<EmitterRegistrationDocument>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly eventBus: EventBus,
    private readonly eventRegistry: CronEventRegistry,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const registrations = await this.emitterModel.find().exec();
    for (const registration of registrations) {
      const event = this.eventRegistry.toEvent(
        registration.eventType,
        registration.eventPayload,
      );
      this.arm(registration.key, registration.expression, event);
    }
  }

  async register(
    key: string,
    emitter: CronEmitter,
    event: object,
  ): Promise<void> {
    const { type, payload } = this.describe(event);

    await this.emitterModel
      .findOneAndUpdate(
        { key },
        {
          $set: {
            key,
            expression: emitter.expression,
            eventType: type,
            eventPayload: payload,
          },
        },
        { upsert: true },
      )
      .exec();

    this.arm(key, emitter.expression, event);
  }

  async remove(key: string): Promise<void> {
    await this.emitterModel.deleteOne({ key }).exec();
    this.disarm(key);
  }

  private arm(key: string, expression: string, event: object): void {
    this.disarm(key);

    const timer = new CronTimer(expression, () => {
      this.eventBus.publish(event);
    });
    this.schedulerRegistry.addCronJob(key, timer);
    timer.start();
  }

  private disarm(key: string): void {
    if (this.schedulerRegistry.doesExist("cron", key)) {
      this.schedulerRegistry.deleteCronJob(key);
    }
  }

  private describe(event: object): {
    type: string;
    payload: Record<string, unknown>;
  } {
    return {
      type: event.constructor.name,
      payload: { ...event } as Record<string, unknown>,
    };
  }
}
