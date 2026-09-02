import { File, Folder, Resource } from "@/database/prisma-client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export type ResourceWithRelations = Resource & {
  file?: File | null;
  folder?: Folder | null;
};

export class ResourceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ["FILE", "FOLDER"] })
  type!: "FILE" | "FOLDER";

  @ApiProperty({ description: "Display name" })
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiPropertyOptional({ description: "Parent resource id, null when at root" })
  parentId!: string | null;

  @ApiPropertyOptional({ description: "Path the file is served from (files only)" })
  url?: string;

  @ApiPropertyOptional({ description: "File mime type (files only)" })
  mimeType?: string;

  @ApiPropertyOptional({ description: "File size in bytes (files only)" })
  size?: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromEntity(resource: ResourceWithRelations): ResourceResponseDto {
    const dto = new ResourceResponseDto();
    dto.id = resource.id;
    dto.parentId = resource.parentId;
    dto.createdAt = resource.createdAt;
    dto.updatedAt = resource.updatedAt;

    if (resource.file) {
      dto.type = "FILE";
      dto.name = resource.file.originalName;
      dto.url = `/uploads/files/${resource.file.filename}`;
      dto.mimeType = resource.file.mimeType;
      dto.size = resource.file.size;
    } else {
      dto.type = "FOLDER";
      dto.name = resource.folder?.name ?? "";
    }

    dto.slug = resource.slug;
    return dto;
  }
}
