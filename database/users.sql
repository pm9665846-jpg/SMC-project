-- SMC - Users table with login (email + password). Default password: password123
-- In phpMyAdmin: select database SMC_DB from the left sidebar, then run this.
-- If you get "Unknown column 'password_hash'" run upgrade_add_password_hash.sql first.

-- Insert or update seed users (password: password123).

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `department_id`, `avatar`, `created_at`, `updated_at`) VALUES
('user-admin', 'Municipal Admin', 'admin@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'admin', NULL, NULL, NOW(3), NOW(3)),
('user-head-1', 'Dept. Head Singh', 'head@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'department_head', 'dept-1', NULL, NOW(3), NOW(3)),
('user-staff-1', 'Staff Kumar', 'staff@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'staff', 'dept-1', NULL, NOW(3), NOW(3)),
('user-auditor', 'Auditor Sharma', 'auditor@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'auditor', NULL, NULL, NOW(3), NOW(3)),
('user-public-1', 'Citizen Rao', 'citizen@email.com', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'public', NULL, NULL, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `password_hash` = VALUES(`password_hash`),
  `role` = VALUES(`role`),
  `department_id` = VALUES(`department_id`),
  `updated_at` = NOW(3);

-- Set department head
UPDATE `departments` SET `head_id` = 'user-head-1' WHERE `id` = 'dept-1';
