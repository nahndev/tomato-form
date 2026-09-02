import { isPrismaNotFoundError } from "@/common/utils/prisma.util";
import { EnvironmentVariables } from "@/config/env.schema";
import { Image, ImageVariant as ImageVariantRecord } from "@/database/prisma-client";
import { PrismaService } from "@/database/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { ImageVariant, ImageVariantKind, imageAssetPath } from "./entities/image-variant.entity";
import { IMAGE_VARIANT_PRESETS } from "./image.constants";

export interface StoredImage extends Image {
  variants: ImageVariant[];
}

type ImageWithVariantRecords = Image & { variants: ImageVariantRecord[] };

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

  async upload(file: Express.Multer.File): Promise<StoredImage> {
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
    const filename = imageAssetPath(id, "original", resized.info.format);

    await mkdir(join(this.uploadDir, "images", id), { recursive: true });
    await writeFile(this.assetFsPath(filename), resized.data);

    const variants = await this.createVariants(id, resized.data);

    const image = await this.prisma.image.create({
      data: {
        id,
        filename,
        mimeType: `image/${resized.info.format}`,
        size: resized.info.size,
        width: resized.info.width,
        height: resized.info.height,
        variants: {
          create: variants.map((variant) => ({
            kind: variant.kind,
            mimeType: variant.mimeType,
            size: variant.size,
            width: variant.width,
            height: variant.height,
          })),
        },
      },
      include: { variants: true },
    });

    return toStoredImage(image);
  }

  async findOne(id: string): Promise<StoredImage> {
    try {
      const image = await this.prisma.image.findUniqueOrThrow({
        where: { id },
        include: { variants: true },
      });
      return toStoredImage(image);
    } catch (err) {
      if (isPrismaNotFoundError(err)) {
        throw new NotFoundException(`Image ${id} not found`);
      }
      throw err;
    }
  }

  private async createVariants(id: string, source: Buffer): Promise<ImageVariant[]> {
    return Promise.all(
      (
        Object.entries(IMAGE_VARIANT_PRESETS) as Array<
          [ImageVariantKind, (typeof IMAGE_VARIANT_PRESETS)[ImageVariantKind]]
        >
      ).map(async ([kind, preset]) => {
        const resized = await sharp(source)
          .resize({
            width: preset.width,
            height: preset.height,
            fit: preset.fit,
            withoutEnlargement: true,
          })
          .toBuffer({ resolveWithObject: true });

        const variant = new ImageVariant({
          kind,
          mimeType: `image/${resized.info.format}`,
          size: resized.info.size,
          width: resized.info.width,
          height: resized.info.height,
        });

        await writeFile(this.assetFsPath(variant.path(id)), resized.data);

        return variant;
      }),
    );
  }

  private assetFsPath(relativePath: string): string {
    return join(this.uploadDir, "images", relativePath);
  }
}

function toStoredImage(image: ImageWithVariantRecords): StoredImage {
  return { ...image, variants: image.variants.map((record) => ImageVariant.from(record)) };
}
