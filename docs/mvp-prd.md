# PRD – MVP Ứng Dụng Học Code Độc Lập

## 1. Mục tiêu & Phạm vi

### 1.1. Mục tiêu

- **Rèn tư duy giải quyết vấn đề và debug** mà không phụ thuộc vào AI sinh code.
- Cung cấp một **môi trường luyện tập thực tế**: mô tả bài toán rõ ràng, người dùng tự viết code, hệ thống chấm và phản hồi về lỗi.
- Tạo **động lực học lâu dài** qua gamification (điểm, level, streak).
- Cá nhân hóa cơ bản theo **ngôn ngữ lập trình yêu thích** và **mức độ kỹ năng**.

### 1.2. Phạm vi MVP

- **Frontend**: Web app (Next.js, TypeScript, Tailwind).
- **Backend**: .NET Core API + PostgreSQL.
- **Ngôn ngữ hỗ trợ trong code editor**:  
  - MVP: Python, C#.  
  - Khác (TS, JS, SQL, C++) – để phase sau.
- **Ngôn ngữ giao diện**:
  - MVP: i18n UI `vi` và `en`.
  - Mô tả bài tập: ưu tiên `vi`, có thể thêm `en` sau.

---

## 2. Persona & User Journey

### 2.1. Persona chính

- **Independent Learner**
  - Có kinh nghiệm với C#/Python/TS, làm full-stack.
  - Mục tiêu: luyện thuật toán, thiết kế giải pháp, debug, tối ưu code.
  - Thích:
    - Bài tập sát thực tế (API, CLI, tối ưu query).
    - Không bị "spoil" code.
    - Thấy rõ tiến bộ (điểm, đồ thị, streak).

### 2.2. User Journey MVP

- **Onboarding**
  - Đăng nhập bằng GitHub.
  - Chọn:
    - Ngôn ngữ giao diện: `vi/en`.
    - Ngôn ngữ lập trình ưa thích (Python hoặc C#).
    - Mức độ tự đánh giá: Beginner / Intermediate / Advanced.

- **Sử dụng hằng ngày**
  - Vào **Dashboard**:
    - Thấy daily challenge.
    - Thấy điểm, level, streak, số bài đã hoàn thành.
  - Chọn:
    - **Daily challenge**.
    - Hoặc chọn challenge theo tag: `arrays`, `API`, `SQL`, `debugging`, `performance`.
  - Mở challenge:
    - Đọc mô tả (vi/en).
    - Xem gợi ý dạng câu hỏi, không có code mẫu.
    - Mở editor (Monaco).
  - Viết code và bấm **Run & Submit**:
    - Xem kết quả test (pass/fail).
    - Xem feedback phân tích lỗi (không show code mẫu).
  - Khi pass:
    - Nhận điểm.
    - Cập nhật level, streak, dashboard.

---

## 3. Yêu cầu chức năng

### 3.1. Authentication & Profile

- **Đăng nhập**
  - OAuth GitHub (MVP).
  - Tạo tài khoản nếu lần đầu đăng nhập.
- **Profile**
  - Lưu:
    - `displayName`, `email` (nếu có).
    - `preferredLanguageCode` (Python/C#).
    - `uiLanguage` (vi/en).
    - `selfAssessedLevel` (Beginner/Intermediate/Advanced).
- **Yêu cầu**
  - JWT để client gọi API.
  - Endpoint lấy thông tin user hiện tại.

### 3.2. Challenge Management (User side)

- **Danh sách challenge**
  - Lọc theo:
    - Difficulty: Easy/Mid/Hard.
    - Topic: `algorithm`, `web`, `db`, `cli`, `system`.
    - Ngôn ngữ được recommend: Python/C#.
  - Sort: mới nhất, phổ biến, gợi ý theo level.
- **Chi tiết challenge**
  - Thông tin:
    - `title`, `slug`.
    - `descriptionVi`, `descriptionEn`.
    - `difficulty`.
    - `topics`.
    - `hints`: danh sách câu hỏi gợi ý, không có code.
    - `allowedLanguages`.
  - Hiển thị:
    - Số test public (nếu có).
    - Thời gian dự kiến (gợi ý: 15/30/60 phút).

### 3.3. Challenge Attempt & Submission

- **Code Editor**
  - Monaco Editor.
  - Chọn language trong số `allowedLanguages`.
  - Template rỗng hoặc tối thiểu (khung hàm không chứa logic).
- **Run & Submit**
  - Nút `Run` = gửi code để chạy test.
  - MVP: `Run` cũng là `Submit` (không phân biệt).
- **Quy trình server**
  - Input:
    - `challengeId`, `language`, `sourceCode`.
  - Xử lý:
    - Tạo `Submission` với trạng thái `Pending`.
    - Đưa job sang service chấm code (có thể async).
    - Chạy code trong container:
      - Timeout mỗi test (VD: 2–3s).
      - Giới hạn CPU/RAM.
    - Thu kết quả và cập nhật:
      - `status`: `Passed`, `Failed`, `RuntimeError`, `Timeout`.
      - `runtimeMs`.
      - Số test pass/total (không show input/output chi tiết nếu tránh "spoiler").

### 3.4. Feedback & Debug

- **Feedback cơ bản**
  - Cho mỗi submission:
    - Trạng thái tổng thể.
    - Nếu Failed:
      - Số test pass/total.
      - Thông tin lỗi tổng quát:
        - "Có lỗi runtime (NullReference / IndexError)."
        - "Có test bị sai kết quả. Hãy kiểm tra các trường hợp biên."
  - Không trả về:
    - Nội dung input/output cụ thể cho từng test (hoặc nếu có thì chỉ cho public tests đơn giản).

- **Phân tích lỗi nâng cao (AI – optional trong MVP)**
  - MVP có thể:
    - Stub: thiết kế API để sau này tích hợp AI.
    - Hoặc áp dụng một số rule-based feedback:
      - Nếu timeout: gợi ý về độ phức tạp thuật toán.
      - Nếu runtime error null/Index: gợi ý về kiểm tra index/nullable.
  - Nguyên tắc:
    - Phản hồi ở level khái niệm, không gợi ý code.

### 3.5. Gamification

- **Điểm**
  - Mỗi challenge lần đầu pass:
    - Easy: 10 điểm.
    - Medium: 20 điểm.
    - Hard: 40 điểm.
  - Pass lại không cộng thêm hoặc cộng rất ít (1–2 điểm).
- **Level**
  - Mapping:
    - 0–99: `Newbie`.
    - 100–299: `Apprentice`.
    - 300–699: `Journeyman`.
    - 700+: `Advanced`.
  - Tự động tính từ tổng điểm.
- **Streak & Daily Challenge**
  - Daily challenge:
    - Mỗi ngày chọn 1 challenge (theo level user).
  - Streak:
    - +1 ngày nếu user pass ít nhất 1 challenge trong ngày.
    - Reset nếu không có pass nào trong ngày.
- **UI**
  - Badge/label theo level.
  - Progress bar tới level tiếp theo.
  - Trạng thái streak (ví dụ: "Streak: 5 days").

### 3.6. Dashboard & Progress

- **Dashboard**
  - Thống kê:
    - Tổng challenge đã hoàn thành.
    - Phân bố theo difficulty.
    - Điểm hiện tại, level, streak.
  - Biểu đồ:
    - Chart.js: số challenge pass theo ngày/tuần.
- **Trang Profile**
  - Cho phép:
    - Cập nhật `preferredLanguage`, `uiLanguage`.
    - Xem lịch sử submission gần đây (trạng thái + thời gian).

### 3.7. Settings & i18n

- **UI language**
  - Lưu trên profile + localStorage.
  - Tất cả text UI dùng i18n (Next.js).
- **Challenge description**
  - Cho phép backend lưu mô tả song ngữ:
    - Nếu thiếu `en`, fallback `vi`.
  - Frontend hiển thị theo ngôn ngữ UI, có nút switch nếu muốn.

### 3.8. Admin (MVP đơn giản)

- **Admin (internal)**
  - MVP có thể chỉ là:
    - Endpoint/API để seed challenge (qua migration hoặc script).
  - Về sau:
    - UI riêng để CRUD challenge, test case.

---

## 4. Yêu cầu phi chức năng

- **Performance**
  - Thời gian từ khi bấm Run đến khi có kết quả:
    - Mục tiêu: < 5s cho bài dễ, < 10s cho bài trung bình.
  - Support 1–5 user đồng thời (MVP).
- **Security**
  - Code chạy trong sandbox container riêng, không access network/FS ngoài.
  - JWT bảo vệ API.
- **Privacy**
  - Không chia sẻ code user cho người khác.
  - Có thể lưu code để phục vụ dashboard & lịch sử, nhưng không public.
- **Reliability**
  - Nếu service chấm code lỗi, submission chuyển sang trạng thái `Error` với message chung chung, không crash hệ thống.

---

## 5. API chính (draft)

### 5.1. Auth

- `POST /api/auth/github/callback`
  - Input: code từ GitHub OAuth.
  - Output: JWT, thông tin user.
- `GET /api/users/me`
  - Output: profile, stats tổng quan.

### 5.2. Challenge

- `GET /api/challenges`
  - Query: `difficulty?`, `topic?`, `language?`, `page`, `pageSize`.
  - Output: danh sách challenge (metadata).
- `GET /api/challenges/{id}`
  - Output:
    - Thông tin challenge + hints + allowedLanguages.

### 5.3. Submission

- `POST /api/submissions`
  - Body:
    - `challengeId`, `language`, `sourceCode`.
  - Output:
    - `submissionId`, status ban đầu (`Pending`), message.
- `GET /api/submissions/{id}`
  - Output:
    - `status`, `runtimeMs`, `passedCount`, `totalCount`, `feedbackMessage`.
- Tùy chọn:
  - `GET /api/challenges/{id}/my-last-submission`
    - Để user xem lại lần nộp gần nhất.

### 5.4. Progress & Gamification

- `GET /api/progress/summary`
  - Output:
    - Tổng điểm, level, streak, số challenge theo difficulty.
- `GET /api/progress/daily`
  - Output:
    - Dữ liệu cho chart (ngày → số challenge pass).
- `GET /api/daily-challenge`
  - Output:
    - Challenge được chỉ định cho ngày hôm nay.

### 5.5. Settings

- `PUT /api/users/me/settings`
  - Body:
    - `preferredLanguage`, `uiLanguage`.
  - Output:
    - Profile updated.

---

## 6. Acceptance Criteria chính cho MVP

- Người dùng có thể:
  - Đăng nhập bằng GitHub, nhìn thấy dashboard cơ bản.
  - Xem danh sách challenge, lọc cơ bản.
  - Xem chi tiết challenge và đọc mô tả.
  - Viết code và submit, nhận kết quả pass/fail và feedback cơ bản.
  - Thấy điểm, level, streak tăng lên khi pass bài.
  - Thay đổi ngôn ngữ UI (vi/en).
