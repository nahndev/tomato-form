import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
}
