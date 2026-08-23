-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('SUBMISSION_CREATION', 'SEND_MAIL');

-- CreateEnum
CREATE TYPE "JobExecutionStatus" AS ENUM ('running', 'success', 'failed');

-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_versions" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "template_version_id" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "type" "ActionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "template_id" TEXT,
    "board_id" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_executions" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "status" "JobExecutionStatus" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "error" TEXT,
    "result" JSONB,

    CONSTRAINT "job_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cron_registrations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "event" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cron_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BoardTemplates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BoardTemplates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "template_versions_template_id_idx" ON "template_versions"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_versions_template_id_version_key" ON "template_versions"("template_id", "version");

-- CreateIndex
CREATE INDEX "submissions_board_id_idx" ON "submissions"("board_id");

-- CreateIndex
CREATE INDEX "submissions_template_version_id_idx" ON "submissions"("template_version_id");

-- CreateIndex
CREATE INDEX "jobs_board_id_idx" ON "jobs"("board_id");

-- CreateIndex
CREATE INDEX "actions_job_id_idx" ON "actions"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "actions_job_id_order_key" ON "actions"("job_id", "order");

-- CreateIndex
CREATE INDEX "job_executions_job_id_started_at_idx" ON "job_executions"("job_id", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "cron_registrations_key_key" ON "cron_registrations"("key");

-- CreateIndex
CREATE INDEX "_BoardTemplates_B_index" ON "_BoardTemplates"("B");

-- AddForeignKey
ALTER TABLE "template_versions" ADD CONSTRAINT "template_versions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_template_version_id_fkey" FOREIGN KEY ("template_version_id") REFERENCES "template_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_executions" ADD CONSTRAINT "job_executions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardTemplates" ADD CONSTRAINT "_BoardTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardTemplates" ADD CONSTRAINT "_BoardTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
