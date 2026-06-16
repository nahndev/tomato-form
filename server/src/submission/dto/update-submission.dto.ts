import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

export class UpdateSubmissionDto {
  @ApiPropertyOptional({ description: "Map of widget id → submitted value" })
  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;
}
