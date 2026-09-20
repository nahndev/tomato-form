-- AlterTable
ALTER TABLE "boards" ADD COLUMN     "views" JSONB NOT NULL DEFAULT '[]';
