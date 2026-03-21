/*
  Warnings:

  - You are about to drop the column `commentId` on the `Like` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Like_commentId_idx";

-- DropIndex
DROP INDEX "Like_userId_commentId_key";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "commentId";
