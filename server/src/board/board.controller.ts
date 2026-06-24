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
import { CreateJobDto } from "../job/dto/create-job.dto";
import { JobService } from "../job/job.service";
import { BoardService } from "./board.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";

@ApiTags("Boards")
@Controller("boards")
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly jobService: JobService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new board" })
  @ApiBody({ type: CreateBoardDto })
  @ApiResponse({ status: 201, description: "Board created" })
  create(@Body() dto: CreateBoardDto) {
    return this.boardService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all boards" })
  @ApiResponse({ status: 200, description: "Boards list" })
  findAll() {
    return this.boardService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a board by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Board found" })
  @ApiResponse({ status: 404, description: "Board not found" })
  findOne(@Param("id") id: string) {
    return this.boardService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a board" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateBoardDto })
  @ApiResponse({ status: 200, description: "Board updated" })
  @ApiResponse({ status: 404, description: "Board not found" })
  update(@Param("id") id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a board" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 204, description: "Board deleted" })
  @ApiResponse({ status: 404, description: "Board not found" })
  async remove(@Param("id") id: string) {
    await this.boardService.remove(id);
  }

  @Post(":boardId/jobs")
  @ApiOperation({ summary: "Create a job for a board" })
  @ApiParam({ name: "boardId", type: String })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, description: "Job created" })
  @ApiResponse({ status: 400, description: "Invalid cron expression" })
  @ApiResponse({ status: 404, description: "Board not found" })
  async createJob(
    @Param("boardId") boardId: string,
    @Body() dto: CreateJobDto,
  ) {
    await this.boardService.findOne(boardId);
    const job = await this.jobService.create(dto);
    await this.boardService.addJobId(boardId, job.id);
    return job;
  }

  @Get(":boardId/jobs")
  @ApiOperation({ summary: "List jobs for a board" })
  @ApiParam({ name: "boardId", type: String })
  @ApiResponse({ status: 200, description: "Jobs list" })
  @ApiResponse({ status: 404, description: "Board not found" })
  async findJobs(@Param("boardId") boardId: string) {
    const board = await this.boardService.findOne(boardId);
    return this.jobService.findByIds(board.jobIds);
  }
}
