import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface Widget {
  id: string;
  type: string;
}

export interface Layout {
  x: number;
  width: number;
  idx: number;
}

export interface WidgetProperties {
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

@Schema({ timestamps: true, collection: "templates" })
export class Template {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object, default: {} })
  widgets: Record<string, Widget>;

  @Prop({ type: Object, default: {} })
  layouts: Record<string, Layout>;

  @Prop({ type: Object, default: {} })
  properties: Record<string, WidgetProperties>;
}

export type TemplateDocument = Template & Document;
export const TemplateSchema = SchemaFactory.createForClass(Template);
TemplateSchema.index({ id: 1 }, { unique: true });
