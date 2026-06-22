import { Injectable } from "@nestjs/common";
import { MailService } from "../../../mail/mail.service";
import { UserService } from "../../../user/user.service";
import {
  ActionRunContext,
  ActionRunnerHandler,
} from "../action-runner.interface";
import { Recipient, RecipientType, SendMailAction } from "./send-mail-action.schema";

@Injectable()
export class SendMailActionRunner implements ActionRunnerHandler<SendMailAction> {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async run(
    action: SendMailAction,
    _context: ActionRunContext,
  ): Promise<Record<string, unknown>> {
    const recipients = await Promise.all(
      action.recipients.map((recipient) => this.resolveEmail(recipient)),
    );

    for (const email of recipients) {
      await this.mailService.sendMail({
        to: email,
        subject: action.content.subject,
        body: action.content.body,
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
