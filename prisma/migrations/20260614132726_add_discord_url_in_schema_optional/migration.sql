/*
  Warnings:

  - You are about to drop the column `coreSkills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stackSkills` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "coreSkills",
DROP COLUMN "stackSkills",
ADD COLUMN     "skills" TEXT[];
