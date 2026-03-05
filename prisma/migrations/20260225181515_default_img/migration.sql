/*
  Warnings:

  - Made the column `image` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "image" SET DEFAULT 'https://res.cloudinary.com/dhaygzwic/image/upload/v1759150104/ulq46oehf0iizem11bkr.png';
