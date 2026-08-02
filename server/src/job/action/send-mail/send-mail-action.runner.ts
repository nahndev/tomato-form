import { Injectable } from "@nestjs/common";
import { Action } from "@/database/prisma-client";
import { MailService } from "../../../mail/mail.service";
import { UserService } from "../../../user/user.service";
import {
  ActionRunContext,
  ActionRunnerHandler,
} from "../action-runner.interface";
import {
  Recipient,
  RecipientType,
  SendMailPayload,
} from "./send-mail-action.types";

@Injectable()
export class SendMailActionRunner implements ActionRunnerHandler {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async run(
    action: Action,
    _context: ActionRunContext,
  ): Promise<Record<string, unknown>> {
    const payload = action.payload as unknown as SendMailPayload;

    const recipients = await Promise.all(
      payload.recipients.map((recipient) => this.resolveEmail(recipient)),
    );

    for (const email of recipients) {
      await this.mailService.sendMail({
        to: email,
        subject: payload.content.subject,
        body: payload.content.body,
      });
    }

    return { recipients };
  }

  private async resolveEmail(recipient: Recipient): Promise<string> {
    if (recipient.type === RecipientType.MAIL) {
      return recipient.value;
    }

    const user = await this.userService.findOne(recipient.value);
    if (!user.email) {
      throw new Error(`User ${user.uuid} has no email configured`);
    }
    return user.email;
  }
}
