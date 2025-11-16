import type {
  ChallengeDifficulty,
  ChallengeSummary,
} from "@/components/features/challenges/challenge-list";

export type ChallengeWithSummary = ChallengeSummary & {
  summary: string;
};

// Mock data used by the challenges list and challenge detail pages.
export const mockChallenges: ChallengeWithSummary[] = [
  {
    id: "sum-even",
    title: "Tính tổng các số chẵn trong mảng",
    difficulty: "Easy" satisfies ChallengeDifficulty,
    topics: ["Array", "Loop"],
    status: "completed",
    createdAt: "2025-01-05T08:00:00.000Z",
    summary:
      "Viết hàm nhận vào một mảng số nguyên và trả về tổng các phần tử chẵn.",
  },
  {
    id: "cli-todo",
    title: "Xây dựng CLI Todo List đơn giản",
    difficulty: "Medium" satisfies ChallengeDifficulty,
    topics: ["CLI", "Node.js"],
    status: "in_progress",
    createdAt: "2025-02-10T09:30:00.000Z",
    summary:
      "Tạo một ứng dụng dòng lệnh cho phép thêm, xoá, đánh dấu hoàn thành công việc.",
  },
  {
    id: "optimize-query",
    title: "Tối ưu hoá truy vấn database",
    difficulty: "Medium" satisfies ChallengeDifficulty,
    topics: ["SQL", "Performance"],
    status: "not_started",
    createdAt: "2025-02-15T11:15:00.000Z",
    summary:
      "Cho một bảng logs lớn, tối ưu truy vấn để lấy top N bản ghi theo một tiêu chí.",
  },
  {
    id: "rate-limiter",
    title: "Cài đặt simple rate limiter",
    difficulty: "Hard" satisfies ChallengeDifficulty,
    topics: ["Algorithms", "Backend"],
    status: "not_started",
    createdAt: "2025-02-20T14:45:00.000Z",
    summary:
      "Thiết kế và cài đặt rate limiter đơn giản cho API theo IP hoặc user.",
  },
];

export async function listChallengesMock(): Promise<ChallengeSummary[]> {
  // Mô phỏng độ trễ mạng nhỏ.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return mockChallenges;
}

export async function getChallengeByIdMock(
  id: string,
): Promise<ChallengeWithSummary | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockChallenges.find((c) => c.id === id);
}
