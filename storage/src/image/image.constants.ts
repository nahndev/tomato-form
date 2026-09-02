import type { FitEnum } from "sharp";
import { ImageVariantKind } from "./entities/image-variant.entity";

export const SUPPORTED_IMAGE_MIME_TYPES = /^(image\/jpeg|image\/png|image\/webp|image\/gif)$/;

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

export interface ImageVariantPreset {
  width: number;
  height: number;
  fit: keyof FitEnum;
}

export const IMAGE_VARIANT_PRESETS: Record<ImageVariantKind, ImageVariantPreset> = {
  [ImageVariantKind.THUMBNAIL]: { width: 150, height: 150, fit: "cover" },
  [ImageVariantKind.MEDIUM]: { width: 600, height: 600, fit: "inside" },
  [ImageVariantKind.LARGE]: { width: 1200, height: 1200, fit: "inside" },
};
