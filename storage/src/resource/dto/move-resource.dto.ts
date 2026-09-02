import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class MoveResourceDto {
  @ApiPropertyOptional({ description: "New parent folder id, omit/null to move to root" })
  @IsUUID()
  @IsOptional()
  parentId?: string | null;
}
