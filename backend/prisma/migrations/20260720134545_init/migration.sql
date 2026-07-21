-- AlterTable
ALTER TABLE `courses` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `discussion_replies` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `discussions` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `lessons` MODIFY `description` TEXT NULL,
    MODIFY `content` TEXT NULL;

-- AlterTable
ALTER TABLE `reviews` MODIFY `comment` TEXT NOT NULL;
