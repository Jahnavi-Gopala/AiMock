/*
  Warnings:

  - You are about to drop the column `finalized` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `type` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "finalized",
ADD COLUMN     "type" TEXT NOT NULL;
