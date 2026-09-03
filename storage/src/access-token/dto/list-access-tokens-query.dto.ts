import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class ListAccessTokensQueryDto {
  @ApiPropertyOptional({ description: "Filter by folder id" })
  @IsUUID()
  @IsOptional()
  folderId?: string;
}
