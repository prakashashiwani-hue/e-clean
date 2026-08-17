/*
  Warnings:

  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "cleanups" DROP CONSTRAINT "cleanups_workerId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_recyclingPartnerId_fkey";

-- DropForeignKey
ALTER TABLE "report_images" DROP CONSTRAINT "report_images_uploadedBy_fkey";

-- DropForeignKey
ALTER TABLE "report_verifications" DROP CONSTRAINT "report_verifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_userId_fkey";

-- DropTable
DROP TABLE "profiles";

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_images" ADD CONSTRAINT "report_images_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleanups" ADD CONSTRAINT "cleanups_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleanups" ADD CONSTRAINT "cleanups_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_verifications" ADD CONSTRAINT "report_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
