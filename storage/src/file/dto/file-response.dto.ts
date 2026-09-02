import { File } from "@/database/prisma-client";
import { ApiProperty } from "@nestjs/swagger";

export class FileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: "Original filename as uploaded" })
  originalName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: "File size in bytes" })
  size!: number;

  @ApiProperty({ description: "Path the file is served from" })
  url!: string;

  @ApiProperty()
  createdAt!: Date;

  static fromEntity(file: File): FileResponseDto {
    const dto = new FileResponseDto();
    dto.id = file.id;
    dto.originalName = file.originalName;
    dto.mimeType = file.mimeType;
    dto.size = file.size;
    dto.url = `/uploads/files/${file.filename}`;
    dto.createdAt = file.createdAt;
    return dto;
  }
}
