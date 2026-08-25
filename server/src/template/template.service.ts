import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Template } from "@/database/prisma-client";
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
          `Template ${id} cannot be deleted: still referenced by submissions`,
        );
      }
      throw err;
    }
  }
}
