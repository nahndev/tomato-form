import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResolveTemplateMigrationDto } from "./dto/resolve-template-migration.dto";
import { TemplateMigrationService } from "./template-migration.service";

@ApiTags("Template Migrations")
@Controller("template-migrations")
export class TemplateMigrationController {
  constructor(private readonly templateMigrationService: TemplateMigrationService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get a template migration by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Template migration found" })
  @ApiResponse({ status: 404, description: "Template migration not found" })
  findOne(@Param("id") id: string) {
    return this.templateMigrationService.findOne(id);
  }

  @Post(":id/resolve")
  @ApiOperation({
    summary:
      "Submit answers to a template migration's conflicts, applying its snapshot to the template.",
  })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: ResolveTemplateMigrationDto })
  @ApiResponse({ status: 200, description: "Migration resolved and applied" })
  @ApiResponse({ status: 404, description: "Template migration not found" })
  @ApiResponse({ status: 409, description: "Template migration already resolved" })
  resolve(@Param("id") id: string, @Body() dto: ResolveTemplateMigrationDto) {
    return this.templateMigrationService.resolve(id, dto);
  }
}
