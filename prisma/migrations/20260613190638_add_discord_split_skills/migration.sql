/*
  Warnings:

  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "skills",
ADD COLUMN     "coreSkills" TEXT[],
ADD COLUMN     "discord" TEXT,
ADD COLUMN     "stackSkills" TEXT[];
