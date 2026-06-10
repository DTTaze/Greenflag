-- Migration Seeding Data Script for TechSolve 2025 PostgreSQL Database
-- Reference: BACKEND/src/seeders and docs/erd.dbml
-- Consistent UUID prefix used: 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6xxxx'

BEGIN;

-- ============================================================================
-- 1. USERS & USER PROFILES
-- ============================================================================

-- Role mappings:
-- role_id 1 (Admin) -> 'admin'
-- role_id 2 (User/Vendor/Partner) -> 'partner'
-- role_id 3 (Customer) -> 'user'

INSERT INTO users (id, status, email, username, password, role, avatar_url, metadata, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'active', 'admin@example.com', 'admin', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'admin', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746718905/avatars/sjya6w8uj53rjsa0trla.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'active', 'user@example.com', 'user', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'partner', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746718918/avatars/dv79x5hzo3id9ssrnwlb.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'active', 'customer@example.com', 'customer', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'user', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746729040/avatars/giqnk58t6g7aw7obwnwp.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'active', 'john.doe@example.com', 'johndoe', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'user', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746581627/avatars/p2olhpe0hjxcmldhggvn.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'active', 'jane.smith@example.com', 'janesmith', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'partner', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746855505/images/f3149daa-7858-4d16-a3c8-237cbd88e210_ijyls7.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a106', 'active', 'david.nguyen@example.com', 'davidnguyen', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'partner', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746581627/avatars/p2olhpe0hjxcmldhggvn.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 'active', 'sophia.lee@example.com', 'sophialee', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'partner', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746896378/avatars/abdaff8c-0ce5-4f75-86b7-420f85fc7cba_k9gmqd.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a108', 'active', 'michael.brown@example.com', 'michaelbrown', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'partner', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746896514/avatars/tien-ao-pi_uxzzud.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a109', 'active', 'emma.wilson@example.com', 'emmawilson', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'user', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746896623/avatars/fe04a19a-9f3e-4ac3-85e2-7c4023053607_ir1d8s.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10a', 'active', 'oliver.jones@example.com', 'oliverjones', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'partner', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746896704/avatars/7872f704-f7f6-45d5-bfe2-b346bf02e950_xjdmww.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10b', 'active', 'lucas.martin@example.com', 'lucasmartin', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'admin', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746896801/avatars/a27a86a1-9509-4a30-9540-81100775348b_uralsi.jpg', NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10c', 'active', 'mia.davis@example.com', 'miadavis', '$2a$10$O0WvjBfR5Z6f1/5bUv6vOeW.969V9p1lUu2n3R4p5q6r7s8t9u0v1', 'user', 'https://res.cloudinary.com/dygavzq8m/image/upload/v1746897177/avatars/3902e7a3e2e57df9dc5e254e41cde03d_xkfizh.jpg', NULL, now(), now());

INSERT INTO user_profiles (id, user_id, full_name, phone_number, streak, last_completed_task, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab01', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Admin User', '0907713012', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab02', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'Normal User', '0788529112', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab03', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Normal User', '0346024177', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab04', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'John Doe', '0898693660', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab05', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'Jane Smith', '0708681209', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab06', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a106', 'David Nguyen', '7897849789', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab07', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 'Sophia Lee', '1591529159', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab08', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a108', 'Michael Brown', '7537563753', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab09', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a109', 'Emma Wilson', '9519514951', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab0a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10a', 'Oliver Jones', '3573575357', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab0b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10b', 'Lucas Martin', '1237896456', 0, now() - INTERVAL '1 day', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ab0c', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10c', 'Mia Davis', '4564123789', 0, now() - INTERVAL '1 day', now(), now());

-- ============================================================================
-- 2. COINS & RANKS
-- ============================================================================

INSERT INTO coins (id, user_id, amount, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac01', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 1000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac02', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 2000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac03', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 3000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac04', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 4000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac05', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 5000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac06', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a106', 6000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac07', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 7000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac08', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a108', 8000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac09', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a109', 8000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac0a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10a', 8000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac0b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10b', 8000, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ac0c', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10c', 8000, now(), now());

INSERT INTO ranks (id, user_id, amount, "order", created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad01', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 1000, 8, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad02', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 2000, 7, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad03', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 3000, 6, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad04', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 4000, 5, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad05', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 5000, 4, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad06', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a106', 6000, 3, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad07', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 7000, 2, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad08', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a108', 8000, 1, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad09', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a109', 9000, 9, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad0a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10a', 10000, 10, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad0b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10b', 11000, 11, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ad0c', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10c', 12000, 12, now(), now());

-- ============================================================================
-- 3. TYPES & TASKS & TASK TYPES & TASK USERS
-- ============================================================================

INSERT INTO "types" (id, type, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', 'daily', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', 'others', now(), now());

INSERT INTO tasks (id, creator_id, title, description, content, coins, difficulty, total, status, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af01', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Nhặt rác tại công viên', 'Thu gom và phân loại rác thải trong khu vực công viên.', NULL, 15, 'easy', 10, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af02', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Trồng cây xanh', 'Trồng ít nhất một cây xanh trong khu vực được chỉ định.', NULL, 25, 'medium', 5, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af03', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Tiết kiệm điện', 'Tắt các thiết bị điện khi không sử dụng trong một tuần.', NULL, 10, 'easy', 2, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af04', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Tái chế rác thải', 'Thu gom ít nhất 5kg rác thải tái chế và đem đến điểm thu gom.', NULL, 30, 'hard', 3, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af05', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Hạn chế sử dụng túi ni lông', 'Không sử dụng túi ni lông trong vòng một tuần.', NULL, 20, 'medium', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af06', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Task 1', 'Description for Task 1', NULL, 10, 'easy', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af07', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Task 2', 'Description for Task 2', NULL, 20, 'medium', 2, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af08', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Đi xe đạp thay vì xe máy', 'Đi xe đạp ít nhất 3 ngày trong tuần để giảm khí thải.', NULL, 20, 'medium', 3, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af09', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Tắt đèn khi ra khỏi phòng', 'Tắt đèn và các thiết bị điện mỗi khi ra khỏi phòng.', NULL, 10, 'easy', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Sử dụng bình nước cá nhân', 'Mang theo bình nước cá nhân thay vì mua chai nhựa dùng một lần.', NULL, 15, 'easy', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Gom pin đã qua sử dụng', 'Thu gom ít nhất 10 viên pin cũ và đem đến điểm thu hồi.', NULL, 25, 'medium', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0c', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Tham gia chiến dịch trồng rừng', 'Tham gia ít nhất một buổi trồng rừng tại địa phương.', NULL, 35, 'hard', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0d', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Chia sẻ kiến thức môi trường', 'Viết bài chia sẻ hoặc đăng video tuyên truyền bảo vệ môi trường.', NULL, 30, 'medium', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0e', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Không dùng ống hút nhựa', 'Không sử dụng ống hút nhựa trong vòng 1 tuần.', NULL, 15, 'easy', 7, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0f', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Tham gia dọn rác bãi biển', 'Tham gia một buổi dọn rác tại bãi biển gần bạn.', NULL, 40, 'hard', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af10', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Sử dụng đồ tái chế', 'Mua và sử dụng ít nhất 3 sản phẩm tái chế.', NULL, 20, 'medium', 3, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af11', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Tự làm compost', 'Bắt đầu ủ rác hữu cơ trong hộp compost tại nhà.', NULL, 30, 'hard', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af12', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Tắm trong 5 phút', 'Giới hạn thời gian tắm trong 5 phút trong một tuần.', NULL, 10, 'easy', 7, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af13', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Giảm sử dụng giấy', 'Chuyển sang lưu trữ tài liệu số thay vì in ra giấy.', NULL, 15, 'medium', 1, 'private', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af14', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Tham gia workshop môi trường', 'Tham gia một buổi hội thảo hoặc lớp học liên quan đến môi trường.', NULL, 25, 'medium', 1, 'private', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af15', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Tiết kiệm nước khi rửa bát', 'Dùng chậu hoặc vòi tiết kiệm nước khi rửa bát trong một tuần.', NULL, 10, 'easy', 7, 'private', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af16', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Dọn sạch khu phố', 'Tổ chức hoặc tham gia một buổi tổng vệ sinh khu phố.', NULL, 30, 'medium', 1, 'private', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af17', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Tham gia thử thách sống xanh', 'Hoàn thành thử thách sống xanh trong một tuần (không nhựa, tiết kiệm nước, v.v.).', NULL, 40, 'hard', 7, 'private', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af18', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Sửa chữa đồ dùng thay vì vứt đi', 'Sửa chữa ít nhất một món đồ thay vì mua mới.', NULL, 20, 'medium', 1, 'private', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af19', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Ủng hộ tổ chức môi trường', 'Quyên góp hoặc hỗ trợ truyền thông cho một tổ chức bảo vệ môi trường.', NULL, 35, 'medium', 1, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af1a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Trồng cây tại nhà', 'Trồng ít nhất 3 chậu cây xanh trong khu vực sinh sống.', NULL, 25, 'easy', 3, 'public', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af1b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Sử dụng năng lượng tái tạo', 'Cài đặt hoặc sử dụng thiết bị dùng năng lượng mặt trời (ví dụ: đèn năng lượng mặt trời).', NULL, 50, 'hard', 1, 'public', now(), now());

-- Map Task to Type (daily = ae01, others = ae02)
INSERT INTO task_types (id, task_id, type_id, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af01', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af03', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af06', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b104', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af09', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b105', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b106', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0e', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b107', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af12', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b108', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af15', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b109', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af1a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b10a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af05', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b10b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af13', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b10c', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af18', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae01', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b10d', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af02', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b10e', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af04', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b10f', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af07', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b110', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af08', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b111', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b112', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0c', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b113', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0d', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b114', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af0f', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b115', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af10', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b116', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af11', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b117', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af14', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b118', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af16', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b119', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af17', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b11a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af19', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b11b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af1b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ae02', now(), now());

INSERT INTO task_users (id, user_id, task_id, progress_count, assigned_at, completed_at, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b201', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af01', 0, now(), NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b202', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af02', 0, now(), NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b203', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af02', 5, now(), now(), now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b204', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af03', 0, now(), NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b205', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af04', 0, now(), now(), now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b206', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af05', 3, now(), NULL, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b207', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a106', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af06', 0, now(), now(), now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b208', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6af07', 2, now(), NULL, now(), now());

-- ============================================================================
-- 4. PRODUCTS & ITEMS
-- ============================================================================

INSERT INTO products (id, seller_id, name, description, price, category, product_status, post_status, images, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b301', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Chậu cây mini dễ thương', 'Cần pass lại do không còn chỗ trưng. Tình trạng như mới.', 30000, 'plants', 'used', 'pending', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746902647/images/9e96ed7d97d423c29cbfe7ac1588b074-2930343147987943507_kiy1ee.jpg']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b302', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Túi vải handmade xinh xắn', 'Tự làm, còn dư vài cái. Pass giá rẻ cho bạn nào cần.', 50000, 'handicraft', 'new', 'public', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746902829/images/86683df39f3609c699aa5760935d8621-2930718888022600023_i4htaf.jpg']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b303', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Chai thuỷ tinh tái chế', 'Còn dư nhiều chai, ai cần trang trí thì lấy nha.', 10000, 'recycled', 'used', 'public', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746902922/images/9279816337de0736f48824198a8d3f63-2930191749800411219_fgwemf.jpg']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b304', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'Phân compost hữu cơ', 'Tự ủ tại nhà, sạch sẽ, phù hợp cho cây trồng.', 20000, 'organic', 'new', 'rejected', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746902986/images/Compost_site_germany_ek6aqo.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b305', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'Bình tưới cây ', 'Không còn dùng đến nên pass lại, ai cần lấy liền.', 25000, 'other', 'used', 'private', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746903034/images/536d073ccf2cc4786af8a4ab1a714234-2923772376550076349_tb3hhu.jpg']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b306', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Bàn gỗ tái chế', 'Bàn gỗ tự làm từ gỗ tái chế, rất chắc chắn và đẹp.', 150000, 'handicraft', 'new', 'public', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746903088/images/5637cac969acb10bafdd97a681df83b4-2739953130120764939_zjs6tn.jpg']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b307', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a106', 'Đèn ngủ handmade', 'Đèn ngủ tự làm, ánh sáng dịu nhẹ, phù hợp cho phòng ngủ.', 80000, 'handicraft', 'new', 'pending', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746903170/images/cach-lam-den-ngu-bang-que-kem11_jh5zwb.png']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b308', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 'Sách cũ - Bộ tiểu thuyết', 'Bộ tiểu thuyết còn mới 90%, ai cần thì lấy nhé.', 120000, 'other', 'used', 'public', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746903223/images/nha-sach-cu-ha-noi-6_z4xbiw.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b309', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a108', 'Áo thun second-hand', 'Áo thun còn mới 80%, size M, ai cần thì lấy.', 30000, 'other', 'used', 'private', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746903273/images/5c7e527eb8714b5a05bea9056d04242f-2929918922757690963_petdup.jpg']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b30a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a109', 'Bộ dụng cụ làm vườn', 'Bộ dụng cụ làm vườn đầy đủ, còn mới 95%.', 50000, 'other', 'new', 'public', ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746903334/images/7a2e14d4f65729b4f2265fa8c1891c91-2930352790853110843_isp378.jpg']::text[], now(), now());

INSERT INTO items (id, product_id, creator_id, name, description, price, stock, status, weight, length, width, height, purchase_limit_per_day, images, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b401', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Bình nước giữ nhiệt', 'Bình nước giữ nhiệt giúp giảm thiểu sử dụng chai nhựa dùng một lần.', 150, 5, 'available', 500, 25, 7, 7, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746897437/images/binh-nuoc-inox-sport-xanh_ttsias.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b402', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'Ống hút tre', 'Bộ ống hút tre tái sử dụng, thân thiện với môi trường.', 50, 10, 'available', 100, 20, 2, 2, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746897546/images/ong-hut-tre-jungle-straws-bamboo-xs-05_y2kbw1.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b403', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Túi vải canvas', 'Túi vải thay thế túi nilon, có thể sử dụng nhiều lần.', 80, 15, 'available', 300, 35, 30, 2, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746898775/images/tui-vai-trust-and-love_ozq5vx.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b404', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Bàn chải tre', 'Bàn chải đánh răng làm từ tre, phân hủy sinh học.', 40, 20, 'available', 80, 18, 3, 2, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746898827/images/3a80f0a2-8a28-4fb4-a0e1-278534f467ef_dpek76.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b405', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'Xà phòng hữu cơ', 'Xà phòng thiên nhiên không chứa hóa chất độc hại.', 120, 8, 'available', 150, 8, 6, 3, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746898886/images/xa-phong-thien-nhien.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b406', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Hộp cơm inox', 'Hộp cơm làm từ inox, giúp giảm thiểu rác thải nhựa.', 200, 6, 'available', 600, 20, 15, 8, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746898961/images/20231227_kdaj9PlpqF_u5jdtb.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b407', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'Khăn vải tái sử dụng', 'Khăn vải thay thế khăn giấy, thân thiện môi trường.', 60, 12, 'available', 200, 30, 30, 1, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746899044/images/papaya-reusable-paper-towels-1c593b2088384796a1559230c982af26_vbtd7x.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b408', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Sáp ong bọc thực phẩm', 'Giấy bọc thực phẩm từ sáp ong, thay thế màng bọc nhựa.', 90, 9, 'available', 120, 25, 25, 1, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746899117/images/Set-Vai-Sap-Ong-Boc-Thuc-Pham-Nhieu-Size-Limart-1-scaled_ozevpy.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b409', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Ly tre', 'Ly uống nước từ tre, có thể sử dụng lâu dài.', 100, 10, 'available', 250, 10, 10, 12, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746901042/images/g-987250ab-0920-4498-b791-1108ec053f53_tzjsmc.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b40a', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'Giấy tái chế', 'Sổ tay làm từ giấy tái chế, bảo vệ rừng.', 70, 14, 'available', 300, 21, 15, 2, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746902358/images/so-tay-qua-tang_fvom4r.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b40b', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Dép lốp xe tái chế', 'Dép được làm từ lốp xe cũ, bền và độc đáo.', 110, 7, 'available', 700, 28, 10, 6, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746901250/images/960px-Tire_Sandals_vme1sp.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b40c', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'Nước giặt sinh học', 'Nước giặt từ thiên nhiên, an toàn cho da và môi trường.', 130, 5, 'available', 1000, 25, 15, 10, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746901329/images/Tha%CC%80nhpha%CC%82%CC%80ntu%CC%9B%CC%A3nhie%CC%82nla%CC%80nhti%CC%81nh-845x500_dz0tol.png']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b40d', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Bình xịt tinh dầu thiên nhiên', 'Bình xịt khử mùi từ tinh dầu tự nhiên.', 140, 4, 'available', 350, 18, 5, 5, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746901451/images/130001-mua-tinh-dau-cam-ngot-nguyen-chat-o-dau-uy-tin-chat-luong-tai-tp-ho-chi-minh-sweet-orange-essential-oil_lbcf8k.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b40e', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Đèn năng lượng mặt trời', 'Đèn sử dụng năng lượng mặt trời, tiết kiệm điện.', 250, 3, 'available', 800, 20, 20, 15, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746901511/images/71zpVVph3mL_mzbw1o.webp']::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b40f', NULL, 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'Nến sáp đậu nành', 'Nến thơm làm từ sáp đậu nành, không độc hại.', 90, 6, 'available', 250, 8, 8, 9, NULL, ARRAY['https://res.cloudinary.com/dygavzq8m/image/upload/v1746901561/images/cach-lam-sap-dau-nanh_c90bda45135b4d929c0760dbd53b7ac9_grande_aelnlt.webp']::text[], now(), now());

-- ============================================================================
-- 5. RECEIVER INFOS & DELIVERY ACCOUNTS & TRANSACTIONS & DELIVERY ORDERS
-- ============================================================================

INSERT INTO receiver_informations (id, user_id, to_name, to_phone, to_address, to_ward_name, to_district_name, to_province_name, account_type, is_default, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b501', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Nguyen Van A', '0901234567', '106 Nguyen Van Dau, Phuong 7, Binh Thanh, TP HCM', 'Phường 7', 'Quận Bình Thạnh', 'Hồ Chí Minh', 'home', true, now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b502', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'Tran Thi B', '0912345678', '123 Le Loi, Phuong 5, Quan 3, TP HCM', 'Phường 5', 'Quận 3', 'Hồ Chí Minh', 'office', false, now(), now());

INSERT INTO delivery_accounts (id, name, user_id, carrier, api_config, is_default) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b601', 'Quoc Anh', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'ghn', '{"token": "c3f24415-29b9-11f0-9b81-222185cb68c8", "shop_id": "196506"}'::jsonb, true),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b602', 'John Doe', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'ghn', '{"token": "c3f24415-29b9-11f0-9b81-222185cb68c8", "shop_id": "196506"}'::jsonb, false);

-- Item snapshot and transaction logs
INSERT INTO transactions (id, receiver_information_id, buyer_id, seller_id, item_id, name, item_snapshot, total_price, quantity, status, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b701', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b501', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b401', 'Transaction 1', '{"public_id": "ITEM-01", "creator": {"id": 2, "full_name": "Seller One", "username": "seller1"}, "name": "Eco Bottle", "description": "Reusable eco-friendly bottle", "price": 1000}'::jsonb, 1000, 1, 'accepted', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b702', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b502', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b402', 'Transaction 2', '{"public_id": "ITEM-02", "creator": {"id": 1, "full_name": "Seller Two", "username": "seller2"}, "name": "Bamboo Toothbrush", "description": "Sustainable bamboo toothbrush", "price": 2000}'::jsonb, 2000, 1, 'pending', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b703', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b501', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b403', 'Transaction 3', '{"public_id": "ITEM-03", "creator": {"id": 3, "full_name": "Seller Three", "username": "seller3"}, "name": "Organic Soap", "description": "Natural handmade soap", "price": 1500}'::jsonb, 1500, 1, 'rejected', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b704', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b502', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b404', 'Transaction 4', '{"public_id": "ITEM-04", "creator": {"id": 2, "full_name": "Seller One", "username": "seller1"}, "name": "Canvas Bag", "description": "Eco-friendly shopping bag", "price": 2500}'::jsonb, 2500, 1, 'accepted', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b705', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b501', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b405', 'Transaction 5', '{"public_id": "ITEM-05", "creator": {"id": 3, "full_name": "Seller Three", "username": "seller3"}, "name": "Recycled Notebook", "description": "Notebook made from recycled paper", "price": 3000}'::jsonb, 3000, 1, 'pending', now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b706', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b502', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b406', 'Transaction 6', '{"public_id": "ITEM-06", "creator": {"id": 1, "full_name": "Seller Two", "username": "seller2"}, "name": "Eco Pen", "description": "Biodegradable pen made from recycled materials", "price": 1800}'::jsonb, 1800, 1, 'cancelled', now(), now();

-- Mapping 5 DOs to 5 Transactions:
-- DO 1 -> Tx 6 (seller 1, buyer 2)
-- DO 2 -> Tx 4 (seller 2, buyer 3)
-- DO 3 -> Tx 1 (Chuyển DO 3 sang seller 2, buyer 1)
-- DO 4 -> Tx 2 (Chuyển DO 4 sang seller 1, buyer 2)
-- DO 5 -> Tx 3 (Chuyển DO 5 sang seller 3, buyer 2)
INSERT INTO delivery_orders (id, transaction_id, seller_id, buyer_id, delivery_account_id, order_code, status, to_name, to_phone, to_address, is_printed, created_date, cod_amount, weight, payment_type_id, total_amount, item_snapshot) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b801', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b706', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b601', 'LB6LQC', 'ready_to_pick', 'Nguyen Van A', '0901234567', '106 Nguyen Van Dau, Phuong 7, Binh Thanh, TP HCM', false, now(), 1000000, 500, 2, 1050000, NULL),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b802', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b704', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b602', 'LB6LQU', 'delivered', 'Tran Thi B', '0912345678', '123 Le Loi, Phuong 5, Quan 3, TP HCM', true, now(), 2000000, 1000, 1, 2050000, NULL),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b803', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b701', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b601', 'LBL6QG', 'cancel', 'Le Van C', '0923456789', '45 Tran Hung Dao, Phuong 1, Quan 1, TP HCM', false, now(), 1500000, 750, 2, 1550000, NULL),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b804', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b702', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b602', 'LB6LQ7', 'delivering', 'Pham Thi D', '0934567890', '78 Nguyen Trai, Phuong 3, Quan 5, TP HCM', true, now(), 2500000, 1200, 1, 2550000, NULL),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b805', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b703', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b601', 'LB6LQF', 'returned', 'Hoang Van E', '0945678901', '12 Ly Tu Trong, Phuong Ben Nghe, Quan 1, TP HCM', false, now(), 3000000, 800, 2, 3050000, NULL);

-- ============================================================================
-- 6. EVENTS & EVENT USERS
-- ============================================================================

INSERT INTO events (id, public_id, creator_id, title, description, location, capacity, coins, end_sign, start_time, end_time, status, images, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b901', 'EV-01', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', '[37 ĐỘ SỰ KIỆN] -  “ĐỔI RÁC LẤY QUÀ XINH', 'Đổi rác lấy quà xinh” là một sự kiện “xanh” được CLB 37 Độ Sinh Viên tổ chức với mục đích thu gom những “rác thải” thường ngày của các bạn sinh viên như: chai nhựa, lon nước, giấy,…đổi lấy những món quà xinh xắn và thân thiện với môi trường.', 'Sảnh chính văn phòng Đoàn (Trước Hội trường D tại Học viện Công nghệ Bưu chính Viễn thông TP.HCM)', 100, 7000, '2025-04-25 00:00:00', '2025-05-06 00:00:00', '2025-05-07 00:00:00', 'upcoming', ARRAY[]::text[], now() - INTERVAL '18 day', now() - INTERVAL '18 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b902', 'EV-02', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Thu gom rác thải nhựa', 'Chiến dịch thu gom rác thải nhựa tại công viên trung tâm nhằm nâng cao ý thức bảo vệ môi trường.', 'Công viên trung tâm Tao Đàn', 100, 6000, now() - INTERVAL '8 day', now() + INTERVAL '5 day', now() + INTERVAL '5 day 5 hour', 'upcoming', ARRAY[]::text[], now() - INTERVAL '10 day', now() - INTERVAL '10 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b903', 'EV-03', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Trồng cây gây rừng', 'Hoạt động trồng cây tại khu vực đồi trọc để phục hồi hệ sinh thái và giảm thiểu biến đổi khí hậu.', 'Khu vực đồi Trảng Dài', 100, 1000, now() + INTERVAL '15 day', now() + INTERVAL '20 day', now() + INTERVAL '20 day 5 hour', 'upcoming', ARRAY[]::text[], now(), now()),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b904', 'EV-04', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Chiến dịch ''No Plastic''', 'Vận động người dân hạn chế sử dụng túi nilon và thay bằng túi vải, sản phẩm thân thiện môi trường.', 'Chợ Hòa Bình', 100, 3000, now() - INTERVAL '15 day', now() - INTERVAL '7 day', now() - INTERVAL '6 day 20 hour', 'upcoming', ARRAY[]::text[], now() - INTERVAL '30 day', now() - INTERVAL '30 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b905', 'EV-05', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Dọn vệ sinh bãi biển', 'Tình nguyện viên tham gia dọn rác tại bãi biển và tuyên truyền về ô nhiễm đại dương.', 'Bãi biển Phan Thiết', 100, 4000, now() - INTERVAL '10 day', now() + INTERVAL '16 hour', now() + INTERVAL '21 hour', 'upcoming', ARRAY[]::text[], now() - INTERVAL '16 day', now() - INTERVAL '16 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b906', 'EV-06', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Tái chế rác thải điện tử', 'Hướng dẫn phân loại và thu gom rác thải điện tử đúng cách để bảo vệ sức khỏe cộng đồng.', 'Nhà văn hóa quận 10', 100, 10000, now() - INTERVAL '13 day', now() + INTERVAL '16 hour', now() + INTERVAL '21 hour', 'upcoming', ARRAY[]::text[], now() - INTERVAL '16 day', now() - INTERVAL '16 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b907', 'EV-07', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'Hội thảo về biến đổi khí hậu', 'Chia sẻ kiến thức và giải pháp ứng phó với biến đổi khí hậu dành cho sinh viên và người dân.', 'Trường ĐH Khoa học Tự nhiên', 100, 4000, now() - INTERVAL '10 day', now() - INTERVAL '4 day', now() - INTERVAL '3 day 18 hour', 'upcoming', ARRAY[]::text[], now() - INTERVAL '18 day', now() - INTERVAL '18 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b908', 'EV-08', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'Đổi rác lấy quà', 'Người dân mang rác tái chế đến để đổi lấy cây xanh và quà tặng thân thiện với môi trường.', 'Khu đô thị EcoCity', 100, 7000, now() - INTERVAL '15 day', now() + INTERVAL '16 hour', now() + INTERVAL '21 hour', 'upcoming', ARRAY[]::text[], now() - INTERVAL '18 day', now() - INTERVAL '18 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b909', 'EV-09', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a101', 'Chiến dịch tắt đèn Giờ Trái Đất', 'Cùng nhau tắt đèn trong một giờ để kêu gọi tiết kiệm năng lượng và bảo vệ Trái Đất.', 'Phố đi bộ Nguyễn Huệ', 100, 4500, now() - INTERVAL '10 day', now() - INTERVAL '5 day', now() - INTERVAL '4 day 15 hour', 'upcoming', ARRAY[]::text[], now() - INTERVAL '20 day', now() - INTERVAL '20 day');

INSERT INTO event_users (id, user_id, event_id, joined_at, completed_at, created_at, updated_at) VALUES
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba01', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b901', now() - INTERVAL '5 day', now() - INTERVAL '4 day 18 hour', now() - INTERVAL '5 day', now() - INTERVAL '4 day 18 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba02', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a105', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b902', NULL, NULL, now() - INTERVAL '5 day', now() - INTERVAL '5 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba03', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b901', now() - INTERVAL '5 day', now() - INTERVAL '4 day 15 hour', now() - INTERVAL '10 day', now() - INTERVAL '4 day 15 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba04', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a108', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b904', now() - INTERVAL '7 day', now() - INTERVAL '6 day 21 hour', now() - INTERVAL '5 day', now() - INTERVAL '6 day 21 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba05', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b905', NULL, NULL, now() - INTERVAL '15 day', now() - INTERVAL '15 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba06', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a102', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b903', NULL, NULL, now() - INTERVAL '9 day', now() - INTERVAL '9 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba07', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a106', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b903', NULL, NULL, now() - INTERVAL '7 day', now() - INTERVAL '7 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba08', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a108', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b907', now() - INTERVAL '4 day', now() - INTERVAL '3 day 20 hour', now() - INTERVAL '10 day', now() - INTERVAL '3 day 20 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba09', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a107', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b907', now() - INTERVAL '4 day 1 hour', now() - INTERVAL '3 day 19 hour', now() - INTERVAL '10 day', now() - INTERVAL '3 day 19 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba0a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a103', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b906', now() - INTERVAL '3 day', now() - INTERVAL '2 day 12 hour', now() - INTERVAL '3 day', now() - INTERVAL '2 day 12 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba0b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a104', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b908', now() - INTERVAL '2 day', now() - INTERVAL '1 day 10 hour', now() - INTERVAL '2 day', now() - INTERVAL '1 day 10 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba0c', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a109', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b902', now() - INTERVAL '4 day', NULL, now() - INTERVAL '4 day', now() - INTERVAL '4 day'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba0d', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10a', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b905', now() - INTERVAL '6 day', now() - INTERVAL '5 day 8 hour', now() - INTERVAL '6 day', now() - INTERVAL '5 day 8 hour'),
('da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6ba0e', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6a10b', 'da1b7a2d-1c3b-4c5d-a1b2-c3d4e5f6b904', now() - INTERVAL '7 day', NULL, now() - INTERVAL '7 day', now() - INTERVAL '7 day');

COMMIT;
