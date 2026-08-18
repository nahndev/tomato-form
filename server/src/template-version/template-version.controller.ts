import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TemplateVersionService } from "./template-version.service";

@ApiTags("Template Versions")
@Controller("template-versions")
export class TemplateVersionController {
  constructor(private readonly templateVersionService: TemplateVersionService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get a template version by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Template version found" })
  @ApiResponse({ status: 404, description: "Template version not found" })
  findOne(@Param("id") id: string) {
    return this.templateVersionService.findOne(id);
  }
}
