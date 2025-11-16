import type {
  DashboardSummaryData,
  FocusArea,
} from "@/components/features/dashboard/dashboard-summary";

export type DailyChallengeSummary = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  shortDescription: string;
};

export type RecentActivityEntry = {
  id: string;
  challengeId: string;
  challengeTitle: string;
  language: string;
  status: "success" | "error";
  ranAt: string; // ISO string for now
};

export type AchievementPreview = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
};

const summaryMock: DashboardSummaryData = {
  points: 240,
  level: "Apprentice",
  streak: 5,
  completedChallenges: 18,
};

const focusAreasMock: FocusArea[] = [
  { label: "Algorithms", value: "Intermediate" },
  { label: "Debugging", value: "Strong" },
  { label: "System Design", value: "Learning" },
];

const dailyChallengeMock: DailyChallengeSummary = {
  id: "cli-todo",
  title: "Xây dựng CLI Todo List đơn giản",
  difficulty: "Medium",
  topics: ["CLI", "Node.js"],
  shortDescription:
    "Tạo ứng dụng dòng lệnh nhỏ để quản lý todo, luyện thao tác IO và xử lý lỗi.",
};

const recentActivityMock: RecentActivityEntry[] = [
  {
    id: "1",
    challengeId: "sum-even",
    challengeTitle: "Tính tổng các số chẵn trong mảng",
    language: "python",
    status: "success",
    ranAt: new Date().toISOString(),
  },
  {
    id: "2",
    challengeId: "cli-todo",
    challengeTitle: "Xây dựng CLI Todo List đơn giản",
    language: "csharp",
    status: "error",
    ranAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

const achievementsMock: AchievementPreview[] = [
  {
    id: "streak-3",
    name: "Streak 3 ngày",
    description: "Hoàn thành ít nhất một thử thách trong 3 ngày liên tiếp.",
    unlocked: true,
  },
  {
    id: "medium-5",
    name: "5 bài Medium",
    description: "Hoàn thành 5 thử thách ở độ khó Medium.",
    unlocked: false,
  },
  {
    id: "first-hard",
    name: "Hard đầu tiên",
    description: "Hoàn thành thử thách Hard đầu tiên.",
    unlocked: false,
  },
];

export async function getDashboardSummaryMock(): Promise<{
  summary: DashboardSummaryData;
  focusAreas: FocusArea[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { summary: summaryMock, focusAreas: focusAreasMock };
}

export async function getDailyChallengeMock(): Promise<DailyChallengeSummary | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return dailyChallengeMock;
}

export async function getRecentActivityMock(): Promise<RecentActivityEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 180));
  return recentActivityMock;
}

export async function getAchievementsMock(): Promise<AchievementPreview[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return achievementsMock;
}
