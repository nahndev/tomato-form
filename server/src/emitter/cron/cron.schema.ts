import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EventDescriptor } from "../../shared/utils/event-codec.util";

@Schema({ timestamps: true, collection: "cron_registrations" })
export class Cron {
  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ required: true })
  expression!: string;

  @Prop({ type: Object, required: true })
  event!: EventDescriptor;
}

export type CronDocument = Cron & Document;
export const CronSchema = SchemaFactory.createForClass(Cron);
CronSchema.index({ key: 1 }, { unique: true });
