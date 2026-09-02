import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateFolderDto {
  @ApiProperty({ example: "Contracts" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: "Parent folder id, omit for root" })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
