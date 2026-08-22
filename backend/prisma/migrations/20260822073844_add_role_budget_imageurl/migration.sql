-- AlterTable
ALTER TABLE "City" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "budgetLimit" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
