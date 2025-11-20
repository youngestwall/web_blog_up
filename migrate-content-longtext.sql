-- Migration: Change content column from TEXT to LONGTEXT
-- Chạy script này trên Railway MySQL Dashboard hoặc MySQL client

USE railway;

-- Thay đổi kiểu dữ liệu cột content từ TEXT sang LONGTEXT
ALTER TABLE posts MODIFY COLUMN content LONGTEXT NOT NULL;

-- Kiểm tra kết quả
DESCRIBE posts;
