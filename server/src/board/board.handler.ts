import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { JobRemovedEvent } from "../shared/events/job-removed.event";
import { BoardService } from "./board.service";

@Injectable()
export class BoardHandler {
  constructor(private readonly boardService: BoardService) {}

  @OnEvent(JobRemovedEvent.name)
  async handleJobRemoved(event: JobRemovedEvent): Promise<void> {
    await this.boardService.removeJobId(event.jobId);
  }
}
