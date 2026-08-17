/*
  Warnings:

  - The primary key for the `cleanups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `profiles` table. All the data in the column will be lost.
  - The primary key for the `recycling_partners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `report_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `report_verifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reports` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_afterImageId_fkey";

-- DropForeignKey
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_beforeImageId_fkey";

-- DropForeignKey
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_reportId_fkey";

-- DropForeignKey
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_workerId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_reportId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_recyclingPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "report_images" DROP CONSTRAINT "report_images_reportId_fkey";

-- DropForeignKey
ALTER TABLE "report_images" DROP CONSTRAINT "report_images_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "report_verifications" DROP CONSTRAINT "report_verifications_reportId_fkey";

-- DropForeignKey
ALTER TABLE "report_verifications" DROP CONSTRAINT "report_verifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_duplicateOfId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_recyclingPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_userId_fkey";

-- AlterTable
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "reportId" SET DATA TYPE TEXT,
ALTER COLUMN "workerId" SET DATA TYPE TEXT,
ALTER COLUMN "assignedBy" SET DATA TYPE TEXT,
ALTER COLUMN "beforeImageId" SET DATA TYPE TEXT,
ALTER COLUMN "afterImageId" SET DATA TYPE TEXT,
ADD CONSTRAINT "cleanups_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "reportId" SET DATA TYPE TEXT,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "email",
DROP COLUMN "name",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "recyclingPartnerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recycling_partners" DROP CONSTRAINT "recycling_partners_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "recycling_partners_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "report_images" DROP CONSTRAINT "report_images_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "reportId" SET DATA TYPE TEXT,
ALTER COLUMN "uploadedBy" SET DATA TYPE TEXT,
ADD CONSTRAINT "report_images_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "report_verifications" DROP CONSTRAINT "report_verifications_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "reportId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "report_verifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reports" DROP CONSTRAINT "reports_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "duplicateOfId" SET DATA TYPE TEXT,
ALTER COLUMN "recyclingPartnerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_recyclingPartnerId_fkey" FOREIGN KEY ("recyclingPartnerId") REFERENCES "recycling_partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_recyclingPartnerId_fkey" FOREIGN KEY ("recyclingPartnerId") REFERENCES "recycling_partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_images" ADD CONSTRAINT "report_images_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_images" ADD CONSTRAINT "report_images_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleanups" ADD CONSTRAINT "cleanups_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleanups" ADD CONSTRAINT "cleanups_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleanups" ADD CONSTRAINT "cleanups_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleanups" ADD CONSTRAINT "cleanups_beforeImageId_fkey" FOREIGN KEY ("beforeImageId") REFERENCES "report_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleanups" ADD CONSTRAINT "cleanups_afterImageId_fkey" FOREIGN KEY ("afterImageId") REFERENCES "report_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_verifications" ADD CONSTRAINT "report_verifications_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_verifications" ADD CONSTRAINT "report_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
