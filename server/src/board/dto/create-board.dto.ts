import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { BoardColumnDto } from "./board-column.dto";

export class CreateBoardDto {
  @ApiProperty({ example: "Customer Feedback" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: "Template ids linked to this board" })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  templateIds?: string[];

  @ApiPropertyOptional({
    type: [BoardColumnDto],
    description: "Board column configuration",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardColumnDto)
  @IsOptional()
  columns?: BoardColumnDto[];
}
