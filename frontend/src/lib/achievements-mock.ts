export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "challenges" | "tracks" | "points" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedAt?: string;
  progress: {
    current: number;
    required: number;
  };
  unlockCondition: string;
};

export const mockAchievements: Achievement[] = [
  // Streak Achievements
  {
    id: "streak-3",
    title: "Bắt đầu nóng",
    description: "Hoàn thành bài tập trong 3 ngày liên tục",
    icon: "🔥",
    category: "streak",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2024-01-17",
    progress: { current: 7, required: 3 },
    unlockCondition: "Hoàn thành bài tập 3 ngày liên tục",
  },
  {
    id: "streak-7",
    title: "Streak Master",
    description: "Hoàn thành bài tập trong 7 ngày liên tục",
    icon: "🔥",
    category: "streak",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2024-01-21",
    progress: { current: 7, required: 7 },
    unlockCondition: "Hoàn thành bài tập 7 ngày liên tục",
  },
  {
    id: "streak-30",
    title: "Thánh streak",
    description: "Hoàn thành bài tập trong 30 ngày liên tục",
    icon: "🔥",
    category: "streak",
    rarity: "epic",
    unlocked: false,
    progress: { current: 7, required: 30 },
    unlockCondition: "Hoàn thành bài tập 30 ngày liên tục",
  },

  // Challenge Achievements
  {
    id: "first-challenge",
    title: "Bước đầu tiên",
    description: "Hoàn thành bài tập đầu tiên",
    icon: "🎯",
    category: "challenges",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2024-01-15",
    progress: { current: 12, required: 1 },
    unlockCondition: "Hoàn thành bài tập đầu tiên",
  },
  {
    id: "challenge-10",
    title: "Code Warrior",
    description: "Hoàn thành 10 bài tập",
    icon: "⚔️",
    category: "challenges",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2024-01-28",
    progress: { current: 12, required: 10 },
    unlockCondition: "Hoàn thành 10 bài tập",
  },
  {
    id: "challenge-50",
    title: "Thử thách bậc thầy",
    description: "Hoàn thành 50 bài tập",
    icon: "🏆",
    category: "challenges",
    rarity: "epic",
    unlocked: false,
    progress: { current: 12, required: 50 },
    unlockCondition: "Hoàn thành 50 bài tập",
  },
  {
    id: "challenge-100",
    title: "Huyền thoại code",
    description: "Hoàn thành 100 bài tập",
    icon: "👑",
    category: "challenges",
    rarity: "legendary",
    unlocked: false,
    progress: { current: 12, required: 100 },
    unlockCondition: "Hoàn thành 100 bài tập",
  },

  // Track Achievements
  {
    id: "first-track",
    title: "Lộ trình đầu tiên",
    description: "Hoàn thành lộ trình đầu tiên",
    icon: "🛤️",
    category: "tracks",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2024-01-20",
    progress: { current: 2, required: 1 },
    unlockCondition: "Hoàn thành lộ trình đầu tiên",
  },
  {
    id: "track-5",
    title: "Track Finisher",
    description: "Hoàn thành 5 lộ trình",
    icon: "🎪",
    category: "tracks",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2024-02-01",
    progress: { current: 2, required: 5 },
    unlockCondition: "Hoàn thành 5 lộ trình",
  },
  {
    id: "track-all",
    title: "Bậc thầy lộ trình",
    description: "Hoàn thành tất cả lộ trình",
    icon: "🌟",
    category: "tracks",
    rarity: "legendary",
    unlocked: false,
    progress: { current: 2, required: 8 },
    unlockCondition: "Hoàn thành tất cả lộ trình",
  },

  // Points Achievements
  {
    id: "points-100",
    title: "Khởi đầu",
    description: "Đạt 100 điểm",
    icon: "💯",
    category: "points",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2024-01-16",
    progress: { current: 1250, required: 100 },
    unlockCondition: "Đạt 100 điểm",
  },
  {
    id: "points-1000",
    title: "Ngôi sao điểm số",
    description: "Đạt 1000 điểm",
    icon: "⭐",
    category: "points",
    rarity: "rare",
    unlocked: true,
    unlockedAt: "2024-01-30",
    progress: { current: 1250, required: 1000 },
    unlockCondition: "Đạt 1000 điểm",
  },
  {
    id: "points-5000",
    title: "Vua điểm số",
    description: "Đạt 5000 điểm",
    icon: "👑",
    category: "points",
    rarity: "epic",
    unlocked: false,
    progress: { current: 1250, required: 5000 },
    unlockCondition: "Đạt 5000 điểm",
  },

  // Special Achievements
  {
    id: "perfect-submission",
    title: "Hoàn hảo",
    description: "Nộp bài đúng ngay lần thử đầu tiên",
    icon: "✨",
    category: "special",
    rarity: "rare",
    unlocked: false,
    progress: { current: 0, required: 1 },
    unlockCondition: "Nộp bài đúng ngay lần thử đầu tiên",
  },
  {
    id: "night-owl",
    title: "Cú đêm",
    description: "Hoàn thành bài tập sau 11 giờ tối",
    icon: "🦉",
    category: "special",
    rarity: "common",
    unlocked: true,
    unlockedAt: "2024-01-25",
    progress: { current: 3, required: 1 },
    unlockCondition: "Hoàn thành bài tập sau 11 giờ tối",
  },
  {
    id: "early-bird",
    title: "Chim sớm",
    description: "Hoàn thành bài tập trước 6 giờ sáng",
    icon: "🐦",
    category: "special",
    rarity: "common",
    unlocked: false,
    progress: { current: 0, required: 1 },
    unlockCondition: "Hoàn thành bài tập trước 6 giờ sáng",
  },
];

export async function getAchievements(): Promise<Achievement[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockAchievements;
}

export async function getAchievementsByCategory(category: Achievement["category"]): Promise<Achievement[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockAchievements.filter((a) => a.category === category);
}

export async function getUnlockedAchievements(): Promise<Achievement[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockAchievements.filter((a) => a.unlocked);
}

export async function getLockedAchievements(): Promise<Achievement[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockAchievements.filter((a) => !a.unlocked);
}

export function getRarityColor(rarity: Achievement["rarity"]): string {
  switch (rarity) {
    case "common":
      return "border-gray-300 bg-gray-50";
    case "rare":
      return "border-blue-300 bg-blue-50";
    case "epic":
      return "border-purple-300 bg-purple-50";
    case "legendary":
      return "border-yellow-300 bg-yellow-50";
    default:
      return "border-gray-300 bg-gray-50";
  }
}

export function getRarityTextColor(rarity: Achievement["rarity"]): string {
  switch (rarity) {
    case "common":
      return "text-gray-600";
    case "rare":
      return "text-blue-600";
    case "epic":
      return "text-purple-600";
    case "legendary":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
}

export function getCategoryIcon(category: Achievement["category"]): string {
  switch (category) {
    case "streak":
      return "🔥";
    case "challenges":
      return "🎯";
    case "tracks":
      return "🛤️";
    case "points":
      return "💯";
    case "special":
      return "✨";
    default:
      return "🏆";
  }
}
