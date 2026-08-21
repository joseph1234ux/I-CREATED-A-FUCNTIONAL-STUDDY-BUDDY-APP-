/*
  Warnings:

  - You are about to drop the `certificates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_enrollments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discussion_replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discussions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizzes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `certificates` DROP FOREIGN KEY `certificates_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `certificates` DROP FOREIGN KEY `certificates_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `course_enrollments` DROP FOREIGN KEY `course_enrollments_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `course_enrollments` DROP FOREIGN KEY `course_enrollments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_instructor_id_fkey`;

-- DropForeignKey
ALTER TABLE `discussion_replies` DROP FOREIGN KEY `discussion_replies_discussion_id_fkey`;

-- DropForeignKey
ALTER TABLE `discussion_replies` DROP FOREIGN KEY `discussion_replies_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `discussions` DROP FOREIGN KEY `discussions_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `discussions` DROP FOREIGN KEY `discussions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `lesson_progress` DROP FOREIGN KEY `lesson_progress_enrollment_id_fkey`;

-- DropForeignKey
ALTER TABLE `lesson_progress` DROP FOREIGN KEY `lesson_progress_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `lessons` DROP FOREIGN KEY `lessons_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_answers` DROP FOREIGN KEY `quiz_answers_attempt_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_answers` DROP FOREIGN KEY `quiz_answers_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_answers` DROP FOREIGN KEY `quiz_answers_selected_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_attempts` DROP FOREIGN KEY `quiz_attempts_enrollment_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_attempts` DROP FOREIGN KEY `quiz_attempts_quiz_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_options` DROP FOREIGN KEY `quiz_options_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `quiz_questions` DROP FOREIGN KEY `quiz_questions_quiz_id_fkey`;

-- DropForeignKey
ALTER TABLE `quizzes` DROP FOREIGN KEY `quizzes_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_enrollment_id_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_user_id_fkey`;

-- DropTable
DROP TABLE `certificates`;

-- DropTable
DROP TABLE `course_enrollments`;

-- DropTable
DROP TABLE `courses`;

-- DropTable
DROP TABLE `discussion_replies`;

-- DropTable
DROP TABLE `discussions`;

-- DropTable
DROP TABLE `lesson_progress`;

-- DropTable
DROP TABLE `lessons`;

-- DropTable
DROP TABLE `payments`;

-- DropTable
DROP TABLE `quiz_answers`;

-- DropTable
DROP TABLE `quiz_attempts`;

-- DropTable
DROP TABLE `quiz_options`;

-- DropTable
DROP TABLE `quiz_questions`;

-- DropTable
DROP TABLE `quizzes`;

-- DropTable
DROP TABLE `reviews`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `Story` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `content` TEXT NULL,
    `category` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `authorId` INTEGER NULL,
    `userId` INTEGER NULL,
    `imageUrl` VARCHAR(191) NULL,
    `totalReaders` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `views` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Story_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `rating` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `storyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_storyId_fkey` FOREIGN KEY (`storyId`) REFERENCES `Story`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
