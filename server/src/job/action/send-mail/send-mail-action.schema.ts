import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Action } from "../base-action.schema";

export enum RecipientType {
  MAIL = "mail",
  USER = "user",
}

@Schema({ _id: false })
export class Recipient {
  @Prop({ type: String, enum: RecipientType, required: true })
  type!: RecipientType;

  // Email address when type is `mail`, user uuid when type is `user`.
  @Prop({ required: true })
  value!: string;
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);

@Schema({ _id: false })
export class MailContent {
  @Prop({ required: true })
  subject!: string;

  @Prop({ required: true })
  body!: string;
}

export const MailContentSchema = SchemaFactory.createForClass(MailContent);

@Schema({ _id: false })
export class SendMailAction extends Action {
  @Prop({ type: [RecipientSchema], required: true })
  recipients!: Recipient[];

  @Prop({ type: MailContentSchema, required: true })
  content!: MailContent;
}

export const SendMailActionSchema = SchemaFactory.createForClass(SendMailAction);
