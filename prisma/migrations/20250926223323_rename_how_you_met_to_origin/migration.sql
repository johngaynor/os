/*
  Warnings:

  - You are about to drop the column `how_you_met` on the `persons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."persons" DROP COLUMN "how_you_met",
ADD COLUMN     "origin" TEXT;
