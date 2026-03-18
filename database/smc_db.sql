-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2026 at 06:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smc_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` char(36) NOT NULL,
  `action` varchar(255) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('pending','approved','rejected','under_review') NOT NULL DEFAULT 'pending',
  `submitted_by` char(36) NOT NULL,
  `approved_by` char(36) DEFAULT NULL,
  `department_id` char(36) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`id`, `title`, `amount`, `status`, `submitted_by`, `approved_by`, `department_id`, `description`, `created_at`, `updated_at`) VALUES
('08682ac7-10c7-4f1f-9ae4-eae27bc554e5', 'road repair materials', 56000.00, 'rejected', '2aeef2fe-a4f9-4b6a-9551-aab3b3257668', 'user-admin', NULL, 'hdfvksurg', '2026-03-13 09:27:36.843', '2026-03-17 05:16:45.324'),
('4119b361-6e25-436b-ab4a-2d168af0ea16', 'road repair material', 500.00, 'approved', '2aeef2fe-a4f9-4b6a-9551-aab3b3257668', NULL, NULL, ',jvblwjgkjhifvkjnr', '2026-03-12 11:00:12.641', '2026-03-12 12:02:39.861'),
('4e77050f-dcf2-451b-814d-3d1cd1afd95d', 'road repair', 450000.00, 'pending', 'user-admin', NULL, 'dept-1', 'jsdvhfayd hdvjyhage hvhjqe', '2026-03-17 05:17:15.179', '2026-03-17 05:17:15.179'),
('85b4863e-0601-40f1-a744-fe8f70dbc0f9', 'road repair', 4500000.00, 'approved', '2aeef2fe-a4f9-4b6a-9551-aab3b3257668', NULL, NULL, 'wdmbflqr', '2026-03-13 06:48:56.843', '2026-03-13 06:49:12.166'),
('e12c7d79-c924-4f4f-ac50-3c30dc5ec55d', 'road repair materials', 500.00, 'approved', '2aeef2fe-a4f9-4b6a-9551-aab3b3257668', NULL, NULL, 'cjhasdbgiugfc jsbfureh jbxjcjd jsbdjgu jhjohed oisduhed cvbbfh jcjh', '2026-03-12 11:21:26.275', '2026-03-12 12:02:35.881');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` char(36) NOT NULL,
  `title` varchar(500) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `status` enum('submitted','assigned','in_progress','resolved','closed','rejected') NOT NULL DEFAULT 'submitted',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `submitted_by` varchar(255) NOT NULL,
  `assigned_to` char(36) DEFAULT NULL,
  `department_id` char(36) DEFAULT NULL,
  `location` varchar(500) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `title`, `description`, `category`, `status`, `priority`, `submitted_by`, `assigned_to`, `department_id`, `location`, `created_at`, `updated_at`) VALUES
('085007c9-ae7a-4986-b0a1-a22415f874f5', 'mndbfrj jfk  ;kwr krhknkd  knfkwkr knfkjr knkr', 'cvhhfuj  jhbdvuhbr jjf djoirjin bgf hgfiqhikhkf i hfifb', 'Water', 'resolved', 'high', 'admin@municipal.gov', NULL, NULL, 'near central park', '2026-03-13 06:51:06.153', '2026-03-16 05:11:36.783'),
('31a67000-cb4d-42ed-8c6e-813251261442', ',menf ', 'mndfbke', 'Street Light', 'resolved', 'low', 'admin@municipal.gov', NULL, NULL, NULL, '2026-03-13 09:35:02.602', '2026-03-16 04:58:57.135'),
('3d2e15de-f338-4393-beda-d3a9b63e7d78', 'dfgdhh', 'chshgsr', 'Sanitation', 'resolved', 'medium', 'admin@municipal.gov', NULL, NULL, 'dzfgdfth', '2026-03-12 07:23:43.736', '2026-03-16 05:11:58.792'),
('7c6ddc86-4d0a-4f42-aa79-1d1aa597436d', 'mnbfjehr', 'dmfjdhfjdbfd nbfefh jshbjr', 'Drainage', 'resolved', 'high', 'admin@municipal.gov', NULL, NULL, 'near central park', '2026-03-13 09:31:26.079', '2026-03-16 04:59:25.336'),
('a69f9a4b-fc24-4911-8864-bd12fb2aaeb5', 'cbsvdfhg', 'jdhgfjf hdfkjhfi jfhiwr', 'Sanitation', 'submitted', 'medium', 'citizen@email.com', NULL, NULL, 'near central park', '2026-03-16 07:14:36.234', '2026-03-16 07:14:36.234'),
('e83651a8-9cb9-44e0-8286-c722e9938804', 'jhdgfehf', 'jdhbfuef jgfuhefu jgdjhe', 'Water', 'submitted', 'high', 'admin@municipal.gov', NULL, NULL, 'near central park', '2026-03-16 05:15:14.942', '2026-03-16 05:15:14.942'),
('f7af74e5-bc8f-451e-bf2d-3f2ae6c9a25e', 'ktfyu', 'mnhgcfhtrdf', 'Sanitation', 'resolved', 'medium', 'admin@municipal.gov', NULL, NULL, 'near central park', '2026-03-12 07:23:24.541', '2026-03-16 05:11:46.495');

-- --------------------------------------------------------

--
-- Table structure for table `complaint_attachments`
--

CREATE TABLE `complaint_attachments` (
  `id` char(36) NOT NULL,
  `complaint_id` char(36) NOT NULL,
  `file_url` varchar(512) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `head_id` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `head_id`, `created_at`, `updated_at`) VALUES
('dept-1', 'Public Works Department', 'user-head-1', '2026-03-16 12:32:41.047', '2026-03-16 12:32:41.157');

-- --------------------------------------------------------

--
-- Table structure for table `discussions`
--

CREATE TABLE `discussions` (
  `id` char(36) NOT NULL,
  `meeting_id` char(36) NOT NULL,
  `topic` varchar(500) NOT NULL,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discussion_posts`
--

CREATE TABLE `discussion_posts` (
  `id` char(36) NOT NULL,
  `discussion_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides`
--

CREATE TABLE `hero_slides` (
  `id` char(36) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(500) DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hero_slides`
--

INSERT INTO `hero_slides` (`id`, `image_url`, `title`, `subtitle`, `link_url`, `order`, `active`, `created_at`, `updated_at`) VALUES
('b2606d31-4dd9-4b84-9546-903128435c5c', '/uploads/1773740673068-ywikllfl3pm.jpg', NULL, NULL, NULL, 1, 1, '2026-03-17 09:44:33.232', '2026-03-17 09:44:33.232'),
('e90fbbc6-7529-4041-80f8-abc7ec93e5ec', '/uploads/1773740851871-u9byrq76ebo.jpg', NULL, NULL, NULL, 0, 1, '2026-03-17 09:47:31.899', '2026-03-17 09:47:31.899');

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `agenda` text DEFAULT NULL,
  `meeting_date` date NOT NULL,
  `meeting_time` time NOT NULL,
  `status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `department_id` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `title`, `agenda`, `meeting_date`, `meeting_time`, `status`, `department_id`, `created_at`, `updated_at`) VALUES
('23962c10-083a-4e7a-9c67-d889c9d21963', 'msdbfjdm', 'nsdbcjbd', '2026-03-11', '03:30:00', 'scheduled', NULL, '2026-03-12 07:29:16.492', '2026-03-12 07:29:16.492'),
('2d6ce3c2-a8ba-4fa3-a240-74255ac1c256', 'ndbvfhde', 'ndsbvchd', '2026-03-12', '06:30:00', 'scheduled', NULL, '2026-03-13 09:39:33.760', '2026-03-13 09:39:33.760');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_participants`
--

CREATE TABLE `meeting_participants` (
  `id` char(36) NOT NULL,
  `meeting_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `title` varchar(500) NOT NULL,
  `body` text DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `read_at` datetime(3) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` char(36) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `bill_id` char(36) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `reference` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `department_id` char(36) DEFAULT NULL,
  `status` enum('active','completed','on_hold') NOT NULL DEFAULT 'active',
  `progress` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` char(36) NOT NULL,
  `title` varchar(500) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('todo','in_progress','review','done') NOT NULL DEFAULT 'todo',
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `assignee_id` char(36) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `project_id` char(36) DEFAULT NULL,
  `sort_order` int(10) UNSIGNED DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL DEFAULT '',
  `role` enum('admin','department_head','staff','auditor','public') NOT NULL DEFAULT 'public',
  `department_id` char(36) DEFAULT NULL,
  `avatar` varchar(512) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `department_id`, `avatar`, `created_at`, `updated_at`) VALUES
('2aeef2fe-a4f9-4b6a-9551-aab3b3257668', 'Prachi Mishra', 'pm9665846@gmail.com', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'staff', NULL, NULL, '2026-03-12 08:41:40.463', '2026-03-16 12:09:45.413'),
('70f4bfe6-4368-462f-b5ab-2f05874f5909', 'john doe', 'john1example@gmail.com', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'staff', NULL, NULL, '2026-03-13 06:50:10.358', '2026-03-16 12:09:45.413'),
('9308d399-b9a7-403a-a24e-513c72c90eef', 'mishra', 'mishra1234@gmail.com', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'staff', NULL, NULL, '2026-03-13 09:30:44.718', '2026-03-16 12:09:45.413'),
('user-admin', 'Municipal Admin', 'admin@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'admin', NULL, NULL, '2026-03-16 12:32:41.140', '2026-03-16 12:32:41.140'),
('user-auditor', 'Auditor Sharma', 'auditor@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'auditor', NULL, NULL, '2026-03-16 12:32:41.140', '2026-03-16 12:32:41.140'),
('user-head-1', 'Dept. Head Singh', 'head@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'department_head', 'dept-1', NULL, '2026-03-16 12:32:41.140', '2026-03-16 12:32:41.140'),
('user-public-1', 'Citizen Rao', 'citizen@email.com', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'public', NULL, NULL, '2026-03-16 12:32:41.140', '2026-03-16 12:32:41.140'),
('user-staff-1', 'Staff Kumar', 'staff@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'staff', 'dept-1', NULL, '2026-03-16 12:32:41.140', '2026-03-16 12:32:41.140');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bills_status_idx` (`status`),
  ADD KEY `bills_department_id_idx` (`department_id`),
  ADD KEY `bills_submitted_by_idx` (`submitted_by`),
  ADD KEY `bills_approved_by_fkey` (`approved_by`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `complaints_status_idx` (`status`),
  ADD KEY `complaints_department_id_idx` (`department_id`),
  ADD KEY `complaints_assigned_to_idx` (`assigned_to`),
  ADD KEY `complaints_created_at_idx` (`created_at`);

--
-- Indexes for table `complaint_attachments`
--
ALTER TABLE `complaint_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `complaint_attachments_complaint_id_idx` (`complaint_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departments_head_id_idx` (`head_id`);

--
-- Indexes for table `discussions`
--
ALTER TABLE `discussions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discussions_meeting_id_idx` (`meeting_id`);

--
-- Indexes for table `discussion_posts`
--
ALTER TABLE `discussion_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discussion_posts_discussion_id_idx` (`discussion_id`),
  ADD KEY `discussion_posts_user_id_fkey` (`user_id`);

--
-- Indexes for table `hero_slides`
--
ALTER TABLE `hero_slides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_slides_active_order_idx` (`active`,`order`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meetings_status_idx` (`status`),
  ADD KEY `meetings_department_id_idx` (`department_id`),
  ADD KEY `meetings_meeting_date_idx` (`meeting_date`);

--
-- Indexes for table `meeting_participants`
--
ALTER TABLE `meeting_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meeting_participants_meeting_user_key` (`meeting_id`,`user_id`),
  ADD KEY `meeting_participants_user_id_idx` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_idx` (`user_id`),
  ADD KEY `notifications_read_at_idx` (`read_at`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_bill_id_idx` (`bill_id`),
  ADD KEY `payments_status_idx` (`status`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_department_id_idx` (`department_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_status_idx` (`status`),
  ADD KEY `tasks_assignee_id_idx` (`assignee_id`),
  ADD KEY `tasks_project_id_idx` (`project_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_department_id_idx` (`department_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bills_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bills_submitted_by_fkey` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `complaints`
--
ALTER TABLE `complaints`
  ADD CONSTRAINT `complaints_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `complaints_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `complaint_attachments`
--
ALTER TABLE `complaint_attachments`
  ADD CONSTRAINT `complaint_attachments_complaint_id_fkey` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_head_id_fkey` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `discussions`
--
ALTER TABLE `discussions`
  ADD CONSTRAINT `discussions_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `discussion_posts`
--
ALTER TABLE `discussion_posts`
  ADD CONSTRAINT `discussion_posts_discussion_id_fkey` FOREIGN KEY (`discussion_id`) REFERENCES `discussions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `discussion_posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `meeting_participants`
--
ALTER TABLE `meeting_participants`
  ADD CONSTRAINT `meeting_participants_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meeting_participants_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_bill_id_fkey` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_assignee_id_fkey` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `tasks_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
