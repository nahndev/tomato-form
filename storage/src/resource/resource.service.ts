import { isPrismaNotFoundError, isPrismaUniqueConstraintError } from "@/common/utils/prisma.util";
import { slugify } from "@/common/utils/slug.util";
import { PrismaService } from "@/database/prisma.service";
import { FileService } from "@/file/file.service";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ResourceWithRelations } from "./dto/resource-response.dto";

const RESOURCE_INCLUDE = { file: true, folder: true } as const;

@Injectable()
export class ResourceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async findChildren(parentId?: string, type?: "FILE" | "FOLDER"): Promise<ResourceWithRelations[]> {
    if (parentId) await this.findOne(parentId);

    return this.prisma.resource.findMany({
      where: {
        parentId: parentId ?? null,
        ...(type === "FILE" ? { file: { isNot: null } } : {}),
        ...(type === "FOLDER" ? { folder: { isNot: null } } : {}),
      },
      include: RESOURCE_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string): Promise<ResourceWithRelations> {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: RESOURCE_INCLUDE,
    });
    if (!resource) throw new NotFoundException(`Resource ${id} not found`);
    return resource;
  }

  async createFolder(name: string, parentId?: string): Promise<ResourceWithRelations> {
    await this.assertFolder(parentId);
    const slug = slugify(name);

    try {
      const resource = await this.prisma.resource.create({
        data: {
          parentId: parentId ?? null,
          slug,
          folder: { create: { name } },
        },
        include: RESOURCE_INCLUDE,
      });
      return resource;
    } catch (err) {
      if (isPrismaUniqueConstraintError(err)) {
        throw new ConflictException(`A resource named "${name}" already exists in this folder`);
      }
      throw err;
    }
  }

  async uploadFile(file: Express.Multer.File, parentId?: string): Promise<ResourceWithRelations> {
    await this.assertFolder(parentId);
    const slug = slugify(file.originalname);

    let resource;
    try {
      resource = await this.prisma.resource.create({
        data: { parentId: parentId ?? null, slug },
      });
    } catch (err) {
      if (isPrismaUniqueConstraintError(err)) {
        throw new ConflictException(`A resource named "${file.originalname}" already exists in this folder`);
      }
      throw err;
    }

    try {
      const created = await this.fileService.upload(file, resource.id);
      return { ...resource, file: created, folder: null };
    } catch (err) {
      await this.prisma.resource.delete({ where: { id: resource.id } }).catch(() => undefined);
      throw err;
    }
  }

  async move(id: string, parentId?: string | null): Promise<ResourceWithRelations> {
    const resource = await this.findOne(id);

    if (parentId) {
      if (parentId === id) throw new BadRequestException("A resource cannot be moved into itself");
      await this.assertFolder(parentId);
      await this.assertNotDescendant(id, parentId);
    }

    try {
      return await this.prisma.resource.update({
        where: { id: resource.id },
        data: { parentId: parentId ?? null },
        include: RESOURCE_INCLUDE,
      });
    } catch (err) {
      if (isPrismaUniqueConstraintError(err)) {
        throw new ConflictException("A resource with that name already exists in the target folder");
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const resource = await this.findOne(id);

    try {
      await this.prisma.resource.delete({ where: { id: resource.id } });
    } catch (err) {
      if (isPrismaNotFoundError(err)) throw new NotFoundException(`Resource ${id} not found`);
      throw err;
    }

    if (resource.file) await this.fileService.removeBlob(resource.file.id);
  }

  private async assertFolder(parentId?: string): Promise<void> {
    if (!parentId) return;
    const parent = await this.findOne(parentId);
    if (!parent.folder) throw new BadRequestException(`Resource ${parentId} is not a folder`);
  }

  private async assertNotDescendant(id: string, targetParentId: string): Promise<void> {
    let cursor: string | null = targetParentId;
    while (cursor) {
      if (cursor === id) {
        throw new ConflictException("Cannot move a folder into one of its own descendants");
      }
      const parent: { parentId: string | null } | null = await this.prisma.resource.findUnique({
        where: { id: cursor },
        select: { parentId: true },
      });
      cursor = parent?.parentId ?? null;
    }
  }
}
