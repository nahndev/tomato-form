-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "data_clocks" JSONB NOT NULL DEFAULT '{}';
