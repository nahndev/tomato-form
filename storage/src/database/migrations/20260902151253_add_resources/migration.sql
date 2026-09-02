-- Add the `resources` tree table, plus a `folders` table, and link `files`
-- into the tree (1:1 via `files.resource_id`). Every file/folder is a node
-- in `resources`; `files` and `folders` hold the type-specific data.

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resources_parent_id_idx" ON "resources"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "resources_parent_id_slug_key" ON "resources"("parent_id", "slug");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "folders" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "folders_resource_id_key" ON "folders"("resource_id");

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Link `files` into the tree: add the column, backfill a root resource row
-- per pre-existing file (reusing the file's own id as the resource id, since
-- the relationship is 1:1 and files.id is already unique), then enforce
-- NOT NULL/uniqueness/FK.
ALTER TABLE "files" ADD COLUMN "resource_id" TEXT;

INSERT INTO "resources" ("id", "slug", "parent_id", "created_at", "updated_at")
SELECT
  "id",
  trim(both '-' from lower(regexp_replace("original_name", '[^a-zA-Z0-9]+', '-', 'g'))) || '-' || left("id", 8),
  NULL,
  "created_at",
  "created_at"
FROM "files";

UPDATE "files" SET "resource_id" = "id";

ALTER TABLE "files" ALTER COLUMN "resource_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_resource_id_key" ON "files"("resource_id");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
