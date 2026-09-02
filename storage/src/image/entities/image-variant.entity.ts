import { ImageVariantKind } from "@/database/prisma-client";

export { ImageVariantKind };

export interface ImageVariantProps {
  kind: ImageVariantKind;
  mimeType: string;
  size: number;
  width: number;
  height: number;
}

export function imageAssetPath(imageId: string, name: string, format: string): string {
  return `${imageId}/${name}.${format}`;
}

export class ImageVariant {
  readonly kind: ImageVariantKind;
  readonly mimeType: string;
  readonly size: number;
  readonly width: number;
  readonly height: number;

  constructor(props: ImageVariantProps) {
    this.kind = props.kind;
    this.mimeType = props.mimeType;
    this.size = props.size;
    this.width = props.width;
    this.height = props.height;
  }

  private get format(): string {
    return this.mimeType.split("/")[1] ?? "";
  }

  path(imageId: string): string {
    return imageAssetPath(imageId, this.kind.toLowerCase(), this.format);
  }

  url(imageId: string): string {
    return `/uploads/${this.path(imageId)}`;
  }

  static from(props: ImageVariantProps): ImageVariant {
    return new ImageVariant(props);
  }
}
