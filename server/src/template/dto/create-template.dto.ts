import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from "class-validator";
import type { Widget, GridLayout, WidgetProperties } from "../template.schema";

export class CreateTemplateDto {
  @ApiProperty({ example: "My Form" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: "Map of widget id → widget" })
  @IsObject()
  @IsOptional()
  widgets?: Record<string, Widget>;

  @ApiPropertyOptional({ description: "Map of widget id → layout" })
  @IsObject()
  @IsOptional()
  layouts?: Record<string, GridLayout>;

  @ApiPropertyOptional({ description: "Map of widget id → session id" })
  @IsObject()
  @IsOptional()
  widgetToSession?: Record<string, string>;

  @ApiPropertyOptional({ description: "Map of widget id → properties" })
  @IsObject()
  @IsOptional()
  properties?: Record<string, WidgetProperties>;

}
