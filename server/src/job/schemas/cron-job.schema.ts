import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import {
  Action,
  ActionSchema,
  ActionType,
  SubmissionCreationActionSchema,
} from "./action.schema";

export enum JobStatus {
  IDLE = "idle",
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
}

@Schema({ timestamps: true, collection: "cron_jobs" })
export class CronJob {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  cronExpression!: string;

  @Prop({ type: [ActionSchema], default: [] })
  actions!: Action[];

  @Prop({ default: true })
  enabled!: boolean;

  @Prop({ type: String, enum: JobStatus, default: JobStatus.IDLE })
  status!: JobStatus;

  @Prop({ type: Date, default: null })
  lastRunAt!: Date | null;

  @Prop({ type: Date, default: null })
  nextRunAt!: Date | null;

  @Prop({ type: String, default: null })
  lastError!: string | null;
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
