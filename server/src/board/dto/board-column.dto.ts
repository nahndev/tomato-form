import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

/**
 * Values must stay in sync with `DisplayType` in
 * `website/src/types/display-type.ts` — there is no shared-types package
 * between web and server in this monorepo, so this is a hand mirror.
 */
export enum BoardColumnDisplayTypeDto {
  TEXT = "text",
  DATE = "date",
  NUMBER = "number",
}

export class BoardColumnItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  widgetId!: string;
}

export class BoardColumnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ enum: BoardColumnDisplayTypeDto })
  @IsEnum(BoardColumnDisplayTypeDto)
  type!: BoardColumnDisplayTypeDto;

  @ApiProperty()
  @IsInt()
  @Min(1)
  size!: number;

  @ApiProperty({ type: [BoardColumnItemDto] })
  @ValidateNested({ each: true })
  @Type(() => BoardColumnItemDto)
  @IsArray()
  items!: BoardColumnItemDto[];
}
