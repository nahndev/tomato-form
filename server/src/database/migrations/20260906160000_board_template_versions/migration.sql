-- Boards now link to a specific TemplateVersion instead of a Template, so
-- widget/column config stays pinned to the version it was configured against
-- instead of silently following whatever is currently "latest".

-- CreateTable
CREATE TABLE "_BoardTemplateVersions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BoardTemplateVersions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BoardTemplateVersions_B_index" ON "_BoardTemplateVersions"("B");

-- AddForeignKey
ALTER TABLE "_BoardTemplateVersions" ADD CONSTRAINT "_BoardTemplateVersions_A_fkey" FOREIGN KEY ("A") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardTemplateVersions" ADD CONSTRAINT "_BoardTemplateVersions_B_fkey" FOREIGN KEY ("B") REFERENCES "template_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DataMigration: for each existing board<->template link, pin to that
-- template's latest version (by semver, major.minor.patch).
INSERT INTO "_BoardTemplateVersions" ("A", "B")
SELECT bt."A", latest."id"
FROM "_BoardTemplates" bt
JOIN LATERAL (
    SELECT tv."id"
    FROM "template_versions" tv
    WHERE tv."template_id" = bt."B"
    ORDER BY string_to_array(tv."version", '.')::int[] DESC
    LIMIT 1
) latest ON true;

-- DropForeignKey
ALTER TABLE "_BoardTemplates" DROP CONSTRAINT "_BoardTemplates_A_fkey";

-- DropForeignKey
ALTER TABLE "_BoardTemplates" DROP CONSTRAINT "_BoardTemplates_B_fkey";

-- DropTable
DROP TABLE "_BoardTemplates";
