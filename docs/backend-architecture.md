 # Backend Architecture – MVP Ứng Dụng Học Code Độc Lập
 
 ## 1. Tổng quan kiến trúc
 
 Backend được thiết kế theo **Clean Architecture**, domain-centric, đảm bảo:
 
 - **Domain** không phụ thuộc framework, DB hay UI.
 - **Application** chứa use case, tương tác qua interface.
 - **Infrastructure** hiện thực hóa persistence, code execution, auth, v.v.
 - **API / Worker** chỉ đóng vai trò entry-point, gọi vào Application.
 
 ### 1.1. Projects / assemblies
 
 - `App.Domain`
 - `App.Application`
 - `App.Infrastructure`
 - `App.Api` (REST API cho frontend)
 - `App.Worker` (background worker chấm code – có thể gộp vào Api ở MVP)
 
 ### 1.2. Quan hệ phụ thuộc
 
 - `App.Domain`: không phụ thuộc project nào khác.
 - `App.Application`: phụ thuộc `Domain`.
 - `App.Infrastructure`: phụ thuộc `Domain` + `Application` (qua interface).
 - `App.Api`: phụ thuộc `Application` (+ `Infrastructure` qua DI).
 - `App.Worker`: phụ thuộc `Application` (+ `Infrastructure`).
 
 ## 2. Domain Layer (`App.Domain`)
 
 ### 2.1. Entities
 
 - **User**
   - `Id`
   - `DisplayName`
   - `Email`
   - `AuthProvider` (GitHub,...)
   - `ProviderUserId` (id user bên provider)
   - `PreferredLanguageCode` (Python, CSharp,...)
   - `UiLanguage` (vi, en)
   - `SelfAssessedLevel` (Beginner, Intermediate, Advanced)
 
 - **UserStats**
   - `UserId` (1-1 với User)
   - `TotalPoints`
   - `CurrentLevel` (Newbie/Apprentice/Journeyman/Advanced)
   - `CurrentStreak`
   - `LastStreakDate`
   - `CreatedAt`, `UpdatedAt`
 
 - **Challenge**
   - `Id`
   - `Slug`
   - `Title`
   - `DescriptionVi`, `DescriptionEn`
   - `Difficulty` (Easy/Medium/Hard)
   - `Topics` (list/string: algorithm, web, db, cli, system,...)
   - `AllowedLanguages` (list: Python, CSharp,...)
   - `IsActive`
   - `CreatedAt`
 
 - **TestCase**
   - `Id`
   - `ChallengeId`
   - `Input` (chuỗi JSON, text,...)
   - `ExpectedOutput` (chuỗi)
   - `IsPublic`
   - `Order`
 
 - **Submission**
   - `Id`
   - `UserId`
   - `ChallengeId`
   - `Language`
   - `SourceCode`
   - `Status` (Pending, Running, Passed, Failed, RuntimeError, Timeout, Error)
   - `RuntimeMs`
   - `PassedCount`
   - `TotalCount`
   - `FeedbackMessage`
   - `CreatedAt`, `CompletedAt`
 
 ### 2.2. Value Objects / Enums
 
 - `Difficulty` enum
 - `LanguageCode` enum
 - `SubmissionStatus` enum
 - `UserLevel` enum
 
 Các enum này được map sang DB bằng kiểu text hoặc smallint tùy chiến lược ở Infrastructure.
 
 ### 2.3. Domain Services
 
 Logic thuần, không phụ thuộc infrastructure:
 
 - **ScoringService**
   - Tính điểm cho submission Passed (first-time, difficulty,...).
 - **LevelService**
   - Từ `TotalPoints` suy ra `UserLevel`.
 - **StreakService**
   - Cập nhật streak dựa trên `LastStreakDate` và ngày hiện tại.
 
 ## 3. Application Layer (`App.Application`)
 
 Chứa **use case**, **DTOs**, **interfaces** (repositories, services).
 
 ### 3.1. Repository Interfaces
 
 - `IUserRepository`
 - `IUserStatsRepository`
 - `IChallengeRepository`
 - `ISubmissionRepository`
 - `ITestCaseRepository`
 
 Yêu cầu tối thiểu:
 
 - Lấy entity theo Id / slug.
 - Query danh sách challenge theo filter.
 - Thêm/cập nhật entities.
 - Lấy submission gần nhất của user cho một challenge.
 
 ### 3.2. Service Interfaces
 
 - **Auth**
   - `IGitHubAuthService`: đổi OAuth code → access token + user info.
   - `IJwtTokenGenerator`: sinh JWT cho client.
 
 - **Code Execution**
   - `ICodeExecutionQueue`: enqueue job chấm code.
   - `ICodeExecutionProcessor`: worker xử lý job (dùng ở Worker).
   - `ICodeRunner`: abstraction cho việc chạy code (Python, C#,...).
   - `IDateTimeProvider`: trừu tượng hóa `DateTime.UtcNow`.
 
 - **Gamification / Progress**
   - `IUserProgressService`:
     - Cập nhật điểm, level, streak sau submission.
 
 ### 3.3. Use Cases
 
 #### AuthUseCases
 
 - `HandleGitHubCallbackAsync(code)`
   - Gọi `IGitHubAuthService` lấy user info.
   - Find-or-create `User` + `UserStats`.
   - Sinh JWT bằng `IJwtTokenGenerator`.
 
 #### ChallengeUseCases
 
 - `GetChallengesAsync(filter)`
   - Lọc theo difficulty, topic, language.
 - `GetChallengeDetailAsync(id)`
   - Lấy challenge + một số metadata kèm theo.
 
 #### SubmissionUseCases
 
 - `CreateSubmissionAsync(userId, dto)`
   - Validate challenge tồn tại, language hợp lệ.
   - Tạo `Submission` (Pending) và lưu.
   - Tạo job `SubmissionJob(submissionId)` và enqueue qua `ICodeExecutionQueue`.
   - Trả về `submissionId` cho client.
 
 - `GetSubmissionAsync(id)`
   - Lấy submission hiện tại + trạng thái, feedback.
 
 - `ProcessSubmissionJobAsync(submissionId)` (dùng trong Worker)
   - Load `Submission`, `Challenge`, `TestCases`.
   - Gọi `ICodeRunner` tương ứng với `Language`.
   - Chạy các test, collect:
     - `PassedCount`, `TotalCount`, `RuntimeMs`, `Status`.
   - Tạo `FeedbackMessage` cơ bản.
   - Cập nhật submission.
   - Gọi `IUserProgressService.UpdateUserStatsAsync()` để cập nhật điểm, level, streak.
 
 #### ProgressUseCases
 
 - `GetProgressSummaryAsync(userId)`
   - Trả về: tổng điểm, level, streak, số challenge theo difficulty.
 - `GetDailyStatsAsync(userId)`
   - Dữ liệu chart: ngày → số challenge Passed.
 - `GetDailyChallengeAsync(userId)`
   - Chọn challenge cho hôm nay dựa trên level, history.
 
 ## 4. Infrastructure Layer (`App.Infrastructure`)
 
 ### 4.1. Persistence (EF Core + PostgreSQL)
 
 - `AppDbContext` với DbSet:
   - `Users`
   - `UserStats`
   - `Challenges`
   - `TestCases`
   - `Submissions`
 
 - Implement repositories:
   - `UserRepository` : `IUserRepository`
   - `UserStatsRepository` : `IUserStatsRepository`
   - `ChallengeRepository` : `IChallengeRepository`
   - `SubmissionRepository` : `ISubmissionRepository`
   - `TestCaseRepository` : `ITestCaseRepository`
 
 - Sử dụng Fluent API để cấu hình:
   - Khóa chính, khóa ngoại, index.
   - Mapping enum sang text/smallint.
   - Quan hệ 1-1 User–UserStats, 1-n Challenge–TestCase, User–Submission.
 
 ### 4.2. Auth & JWT
 
 - `GitHubAuthService` : `IGitHubAuthService`
   - Gọi GitHub OAuth API để đổi `code` → access token → user profile.
 
 - `JwtTokenGenerator` : `IJwtTokenGenerator`
   - Sinh JWT với các claims: `sub`, `email`, `displayName`, v.v.
 
 ### 4.3. Code Execution Infrastructure
 
 #### Job Queue
 
 - `ICodeExecutionQueue` implementation cho MVP:
   - `InMemoryCodeExecutionQueue` (dựa trên `Channel<SubmissionJob>` + `BackgroundService`).
   - Về sau có thể thay bằng RabbitMQ/Azure Queue chỉ bằng cách thay implementation.
 
 #### Code Runner
 
 - `ICodeRunner` + implementations:
   - `PythonCodeRunner`
   - `CSharpCodeRunner`
 
 - `CodeSandbox` helper:
   - Tạo thư mục/ file tạm cho source và test harness.
   - Chạy process (python/dotnet) với:
     - Timeout mỗi test.
     - Giới hạn tài nguyên (tùy OS/host).
   - Capture stdout/stderr.
   - Trả kết quả cho `ICodeRunner`.
 
 ### 4.4. DateTime & Logging
 
 - `SystemDateTimeProvider` : `IDateTimeProvider`.
 - Logging: sử dụng `ILogger` tích hợp .NET, log ở Api + Worker.
 
 ## 5. API Layer (`App.Api`)
 
 ### 5.1. Technology
 
 - .NET 8 / ASP.NET Core (Minimal APIs hoặc Controllers).
 - JWT Authentication middleware.
 - DI container của ASP.NET Core để wire:
   - Repositories
   - Services
   - Use cases
 
 ### 5.2. Controllers / Endpoints chính
 
 - **AuthController**
   - `POST /api/auth/github/callback` → `HandleGitHubCallbackAsync`.
 
 - **UsersController**
   - `GET /api/users/me` → trả profile + stats.
 
 - **ChallengesController**
   - `GET /api/challenges` → list challenges.
   - `GET /api/challenges/{id}` → detail.
 
 - **SubmissionsController**
   - `POST /api/submissions` → `CreateSubmissionAsync`.
   - `GET /api/submissions/{id}` → `GetSubmissionAsync`.
   - (Optional) `GET /api/challenges/{id}/my-last-submission`.
 
 - **ProgressController**
   - `GET /api/progress/summary` → `GetProgressSummaryAsync`.
   - `GET /api/progress/daily` → `GetDailyStatsAsync`.
   - `GET /api/daily-challenge` → `GetDailyChallengeAsync`.
 
 Controllers chỉ xử lý:
 
 - Model binding & validation cơ bản.
 - Gọi use case tương ứng.
 - Map kết quả sang HTTP response.
 
 ## 6. Worker (`App.Worker`) – Service chấm code
 
 Hai lựa chọn triển khai:
 
 - **Lựa chọn 1 (MVP đơn giản)**
   - Worker là `BackgroundService` chạy trong cùng process với `App.Api`.
   - Lắng nghe `ICodeExecutionQueue` in-memory.
 
 - **Lựa chọn 2 (modular)**
   - `App.Worker` là host/console app riêng.
   - Dùng cùng `App.Application` + `App.Infrastructure`.
   - Queue thực tế: RabbitMQ/Azure Queue/... (về sau).
 
 ### 6.1. Luồng xử lý job
 
 1. Worker lấy `SubmissionJob(submissionId)` từ `ICodeExecutionQueue`.
 2. Gọi `ProcessSubmissionJobAsync(submissionId)` trong Application.
 3. Use case:
    - Load Submission + Challenge + TestCases.
    - Gọi `ICodeRunner` phù hợp `Language`.
    - Chạy test, tính `Status`, `PassedCount`, `TotalCount`, `RuntimeMs`.
    - Sinh `FeedbackMessage` cơ bản.
    - Cập nhật Submission.
    - Gọi `IUserProgressService` để update điểm, level, streak.
 
 ## 7. Flow tổng thể
 
 ### 7.1. Submit code từ phía client
 
 1. Frontend gọi `POST /api/submissions` với `challengeId`, `language`, `sourceCode`.
 2. `SubmissionsController` gọi `CreateSubmissionAsync`.
 3. Use case tạo Submission (Pending), lưu DB, enqueue job.
 4. Client nhận `submissionId` và bắt đầu poll `GET /api/submissions/{id}`.
 
 ### 7.2. Chấm code & cập nhật tiến độ
 
 1. Worker xử lý job → chạy code, cập nhật Submission.
 2. Worker gọi `IUserProgressService` để cập nhật UserStats.
 3. Khi client poll lại, nhận được status & feedback cuối cùng.
 
 ## 8. Ghi chú triển khai
 
 - Tách rõ **Domain/Application** khỏi **Infrastructure** để sau này dễ:
   - Đổi DB (Postgres → khác).
   - Đổi queue (in-memory → message broker).
   - Đổi cách chạy code (process trực tiếp → Docker sandbox).
 - Mọi logic tính điểm, level, streak nên được cover bởi unit test ở Domain/Application.
 
