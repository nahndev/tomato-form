import { isPrismaNotFoundError } from "@/common/utils/prisma.util";
import { EnvironmentVariables } from "@/config/env.schema";
import { File } from "@/database/prisma-client";
import { PrismaService } from "@/database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

@Injectable()
export class FileService {
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.uploadDir = configService.get("FILE_UPLOAD_DIR", { infer: true });
  }

  async upload(file: Express.Multer.File): Promise<File> {
    const id = randomUUID();
    const filename = `${id}/${file.originalname}`;

    await mkdir(join(this.uploadDir, "files", id), { recursive: true });
    await writeFile(this.assetFsPath(filename), file.buffer);

    return this.prisma.file.create({
      data: {
        id,
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  }

  async findAll(): Promise<File[]> {
    return this.prisma.file.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string): Promise<File> {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File ${id} not found`);
    return file;
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.file.delete({ where: { id } });
    } catch (err) {
      if (isPrismaNotFoundError(err)) throw new NotFoundException(`File ${id} not found`);
      throw err;
    }

    await rm(join(this.uploadDir, "files", id), { recursive: true, force: true });
  }

  private assetFsPath(relativePath: string): string {
    return join(this.uploadDir, "files", relativePath);
  }
}
