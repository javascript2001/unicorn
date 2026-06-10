-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('JUNIOR', 'MID_LEVEL', 'SENIOR', 'EXPERT');

-- CreateEnum
CREATE TYPE "MOOD" AS ENUM ('PART_TIME', 'FULL_TIME', 'FREELANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "dob" TEXT NOT NULL,
    "mobile" TEXT,
    "linkedIn" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "portfolio" TEXT,
    "skills" TEXT[],
    "experience" "Experience" NOT NULL,
    "mood" "MOOD" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");
