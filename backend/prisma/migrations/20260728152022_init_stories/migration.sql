/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `story` DROP COLUMN `imageUrl`,
    ADD COLUMN `publishedYear` INTEGER NULL,
    ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Ongoing';
