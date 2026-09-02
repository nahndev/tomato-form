-- CreateEnum
CREATE TYPE "ImageVariantKind" AS ENUM ('THUMBNAIL', 'MEDIUM', 'LARGE');

-- CreateTable
CREATE TABLE "image_variants" (
    "id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "kind" "ImageVariantKind" NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "image_variants_image_id_idx" ON "image_variants"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "image_variants_image_id_kind_key" ON "image_variants"("image_id", "kind");

-- AddForeignKey
ALTER TABLE "image_variants" ADD CONSTRAINT "image_variants_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
