-- Access tokens grant scoped upload access to a single folder, so a curl
-- command can upload files without a browser session.

-- CreateTable
CREATE TABLE "access_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_token_key" ON "access_tokens"("token");

-- CreateIndex
CREATE INDEX "access_tokens_folder_id_idx" ON "access_tokens"("folder_id");

-- AddForeignKey
ALTER TABLE "access_tokens" ADD CONSTRAINT "access_tokens_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
