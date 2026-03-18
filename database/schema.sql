-- SMC - Smart Municipal Complaint & Meeting Control System
-- MySQL 8.0+ Schema - Run this file to create all tables

CREATE DATABASE IF NOT EXISTS `SMC_DB`;
USE `SMC_DB`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS `discussion_posts`;
DROP TABLE IF EXISTS `discussions`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `bills`;
DROP TABLE IF EXISTS `meeting_participants`;
DROP TABLE IF EXISTS `meetings`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `complaint_attachments`;
DROP TABLE IF EXISTS `complaints`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `hero_slides`;

-- ----------------------------
-- Departments (no head_id FK yet)
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
-- Users
-- ----------------------------
CREATE TABLE `users` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','department_head','staff','auditor','public') NOT NULL DEFAULT 'public',
  `department_id` CHAR(36) DEFAULT NULL,
  `avatar` VARCHAR(512) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `users_department_id_idx` (`department_id`),
  CONSTRAINT `users_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `departments` ADD CONSTRAINT `departments_head_id_fkey` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

-- ----------------------------
-- Complaints
-- ----------------------------
CREATE TABLE `complaints` (
  `id` CHAR(36) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `status` ENUM('submitted','assigned','in_progress','resolved','closed','rejected') NOT NULL DEFAULT 'submitted',
  `priority` ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `submitted_by` VARCHAR(255) NOT NULL,
  `assigned_to` CHAR(36) DEFAULT NULL,
  `department_id` CHAR(36) DEFAULT NULL,
  `location` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `complaints_status_idx` (`status`),
  KEY `complaints_department_id_idx` (`department_id`),
  KEY `complaints_assigned_to_idx` (`assigned_to`),
  KEY `complaints_created_at_idx` (`created_at`),
  CONSTRAINT `complaints_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `complaints_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `complaint_attachments` (
  `id` CHAR(36) NOT NULL,
  `complaint_id` CHAR(36) NOT NULL,
  `file_url` VARCHAR(512) NOT NULL,
  `file_name` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `complaint_attachments_complaint_id_idx` (`complaint_id`),
  CONSTRAINT `complaint_attachments_complaint_id_fkey` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Projects
-- ----------------------------
CREATE TABLE `projects` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `department_id` CHAR(36) DEFAULT NULL,
  `status` ENUM('active','completed','on_hold') NOT NULL DEFAULT 'active',
  `progress` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `projects_department_id_idx` (`department_id`),
  CONSTRAINT `projects_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Tasks
-- ----------------------------
CREATE TABLE `tasks` (
  `id` CHAR(36) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('todo','in_progress','review','done') NOT NULL DEFAULT 'todo',
  `priority` ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  `assignee_id` CHAR(36) DEFAULT NULL,
  `due_date` DATE DEFAULT NULL,
  `project_id` CHAR(36) DEFAULT NULL,
  `sort_order` INT UNSIGNED DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `tasks_status_idx` (`status`),
  KEY `tasks_assignee_id_idx` (`assignee_id`),
  KEY `tasks_project_id_idx` (`project_id`),
  CONSTRAINT `tasks_assignee_id_fkey` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Meetings
-- ----------------------------
CREATE TABLE `meetings` (
  `id` CHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `agenda` TEXT DEFAULT NULL,
  `meeting_date` DATE NOT NULL,
  `meeting_time` TIME NOT NULL,
  `status` ENUM('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `department_id` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `meetings_status_idx` (`status`),
  KEY `meetings_department_id_idx` (`department_id`),
  KEY `meetings_meeting_date_idx` (`meeting_date`),
  CONSTRAINT `meetings_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `meeting_participants` (
  `id` CHAR(36) NOT NULL,
  `meeting_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `meeting_participants_meeting_user_key` (`meeting_id`,`user_id`),
  KEY `meeting_participants_user_id_idx` (`user_id`),
  CONSTRAINT `meeting_participants_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `meeting_participants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Bills
-- ----------------------------
CREATE TABLE `bills` (
  `id` CHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `status` ENUM('pending','approved','rejected','under_review') NOT NULL DEFAULT 'pending',
  `submitted_by` CHAR(36) NOT NULL,
  `approved_by` CHAR(36) DEFAULT NULL,
  `department_id` CHAR(36) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `bills_status_idx` (`status`),
  KEY `bills_department_id_idx` (`department_id`),
  KEY `bills_submitted_by_idx` (`submitted_by`),
  CONSTRAINT `bills_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bills_submitted_by_fkey` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `bills_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Payments
-- ----------------------------
CREATE TABLE `payments` (
  `id` CHAR(36) NOT NULL,
  `bill_id` CHAR(36) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `status` ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `reference` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `payments_bill_id_idx` (`bill_id`),
  KEY `payments_status_idx` (`status`),
  CONSTRAINT `payments_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Notifications
-- ----------------------------
CREATE TABLE `notifications` (
  `id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `body` TEXT DEFAULT NULL,
  `type` VARCHAR(50) NOT NULL DEFAULT 'info',
  `read_at` DATETIME(3) DEFAULT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL,
  `entity_id` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_idx` (`user_id`),
  KEY `notifications_read_at_idx` (`read_at`),
  CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Audit logs
-- ----------------------------
CREATE TABLE `audit_logs` (
  `id` CHAR(36) NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `user_id` CHAR(36) DEFAULT NULL,
  `user_email` VARCHAR(255) DEFAULT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL,
  `entity_id` CHAR(36) DEFAULT NULL,
  `metadata` JSON DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_idx` (`user_id`),
  KEY `audit_logs_entity_idx` (`entity_type`,`entity_id`),
  KEY `audit_logs_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Discussions
-- ----------------------------
CREATE TABLE `discussions` (
  `id` CHAR(36) NOT NULL,
  `meeting_id` CHAR(36) NOT NULL,
  `topic` VARCHAR(500) NOT NULL,
  `status` ENUM('open','closed') NOT NULL DEFAULT 'open',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `discussions_meeting_id_idx` (`meeting_id`),
  CONSTRAINT `discussions_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `discussion_posts` (
  `id` CHAR(36) NOT NULL,
  `discussion_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `discussion_posts_discussion_id_idx` (`discussion_id`),
  CONSTRAINT `discussion_posts_discussion_id_fkey` FOREIGN KEY (`discussion_id`) REFERENCES `discussions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `discussion_posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Hero slides (public homepage slider)
-- ----------------------------
CREATE TABLE `hero_slides` (
  `id` CHAR(36) NOT NULL,
  `image_url` VARCHAR(512) NOT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `subtitle` VARCHAR(500) DEFAULT NULL,
  `link_url` VARCHAR(255) DEFAULT NULL,
  `order` INT NOT NULL DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `hero_slides_active_order_idx` (`active`,`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
