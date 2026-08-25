/*
  Warnings:

  - You are about to drop the `actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cron_registrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_executions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_board_id_fkey";

-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_job_id_fkey";

-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_template_id_fkey";

-- DropForeignKey
ALTER TABLE "job_executions" DROP CONSTRAINT "job_executions_job_id_fkey";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_board_id_fkey";

-- DropTable
DROP TABLE "actions";

-- DropTable
DROP TABLE "cron_registrations";

-- DropTable
DROP TABLE "job_executions";

-- DropTable
DROP TABLE "jobs";

-- DropEnum
DROP TYPE "ActionType";

-- DropEnum
DROP TYPE "JobExecutionStatus";
