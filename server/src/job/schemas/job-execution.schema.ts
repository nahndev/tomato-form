import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum JobExecutionStatus {
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
}

@Schema({ timestamps: true, collection: "job_executions" })
export class JobExecution {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  jobId!: string;

  @Prop({ type: String, enum: JobExecutionStatus, required: true })
  status!: JobExecutionStatus;

  @Prop({ required: true })
  startedAt!: Date;

  @Prop({ type: Date, default: null })
  finishedAt!: Date | null;

  @Prop({ type: String, default: null })
  error!: string | null;

  @Prop({ type: Object, default: null })
  result!: Record<string, unknown> | null;
}

export type JobExecutionDocument = JobExecution & Document;
export const JobExecutionSchema = SchemaFactory.createForClass(JobExecution);
JobExecutionSchema.index({ id: 1 }, { unique: true });
JobExecutionSchema.index({ jobId: 1, startedAt: -1 });
