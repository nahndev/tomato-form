import { Board, Prisma } from "@/database/prisma-client";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  isPrismaForeignKeyError,
  isPrismaNotFoundError,
} from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
      data: {
        name: dto.name,
        templateVersions: dto.templateVersionIds
          ? { connect: dto.templateVersionIds.map((id) => ({ id })) }
          : undefined,
        columns: (dto.columns ?? []) as unknown as Prisma.InputJsonValue,
      },
      include: {
        templateVersions: { include: { template: true } },
      },
    });
  }

  async findAll(): Promise<Board[]> {
    return this.prisma.board.findMany({
      include: { templateVersions: { include: { template: true } } },
    });
  }

  async findOne(id: string): Promise<Board> {
    const doc = await this.prisma.board.findUnique({
      where: { id },
      include: { templateVersions: { include: { template: true } } },
    });
    if (!doc) throw new NotFoundException(`Board ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateBoardDto): Promise<Board> {
    try {
      return await this.prisma.board.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.templateVersionIds
            ? {
                templateVersions: {
                  set: dto.templateVersionIds.map((id) => ({ id })),
                },
              }
            : {}),
          ...(dto.columns !== undefined
            ? { columns: dto.columns as unknown as Prisma.InputJsonValue }
            : {}),
        },
        include: {
          templateVersions: { include: { template: true } },
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

    try {
      await this.prisma.board.delete({ where: { id } });
    } catch (err) {
      if (isPrismaForeignKeyError(err)) {
        throw new ConflictException(
          `Board ${id} cannot be deleted: still referenced by other records`,
        );
      }
      throw err;
    }
  }
}
