-- SMC - Staff storage (users + departments)
-- Run this to create only the database and tables needed for staff management.
-- For full SMC schema use schema.sql instead.

CREATE DATABASE IF NOT EXISTS `SMC_DB`;
USE `SMC_DB`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop in reverse dependency order
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `departments`;

-- ----------------------------
-- Departments (staff can be assigned to a department)
-- ----------------------------
CREATE TABLE `departments` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `head_id` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `departments_head_id_idx` (`head_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Users (staff)
-- ----------------------------
CREATE TABLE `users` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','department_head','staff','auditor','public') NOT NULL DEFAULT 'staff',
  `department_id` CHAR(36) DEFAULT NULL,
  `avatar` VARCHAR(512) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `users_department_id_idx` (`department_id`),
  CONSTRAINT `users_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Department head references a user (add after users exists)
ALTER TABLE `departments` ADD CONSTRAINT `departments_head_id_fkey` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

SET FOREIGN_KEY_CHECKS = 1;

-- Example: insert a department and a staff user (optional)
-- INSERT INTO `departments` (`id`, `name`, `head_id`, `created_at`, `updated_at`) VALUES
-- ('dept-1', 'Public Works', NULL, NOW(3), NOW(3));
-- INSERT INTO `users` (`id`, `name`, `email`, `role`, `department_id`, `avatar`, `created_at`, `updated_at`) VALUES
-- ('user-1', 'John Doe', 'john@municipal.gov', 'staff', 'dept-1', NULL, NOW(3), NOW(3));
