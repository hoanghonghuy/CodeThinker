import type { ChallengeSummary } from "@/components/features/challenges/challenge-list";

export type TrackStatus = "not_started" | "in_progress" | "completed";

export type Track = {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  challengeIds: string[];
  status: TrackStatus;
};

export type TrackWithProgress = Track & {
  totalChallenges: number;
  completedChallenges: number;
  progressPercentage: number;
};

const mockTracks: Track[] = [
  {
    id: "fundamentals",
    title: "Fundamentals",
    description:
      "Các bài tập nền tảng về thuật toán, mảng, vòng lặp, và xử lý chuỗi.",
    estimatedHours: 12,
    difficulty: "Beginner",
    challengeIds: ["sum-even"],
    status: "completed",
  },
  {
    id: "backend-basics",
    title: "Backend Basics",
    description:
      "Giới thiệu về CLI, file I/O, và các bài tập backend đơn giản (Node.js/Python).",
    estimatedHours: 16,
    difficulty: "Intermediate",
    challengeIds: ["cli-todo"],
    status: "in_progress",
  },
  {
    id: "sql-performance",
    title: "SQL & Performance",
    description:
      "Tập trung vào truy vấn SQL, tối ưu, và các bài tập về hiệu năng cơ bản.",
    estimatedHours: 20,
    difficulty: "Intermediate",
    challengeIds: ["optimize-query"],
    status: "not_started",
  },
  {
    id: "algorithms-hard",
    title: "Algorithms (Hard)",
    description:
      "Các vấn đề thuật toán nâng cao: rate limiting, cache, và các thuật toán phức tạp hơn.",
    estimatedHours: 24,
    difficulty: "Advanced",
    challengeIds: ["rate-limiter"],
    status: "not_started",
  },
];

export async function getTracksMock(): Promise<Track[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockTracks;
}

export async function getTrackByIdMock(
  id: string,
): Promise<Track | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockTracks.find((t) => t.id === id);
}

// Helper để tính progress (sau này sẽ dùng data thật từ backend)
export function enrichTrackWithProgress(
  track: Track,
  allChallenges: ChallengeSummary[],
): TrackWithProgress {
  const trackChallenges = allChallenges.filter((c) =>
    track.challengeIds.includes(c.id),
  );
  const completed = trackChallenges.filter((c) => c.status === "completed")
    .length;
  const total = trackChallenges.length;
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    ...track,
    totalChallenges: total,
    completedChallenges: completed,
    progressPercentage,
  };
}
