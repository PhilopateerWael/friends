/*
  Warnings:

  - You are about to drop the column `groupName` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `isGroup` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `commentId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_commentId_fkey";

-- DropIndex
DROP INDEX "Media_commentId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "groupName",
DROP COLUMN "isGroup";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "commentId";
