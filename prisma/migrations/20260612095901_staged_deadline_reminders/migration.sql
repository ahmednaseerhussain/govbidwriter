/*
  Warnings:

  - You are about to drop the column `reminderSentAt` on the `RfpAnalysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RfpAnalysis" DROP COLUMN "reminderSentAt",
ADD COLUMN     "remindersSent" TEXT;
