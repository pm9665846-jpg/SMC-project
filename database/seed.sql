-- Seed data for SMC - Run after schema.sql

USE `SMC_DB`;

-- Departments
INSERT INTO `departments` (`id`, `name`, `head_id`, `created_at`, `updated_at`) VALUES
('dept-1', 'Public Works', NULL, NOW(3), NOW(3)),
('dept-2', 'Sanitation', NULL, NOW(3), NOW(3)),
('dept-3', 'Water', NULL, NOW(3), NOW(3)),
('dept-4', 'Housing', NULL, NOW(3), NOW(3));

-- Users (default password for all: password123; hash = bcrypt)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `department_id`, `avatar`, `created_at`, `updated_at`) VALUES
('user-admin', 'Municipal Admin', 'admin@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'admin', NULL, NULL, NOW(3), NOW(3)),
('user-head-1', 'Dept. Head Singh', 'head@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'department_head', 'dept-1', NULL, NOW(3), NOW(3)),
('user-staff-1', 'Staff Kumar', 'staff@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'staff', 'dept-1', NULL, NOW(3), NOW(3)),
('user-auditor', 'Auditor Sharma', 'auditor@municipal.gov', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'auditor', NULL, NULL, NOW(3), NOW(3)),
('user-public-1', 'Citizen Rao', 'citizen@email.com', '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti', 'public', NULL, NULL, NOW(3), NOW(3));

-- Set department heads
UPDATE `departments` SET `head_id` = 'user-head-1' WHERE `id` = 'dept-1';

-- Complaints
INSERT INTO `complaints` (`id`, `title`, `description`, `category`, `status`, `priority`, `submitted_by`, `assigned_to`, `department_id`, `location`, `created_at`, `updated_at`) VALUES
('C-1245', 'Street light not working', 'Light pole #45 on Block A has been off for 3 days.', 'Street Light', 'assigned', 'high', 'citizen@email.com', 'user-staff-1', 'dept-1', 'Block A', NOW(3), NOW(3)),
('C-1244', 'Garbage not collected', 'Weekly collection missed on Lane 2.', 'Sanitation', 'in_progress', 'medium', 'citizen@email.com', 'user-staff-1', 'dept-2', 'Lane 2', NOW(3), NOW(3)),
('C-1243', 'Water leakage on Block B', 'Pipe leakage near building 5.', 'Water', 'resolved', 'urgent', 'citizen@email.com', NULL, 'dept-3', 'Block B', NOW(3), NOW(3)),
('C-1242', 'Pothole on Main Road', 'Large pothole near the market.', 'Roads', 'submitted', 'high', 'citizen@email.com', NULL, 'dept-1', 'Main Road', NOW(3), NOW(3)),
('C-1241', 'Drain blockage', 'Drain blocked at crossing.', 'Drainage', 'in_progress', 'medium', 'citizen@email.com', 'user-staff-1', 'dept-3', 'Crossing', NOW(3), NOW(3));

-- Projects
INSERT INTO `projects` (`id`, `name`, `department_id`, `status`, `progress`, `created_at`, `updated_at`) VALUES
('proj-1', 'Street light upgrade - Zone A', 'dept-1', 'active', 75, NOW(3), NOW(3)),
('proj-2', 'Drainage overhaul Block B', 'dept-3', 'active', 40, NOW(3), NOW(3)),
('proj-3', 'Road resurfacing Main St', 'dept-1', 'completed', 100, NOW(3), NOW(3));

-- Tasks
INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `priority`, `assignee_id`, `due_date`, `project_id`, `sort_order`, `created_at`, `updated_at`) VALUES
('task-1', 'Inspect street light #45', NULL, 'in_progress', 'high', 'user-staff-1', CURDATE() + INTERVAL 2 DAY, 'proj-1', 0, NOW(3), NOW(3)),
('task-2', 'Submit site report', NULL, 'todo', 'medium', 'user-staff-1', CURDATE() + INTERVAL 1 DAY, NULL, 1, NOW(3), NOW(3)),
('task-3', 'Follow-up complaint C-1230', NULL, 'review', 'high', 'user-staff-1', NULL, NULL, 2, NOW(3), NOW(3)),
('task-4', 'Drain cleaning Zone 2', NULL, 'todo', 'low', NULL, CURDATE() + INTERVAL 5 DAY, 'proj-2', 3, NOW(3), NOW(3)),
('task-5', 'Road repair documentation', NULL, 'done', 'medium', 'user-staff-1', NULL, 'proj-3', 4, NOW(3), NOW(3));

-- Meetings
INSERT INTO `meetings` (`id`, `title`, `agenda`, `meeting_date`, `meeting_time`, `status`, `department_id`, `created_at`, `updated_at`) VALUES
('meet-1', 'Zone review - North', 'Monthly zone status', CURDATE() + INTERVAL 2 DAY, '15:00:00', 'scheduled', 'dept-1', NOW(3), NOW(3)),
('meet-2', 'Budget allocation', 'Q2 budget', CURDATE() + INTERVAL 1 DAY, '10:00:00', 'completed', NULL, NOW(3), NOW(3)),
('meet-3', 'Complaint resolution', 'Priority complaints', CURDATE() - INTERVAL 2 DAY, '14:00:00', 'completed', 'dept-1', NOW(3), NOW(3));

INSERT INTO `meeting_participants` (`id`, `meeting_id`, `user_id`, `created_at`) VALUES
('mp-1', 'meet-1', 'user-head-1', NOW(3)),
('mp-2', 'meet-1', 'user-staff-1', NOW(3)),
('mp-3', 'meet-2', 'user-admin', NOW(3));

-- Bills
INSERT INTO `bills` (`id`, `title`, `amount`, `status`, `submitted_by`, `approved_by`, `department_id`, `description`, `created_at`, `updated_at`) VALUES
('bill-1', 'Road repair materials', 45000.00, 'pending', 'user-head-1', NULL, 'dept-1', 'Materials for Main St', NOW(3), NOW(3)),
('bill-2', 'Cleaning supplies', 12200.00, 'approved', 'user-head-1', 'user-admin', 'dept-2', 'Sanitation supplies', NOW(3), NOW(3)),
('bill-3', 'Pipe replacement', 78500.00, 'under_review', 'user-head-1', NULL, 'dept-3', 'Block B pipes', NOW(3), NOW(3));

-- Payments
INSERT INTO `payments` (`id`, `bill_id`, `amount`, `status`, `reference`, `created_at`) VALUES
('pay-1', 'bill-2', 12200.00, 'completed', 'PAY-201', NOW(3)),
('pay-2', 'bill-1', 45000.00, 'pending', 'PAY-202', NOW(3));

-- Notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `body`, `type`, `read_at`, `entity_type`, `entity_id`, `created_at`) VALUES
('notif-1', 'user-admin', 'New complaint #1245 assigned', 'Complaint C-1245 assigned to your department.', 'complaint', NULL, 'complaint', 'C-1245', NOW(3)),
('notif-2', 'user-admin', 'Meeting at 3 PM confirmed', 'Zone review meeting confirmed.', 'meeting', NULL, 'meeting', 'meet-1', NOW(3)),
('notif-3', 'user-admin', 'Bill #89 approved', 'Bill bill-2 has been approved.', 'bill', NOW(3), 'bill', 'bill-2', NOW(3));

-- Audit logs
INSERT INTO `audit_logs` (`id`, `action`, `user_id`, `user_email`, `entity_type`, `entity_id`, `metadata`, `created_at`) VALUES
('audit-1', 'Bill bill-2 approved', 'user-admin', 'admin@municipal.gov', 'bill', 'bill-2', '{"amount": 12200}', NOW(3)),
('audit-2', 'Complaint C-1244 assigned', 'user-head-1', 'head@municipal.gov', 'complaint', 'C-1244', NULL, NOW(3)),
('audit-3', 'Meeting meet-2 completed', NULL, 'system', 'meeting', 'meet-2', NULL, NOW(3));

-- Discussions
INSERT INTO `discussions` (`id`, `meeting_id`, `topic`, `status`, `created_at`, `updated_at`) VALUES
('disc-1', 'meet-1', 'Zone North - Street lights', 'open', NOW(3), NOW(3)),
('disc-2', 'meet-2', 'Budget Q2 allocation', 'closed', NOW(3), NOW(3));
