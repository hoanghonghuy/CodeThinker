# Database Design & Migration Strategy – MVP Ứng Dụng Học Code Độc Lập

## 1. Tổng quan

- **DB chính**: PostgreSQL.
- Lưu trữ:
  - Người dùng & profile.
  - Thử thách (challenge) & test case.
  - Submission & kết quả chấm.
  - Thống kê tiến độ (UserStats).
- Logs chi tiết (nếu cần) có thể để Phase sau hoặc dùng riêng (file/ELK), không bắt buộc cho MVP.

---

## 2. Bảng & schema chính

Tên bảng dùng snake_case, khóa chính `id` kiểu `uuid` (hoặc `bigserial` nếu bạn thích). Dưới đây là mô tả logic; khi triển khai EF Core sẽ map sang type cụ thể.

### 2.1. users

- **Mục đích**: thông tin tài khoản.
- **Cột**:
  - `id` (PK)
  - `display_name` (text, not null)
  - `email` (text, nullable)
  - `auth_provider` (text, not null) – ví dụ: `github`.
  - `provider_user_id` (text, not null)
  - `preferred_language_code` (text, not null, default 'Python')
  - `ui_language` (text, not null, default 'vi')
  - `self_assessed_level` (text, not null, default 'Beginner')
  - `created_at` (timestamptz, not null)
  - `updated_at` (timestamptz, not null)
- **Index**:
  - unique (`auth_provider`, `provider_user_id`) – để find-or-create user.

### 2.2. user_stats

- **Mục đích**: thống kê tiến độ của user.
- **Cột**:
  - `user_id` (PK, FK → users.id)
  - `total_points` (int, not null, default 0)
  - `current_level` (text, not null, default 'Newbie')
  - `current_streak` (int, not null, default 0)
  - `last_streak_date` (date, nullable)
  - `created_at` (timestamptz, not null)
  - `updated_at` (timestamptz, not null)

### 2.3. challenges

- **Mục đích**: định nghĩa bài tập.
- **Cột**:
  - `id` (PK)
  - `slug` (text, not null)
  - `title` (text, not null)
  - `description_vi` (text, not null)
  - `description_en` (text, nullable)
  - `difficulty` (text, not null) – 'Easy' | 'Medium' | 'Hard'
  - `topics` (jsonb, not null, default '[]') – danh sách string.
  - `allowed_languages` (jsonb, not null, default '[]') – VD: ["Python","CSharp"].
  - `is_active` (bool, not null, default true)
  - `created_at` (timestamptz, not null)
  - `updated_at` (timestamptz, not null)
- **Index**:
  - unique (`slug`)
  - btree (`difficulty`)
  - GIN index trên `topics` nếu cần filter nhiều.

### 2.4. test_cases

- **Mục đích**: test input/output cho mỗi challenge.
- **Cột**:
  - `id` (PK)
  - `challenge_id` (FK → challenges.id, not null)
  - `input` (text, not null) – JSON/text tuỳ runner.
  - `expected_output` (text, not null)
  - `is_public` (bool, not null, default false)
  - `order` (int, not null, default 0)
- **Index**:
  - btree (`challenge_id`, `order`).

### 2.5. submissions

- **Mục đích**: lưu mỗi lần user submit code.
- **Cột**:
  - `id` (PK)
  - `user_id` (FK → users.id, not null)
  - `challenge_id` (FK → challenges.id, not null)
  - `language` (text, not null) – 'Python', 'CSharp',...
  - `source_code` (text, not null)
  - `status` (text, not null) – 'Pending', 'Running', 'Passed', 'Failed', 'RuntimeError', 'Timeout', 'Error'
  - `runtime_ms` (int, nullable)
  - `passed_count` (int, not null, default 0)
  - `total_count` (int, not null, default 0)
  - `feedback_message` (text, nullable)
  - `created_at` (timestamptz, not null)
  - `completed_at` (timestamptz, nullable)
- **Index**:
  - btree (`user_id`)
  - btree (`challenge_id`)
  - btree (`status`)
  - composite index (`user_id`, `challenge_id`, `created_at DESC`) – query "submission gần nhất".

### 2.6. optional: daily_stats (có thể thêm sau)

MVP có thể tính dữ liệu chart trực tiếp từ `submissions`. Nếu sau này cần tối ưu:

- Bảng `daily_stats`:
  - `user_id` (FK → users.id)
  - `date` (date)
  - `completed_challenges` (int)
  - PK: (`user_id`, `date`)

---

## 3. Quan hệ & ERD (mô tả dạng chữ)

- `users` 1 — 1 `user_stats`
- `users` 1 — n `submissions`
- `challenges` 1 — n `test_cases`
- `challenges` 1 — n `submissions`

Tóm tắt ERD:

- User (1) → UserStats (1)
- User (1) → Submissions (n)
- Challenge (1) → TestCases (n)
- Challenge (1) → Submissions (n)

Không có quan hệ many-to-many phức tạp trong MVP.

---

## 4. Mapping sang Entities (.NET)

Tương ứng với layer Domain:

- `User`
- `UserStats`
- `Challenge`
- `TestCase`
- `Submission`

Một số lưu ý mapping:

- Enum (`Difficulty`, `SubmissionStatus`, `UserLevel`, `LanguageCode`) map sang text hoặc smallint.
  - Gợi ý: map sang text để dễ debug và migration.
- `topics` và `allowed_languages` dùng `jsonb` → map sang `List<string>` bằng EF Core value converter.

---

## 5. Migration Strategy (EF Core)

### 5.1. Tooling

- Sử dụng **EF Core Migrations** trong project `App.Infrastructure`.
- DbContext: `AppDbContext`.
- Connection string cấu hình theo môi trường (Development/Staging/Production).

### 5.2. Quy ước đặt tên migration

- Định dạng gợi ý: `yyyyMMddHHmm_Description`
  - Ví dụ: `20251116_1200_InitialCreate`
  - `20251120_0930_AddUserStats`

### 5.3. Các bước migration ban đầu

1. **InitialCreate**
   - Tạo bảng: `users`, `user_stats`, `challenges`, `test_cases`, `submissions`.
   - Thiết lập khóa ngoại + index cơ bản.
2. **SeedInitialChallenges** (tuỳ chọn)
   - Seed một số challenge mẫu + test cases.
   - Có thể dùng `HasData` hoặc script riêng.

### 5.4. Quy trình dev

- Thay đổi model → chạy:
  - `dotnet ef migrations add {Name}` trong project Infrastructure.
  - `dotnet ef database update` cho môi trường dev.
- CI/CD:
  - Trước khi deploy, chạy migration tự động (hoặc migration tool) để sync schema.

### 5.5. Chiến lược versioning / backward compatibility

- Tránh breaking change mạnh trong MVP.
- Khi cần thay đổi lớn (vd: chuyển enum từ text sang smallint):
  - Tạo migration trung gian, hỗ trợ song song trong một thời gian.

---

## 6. Lưu ý về log & mở rộng

- **Logs**:
  - MVP: dùng logging của ứng dụng (file/console/APM), không nhất thiết lưu vào DB.
  - Nếu cần log submission chi tiết (từng test input/output), có thể tạo bảng `submission_logs` ở phase sau.

- **Mở rộng tương lai**:
  - Thêm bảng cho community features: comments, solutions, votes.
  - Thêm bảng cho GitHub integration: repo mapping, suggestions,...

---

## 7. Tóm tắt

- Thiết kế tập trung vào các bảng cốt lõi để hỗ trợ:
  - Auth & profile.
  - Challenge & test case.
  - Submission & kết quả chấm.
  - Gamification (points, level, streak).
- Mọi thứ được tối ưu cho việc triển khai bằng EF Core + PostgreSQL và mở rộng dần về sau.
