import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, collection: "users" })
export class User {
  @Prop({ required: true, unique: true })
  uuid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false, default: null })
  email: string | null;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ uuid: 1 }, { unique: true });
