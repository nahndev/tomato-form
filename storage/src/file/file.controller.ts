import {
  Controller,
  Delete,
  Get,
  HttpCode,
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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileResponseDto } from "./dto/file-response.dto";
import { MAX_UPLOAD_SIZE_BYTES } from "./file.constants";
import { FileService } from "./file.service";

@ApiTags("Files")
@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiCreatedResponse({ type: FileResponseDto, description: "File uploaded" })
  @ApiResponse({ status: 422, description: "Missing or oversized file" })
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_UPLOAD_SIZE_BYTES })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    const created = await this.fileService.upload(file);
    return FileResponseDto.fromEntity(created);
  }

  @Get()
  @ApiOperation({ summary: "List uploaded files" })
  @ApiOkResponse({ type: [FileResponseDto], description: "Files list" })
  async findAll(): Promise<FileResponseDto[]> {
    const files = await this.fileService.findAll();
    return files.map((file) => FileResponseDto.fromEntity(file));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get file metadata" })
  @ApiParam({ name: "id", description: "File id" })
  @ApiOkResponse({ type: FileResponseDto })
  @ApiResponse({ status: 404, description: "File not found" })
  async findOne(@Param("id") id: string): Promise<FileResponseDto> {
    const file = await this.fileService.findOne(id);
    return FileResponseDto.fromEntity(file);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a file" })
  @ApiParam({ name: "id", description: "File id" })
  @ApiNoContentResponse({ description: "File deleted" })
  @ApiResponse({ status: 404, description: "File not found" })
  async remove(@Param("id") id: string): Promise<void> {
    await this.fileService.remove(id);
  }
}
