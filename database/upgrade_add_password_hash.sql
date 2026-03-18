-- Run this ONCE if you get: Unknown column 'password_hash' in 'field list'
-- In phpMyAdmin: select database SMC_DB from the left sidebar, then run this.

ALTER TABLE `users` ADD COLUMN `password_hash` VARCHAR(255) NOT NULL DEFAULT '' AFTER `email`;

UPDATE `users` SET `password_hash` = '$2b$10$qy5ZPm5rmZISBCvFlwAwmes0amTvmffECcGVt2ABY4v/zzwa9JOti' WHERE 1=1;
