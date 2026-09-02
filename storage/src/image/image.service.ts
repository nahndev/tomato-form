import { isPrismaNotFoundError } from "@/common/utils/prisma.util";
import { EnvironmentVariables } from "@/config/env.schema";
import { Image } from "@/database/prisma-client";
import { PrismaService } from "@/database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

@Injectable()
export class ImageService {
  private readonly uploadDir: string;
  private readonly maxWidth: number;
  private readonly maxHeight: number;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.uploadDir = configService.get("IMAGE_UPLOAD_DIR", { infer: true });
    this.maxWidth = configService.get("IMAGE_MAX_WIDTH", { infer: true });
    this.maxHeight = configService.get("IMAGE_MAX_HEIGHT", { infer: true });
  }

  async upload(file: Express.Multer.File): Promise<Image> {
    const resized = await sharp(file.buffer)
      .rotate()
      .resize({
        width: this.maxWidth,
        height: this.maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer({ resolveWithObject: true });

    const id = randomUUID();
    const filename = `${id}.${resized.info.format}`;

    await mkdir(this.uploadDir, { recursive: true });
    await writeFile(join(this.uploadDir, filename), resized.data);

    return this.prisma.image.create({
      data: {
        id,
        filename,
        mimeType: `image/${resized.info.format}`,
        size: resized.info.size,
        width: resized.info.width,
        height: resized.info.height,
      },
    });
  }

  async findOne(id: string): Promise<Image> {
    try {
      return await this.prisma.image.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (isPrismaNotFoundError(err)) {
        throw new NotFoundException(`Image ${id} not found`);
      }
      throw err;
    }
  }
}
