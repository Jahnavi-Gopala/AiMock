/*
  Warnings:

  - The `strengths` column on the `Feedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `areasForImprovement` column on the `Feedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "strengths",
ADD COLUMN     "strengths" JSONB[],
DROP COLUMN "areasForImprovement",
ADD COLUMN     "areasForImprovement" JSONB[];
