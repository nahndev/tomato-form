import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Submission } from "@/database/prisma-client";
import {
  isPrismaForeignKeyError,
  isPrismaNotFoundError,
} from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { UpdateSubmissionDto } from "./dto/update-submission.dto";

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    try {
      return await this.prisma.submission.create({
        data: {
          boardId: dto.boardId,
          templateId: dto.templateId,
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
}
