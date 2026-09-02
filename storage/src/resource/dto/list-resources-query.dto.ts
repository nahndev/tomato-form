import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsUUID } from "class-validator";

export class ListResourcesQueryDto {
  @ApiPropertyOptional({ description: "Parent folder id, omit for root" })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ enum: ["FILE", "FOLDER"], description: "Filter by resource type" })
  @IsIn(["FILE", "FOLDER"])
  @IsOptional()
  type?: "FILE" | "FOLDER";
}
