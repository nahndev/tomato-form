import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

export class ResolveTemplateMigrationDto {
  @ApiPropertyOptional({
    description:
      "User-submitted answers to the migration's conflicts. Shape is undecided until conflict detection exists.",
    type: Object,
  })
  @IsObject()
  @IsOptional()
  resolutions?: Record<string, unknown>;
}
