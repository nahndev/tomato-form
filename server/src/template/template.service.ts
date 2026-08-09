import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Template } from "@/database/prisma-client";
import {
  isPrismaForeignKeyError,
  isPrismaNotFoundError,
} from "../common/utils/prisma.util";
import { PrismaService } from "../database/prisma.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTemplateDto): Promise<Template> {
    return this.prisma.template.create({
      data: {
        name: dto.name,
        widgets: (dto.widgets ?? {}) as unknown as Prisma.InputJsonValue,
        layouts: (dto.layouts ?? {}) as unknown as Prisma.InputJsonValue,
        widgetToSession: (dto.widgetToSession ??
          {}) as unknown as Prisma.InputJsonValue,
        properties: (dto.properties ?? {}) as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async findAll(): Promise<Template[]> {
    return this.prisma.template.findMany({
      include: { templateVersions: true },
    });
  }

  async findOne(id: string): Promise<Template> {
    const doc = await this.prisma.template.findUnique({
      where: { id },
      include: { templateVersions: true },
    });
    if (!doc) throw new NotFoundException(`Template ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    try {
      return await this.prisma.template.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.widgets !== undefined
            ? { widgets: dto.widgets as unknown as Prisma.InputJsonValue }
            : {}),
          ...(dto.layouts !== undefined
            ? { layouts: dto.layouts as unknown as Prisma.InputJsonValue }
            : {}),
          ...(dto.widgetToSession !== undefined
            ? {
                widgetToSession: dto.widgetToSession as unknown as Prisma.InputJsonValue,
              }
            : {}),
          ...(dto.properties !== undefined
            ? {
                properties: dto.properties as unknown as Prisma.InputJsonValue,
              }
            : {}),
        },
      });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`Template ${id} not found`);
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.template.delete({ where: { id } });
    } catch (err) {
      if (isPrismaNotFoundError(err))
        throw new NotFoundException(`Template ${id} not found`);
      if (isPrismaForeignKeyError(err)) {
        throw new ConflictException(
          `Template ${id} cannot be deleted: still referenced by submissions or job actions`,
        );
      }
      throw err;
    }
  }
}
