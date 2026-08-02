import { Injectable } from "@nestjs/common";
import { ActionType } from "@/database/prisma-client";
import { ActionRunnerHandler } from "./action-runner.interface";
import { SubmissionCreationActionRunner } from "./submission-creation/submission-creation-action.runner";
import { SendMailActionRunner } from "./send-mail/send-mail-action.runner";

@Injectable()
export class ActionRunnerRegistry {
  constructor(
    private readonly submissionCreationActionRunner: SubmissionCreationActionRunner,
    private readonly sendMailActionRunner: SendMailActionRunner,
  ) {}

  getRunner(type: ActionType): ActionRunnerHandler {
    switch (type) {
      case ActionType.SUBMISSION_CREATION:
        return this.submissionCreationActionRunner;
      case ActionType.SEND_MAIL:
        return this.sendMailActionRunner;
      default:
        throw new Error(`Unsupported action type: ${type}`);
    }
  }
}
