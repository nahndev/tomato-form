import { Injectable } from "@nestjs/common";
import { ActionRunnerHandler } from "./action-runner.interface";
import { ActionType } from "../schemas/action.schema";
import { SubmissionCreationActionRunner } from "./runners/submission-creation-action-runner.service";

@Injectable()
export class ActionRunnerRegistry {
  constructor(
    private readonly submissionCreationActionRunner: SubmissionCreationActionRunner,
  ) {}

  getRunner(type: ActionType): ActionRunnerHandler {
    switch (type) {
      case ActionType.SUBMISSION_CREATION:
        return this.submissionCreationActionRunner;
      default:
        throw new Error(`Unsupported action type: ${type}`);
    }
  }
}
