import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ImageResponseDto } from "./dto/image-response.dto";
import { ImageService } from "./image.service";
import { MAX_UPLOAD_SIZE_BYTES, SUPPORTED_IMAGE_MIME_TYPES } from "./image.constants";

@ApiTags("Images")
@Controller("images")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload an image, resized on the server" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiCreatedResponse({
    type: ImageResponseDto,
    description: "Image uploaded and resized",
  })
  @ApiResponse({ status: 422, description: "Missing, oversized, or unsupported image file" })
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: SUPPORTED_IMAGE_MIME_TYPES })
        .addMaxSizeValidator({ maxSize: MAX_UPLOAD_SIZE_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ): Promise<ImageResponseDto> {
    const image = await this.imageService.upload(file);
    return ImageResponseDto.fromEntity(image);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get image metadata" })
  @ApiParam({ name: "id", description: "Image id" })
  @ApiOkResponse({ type: ImageResponseDto })
  @ApiResponse({ status: 404, description: "Image not found" })
  async findOne(@Param("id") id: string): Promise<ImageResponseDto> {
    const image = await this.imageService.findOne(id);
    return ImageResponseDto.fromEntity(image);
  }
}
