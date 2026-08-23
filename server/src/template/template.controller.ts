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
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary:
      "Request that the current draft be published as a new template version. " +
      "Fire-and-forget: the version is created asynchronously once yjs-server confirms it, and isn't returned here.",
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 202, description: "Publish requested" })
  @ApiResponse({ status: 404, description: "Template not found" })
  async publishVersion(@Param("id") id: string): Promise<void> {
    await this.templateVersionService.publish(id);
  }
}
