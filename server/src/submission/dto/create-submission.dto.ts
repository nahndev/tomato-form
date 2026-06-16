import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateSubmissionDto {
  @ApiProperty({ example: "b3f1c2..." })
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @ApiProperty({ example: "t9a2e4..." })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiPropertyOptional({ description: "Map of widget id → submitted value" })
  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;
}
