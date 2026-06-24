import { Cron, CronSchema } from "@/job/schemas/cron.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Action, ActionSchema, ActionType } from "../action/base-action.schema";
import { SendMailActionSchema } from "../action/send-mail/send-mail-action.schema";
import { SubmissionCreationActionSchema } from "../action/submission-creation/submission-creation-action.schema";

@Schema({ timestamps: true, collection: "jobs" })
export class Job {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: CronSchema, required: true })
  emitter!: Cron;

  @Prop({ type: [ActionSchema], default: [] })
  actions!: Action[];

  @Prop({ default: true })
  enable!: boolean;
}

export type JobDocument = Job & Document;
export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.index({ id: 1 }, { unique: true });

const actions = JobSchema.path(
  "actions",
) as mongoose.Schema.Types.DocumentArray;

actions.discriminator(
  ActionType.SUBMISSION_CREATION,
  SubmissionCreationActionSchema,
);
actions.discriminator(ActionType.SEND_MAIL, SendMailActionSchema);
