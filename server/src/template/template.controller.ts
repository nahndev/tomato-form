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
import { TemplateMigrationService } from "../template-migration/template-migration.service";
import { TemplateService } from "./template.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";

@ApiTags("Templates")
@Controller("templates")
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateMigrationService: TemplateMigrationService,
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

  @Post(":id/publish")
  @ApiOperation({
    summary:
      "Publish the template's current draft: fetches it from yjs-server, records it as a " +
      "TemplateMigration against the template's prior snapshot, and applies it immediately " +
      "(conflict detection isn't implemented yet, so there's never anything to resolve).",
  })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 201, description: "Published" })
  @ApiResponse({ status: 404, description: "Template not found" })
  @ApiResponse({ status: 409, description: "Nothing to publish - no draft exists for this template" })
  publish(@Param("id") id: string) {
    return this.templateMigrationService.publish(id);
  }
}
