import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import {
  SUBMISSION_VALUES_CHANGED_EVENT,
  SubmissionValuesChangedEvent,
} from "./submission-value.contract";
import { SubmissionService } from "./submission.service";

@Controller()
export class SubmissionValueEventsController {
  private readonly logger = new Logger(SubmissionValueEventsController.name);

  constructor(private readonly submissionService: SubmissionService) {}

  @EventPattern(SUBMISSION_VALUES_CHANGED_EVENT)
  async onValuesChanged(
    @Payload() event: SubmissionValuesChangedEvent,
  ): Promise<void> {
    try {
      await this.submissionService.applyValuesChangedEvent(event);
    } catch (err) {
      this.logger.error(
        `Failed to apply values-changed event for submission ${event.submissionId}: ${(err as Error).message}`,
      );
    }
  }
}
