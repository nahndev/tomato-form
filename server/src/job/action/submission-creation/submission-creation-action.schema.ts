import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Action } from "../base-action.schema";

@Schema({ _id: false })
export class SubmissionCreationAction extends Action {
  @Prop({ required: true })
  templateId!: string;

  @Prop({ required: true })
  boardId!: string;
}

export const SubmissionCreationActionSchema = SchemaFactory.createForClass(
  SubmissionCreationAction,
);
