# Project Skeleton – MVP Ứng Dụng Học Code Độc Lập

Tài liệu này mô tả cấu trúc thư mục / project đề xuất cho repo, để triển khai kiến trúc đã mô tả trong các file:

- `mvp-prd.md`
- `backend-architecture.md`
- `db-design.md`

---

## 1. Cấu trúc thư mục tổng thể

```text
CodeThinker/
  docs/
    mvp-prd.md
    backend-architecture.md
    db-design.md
    skeleton-project.md

  backend/
    src/
      App.Domain/
      App.Application/
      App.Infrastructure/
      App.Api/
      App.Worker/
    tests/
      App.Domain.Tests/
      App.Application.Tests/
    App.sln

  frontend/
    src/
      app/              # Next.js App Router
      components/
      features/
      lib/
    public/
    package.json
    tsconfig.json
    next.config.mjs
    tailwind.config.ts
    postcss.config.mjs

  .gitignore
  README.md
```

- Thư mục `docs/`: chứa toàn bộ tài liệu design.
- Thư mục `backend/`: solution .NET Core, clean architecture.
- Thư mục `frontend/`: app Next.js + TypeScript + Tailwind.

---

## 2. Backend Skeleton (.NET, Clean Architecture)

### 2.1. Solution & projects

```text
backend/
  App.sln
  src/
    App.Domain/
    App.Application/
    App.Infrastructure/
    App.Api/
    App.Worker/
  tests/
    App.Domain.Tests/
    App.Application.Tests/
```

### 2.2. App.Domain

```text
App.Domain/
  Entities/
    User.cs
    UserStats.cs
    Challenge.cs
    TestCase.cs
    Submission.cs
  Enums/
    Difficulty.cs
    LanguageCode.cs
    SubmissionStatus.cs
    UserLevel.cs
  Services/
    ScoringService.cs
    LevelService.cs
    StreakService.cs
```

- Chỉ chứa logic thuần, không reference EF Core, ASP.NET, v.v.

### 2.3. App.Application

```text
App.Application/
  Interfaces/
    Repositories/
      IUserRepository.cs
      IUserStatsRepository.cs
      IChallengeRepository.cs
      ISubmissionRepository.cs
      ITestCaseRepository.cs
    Services/
      IGitHubAuthService.cs
      IJwtTokenGenerator.cs
      ICodeExecutionQueue.cs
      ICodeExecutionProcessor.cs
      ICodeRunner.cs
      IUserProgressService.cs
      IDateTimeProvider.cs

  UseCases/
    Auth/
      HandleGitHubCallback/
        HandleGitHubCallbackCommand.cs
        HandleGitHubCallbackHandler.cs
    Challenges/
      GetChallenges/
      GetChallengeDetail/
    Submissions/
      CreateSubmission/
      GetSubmission/
      ProcessSubmissionJob/
    Progress/
      GetProgressSummary/
      GetDailyStats/
      GetDailyChallenge/

  Dtos/
    Auth/
    Challenges/
    Submissions/
    Progress/
```

- Có thể dùng pattern CQRS (Command/Query + Handler) nếu muốn, nhưng MVP chỉ cần service class là đủ.

### 2.4. App.Infrastructure

```text
App.Infrastructure/
  Persistence/
    AppDbContext.cs
    Configurations/
      UserConfiguration.cs
      UserStatsConfiguration.cs
      ChallengeConfiguration.cs
      TestCaseConfiguration.cs
      SubmissionConfiguration.cs
    Repositories/
      UserRepository.cs
      UserStatsRepository.cs
      ChallengeRepository.cs
      TestCaseRepository.cs
      SubmissionRepository.cs

  Auth/
    GitHubAuthService.cs
    JwtTokenGenerator.cs

  CodeExecution/
    Queue/
      InMemoryCodeExecutionQueue.cs
    Runners/
      PythonCodeRunner.cs
      CSharpCodeRunner.cs
    Sandbox/
      CodeSandbox.cs

  Services/
    UserProgressService.cs
    SystemDateTimeProvider.cs

  DependencyInjection/
    ServiceCollectionExtensions.cs
```

- `ServiceCollectionExtensions` cung cấp các hàm kiểu `AddInfrastructure(...)` để `App.Api` và `App.Worker` đăng ký DI.

### 2.5. App.Api

```text
App.Api/
  Program.cs
  appsettings.json
  appsettings.Development.json

  Controllers/
    AuthController.cs
    UsersController.cs
    ChallengesController.cs
    SubmissionsController.cs
    ProgressController.cs

  Filters/
  Middlewares/
  Mappings/
```

- `Program.cs`:
  - Đăng ký DbContext, Infrastructure, Application.
  - Cấu hình JWT auth.
  - Map các controller / endpoint minimal API.

### 2.6. App.Worker

```text
App.Worker/
  Program.cs
  appsettings.json
  Services/
    CodeExecutionWorker.cs  # BackgroundService
```

- `CodeExecutionWorker` (BackgroundService):
  - Inject `ICodeExecutionProcessor` / `ICodeExecutionQueue`.
  - Loop: lấy job → gọi use case `ProcessSubmissionJob`.

### 2.7. Tests

```text
backend/tests/
  App.Domain.Tests/
    Services/
      ScoringServiceTests.cs
      LevelServiceTests.cs
      StreakServiceTests.cs
  App.Application.Tests/
    UseCases/
      Submissions/
      Progress/
```

- Tập trung test logic domain / application (không cần EF).

---

## 3. Frontend Skeleton (Next.js + TypeScript + Tailwind)

### 3.1. Cấu trúc cơ bản

```text
frontend/
  package.json
  tsconfig.json
  next.config.mjs
  tailwind.config.ts
  postcss.config.mjs
  .eslintrc.cjs (hoặc .eslintrc.js)

  src/
    app/
      layout.tsx
      page.tsx               # Landing / intro
      dashboard/
        page.tsx
      challenges/
        page.tsx             # list
        [id]/
          page.tsx           # detail + editor
      profile/
        page.tsx
      auth/
        github/callback/
          route.ts           # API route/client page tuỳ cách implement

    components/
      layout/
        Navbar.tsx
        Sidebar.tsx
      ui/
        Button.tsx
        Card.tsx
        Badge.tsx
      charts/
        ProgressChart.tsx

    features/
      auth/
        useAuth.ts
      challenges/
        ChallengeList.tsx
        ChallengeDetail.tsx
      submissions/
        CodeEditor.tsx       # Monaco integration
        SubmissionResult.tsx
      progress/
        SummaryStats.tsx

    lib/
      api-client.ts          # wrapper gọi backend API
      i18n/
        index.ts
        messages/
          vi.json
          en.json
```

### 3.2. Config chính

- `next.config.mjs`
  - Bật experimental app router (nếu cần), config i18n (locales: `vi`, `en`).
- `tailwind.config.ts`
  - Cấu hình theme, dark mode.
- `api-client.ts`
  - Hàm helper gọi backend: base URL từ env (`NEXT_PUBLIC_API_BASE_URL`).

### 3.3. Luồng màn hình chính

- `/dashboard`
  - Gọi `GET /api/progress/summary`, `GET /api/daily-challenge`.
- `/challenges`
  - Gọi `GET /api/challenges` với filter.
- `/challenges/[id]`
  - Gọi `GET /api/challenges/{id}`.
  - Gửi `POST /api/submissions` khi user bấm Run.
  - Poll `GET /api/submissions/{id}` đến khi `status` không còn Pending/Running.
- `/profile`
  - Gọi `GET /api/users/me`, `GET /api/progress/daily`.

---

## 4. Files cấu hình chung ở root

- `.gitignore`
  - Bỏ qua `bin/`, `obj/`, `node_modules/`, `dist/`, `.vs/`, `.vscode/`.
- `README.md`
  - Mô tả ngắn project.
  - Hướng dẫn chạy nhanh:
    - Backend: `dotnet run` trong `App.Api`.
    - Frontend: `npm install` + `npm run dev` trong `frontend/`.

---

## 5. Hướng dẫn khởi tạo sơ bộ (gợi ý, không bắt buộc)

- Backend (.NET):
  - Tạo solution và projects bằng `dotnet new` (console, classlib, webapi).
  - Thêm reference giữa các project theo sơ đồ trong `backend-architecture.md`.
- Frontend (Next.js):
  - `npx create-next-app@latest frontend --ts --tailwind`.
  - Điều chỉnh lại cấu trúc thư mục như trên.

---

## 6. Tóm tắt

- Repo được chia rõ thành `backend/`, `frontend/`, `docs/`.
- Backend theo clean architecture, tách project Domain / Application / Infrastructure / Api / Worker.
- Frontend dùng Next.js + TS + Tailwind, cấu trúc theo modules (features) để dễ mở rộng.
