import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Board } from "@/database/prisma-client";
import {
  isPrismaForeignKeyError,
  isPrismaNotFoundError,
} from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { JobService } from "../job/job.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";

@Injectable()
export class BoardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobService: JobService,
  ) {}

  async create(dto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
      data: {
        name: dto.name,
        templates: dto.templateIds
          ? { connect: dto.templateIds.map((id) => ({ id })) }
          : undefined,
      },
    });
  }

  async findAll(): Promise<Board[]> {
    return this.prisma.board.findMany();
  }

  async findOne(id: string): Promise<Board> {
    const doc = await this.prisma.board.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Board ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateBoardDto): Promise<Board> {
    try {
      return await this.prisma.board.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.templateIds
            ? {
                templates: {
                  set: dto.templateIds.map((templateId) => ({ id: templateId })),
                },
              }
            : {}),
        },
      });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`Board ${id} not found`);
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const jobs = await this.prisma.job.findMany({ where: { boardId: id } });
    for (const job of jobs) {
      await this.jobService.remove(job.id);
    }

    try {
      await this.prisma.board.delete({ where: { id } });
    } catch (err) {
      if (isPrismaForeignKeyError(err)) {
        throw new ConflictException(
          `Board ${id} cannot be deleted: still referenced by other jobs`,
        );
      }
      throw err;
    }
  }
}
