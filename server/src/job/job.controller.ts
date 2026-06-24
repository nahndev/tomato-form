import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobService } from "./job.service";

@ApiTags("Jobs")
@Controller("jobs")
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get a job by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Job found" })
  @ApiResponse({ status: 404, description: "Job not found" })
  findOne(@Param("id") id: string) {
    return this.jobService.findOne(id);
  }

  @Get(":id/executions")
  @ApiOperation({ summary: "List execution history for a job" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Job execution history" })
  @ApiResponse({ status: 404, description: "Job not found" })
  findExecutions(@Param("id") id: string) {
    return this.jobService.findExecutions(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a job" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({ status: 200, description: "Job updated" })
  @ApiResponse({ status: 400, description: "Invalid cron expression" })
  @ApiResponse({ status: 404, description: "Job not found" })
  update(@Param("id") id: string, @Body() dto: UpdateJobDto) {
    return this.jobService.update(id, dto);
  }

  @Patch(":id/activate")
  @ApiOperation({ summary: "Activate a job" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Job activated" })
  @ApiResponse({ status: 404, description: "Job not found" })
  activate(@Param("id") id: string) {
    return this.jobService.setEnabled(id, true);
  }

  @Patch(":id/deactivate")
  @ApiOperation({ summary: "Deactivate a job" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Job deactivated" })
  @ApiResponse({ status: 404, description: "Job not found" })
  deactivate(@Param("id") id: string) {
    return this.jobService.setEnabled(id, false);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a job" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204, description: "Job deleted" })
  @ApiResponse({ status: 404, description: "Job not found" })
  async remove(@Param("id") id: string) {
    await this.jobService.remove(id);
  }
}
