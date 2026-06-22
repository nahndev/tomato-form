import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import {
  Action,
  ActionSchema,
  ActionType,
  SubmissionCreationActionSchema,
} from "./action.schema";

@Schema({ timestamps: true, collection: "cron_jobs" })
export class CronJob {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  expression!: string;

  @Prop({ type: [ActionSchema], default: [] })
  actions!: Action[];

  @Prop({ default: true })
  enable!: boolean;
}

export type CronJobDocument = CronJob & Document;
export const CronJobSchema = SchemaFactory.createForClass(CronJob);
CronJobSchema.index({ id: 1 }, { unique: true });

const actions = CronJobSchema.path(
  "actions",
) as mongoose.Schema.Types.DocumentArray;

actions.discriminator(
  ActionType.SUBMISSION_CREATION,
  SubmissionCreationActionSchema,
);
