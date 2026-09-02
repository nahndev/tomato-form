import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class UploadFileDto {
  @ApiPropertyOptional({ description: "Parent folder id, omit for root" })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
