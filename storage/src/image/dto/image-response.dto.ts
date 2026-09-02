import { ApiProperty } from "@nestjs/swagger";
import { ImageVariantKind } from "../entities/image-variant.entity";
import { StoredImage } from "../image.service";

export class ImageVariantResponseDto {
  @ApiProperty({ enum: ImageVariantKind })
  kind!: ImageVariantKind;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: "File size in bytes" })
  size!: number;

  @ApiProperty({ description: "Variant width in pixels" })
  width!: number;

  @ApiProperty({ description: "Variant height in pixels" })
  height!: number;

  @ApiProperty({ description: "Path the variant is served from" })
  url!: string;
}

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

  @ApiProperty({ type: [ImageVariantResponseDto], description: "Generated size variants" })
  variants!: ImageVariantResponseDto[];

  static fromEntity(image: StoredImage): ImageResponseDto {
    const dto = new ImageResponseDto();
    dto.id = image.id;
    dto.filename = image.filename;
    dto.mimeType = image.mimeType;
    dto.size = image.size;
    dto.width = image.width;
    dto.height = image.height;
    dto.url = `/uploads/${image.filename}`;
    dto.variants = image.variants.map((variant) => {
      const variantDto = new ImageVariantResponseDto();
      variantDto.kind = variant.kind;
      variantDto.mimeType = variant.mimeType;
      variantDto.size = variant.size;
      variantDto.width = variant.width;
      variantDto.height = variant.height;
      variantDto.url = variant.url(image.id);
      return variantDto;
    });
    return dto;
  }
}
