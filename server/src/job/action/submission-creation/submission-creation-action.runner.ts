import { Injectable } from "@nestjs/common";
import { SubmissionService } from "../../../submission/submission.service";
import {
  ActionRunContext,
  ActionRunnerHandler,
} from "../action-runner.interface";
import { SubmissionCreationAction } from "./submission-creation-action.schema";

@Injectable()
export class SubmissionCreationActionRunner implements ActionRunnerHandler<SubmissionCreationAction> {
  constructor(private readonly submissionService: SubmissionService) {}

  async run(
    action: SubmissionCreationAction,
    _context: ActionRunContext,
  ): Promise<Record<string, unknown>> {
    const submission = await this.submissionService.create({
      boardId: action.boardId,
      templateId: action.templateId,
      data: {},
    });
    return { submissionId: submission.id };
  }
}
