-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "finalized" BOOLEAN NOT NULL DEFAULT false;
