import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport } from "nodemailer";

export interface SendMailOptions {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: ReturnType<typeof createTransport>;
  private readonly mailFrom: string;

  constructor(configService: ConfigService) {
    this.mailFrom = configService.getOrThrow<string>("MAIL_FROM");
    this.transporter = createTransport({
      host: configService.getOrThrow<string>("SMTP_HOST"),
      port: configService.getOrThrow<number>("SMTP_PORT"),
    });
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
    } catch (error) {
      this.logger.error(
        "Mail service connection check failed",
        error instanceof Error ? error.stack : error,
      );
      return false;
    }

    try {
      await this.sendMail({
        to: this.mailFrom,
        subject: "Mail service health check",
        body: `Health check performed at ${new Date().toISOString()}`,
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.mailFrom,
        to: options.to,
        subject: options.subject,
        text: options.body,
      });
      this.logger.log(
        `Sent mail to "${options.to}" — subject: "${options.subject}"`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send mail to "${options.to}"`,
        error instanceof Error ? error.stack : error,
      );
      throw error;
    }
  }
}
