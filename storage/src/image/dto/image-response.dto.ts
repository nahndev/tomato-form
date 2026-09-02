import { ApiProperty } from "@nestjs/swagger";
import { Image } from "@/database/prisma-client";

export class ImageResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  filename!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: "File size in bytes, after resizing" })
  size!: number;

  @ApiProperty({ description: "Image width in pixels, after resizing" })
  width!: number;

  @ApiProperty({ description: "Image height in pixels, after resizing" })
  height!: number;

  @ApiProperty({ description: "Path the file is served from" })
  url!: string;

  static fromEntity(image: Image): ImageResponseDto {
    const dto = new ImageResponseDto();
    dto.id = image.id;
    dto.filename = image.filename;
    dto.mimeType = image.mimeType;
    dto.size = image.size;
    dto.width = image.width;
    dto.height = image.height;
    dto.url = `/uploads/${image.filename}`;
    return dto;
  }
}
