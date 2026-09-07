import { Prisma, Submission } from "@/database/prisma-client";
import { SubmissionDisplayService } from "@/display/submission-display.service";
import { MailService } from "@/mail/mail.service";
import { Recipient, RecipientType } from "@/mail/recipient.types";
import { SubmissionSearchService } from "@/search/submission-search.service";
import type { TemplateVersionSnapshot } from "@/template/template.types";
import { UserService } from "@/user/user.service";
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  isPrismaForeignKeyError,
  isPrismaNotFoundError,
} from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { SendMailActionDto } from "./dto/send-mail-action.dto";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";
import { SubmissionValuesChangedEvent } from "./submission-value.contract";

@Injectable()
export class SubmissionService {
  private readonly logger = new Logger(SubmissionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly submissionSearchService: SubmissionSearchService,
    private readonly submissionDisplayService: SubmissionDisplayService,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    const templateVersion = await this.prisma.templateVersion.findUnique({
      where: { id: dto.templateVersionId },
      select: { snapshot: true },
    });
    if (!templateVersion) {
      throw new ConflictException(
        "Submission references a board or template that does not exist",
      );
    }

    const data = dto.data ?? {};
    const snapshot =
      templateVersion.snapshot as unknown as TemplateVersionSnapshot;
    const dataDisplays = this.submissionDisplayService.buildDisplayDoc(
      { data },
      snapshot,
    );

    try {
      return await this.prisma.submission.create({
        data: {
          boardId: dto.boardId,
          templateVersionId: dto.templateVersionId,
          data: data as Prisma.InputJsonValue,
          dataDisplays: dataDisplays as Prisma.InputJsonValue,
        },
      });
    } catch (err) {
      if (isPrismaForeignKeyError(err)) {
        throw new ConflictException(
          "Submission references a board or template that does not exist",
        );
      }
      throw err;
    }
  }

  async findAll(boardId?: string): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: boardId ? { boardId } : undefined,
    });
  }

  async findOne(id: string): Promise<Submission> {
    const doc = await this.prisma.submission.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Submission ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateSubmissionDto): Promise<Submission> {
    try {
      return await this.prisma.submission.update({
        where: { id },
        data: {
          ...(dto.data !== undefined
            ? { data: dto.data as Prisma.InputJsonValue }
            : {}),
        },
      });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`Submission ${id} not found`);
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.submission.delete({ where: { id } });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`Submission ${id} not found`);
      throw err;
    }
  }

  /** Sends mail on behalf of a `button` widget's `mail` action. */
  async sendMail(id: string, dto: SendMailActionDto): Promise<void> {
    await this.findOne(id);

    const recipients = await Promise.all(
      dto.recipients.map((recipient) => this.resolveEmail(recipient)),
    );

    for (const email of recipients) {
      await this.mailService.sendMail({
        to: email,
        subject: dto.subject,
        body: dto.body,
      });
    }
  }

  /**
   * Handles yjs-server's `SUBMISSION_VALUES_CHANGED_EVENT`, merging values
   * into `data` and `dataClocks`, and recomputing `dataDisplays` from the
   * result. A key is only applied when its clock is newer than the one last
   * applied for that key, so an out-of-order delivery can't clobber a more
   * recent value.
   */
  async applyValuesChangedEvent(
    event: SubmissionValuesChangedEvent,
  ): Promise<void> {
    const submission = await this.prisma.submission.findUnique({
      where: { id: event.submissionId },
      select: {
        data: true,
        dataClocks: true,
        templateVersion: { select: { snapshot: true } },
      },
    });
    if (!submission) {
      this.logger.warn(
        `Submission ${event.submissionId} not found for values-changed event`,
      );
      return;
    }

    const data = { ...(submission.data as Record<string, unknown>) };
    const clocks = { ...(submission.dataClocks as Record<string, number>) };

    let changed = false;
    for (const [key, entry] of Object.entries(event.values)) {
      if (clocks[key] !== undefined && clocks[key] === entry.clock) continue;
      data[key] = entry.value;
      clocks[key] = entry.clock;
      changed = true;
    }

    if (!changed) return;

    const snapshot = submission.templateVersion
      .snapshot as unknown as TemplateVersionSnapshot;
    const widgets = snapshot.widgets ?? {};
    const dataDisplays = this.submissionDisplayService.buildDisplayDoc(
      { data },
      snapshot,
    );

    console.log(dataDisplays);
    await this.prisma.submission.update({
      where: { id: event.submissionId },
      data: {
        data: data as Prisma.InputJsonValue,
        dataClocks: clocks as Prisma.InputJsonValue,
        dataDisplays: dataDisplays as Prisma.InputJsonValue,
      },
    });

    await this.submissionSearchService.indexSubmission(
      event.submissionId,
      data,
      widgets,
    );
  }

  private async resolveEmail(recipient: Recipient): Promise<string> {
    if (recipient.type === RecipientType.MAIL) {
      return recipient.value;
    }

    const user = await this.userService.findOne(recipient.value);
    if (!user.email) {
      throw new ConflictException(`User ${user.uuid} has no email configured`);
    }
    return user.email;
  }
}
