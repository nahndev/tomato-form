import { Schema, SchemaFactory } from "@nestjs/mongoose";

export enum ActionType {
  SUBMISSION_CREATION = "SUBMISSION_CREATION",
  SEND_MAIL = "SEND_MAIL",
}

@Schema({ discriminatorKey: "type", _id: false })
export class Action {
  // Populated automatically by Mongoose as the discriminator key.
  // Must not be declared with @Prop(), since subclasses extending
  // this class would inherit the path and collide with the key itself.
  type!: ActionType;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
