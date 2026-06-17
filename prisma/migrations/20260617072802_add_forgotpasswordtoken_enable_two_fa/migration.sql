-- AlterTable
ALTER TABLE "User" ADD COLUMN     "forgotPasswordToken" TEXT,
ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
