import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum ActionType {
  SUBMISSION_CREATION = "SUBMISSION_CREATION",
}

@Schema({ discriminatorKey: "type", _id: false })
export class Action {
  // Populated automatically by Mongoose as the discriminator key.
  // Must not be declared with @Prop(), since subclasses extending
  // this class would inherit the path and collide with the key itself.
  type!: ActionType;
}

export const ActionSchema = SchemaFactory.createForClass(Action);

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
