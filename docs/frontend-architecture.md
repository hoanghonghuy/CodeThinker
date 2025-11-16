# Frontend Architecture – CodeThinker

## 1. Stack & mục tiêu

- **Framework**: Next.js 16 (App Router).
- **UI**: React 19, Tailwind CSS v4, shadcn/ui.
- **Editor**: Monaco (`@monaco-editor/react`) cho code editor.
- **Ngôn ngữ**: TypeScript strict.

Mục tiêu:

- Ưu tiên trải nghiệm học code độc lập, debug tốt.
- Frontend đủ clean và tách lớp để sau này nối backend .NET dễ dàng.
- Tận dụng App Router và server components, nhưng rõ ràng client boundaries cho i18n, editor, filter.

---

## 2. Cấu trúc thư mục frontend

```text
frontend/
  src/
    app/
      layout.tsx         # Root layout (fonts, globals)
      page.tsx           # Landing page CodeThinker

      (app)/             # Shell layout + authenticated-like pages
        layout.tsx       # AppShell: header, nav, locale toggle, mock user

        dashboard/
          page.tsx       # Dashboard: summary + focus areas (mock)

        challenges/
          page.tsx       # List challenges + filter/search + loading
          loading.tsx    # Skeleton when list is loading
          [id]/
            page.tsx     # Challenge detail + editor + history (mock)
            loading.tsx  # Skeleton while detail is loading

        profile/
          page.tsx       # Mock profile page

        error.tsx        # Error boundary cho group (app)

    components/
      ui/                # shadcn/ui primitives (button, card, badge, skeleton, ...)
      providers/
        locale-provider.tsx  # i18n context + locale persistence

      features/
        dashboard/
          dashboard-summary.tsx        # Summary cards + strengths area

        challenges/
          challenge-list.tsx           # Reusable list card UI
          challenge-editor-section.tsx # Editor + submission history (mock)

        editor/
          code-editor-panel.tsx        # Monaco wrapper + mock run

    lib/
      i18n.ts             # Locale types + messages (vi/en)
      utils.ts            # cn() helper
      api-client.ts       # Abstraction over backend API (currently mock)
      challenges-mock.ts  # In-memory mock data + helpers
```

---

## 3. Root layout & landing page

### 3.1. `src/app/layout.tsx`

- Server component.
- Import fonts (`Geist`, `Geist_Mono`) và `globals.css`.
- Thiết lập:

  ```tsx
  <html lang="en" className="dark">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="app">{children}</div>
    </body>
  </html>
  ```

- Toàn bộ app nằm bên trong `div.app`.

### 3.2. `src/app/page.tsx` (landing)

- Landing page product-focused, không dùng shell `(app)`.
- Mô tả ngắn CodeThinker và lộ trình 1 ngày học:
  - Hero text: luyện tư duy, debug, không dùng AI sinh code.
  - Bullet: bài tập thực tế, tập trung đọc lỗi, không cho code sẵn.
- CTA chính:
  - `Vào dashboard` → `/dashboard`.
  - `Xem danh sách thử thách` → `/challenges`.

Landing có thể xem như màn hình giới thiệu trước khi đi vào trải nghiệm chính.

---

## 4. App Shell `(app)/layout.tsx`

### 4.1. LocaleProvider & i18n

- `LocaleProvider` bọc toàn bộ `(app)` group:

  ```tsx
  export default function AppLayout({ children }) {
    return (
      <LocaleProvider>
        <AppShell>{children}</AppShell>
      </LocaleProvider>
    );
  }
  ```

- `useLocale()` trả về:
  - `locale: "vi" | "en"`.
  - `t: Messages` (dictionary cho UI).
  - `setLocale`.
- Locale lưu trong `localStorage` (`ct.locale`) bằng lazy initializer, tránh setState trong effect.

### 4.2. AppShell & navigation

`AppShell` là client component:

- Header chứa:
  - Logo (tên + tag "MVP").
  - Navigation: Dashboard, Challenges, Profile.
  - Nút toggle locale.
  - Mock user avatar + tên/email.

- Active nav dùng `usePathname()`:

  ```ts
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname.startsWith("/dashboard");
    }
    return pathname.startsWith(href);
  };
  ```

- Dựa vào `isActive`, link được highlight với `text-foreground font-medium`.

---

## 5. i18n (`src/lib/i18n.ts`, `src/components/providers/locale-provider.tsx`)

### 5.1. Messages & Locale

- `Locale = "vi" | "en"`.
- `Messages` mô tả shape chung cho mọi locale (app, nav, common, dashboard, challenges, profile).
- `messages: Record<Locale, Messages>`:
  - `messages.vi` dùng tiếng Việt.
  - `messages.en` dùng tiếng Anh.

### 5.2. LocaleProvider

- Dùng `useState` với lazy initializer đọc `localStorage` nếu tồn tại.
- `useEffect` để sync locale → `localStorage`.
- Context cung cấp `{ locale, t: messages[locale], setLocale }`.

Các page trong `(app)` (dashboard, challenges, profile) dùng `useLocale()` để lấy text, đảm bảo i18n.

---

## 6. Features: Dashboard

### 6.1. `DashboardSummary` component

File: `src/components/features/dashboard/dashboard-summary.tsx`

- Nhận `summary`, `focusAreas`, `messages` (từ `t.dashboard`).
- Render:
  - 3 card: tổng điểm, level hiện tại, streak + số bài hoàn thành.
  - 2 card: kế hoạch học tập, khu vực mạnh/yếu.

### 6.2. Dashboard page

File: `src/app/(app)/dashboard/page.tsx`

- Client component, dùng `useLocale()`.
- Mock data (`mockSummary`, `mockFocusAreas`).
- Render heading từ `t.dashboard.title`, `t.dashboard.subtitle`.
- Render `<DashboardSummary ... />`.

Dashboard có thể được nối backend sau bằng cách thay mock dữ liệu bằng call từ apiClient.

---

## 7. Features: Challenges list

### 7.1. `ChallengeList` component

File: `src/components/features/challenges/challenge-list.tsx`

- Types: `ChallengeDifficulty`, `ChallengeSummary`.
- Props: `challenges: ChallengeSummary[]`, `messages: Messages["challenges"]`.
- Render grid card:
  - Title + `messages.detailPlaceholder`.
  - `Badge` hiển thị độ khó (với variant theo difficulty).
  - Các topic hiển thị bằng badge outline.

### 7.2. Challenges page (filter + search)

File: `src/app/(app)/challenges/page.tsx`

- Client component với state:
  - `challenges`, `loading`.
  - `difficulty: "all" | "Easy" | "Medium" | "Hard"`.
  - `topic: string` ("all" hoặc một topic cụ thể).
  - `search: string`.

- Gọi `apiClient.listChallenges()` để lấy danh sách (mock), có flag `cancelled` trong effect.
- Dùng `useMemo` để tính:
  - `allTopics`: tập các topic duy nhất.
  - `filteredChallenges` theo difficulty + topic + search.

- UI filter:
  - Button group cho độ khó.
  - Select cho topic.
  - Input search theo tiêu đề.

- Loading & empty state:
  - Khi loading: grid Skeleton.
  - Khi lọc không ra kết quả: text thông báo.

- Render list bằng `ChallengeList`.

---

## 8. Features: Challenge detail + Editor + History

### 8.1. API client cho detail

`apiClient.getChallengeById(id)` trả về `ChallengeWithSummary | undefined` từ mock.

### 8.2. Code editor panel

File: `src/components/features/editor/code-editor-panel.tsx`

- Client component dùng Monaco editor (`@monaco-editor/react`) thông qua dynamic import (SSR off).
- Props:
  - `challengeId`.
  - `initialLanguage` ("python"/"csharp").
  - `onMockRun` (optional) để báo kết quả cho parent.
- State: `language`, `code`, `status`, `message`, `lastRunAt`.
- Mock run:
  - Nếu code rỗng hoặc random fail → `status = "error"` + message gợi ý debug.
  - Ngược lại → `status = "success"` + message PASS mock.
  - Gọi `onMockRun` nếu được truyền.
- UI:
  - Editor chiều cao cố định (`h-80`), theme `vs-dark`.
  - Indicator trạng thái bằng `Badge`.
  - Text note nhắc đây chỉ là flow mock.

### 8.3. ChallengeEditorSection – lịch sử submission mock

File: `src/components/features/challenges/challenge-editor-section.tsx`

- Client component.
- Quản lý `history: SubmissionHistoryEntry[]`.
- Truyền `onMockRun` vào `CodeEditorPanel` để nhận payload và push vào history.
- Render card "Lịch sử chạy (mock)":
  - Empty state khi chưa có lần chạy.
  - List entry: badge trạng thái, thời gian, language, message.

### 8.4. Challenge detail page

File: `src/app/(app)/challenges/[id]/page.tsx`

- Server component async:

  ```tsx
  const challenge = await apiClient.getChallengeById(params.id);
  if (!challenge) return notFound();
  ```

- Hiển thị:
  - Title + difficulty badge.
  - Summary.
  - Card "Mô tả chi tiết" (placeholder, sau này sẽ lấy từ backend).
  - `<ChallengeEditorSection challengeId={challenge.id} />`.

---

## 9. Loading & error boundaries

### 9.1. Loading cho Challenges

- `src/app/(app)/challenges/loading.tsx`:
  - Hiển thị skeleton cho title + mô tả + list cards.
- `src/app/(app)/challenges/[id]/loading.tsx`:
  - Skeleton cho title, mô tả, description card, và editor.

### 9.2. Error boundary

- `src/app/(app)/error.tsx` (client component):
  - Nhận `error`, `reset` từ Next.
  - `useEffect` để log error.
  - UI thân thiện: message + nút "Thử tải lại" gọi `reset()`.

Error boundary này áp dụng cho mọi route bên dưới `(app)`.

---

## 10. Định hướng nối backend sau này

Nhờ các abstraction hiện tại, việc nối backend .NET sau này sẽ khá thẳng:

- Thay implementation trong `api-client.ts`:
  - `listChallenges()` → gọi `GET /api/challenges`.
  - `getChallengeById()` → gọi `GET /api/challenges/{id}`.
  - Thêm `submitSolution()` → gọi `POST /api/submissions` và `GET /api/submissions/{id}`.
- Dữ liệu trả về map 1-1 với các type `ChallengeSummary`, `ChallengeWithSummary`.
- Editor flow: thay mock `setTimeout` trong `CodeEditorPanel` bằng việc gọi API qua hook client.

Kiến trúc hiện tại giúp frontend được triển khai sớm (deployable) để thu thập feedback UX, trong khi backend có thể được xây dựng và tích hợp dần mà không phá vỡ UI.
