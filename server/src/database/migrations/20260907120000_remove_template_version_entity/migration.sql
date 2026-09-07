-- Removes TemplateVersion: Template now holds its current published
-- version/snapshot directly, and Board/Submission link straight to
-- Template instead of a specific version. Publishing is replaced by a
-- synchronous flow that records a TemplateMigration (old + new snapshot,
-- plus conflicts to resolve) instead of appending a new version row.
--
-- All data in this domain is test data (per TASK.md) - wiped clean rather
-- than migrated across the entity change. "users" is untouched.
TRUNCATE TABLE "submissions", "boards", "templates", "template_versions" CASCADE;

-- DropForeignKey
ALTER TABLE "_BoardTemplateVersions" DROP CONSTRAINT "_BoardTemplateVersions_A_fkey";

-- DropForeignKey
ALTER TABLE "_BoardTemplateVersions" DROP CONSTRAINT "_BoardTemplateVersions_B_fkey";

-- DropTable
DROP TABLE "_BoardTemplateVersions";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_template_version_id_fkey";

-- DropIndex
DROP INDEX "submissions_template_version_id_idx";

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "template_version_id",
    ADD COLUMN "template_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "submissions_template_id_idx" ON "submissions"("template_id");

-- DropTable
DROP TABLE "template_versions";

-- AlterTable
ALTER TABLE "templates" ADD COLUMN "version" TEXT,
    ADD COLUMN "snapshot" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "_BoardTemplates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BoardTemplates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BoardTemplates_B_index" ON "_BoardTemplates"("B");

-- AddForeignKey
ALTER TABLE "_BoardTemplates" ADD CONSTRAINT "_BoardTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardTemplates" ADD CONSTRAINT "_BoardTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "template_migrations" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "from_snapshot" JSONB NOT NULL,
    "to_snapshot" JSONB NOT NULL,
    "conflicts" JSONB NOT NULL DEFAULT '[]',
    "resolutions" JSONB,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_migrations_template_id_idx" ON "template_migrations"("template_id");

-- AddForeignKey
ALTER TABLE "template_migrations" ADD CONSTRAINT "template_migrations_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
