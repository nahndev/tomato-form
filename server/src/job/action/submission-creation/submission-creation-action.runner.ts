import { Injectable } from "@nestjs/common";
import { Action } from "@/database/prisma-client";
import { TemplateVersionService } from "../../../template-version/template-version.service";
import { SubmissionService } from "../../../submission/submission.service";
import {
  ActionRunContext,
  ActionRunnerHandler,
} from "../action-runner.interface";

@Injectable()
export class SubmissionCreationActionRunner implements ActionRunnerHandler {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly templateVersionService: TemplateVersionService,
  ) {}

  async run(
    action: Action,
    _context: ActionRunContext,
  ): Promise<Record<string, unknown>> {
    const templateVersion = await this.templateVersionService.findLatestByTemplateId(
      action.templateId!,
    );
    const submission = await this.submissionService.create({
      boardId: action.boardId!,
      templateVersionId: templateVersion.id,
      data: {},
    });
    return { submissionId: submission.id };
  }
}
