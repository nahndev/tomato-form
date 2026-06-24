import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Cron {
  @Prop({ required: true })
  expression!: string;
}

export const CronSchema = SchemaFactory.createForClass(Cron);
