import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { MAX_UPLOAD_SIZE_BYTES } from "@/file/file.constants";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { ListResourcesQueryDto } from "./dto/list-resources-query.dto";
import { MoveResourceDto } from "./dto/move-resource.dto";
import { ResourceResponseDto } from "./dto/resource-response.dto";
import { UploadFileDto } from "./dto/upload-file.dto";
import { ResourceService } from "./resource.service";

@ApiTags("Resources")
@Controller("resources")
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  @ApiOperation({ summary: "List direct children of a folder (root when parentId is omitted)" })
  @ApiOkResponse({ type: [ResourceResponseDto] })
  @ApiResponse({ status: 404, description: "Parent folder not found" })
  async findChildren(@Query() query: ListResourcesQueryDto): Promise<ResourceResponseDto[]> {
    const resources = await this.resourceService.findChildren(query.parentId, query.type);
    return resources.map((resource) => ResourceResponseDto.fromEntity(resource));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get resource metadata" })
  @ApiParam({ name: "id", description: "Resource id" })
  @ApiOkResponse({ type: ResourceResponseDto })
  @ApiResponse({ status: 404, description: "Resource not found" })
  async findOne(@Param("id") id: string): Promise<ResourceResponseDto> {
    const resource = await this.resourceService.findOne(id);
    return ResourceResponseDto.fromEntity(resource);
  }

  @Post("folders")
  @ApiOperation({ summary: "Create a folder" })
  @ApiCreatedResponse({ type: ResourceResponseDto, description: "Folder created" })
  @ApiResponse({ status: 400, description: "Parent is not a folder" })
  @ApiResponse({ status: 404, description: "Parent folder not found" })
  @ApiConflictResponse({ description: "A resource with that name already exists in the parent" })
  async createFolder(@Body() dto: CreateFolderDto): Promise<ResourceResponseDto> {
    const resource = await this.resourceService.createFolder(dto.name, dto.parentId);
    return ResourceResponseDto.fromEntity(resource);
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload a file into the resource tree" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        parentId: { type: "string", description: "Parent folder id, omit for root" },
      },
    },
  })
  @ApiCreatedResponse({ type: ResourceResponseDto, description: "File uploaded" })
  @ApiResponse({ status: 400, description: "Parent is not a folder" })
  @ApiResponse({ status: 404, description: "Parent folder not found" })
  @ApiResponse({ status: 422, description: "Missing or oversized file" })
  @ApiConflictResponse({ description: "A resource with that name already exists in the parent" })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_UPLOAD_SIZE_BYTES })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ): Promise<ResourceResponseDto> {
    const resource = await this.resourceService.uploadFile(file, dto.parentId);
    return ResourceResponseDto.fromEntity(resource);
  }

  @Patch(":id/move")
  @ApiOperation({ summary: "Move a resource to another parent folder" })
  @ApiParam({ name: "id", description: "Resource id" })
  @ApiOkResponse({ type: ResourceResponseDto })
  @ApiResponse({ status: 400, description: "Target is not a folder, or resource moved into itself" })
  @ApiResponse({ status: 404, description: "Resource or target folder not found" })
  @ApiConflictResponse({ description: "Name conflict in target folder, or move creates a cycle" })
  async move(
    @Param("id") id: string,
    @Body() dto: MoveResourceDto,
  ): Promise<ResourceResponseDto> {
    const resource = await this.resourceService.move(id, dto.parentId);
    return ResourceResponseDto.fromEntity(resource);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a resource (folders cascade to their contents)" })
  @ApiParam({ name: "id", description: "Resource id" })
  @ApiNoContentResponse({ description: "Resource deleted" })
  @ApiResponse({ status: 404, description: "Resource not found" })
  async remove(@Param("id") id: string): Promise<void> {
    await this.resourceService.remove(id);
  }
}
