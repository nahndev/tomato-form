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
import { SubmissionService } from "./submission.service";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";

@ApiTags("Submissions")
@Controller("submissions")
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiOperation({ summary: "Create a new submission" })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiResponse({ status: 201, description: "Submission created" })
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List submissions, optionally filtered by board" })
  @ApiQuery({ name: "boardId", required: false, type: String })
  @ApiResponse({ status: 200, description: "Submissions list" })
  findAll(@Query("boardId") boardId?: string) {
    return this.submissionService.findAll(boardId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a submission by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Submission found" })
  @ApiResponse({ status: 404, description: "Submission not found" })
  findOne(@Param("id") id: string) {
    return this.submissionService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a submission's data" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateSubmissionDto })
  @ApiResponse({ status: 200, description: "Submission updated" })
  @ApiResponse({ status: 404, description: "Submission not found" })
  update(@Param("id") id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a submission" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204, description: "Submission deleted" })
  @ApiResponse({ status: 404, description: "Submission not found" })
  async remove(@Param("id") id: string) {
    await this.submissionService.remove(id);
  }
}
