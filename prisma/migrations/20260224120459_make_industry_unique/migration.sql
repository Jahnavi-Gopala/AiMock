/*
  Warnings:

  - A unique constraint covering the columns `[industry]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_industry_key" ON "User"("industry");
