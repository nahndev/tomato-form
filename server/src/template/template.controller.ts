import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TemplateVersionService } from "../template-version/template-version.service";
import { TemplateService } from "./template.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";

@ApiTags("Templates")
@Controller("templates")
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateVersionService: TemplateVersionService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new template" })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({ status: 201, description: "Template created" })
  create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all templates" })
  @ApiResponse({ status: 200, description: "Templates list" })
  findAll() {
    return this.templateService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a template by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Template found" })
  @ApiResponse({ status: 404, description: "Template not found" })
  findOne(@Param("id") id: string) {
    return this.templateService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a template" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({ status: 200, description: "Template updated" })
  @ApiResponse({ status: 404, description: "Template not found" })
  update(@Param("id") id: string, @Body() dto: UpdateTemplateDto) {
    return this.templateService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a template" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204, description: "Template deleted" })
  @ApiResponse({ status: 404, description: "Template not found" })
  async remove(@Param("id") id: string) {
    await this.templateService.remove(id);
  }

  @Post(":id/versions")
  @ApiOperation({
    summary: "Publish the current draft as a new template version",
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 201, description: "Template version published" })
  @ApiResponse({ status: 404, description: "Template not found" })
  @ApiResponse({ status: 422, description: "No draft to publish" })
  @ApiResponse({ status: 503, description: "yjs-server unavailable" })
  publishVersion(@Param("id") id: string) {
    return this.templateVersionService.publish(id);
  }
}
