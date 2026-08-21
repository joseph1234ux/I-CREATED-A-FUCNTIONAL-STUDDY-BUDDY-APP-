-- Adds editorial promotion state without modifying existing story data.
ALTER TABLE `Story` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;
