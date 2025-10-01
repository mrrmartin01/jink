-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "coverImageId" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "website" TEXT[] DEFAULT ARRAY[]::TEXT[];
