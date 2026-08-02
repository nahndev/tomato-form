import { Injectable } from "@nestjs/common";
import { Action } from "@/database/prisma-client";
import { SubmissionService } from "../../../submission/submission.service";
import {
  ActionRunContext,
  ActionRunnerHandler,
} from "../action-runner.interface";

@Injectable()
export class SubmissionCreationActionRunner implements ActionRunnerHandler {
  constructor(private readonly submissionService: SubmissionService) {}

  async run(
    action: Action,
    _context: ActionRunContext,
  ): Promise<Record<string, unknown>> {
    const submission = await this.submissionService.create({
      boardId: action.boardId!,
      templateId: action.templateId!,
      data: {},
    });
    return { submissionId: submission.id };
  }
}
