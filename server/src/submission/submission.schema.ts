import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, collection: "submissions" })
export class Submission {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  boardId!: string;

  @Prop({ required: true })
  templateId!: string;

  @Prop({ type: Object, default: {} })
  data: Record<string, unknown> = {};
}

export type SubmissionDocument = Submission & Document;
export const SubmissionSchema = SchemaFactory.createForClass(Submission);
SubmissionSchema.index({ id: 1 }, { unique: true });
SubmissionSchema.index({ boardId: 1 });
