/*
  Warnings:

  - You are about to drop the `retweets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "retweets" DROP CONSTRAINT "retweets_postId_fkey";

-- DropForeignKey
ALTER TABLE "retweets" DROP CONSTRAINT "retweets_userId_fkey";

-- DropTable
DROP TABLE "retweets";

-- CreateTable
CREATE TABLE "repost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "repost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repost_userId_postId_key" ON "repost"("userId", "postId");

-- AddForeignKey
ALTER TABLE "repost" ADD CONSTRAINT "repost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repost" ADD CONSTRAINT "repost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
