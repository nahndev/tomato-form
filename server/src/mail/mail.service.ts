import { Injectable, Logger } from "@nestjs/common";

export interface SendMailOptions {
  to: string;
  subject: string;
  body: string;
}

// Mockup implementation: sending mail is not wired up to a real provider yet,
// so this only logs what would have been sent.
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendMail(options: SendMailOptions): Promise<void> {
    this.logger.log(
      `[MOCK] Sending mail to "${options.to}" — subject: "${options.subject}"`,
    );
    this.logger.debug(`[MOCK] Body: ${options.body}`);
  }
}
