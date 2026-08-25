import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Submission } from "@/database/prisma-client";
import { Recipient, RecipientType } from "@/mail/recipient.types";
import { MailService } from "@/mail/mail.service";
import { UserService } from "@/user/user.service";
import {
  isPrismaForeignKeyError,
  isPrismaNotFoundError,
} from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { SendMailActionDto } from "./dto/send-mail-action.dto";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";

@Injectable()
export class SubmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    try {
      return await this.prisma.submission.create({
        data: {
          boardId: dto.boardId,
          templateVersionId: dto.templateVersionId,
          data: (dto.data ?? {}) as Prisma.InputJsonValue,
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

  private async resolveEmail(recipient: Recipient): Promise<string> {
    if (recipient.type === RecipientType.MAIL) {
      return recipient.value;
    }

    const user = await this.userService.findOne(recipient.value);
    if (!user.email) {
      throw new ConflictException(
        `User ${user.uuid} has no email configured`,
      );
    }
    return user.email;
  }
}
