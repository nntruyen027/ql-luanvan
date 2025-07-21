-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 21, 2025 lúc 01:59 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nienluan`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `academic_years`
--

CREATE TABLE `academic_years` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `academic_years`
--

INSERT INTO `academic_years` (`id`, `name`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(18, 'Năm học 2020-2021', '2020-01-01', '2021-01-01', 0, '2025-06-17 01:30:26', '2025-06-17 18:42:03'),
(20, 'Năm học 2021-2022', '2021-01-02', '2022-01-01', 0, '2025-06-17 01:45:49', '2025-06-17 18:41:58'),
(21, 'Năm học 2022-2023', '2022-01-03', '2023-01-03', 0, '2025-06-17 01:46:30', '2025-06-17 18:41:47'),
(22, 'Năm học 2023-2024', '2023-01-04', '2024-01-04', 0, '2025-06-17 01:47:19', '2025-06-17 18:41:39'),
(23, 'Năm học 2024-2025', '2024-01-05', '2025-01-05', 0, '2025-06-17 01:49:24', '2025-06-20 21:04:07'),
(24, 'Năm học 2025 - 2026', '2025-01-06', '2026-01-06', 1, '2025-06-17 01:49:46', '2025-06-20 21:04:07'),
(25, 'Năm học 2026-2027', '2026-01-07', '2026-01-07', 0, '2025-06-17 01:50:10', '2025-06-17 18:41:24'),
(26, 'Năm học 2027-2028', '2026-01-08', '2027-01-08', 0, '2025-06-17 01:50:41', '2025-06-17 18:41:18'),
(27, 'Năm học 2028-2029', '2027-01-09', '2028-01-09', 0, '2025-06-17 01:51:03', '2025-06-17 18:41:10'),
(28, 'Năm học 2029-2030', '2029-01-11', '2030-01-11', 0, '2025-06-17 01:52:09', '2025-06-17 18:41:03'),
(29, 'Năm học 2030-2031', '2030-01-12', '2031-01-12', 0, '2025-06-17 01:52:46', '2025-06-17 18:40:56'),
(32, 'Năm học 2031-2032', '2031-06-18', '2032-06-18', 0, '2025-06-17 04:46:06', '2025-06-17 18:40:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `majors`
--

CREATE TABLE `majors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `majors`
--

INSERT INTO `majors` (`id`, `name`, `code`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(5, 'Kỹ thuật phần mềm', 'KTPM', 'Kỹ thuật phần mềm', 1, '2025-06-16 19:53:23', '2025-06-17 05:19:28'),
(6, 'Hệ thống thông tin', 'HTTT', 'Hệ thống thông tin', 1, '2025-06-16 19:54:12', '2025-06-17 05:19:17'),
(7, 'Công nghệ thông tin', 'CNTT', 'Công nghệ thông tin', 1, '2025-06-17 05:13:59', '2025-06-17 05:19:07'),
(8, 'Khoa học máy tính', 'KHMT', 'Khoa học máy tính', 1, '2025-06-17 05:14:07', '2025-06-17 05:19:48'),
(9, 'Trí tuệ nhân tạo (AI)', 'TTNTAI', 'Trí tuệ nhân tạo (AI)', 1, '2025-06-17 05:14:14', '2025-06-17 05:20:07'),
(10, 'Kỹ thuật điện, điện tử', 'KTDDT', 'Kỹ thuật điện, điện tử', 0, '2025-06-17 05:14:20', '2025-06-17 05:20:45'),
(11, 'Kỹ thuật cơ điện tử', 'KTCDT', 'Kỹ thuật cơ điện tử', 1, '2025-06-17 05:14:27', '2025-06-17 05:21:00'),
(12, 'Kỹ thuật điều khiển và tự động hóa', 'TDH', 'Kỹ thuật điều khiển và tự động hóa', 1, '2025-06-17 05:14:35', '2025-06-17 05:21:17'),
(13, 'Kỹ thuật xây dựng', 'KTXD', 'Kỹ thuật xây dựng', 1, '2025-06-17 05:14:45', '2025-06-17 05:21:36'),
(14, 'Kỹ thuật môi trường', 'KTMT', 'Kỹ thuật môi trường', 0, '2025-06-17 05:14:52', '2025-06-17 05:21:49'),
(16, 'Công nghệ thực phẩm', 'CNTP', 'Công nghệ thực phẩm', 1, '2025-06-17 05:15:33', '2025-06-17 05:22:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_06_15_135031_add_username_to_users_table', 2),
(6, '2025_06_15_135504_add_username_column_to_users_table', 3),
(7, '2025_06_16_024606_create_academic_years_table', 4),
(8, '2025_06_16_134431_create_semesters_table', 5),
(9, '2025_06_17_012612_create_majors_table', 6),
(10, '2025_06_17_032221_create_rooms_table', 7),
(11, '2025_06_17_135647_create_report_periods_table', 8),
(12, '2025_06_18_074711_add_lecturer_fields_to_users_table', 9),
(14, '2025_06_18_151540_create_thesis_attachments_table', 10),
(15, '2025_06_18_151513_create_theses_table', 11),
(16, '2025_06_20_025452_create_thesis_registrations_table', 12),
(20, '2025_06_23_021240_create_thesis_tasks_table', 13),
(21, '2025_06_24_152746_create_thesis_councils_table', 14),
(22, '2025_06_24_152819_create_thesis_council_members_table', 14),
(23, '2025_07_05_034255_create_schedules_table', 15),
(24, '2025_07_12_101501_create_thesis_task_attachments_table', 16),
(25, '2025_07_12_165258_create_permissions_table', 17),
(26, '2025_07_12_165303_create_roles_table', 17),
(27, '2025_07_12_165311_create_permission_role_table', 17),
(28, '2025_07_12_165318_create_role_user_table', 17);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `module` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `permissions`
--

INSERT INTO `permissions` (`id`, `module`, `action`, `code`, `created_at`, `updated_at`) VALUES
(28, 'Đề tài đăng ký', 'Truy cập', 'access:thesis-register', '2025-07-15 08:38:48', '2025-07-15 08:38:48'),
(30, 'Đề tài đăng ký', 'Thêm', 'add:thesis-register', '2025-07-15 08:51:46', '2025-07-15 08:51:46'),
(31, 'Đề tài đăng ký', 'Sửa', 'edit:thesis-register', '2025-07-15 08:51:58', '2025-07-15 08:51:58'),
(32, 'Đề tài đăng ký', 'Xóa', 'delete:thesis-register', '2025-07-15 08:52:11', '2025-07-15 08:52:11'),
(33, 'Đề tài công bố', 'Truy cập', 'access:thesis-publish', '2025-07-15 08:55:23', '2025-07-15 08:55:23'),
(34, 'Đề tài công bố', 'Thêm', 'add:thesis-publish', '2025-07-15 08:55:37', '2025-07-15 08:55:37'),
(35, 'Đề tài công bố', 'Sửa', 'edit:thesis-publish', '2025-07-15 08:55:49', '2025-07-15 08:55:49'),
(36, 'Đề tài công bố', 'Xóa', 'delete:thesis-publish', '2025-07-15 08:56:01', '2025-07-15 08:56:01'),
(37, 'Công việc luận văn', 'Truy cập', 'access:thesis-task', '2025-07-15 08:59:18', '2025-07-15 08:59:18'),
(38, 'Công việc luận văn', 'Thêm', 'add:thesis-task', '2025-07-15 08:59:30', '2025-07-15 08:59:30'),
(39, 'Công việc luận văn', 'Sửa', 'edit:thesis-task', '2025-07-15 08:59:41', '2025-07-15 08:59:41'),
(40, 'Công việc luận văn', 'Xóa', 'delete:thesis-task', '2025-07-15 08:59:53', '2025-07-15 08:59:53'),
(41, 'Lịch bảo vệ', 'Truy cập', 'access:thesis-schedule', '2025-07-15 09:00:12', '2025-07-15 09:00:12'),
(42, 'Danh sách lịch bảo vệ', 'Truy cập', 'access:defense-schedule', '2025-07-16 18:21:32', '2025-07-16 18:21:32'),
(43, 'Danh sách lịch bảo vệ', 'Thêm', 'add:defense-schedule', '2025-07-16 18:21:47', '2025-07-16 18:21:47'),
(44, 'Danh sách lịch bảo vệ', 'Sửa', 'edit:defense-schedule', '2025-07-16 18:22:05', '2025-07-16 18:22:05'),
(45, 'Danh sách lịch bảo vệ', 'Xóa', 'delete:defense-schedule', '2025-07-16 18:22:22', '2025-07-16 18:22:22'),
(46, 'Danh sách hội đồng luận văn', 'Truy cập', 'access:defense-committee', '2025-07-16 18:25:10', '2025-07-16 18:25:10'),
(47, 'Danh sách hội đồng luận văn', 'Thêm', 'add:defense-committee', '2025-07-16 18:25:23', '2025-07-16 18:25:23'),
(48, 'Danh sách hội đồng luận văn', 'Sửa', 'edit:defense-committee', '2025-07-16 18:25:39', '2025-07-16 18:25:39'),
(49, 'Danh sách hội đồng luận văn', 'Xóa', 'delete:defense-committee', '2025-07-16 18:25:56', '2025-07-16 18:25:56'),
(50, 'Danh sách đề tài đăng ký', 'Truy cập', 'access:registered-topics', '2025-07-16 18:27:23', '2025-07-16 18:27:23'),
(51, 'Danh sách đề tài đăng ký', 'Thêm', 'add:registered-topics', '2025-07-16 18:27:36', '2025-07-16 18:27:36'),
(52, 'Danh sách đề tài đăng ký', 'Sửa', 'edit:registered-topics', '2025-07-16 18:27:48', '2025-07-16 18:27:48'),
(53, 'Danh sách đề tài đăng ký', 'Xóa', 'delete:registered-topics', '2025-07-16 18:28:18', '2025-07-16 18:28:18'),
(54, 'Danh sách đợt đăng ký', 'Truy cập', 'access:registration-period', '2025-07-16 18:28:58', '2025-07-16 18:28:58'),
(55, 'Danh sách đợt đăng ký', 'Thêm', 'add:registration-period', '2025-07-16 18:29:14', '2025-07-16 18:29:14'),
(56, 'Danh sách đợt đăng ký', 'Sửa', 'edit:registration-period', '2025-07-16 18:29:29', '2025-07-16 18:29:29'),
(57, 'Danh sách đợt đăng ký', 'Xóa', 'delete:registration-period', '2025-07-16 18:29:42', '2025-07-16 18:29:42'),
(58, 'Danh sách phòng học', 'Truy cập', 'access:classroom-list', '2025-07-16 18:30:28', '2025-07-16 18:30:28'),
(59, 'Danh sách phòng học', 'Thêm', 'add:classroom-list', '2025-07-16 18:30:39', '2025-07-16 18:30:39'),
(60, 'Danh sách phòng học', 'Sửa', 'edit:classroom-list', '2025-07-16 18:30:51', '2025-07-16 18:30:51'),
(61, 'Danh sách phòng học', 'Xóa', 'delete:classroom-list', '2025-07-16 18:31:03', '2025-07-16 18:31:03'),
(62, 'Danh sách ngành học', 'Truy cập', 'access:majors', '2025-07-16 18:31:36', '2025-07-16 18:31:36'),
(63, 'Danh sách ngành học', 'Thêm', 'add:majors', '2025-07-16 18:31:51', '2025-07-16 18:31:51'),
(64, 'Danh sách ngành học', 'Sửa', 'edit:majors', '2025-07-16 18:32:03', '2025-07-16 18:32:03'),
(65, 'Danh sách ngành học', 'Xóa', 'delete:majors', '2025-07-16 18:32:14', '2025-07-16 18:32:14'),
(66, 'Danh sách kỳ học', 'Truy cập', 'access:semesters', '2025-07-16 18:32:48', '2025-07-16 18:32:48'),
(67, 'Danh sách kỳ học', 'Thêm', 'add:semesters', '2025-07-16 18:33:03', '2025-07-16 18:33:03'),
(68, 'Danh sách kỳ học', 'Sửa', 'edit:semesters', '2025-07-16 18:33:17', '2025-07-16 18:33:17'),
(69, 'Danh sách kỳ học', 'Xóa', 'delete:semesters', '2025-07-16 18:33:31', '2025-07-16 18:33:31'),
(70, 'Danh sách năm học', 'Truy cập', 'access:academic-years', '2025-07-16 18:34:03', '2025-07-16 18:34:03'),
(71, 'Danh sách năm học', 'Thêm', 'add:academic-years', '2025-07-16 18:34:14', '2025-07-16 18:34:14'),
(72, 'Danh sách năm học', 'Sửa', 'edit:academic-years', '2025-07-16 18:34:24', '2025-07-16 18:34:24'),
(73, 'Danh sách năm học', 'Xóa', 'delete:academic-years', '2025-07-16 18:34:38', '2025-07-16 18:34:38'),
(74, 'Danh sách nhóm quyền', 'Truy cập', 'access:permission-groups', '2025-07-16 18:35:10', '2025-07-16 18:35:10'),
(75, 'Danh sách nhóm quyền', 'Thêm', 'add:permission-groups', '2025-07-16 18:35:21', '2025-07-16 18:35:21'),
(76, 'Danh sách nhóm quyền', 'Sửa', 'edit:permission-groups', '2025-07-16 18:35:33', '2025-07-16 18:35:33'),
(77, 'Danh sách nhóm quyền', 'Xóa', 'delete:permission-groups', '2025-07-16 18:35:50', '2025-07-16 18:35:50'),
(78, 'Danh sách quyền', 'Truy cập', 'access:permissions', '2025-07-16 18:36:22', '2025-07-16 18:36:22'),
(79, 'Danh sách quyền', 'Thêm', 'add:permissions', '2025-07-16 18:36:34', '2025-07-16 18:36:34'),
(80, 'Danh sách quyền', 'Sửa', 'edit:permissions', '2025-07-16 18:36:48', '2025-07-16 18:36:48'),
(81, 'Danh sách quyền', 'Xóa', 'delete:permissions', '2025-07-16 18:37:08', '2025-07-16 18:37:08'),
(82, 'Danh sách sinh viên', 'Truy cập', 'access:students', '2025-07-16 18:37:39', '2025-07-16 18:37:39'),
(83, 'Danh sách sinh viên', 'Thêm', 'add:students', '2025-07-16 18:37:48', '2025-07-16 18:37:48'),
(84, 'Danh sách sinh viên', 'Sửa', 'edit:students', '2025-07-16 18:38:02', '2025-07-16 18:38:02'),
(85, 'Danh sách sinh viên', 'Xóa', 'delete:students', '2025-07-16 18:38:12', '2025-07-16 18:38:12'),
(86, 'Danh sách cán bộ', 'Truy cập', 'access:faculty-staff', '2025-07-16 18:39:15', '2025-07-16 18:39:15'),
(87, 'Danh sách cán bộ', 'Thêm', 'add:faculty-staff', '2025-07-16 18:39:24', '2025-07-16 18:39:24'),
(88, 'Danh sách cán bộ', 'Sửa', 'edit:faculty-staff', '2025-07-16 18:39:36', '2025-07-16 18:39:36'),
(89, 'Danh sách cán bộ', 'Xóa', 'delete:faculty-staff', '2025-07-16 18:39:48', '2025-07-16 18:39:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `permission_role`
--

CREATE TABLE `permission_role` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `permission_role`
--

INSERT INTO `permission_role` (`permission_id`, `role_id`) VALUES
(28, 10),
(30, 10),
(31, 10),
(32, 10),
(33, 10),
(34, 10),
(35, 10),
(36, 10),
(37, 10),
(38, 10),
(39, 10),
(40, 10),
(41, 10),
(42, 10),
(43, 10),
(44, 10),
(45, 10),
(46, 10),
(47, 10),
(48, 10),
(49, 10),
(50, 10),
(51, 10),
(52, 10),
(53, 10),
(54, 10),
(55, 10),
(56, 10),
(57, 10),
(58, 10),
(59, 10),
(60, 10),
(61, 10),
(62, 10),
(63, 10),
(64, 10),
(65, 10),
(66, 10),
(67, 10),
(68, 10),
(69, 10),
(70, 10),
(71, 10),
(72, 10),
(73, 10),
(74, 10),
(75, 10),
(76, 10),
(77, 10),
(78, 10),
(79, 10),
(80, 10),
(81, 10),
(82, 10),
(83, 10),
(84, 10),
(85, 10),
(86, 10),
(87, 10),
(88, 10),
(89, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `report_periods`
--

CREATE TABLE `report_periods` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `semester_id` bigint(20) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `report_periods`
--

INSERT INTO `report_periods` (`id`, `name`, `semester_id`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(7, 'Đợt 1', 23, '2025-04-01', '2025-06-18', 0, '2025-06-17 19:55:29', '2025-06-20 09:57:09'),
(8, 'Đợt 2', 23, '2025-06-19', '2025-06-30', 1, '2025-06-17 20:04:51', '2025-06-20 09:57:09');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(5, 'Admin', '2025-07-14 19:26:47', '2025-07-14 20:50:59'),
(6, 'Giảng viên', '2025-07-14 20:50:36', '2025-07-14 20:50:36'),
(7, 'Sinh viên', '2025-07-15 06:07:55', '2025-07-15 06:07:55'),
(10, 'Super_admin', '2025-07-15 09:38:28', '2025-07-15 09:38:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role_user`
--

CREATE TABLE `role_user` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `role_user`
--

INSERT INTO `role_user` (`role_id`, `user_id`) VALUES
(5, 24),
(6, 6),
(6, 11),
(6, 14),
(7, 10),
(7, 12),
(7, 13),
(7, 25),
(10, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(12, 'Phòng họp 1', 'Phòng họp 1', 1, '2025-06-17 00:36:46', '2025-07-04 23:38:46'),
(13, 'Phòng C03', 'Phòng C03', 1, '2025-06-17 00:37:00', '2025-06-17 01:53:52'),
(14, 'Phòng C02', 'Phòng C02', 1, '2025-06-17 00:37:09', '2025-06-17 01:53:41'),
(15, 'Phòng C01', 'Phòng C01', 1, '2025-06-17 00:37:22', '2025-06-17 01:53:30'),
(17, 'Phòng Quản trị thiết bị', 'Phòng Quản trị thiết bị', 1, '2025-06-17 04:52:36', '2025-07-04 23:38:36'),
(18, 'Phòng Đào tạo', 'Phòng Đào tạo', 1, '2025-06-17 06:06:22', '2025-06-17 06:06:22'),
(19, 'Phòng bảo vệ - Cổng B', 'Phòng bảo vệ - Cổng B', 1, '2025-06-17 06:06:44', '2025-07-04 23:38:29'),
(20, 'Phòng thư viện - Khoa CNPT', 'Phòng thư viện - Khoa CNPT', 1, '2025-06-17 06:12:40', '2025-06-17 06:13:07'),
(21, 'Phòng bảo vệ - Cổng A', 'Phòng bảo vệ - Cổng A', 1, '2025-06-17 06:13:35', '2025-06-17 06:13:35'),
(24, 'Phòng thư viện - Khoa CNTT', 'Phòng thư viện - Khoa CNTT', 1, '2025-06-17 06:16:12', '2025-07-04 23:38:21'),
(26, 'Phòng họp 2', 'Phòng họp 2', 1, '2025-06-17 06:18:32', '2025-07-04 23:38:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `schedules`
--

CREATE TABLE `schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `thesis_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `session` enum('sáng','chiều','tối') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `schedules`
--

INSERT INTO `schedules` (`id`, `room_id`, `thesis_id`, `date`, `start_time`, `end_time`, `session`, `created_at`, `updated_at`) VALUES
(24, 12, 11, '2025-07-07', '07:00:00', '08:00:00', 'sáng', '2025-07-07 19:55:33', '2025-07-08 06:48:14'),
(27, 12, 9, '2025-07-07', '17:00:00', '17:59:00', 'chiều', '2025-07-08 01:29:04', '2025-07-08 06:54:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `semesters`
--

CREATE TABLE `semesters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `academic_year_id` bigint(20) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `semesters`
--

INSERT INTO `semesters` (`id`, `name`, `academic_year_id`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(20, 'Kỳ 1', 24, '2025-01-07', '2025-03-30', 0, '2025-06-17 05:43:40', '2025-06-18 19:24:06'),
(23, 'Kỳ 2', 24, '2025-04-01', '2025-06-30', 1, '2025-06-17 05:57:22', '2025-06-20 09:56:27'),
(24, 'Kỳ hè', 24, '2025-07-01', '2025-08-15', 0, '2025-06-17 05:58:33', '2025-06-20 09:56:27'),
(26, 'Kỳ 1', 23, '2024-01-06', '2024-03-30', 1, '2025-06-20 20:45:56', '2025-06-20 20:47:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theses`
--

CREATE TABLE `theses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `report_period_id` bigint(20) UNSIGNED NOT NULL,
  `lecturer_id` bigint(20) UNSIGNED NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `theses`
--

INSERT INTO `theses` (`id`, `name`, `description`, `report_period_id`, `lecturer_id`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(9, 'Xây dựng phần mềm tính lương', 'Chi tiết trong file mô tả:', 8, 6, '2025-06-20', '2025-06-30', '2025-06-19 19:34:46', '2025-06-19 19:35:19'),
(11, 'Xây dựng phần mềm quản lý hồ sơ', 'Chi tiết trong file mô tả:', 8, 11, '2025-06-22', '2025-06-30', '2025-06-21 21:41:01', '2025-06-21 21:41:01'),
(14, 'Xây dựng phần mềm quản lý công việc', 'Mô tả trong file:', 8, 11, '2025-06-25', '2025-06-30', '2025-06-24 18:31:59', '2025-06-24 18:31:59'),
(15, 'Quản lý thu chi', 'Mô tả trong file:', 8, 11, '2025-07-10', '2025-08-31', '2025-07-10 05:31:14', '2025-07-10 05:37:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thesis_attachments`
--

CREATE TABLE `thesis_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `thesis_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thesis_attachments`
--

INSERT INTO `thesis_attachments` (`id`, `thesis_id`, `file_path`, `file_name`, `created_at`, `updated_at`) VALUES
(13, 9, '/storage/theses/d8BsMe04u1wRf4RCECqClt9vYu311t1gnxWzqx10.docx', 'Test.docx', '2025-06-19 19:34:46', '2025-06-19 19:34:46'),
(14, 9, '/storage/theses/EaRg8NzlT5nISjuj4nPymH2aTekmFvWq4bZaQqmm.pdf', 'Test.pdf', '2025-06-21 02:12:03', '2025-06-21 02:12:03'),
(16, 11, '/storage/theses/S433McNmBhnNH8i7QGhCRo5gzfiTubPUPFwOLwwy.doc', 'Test1.doc', '2025-06-21 21:41:01', '2025-06-21 21:41:01'),
(19, 15, '/storage/theses/f6rVNPAgoXZixgoZJRC0RgMdCOxIT6hMFjPzHfyA.docx', 'Test.docx', '2025-07-10 05:37:23', '2025-07-10 05:37:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thesis_councils`
--

CREATE TABLE `thesis_councils` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `thesis_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thesis_councils`
--

INSERT INTO `thesis_councils` (`id`, `thesis_id`, `created_at`, `updated_at`) VALUES
(8, 11, '2025-06-25 09:30:01', '2025-06-25 09:30:01'),
(9, 9, '2025-07-05 01:52:49', '2025-07-05 01:52:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thesis_council_members`
--

CREATE TABLE `thesis_council_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `thesis_council_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thesis_council_members`
--

INSERT INTO `thesis_council_members` (`id`, `thesis_council_id`, `user_id`, `position`, `created_at`, `updated_at`) VALUES
(22, 8, 6, 'Chủ tịch', '2025-06-25 09:30:01', '2025-06-25 09:30:01'),
(23, 8, 11, 'Thư ký', '2025-06-25 09:30:01', '2025-06-25 09:30:01'),
(24, 8, 14, 'Ủy viên', '2025-06-25 09:30:01', '2025-06-25 09:30:01'),
(25, 9, 11, 'Chủ tịch', '2025-07-05 01:52:49', '2025-07-05 01:52:49'),
(26, 9, 6, 'Thư ký', '2025-07-05 01:52:49', '2025-07-05 01:52:49'),
(27, 9, 14, 'Ủy viên', '2025-07-05 01:52:49', '2025-07-05 01:52:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thesis_registrations`
--

CREATE TABLE `thesis_registrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `thesis_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `reject_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thesis_registrations`
--

INSERT INTO `thesis_registrations` (`id`, `thesis_id`, `status`, `reject_note`, `created_at`, `updated_at`) VALUES
(10, 11, 'approved', NULL, '2025-06-21 21:43:21', '2025-06-22 01:35:46'),
(11, 9, 'approved', NULL, '2025-06-21 21:45:05', '2025-06-22 01:35:46'),
(14, 15, 'pending', NULL, '2025-07-17 20:23:13', '2025-07-17 20:23:13'),
(15, 14, 'pending', NULL, '2025-07-18 09:33:18', '2025-07-18 09:33:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thesis_registration_student`
--

CREATE TABLE `thesis_registration_student` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `thesis_registration_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thesis_registration_student`
--

INSERT INTO `thesis_registration_student` (`id`, `thesis_registration_id`, `student_id`, `created_at`, `updated_at`) VALUES
(15, 10, 10, '2025-06-22 04:43:21', '2025-06-22 04:43:21'),
(16, 11, 12, '2025-06-22 04:45:05', '2025-06-22 04:45:05'),
(19, 14, 13, '2025-07-18 03:23:13', '2025-07-18 03:23:13'),
(20, 15, 25, '2025-07-18 16:33:18', '2025-07-18 16:33:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thesis_tasks`
--

CREATE TABLE `thesis_tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `thesis_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `deadline` date NOT NULL,
  `status` enum('notstarted','doing','finished','cancelled') NOT NULL DEFAULT 'notstarted',
  `instructor_status` enum('passed','failed') DEFAULT NULL,
  `instructor_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thesis_tasks`
--

INSERT INTO `thesis_tasks` (`id`, `thesis_id`, `title`, `description`, `deadline`, `status`, `instructor_status`, `instructor_note`, `created_at`, `updated_at`) VALUES
(11, 11, 'Phân tích yêu cầu từ giảng viên', 'Phân tích yêu cầu từ giảng viên', '2025-06-25', 'notstarted', NULL, NULL, '2025-06-24 06:58:22', '2025-06-24 06:58:22'),
(12, 11, 'Đặc tả hệ thống phần mềm quản lý hồ sơ', 'Đặc tả hệ thống phần mềm quản lý hồ sơ', '2025-06-27', 'doing', NULL, NULL, '2025-06-24 06:58:59', '2025-07-12 09:05:51'),
(13, 14, 'Phân tích và thiết kế hệ thống', 'Phân tích và thiết kế hệ thống', '2025-06-30', 'notstarted', 'failed', 'Đã quá hạn task.', '2025-07-10 20:51:25', '2025-07-18 09:25:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thesis_task_attachments`
--

CREATE TABLE `thesis_task_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `thesis_task_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `major_id` bigint(20) UNSIGNED DEFAULT NULL,
  `role` varchar(150) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `user_code`, `name`, `username`, `email`, `phone_number`, `major_id`, `role`, `avatar`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'cb_qtlv01', 'Quản trị viên tối cao', 'sysadmin_qtlv', 'test0129@example.com', '0367562673', 6, 'Super_admin', '/storage/avatar/1752665675_wibu-avatar.jpg', NULL, '$2y$10$BHG8pXzhgI0Fq4OsAOgXdOk/MTNVQfERr3K7O37b.8WOH8oeusPlO', NULL, '2025-06-15 06:56:10', '2025-07-16 18:57:31'),
(6, 'cb999', 'Kim Tân', 'cb999', 'ynkdn999@gmail.com', '0367562680', 6, 'Giảng viên', NULL, NULL, '$2y$10$BHG8pXzhgI0Fq4OsAOgXdOk/MTNVQfERr3K7O37b.8WOH8oeusPlO', NULL, '2025-06-18 05:30:21', '2025-07-15 05:38:09'),
(10, 'sv1999', 'Văn Nguyễn Duy Tân', 'sv1999', 'ynkdn998@gmail.com', '0367562681', 6, 'Sinh viên', '/storage/avatar/1752671526_avatar_meme_24_0703b221ff.jpg', NULL, '$2y$10$BHG8pXzhgI0Fq4OsAOgXdOk/MTNVQfERr3K7O37b.8WOH8oeusPlO', NULL, '2025-06-18 06:37:48', '2025-07-16 08:48:09'),
(11, 'cb200', 'Nguyễn Ngọc Truyện', 'cb200', 'nntruyengay@gmail.com', '0987564799', 5, 'Giảng viên', '/storage/avatar/1752670069_avtTruyen.png', NULL, '$2y$10$BHG8pXzhgI0Fq4OsAOgXdOk/MTNVQfERr3K7O37b.8WOH8oeusPlO', NULL, '2025-06-18 21:31:11', '2025-07-17 00:42:06'),
(12, 'sv02220', 'Nguyễn Hưng Hứng', NULL, 'nhunghung@gmail.com', '0976546763', 5, 'Sinh viên', NULL, NULL, NULL, NULL, '2025-06-19 00:29:02', '2025-07-15 06:08:44'),
(13, 'sv2020', 'Thạch Võ', 'cb299', 'vovanthach2001@gmail.com', '0338791316', 6, 'Sinh viên', NULL, NULL, '$2y$10$BHG8pXzhgI0Fq4OsAOgXdOk/MTNVQfERr3K7O37b.8WOH8oeusPlO', NULL, '2025-06-24 11:03:38', '2025-07-15 06:08:36'),
(14, 'cb022', 'Nguyễn Minh Luân', NULL, 'ntluan@gmail.com', '0356987746', 5, 'Giảng viên', NULL, NULL, NULL, NULL, '2025-06-24 20:51:59', '2025-07-14 21:17:17'),
(24, 'cb_qtlv02', 'Admin hệ thống', 'quantri_qtlv', 'adminht@gmail.com', '0367563234', 12, 'Admin', NULL, NULL, '$2y$10$BHG8pXzhgI0Fq4OsAOgXdOk/MTNVQfERr3K7O37b.8WOH8oeusPlO', NULL, '2025-07-17 02:41:03', '2025-07-17 02:42:39'),
(25, 'httt0669', 'Nguyễn Văn Tài', NULL, 'nvtai@gmail.com', '0956437658', 8, 'Sinh viên', NULL, NULL, NULL, NULL, '2025-07-18 09:32:38', '2025-07-18 09:32:38');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `majors`
--
ALTER TABLE `majors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `majors_code_unique` (`code`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_code_unique` (`code`);

--
-- Chỉ mục cho bảng `permission_role`
--
ALTER TABLE `permission_role`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `permission_role_role_id_foreign` (`role_id`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Chỉ mục cho bảng `report_periods`
--
ALTER TABLE `report_periods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_periods_semester_id_foreign` (`semester_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Chỉ mục cho bảng `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`role_id`,`user_id`),
  ADD KEY `role_user_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rooms_name_unique` (`name`);

--
-- Chỉ mục cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedules_room_id_foreign` (`room_id`),
  ADD KEY `schedules_thesis_id_foreign` (`thesis_id`);

--
-- Chỉ mục cho bảng `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `semesters_academic_year_id_foreign` (`academic_year_id`);

--
-- Chỉ mục cho bảng `theses`
--
ALTER TABLE `theses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `theses_report_period_id_foreign` (`report_period_id`),
  ADD KEY `theses_lecturer_id_foreign` (`lecturer_id`);

--
-- Chỉ mục cho bảng `thesis_attachments`
--
ALTER TABLE `thesis_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thesis_attachments_thesis_id_foreign` (`thesis_id`);

--
-- Chỉ mục cho bảng `thesis_councils`
--
ALTER TABLE `thesis_councils`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thesis_councils_thesis_id_foreign` (`thesis_id`);

--
-- Chỉ mục cho bảng `thesis_council_members`
--
ALTER TABLE `thesis_council_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thesis_council_members_thesis_council_id_foreign` (`thesis_council_id`),
  ADD KEY `thesis_council_members_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `thesis_registrations`
--
ALTER TABLE `thesis_registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thesis_registrations_thesis_id_foreign` (`thesis_id`);

--
-- Chỉ mục cho bảng `thesis_registration_student`
--
ALTER TABLE `thesis_registration_student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trs_student_unique` (`thesis_registration_id`,`student_id`),
  ADD KEY `thesis_registration_student_student_id_foreign` (`student_id`);

--
-- Chỉ mục cho bảng `thesis_tasks`
--
ALTER TABLE `thesis_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thesis_tasks_thesis_id_foreign` (`thesis_id`);

--
-- Chỉ mục cho bảng `thesis_task_attachments`
--
ALTER TABLE `thesis_task_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `thesis_task_attachments_thesis_task_id_foreign` (`thesis_task_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_lecturer_code_unique` (`user_code`),
  ADD KEY `users_major_id_foreign` (`major_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `academic_years`
--
ALTER TABLE `academic_years`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `majors`
--
ALTER TABLE `majors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `report_periods`
--
ALTER TABLE `report_periods`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `semesters`
--
ALTER TABLE `semesters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `theses`
--
ALTER TABLE `theses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `thesis_attachments`
--
ALTER TABLE `thesis_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `thesis_councils`
--
ALTER TABLE `thesis_councils`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `thesis_council_members`
--
ALTER TABLE `thesis_council_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `thesis_registrations`
--
ALTER TABLE `thesis_registrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `thesis_registration_student`
--
ALTER TABLE `thesis_registration_student`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `thesis_tasks`
--
ALTER TABLE `thesis_tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `thesis_task_attachments`
--
ALTER TABLE `thesis_task_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `permission_role`
--
ALTER TABLE `permission_role`
  ADD CONSTRAINT `permission_role_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permission_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `report_periods`
--
ALTER TABLE `report_periods`
  ADD CONSTRAINT `report_periods_semester_id_foreign` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `role_user`
--
ALTER TABLE `role_user`
  ADD CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedules_thesis_id_foreign` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `semesters`
--
ALTER TABLE `semesters`
  ADD CONSTRAINT `semesters_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `theses`
--
ALTER TABLE `theses`
  ADD CONSTRAINT `theses_lecturer_id_foreign` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `theses_report_period_id_foreign` FOREIGN KEY (`report_period_id`) REFERENCES `report_periods` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thesis_attachments`
--
ALTER TABLE `thesis_attachments`
  ADD CONSTRAINT `thesis_attachments_thesis_id_foreign` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thesis_councils`
--
ALTER TABLE `thesis_councils`
  ADD CONSTRAINT `thesis_councils_thesis_id_foreign` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thesis_council_members`
--
ALTER TABLE `thesis_council_members`
  ADD CONSTRAINT `thesis_council_members_thesis_council_id_foreign` FOREIGN KEY (`thesis_council_id`) REFERENCES `thesis_councils` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `thesis_council_members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thesis_registrations`
--
ALTER TABLE `thesis_registrations`
  ADD CONSTRAINT `thesis_registrations_thesis_id_foreign` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thesis_registration_student`
--
ALTER TABLE `thesis_registration_student`
  ADD CONSTRAINT `thesis_registration_student_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `thesis_registration_student_thesis_registration_id_foreign` FOREIGN KEY (`thesis_registration_id`) REFERENCES `thesis_registrations` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thesis_tasks`
--
ALTER TABLE `thesis_tasks`
  ADD CONSTRAINT `thesis_tasks_thesis_id_foreign` FOREIGN KEY (`thesis_id`) REFERENCES `theses` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `thesis_task_attachments`
--
ALTER TABLE `thesis_task_attachments`
  ADD CONSTRAINT `thesis_task_attachments_thesis_task_id_foreign` FOREIGN KEY (`thesis_task_id`) REFERENCES `thesis_tasks` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_major_id_foreign` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
