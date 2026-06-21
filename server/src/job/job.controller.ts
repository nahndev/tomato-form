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
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobService } from "./job.service";

@ApiTags("Jobs")
@Controller("jobs")
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ApiOperation({ summary: "Create a new job" })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, description: "Job created" })
  @ApiResponse({ status: 400, description: "Invalid cron expression" })
  create(@Body() dto: CreateJobDto) {
    return this.jobService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List jobs, optionally filtered by board" })
  @ApiQuery({ name: "boardId", required: false, type: String })
  @ApiResponse({ status: 200, description: "Jobs list" })
  findAll(@Query("boardId") boardId?: string) {
    return this.jobService.findAll(boardId);
  }

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
