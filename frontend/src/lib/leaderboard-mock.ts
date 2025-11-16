export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  points: number;
  streak: number;
  completedChallenges: number;
  joinDate: string;
  lastActive: string;
  country: string;
  level: string;
};

export type LeaderboardTimeframe = "all-time" | "monthly" | "weekly";
export type LeaderboardSortBy = "points" | "streak" | "completed";

const mockUsers: Omit<LeaderboardEntry, "rank">[] = [
  {
    userId: "user-1",
    displayName: "CodeMaster",
    avatar: "👨‍💻",
    points: 5420,
    streak: 45,
    completedChallenges: 89,
    joinDate: "2023-06-15",
    lastActive: "2024-02-10",
    country: "🇻🇳",
    level: "Expert",
  },
  {
    userId: "user-2",
    displayName: "AlgorithmNinja",
    avatar: "🥷",
    points: 4890,
    streak: 30,
    completedChallenges: 76,
    joinDate: "2023-07-20",
    lastActive: "2024-02-10",
    country: "🇺🇸",
    level: "Expert",
  },
  {
    userId: "user-3",
    displayName: "DebugQueen",
    avatar: "👸",
    points: 4250,
    streak: 28,
    completedChallenges: 68,
    joinDate: "2023-08-10",
    lastActive: "2024-02-09",
    country: "🇬🇧",
    level: "Advanced",
  },
  {
    userId: "user-4",
    displayName: "SyntaxWizard",
    avatar: "🧙‍♂️",
    points: 3800,
    streak: 25,
    completedChallenges: 62,
    joinDate: "2023-09-01",
    lastActive: "2024-02-10",
    country: "🇯🇵",
    level: "Advanced",
  },
  {
    userId: "user-5",
    displayName: "DataStructuresGuru",
    avatar: "🧘",
    points: 3550,
    streak: 22,
    completedChallenges: 58,
    joinDate: "2023-09-15",
    lastActive: "2024-02-08",
    country: "🇩🇪",
    level: "Advanced",
  },
  {
    userId: "user-6",
    displayName: "FrontendHero",
    avatar: "🦸‍♂️",
    points: 3200,
    streak: 20,
    completedChallenges: 54,
    joinDate: "2023-10-01",
    lastActive: "2024-02-10",
    country: "🇫🇷",
    level: "Advanced",
  },
  {
    userId: "user-7",
    displayName: "BackendBoss",
    avatar: "👨‍💼",
    points: 2950,
    streak: 18,
    completedChallenges: 49,
    joinDate: "2023-10-20",
    lastActive: "2024-02-09",
    country: "🇨🇦",
    level: "Intermediate",
  },
  {
    userId: "user-8",
    displayName: "FullStackPhoenix",
    avatar: "🔥",
    points: 2700,
    streak: 15,
    completedChallenges: 45,
    joinDate: "2023-11-01",
    lastActive: "2024-02-10",
    country: "🇦🇺",
    level: "Intermediate",
  },
  {
    userId: "user-9",
    displayName: "MobileDevStar",
    avatar: "⭐",
    points: 2450,
    streak: 12,
    completedChallenges: 41,
    joinDate: "2023-11-15",
    lastActive: "2024-02-07",
    country: "🇮🇳",
    level: "Intermediate",
  },
  {
    userId: "user-10",
    displayName: "CloudArchitect",
    avatar: "☁️",
    points: 2200,
    streak: 10,
    completedChallenges: 38,
    joinDate: "2023-12-01",
    lastActive: "2024-02-10",
    country: "🇧🇷",
    level: "Intermediate",
  },
  {
    userId: "user-11",
    displayName: "AIExpert",
    avatar: "🤖",
    points: 1950,
    streak: 8,
    completedChallenges: 34,
    joinDate: "2023-12-15",
    lastActive: "2024-02-09",
    country: "🇰🇷",
    level: "Intermediate",
  },
  {
    userId: "user-12",
    displayName: "SecuritySpecialist",
    avatar: "🔐",
    points: 1700,
    streak: 7,
    completedChallenges: 30,
    joinDate: "2024-01-01",
    lastActive: "2024-02-10",
    country: "🇮🇱",
    level: "Intermediate",
  },
  {
    userId: "user-13",
    displayName: "DevOpsMaster",
    avatar: "🔧",
    points: 1450,
    streak: 6,
    completedChallenges: 26,
    joinDate: "2024-01-10",
    lastActive: "2024-02-08",
    country: "🇸🇪",
    level: "Beginner",
  },
  {
    userId: "current-user",
    displayName: "Independent Learner",
    avatar: "🎓",
    points: 1250,
    streak: 7,
    completedChallenges: 12,
    joinDate: "2024-01-15",
    lastActive: "2024-02-10",
    country: "🇻🇳",
    level: "Intermediate",
  },
];

export function getLeaderboardData(
  timeframe: LeaderboardTimeframe = "all-time",
  sortBy: LeaderboardSortBy = "points"
): LeaderboardEntry[] {
  // Simulate different data for different timeframes
  let data = [...mockUsers];
  
  if (timeframe === "monthly") {
    // Reduce points for monthly view (simulate monthly activity)
    data = data.map(user => ({
      ...user,
      points: Math.floor(user.points * 0.15), // 15% of total points earned this month
      streak: Math.min(user.streak, 30), // Max 30 days in a month
    }));
  } else if (timeframe === "weekly") {
    // Further reduce for weekly view
    data = data.map(user => ({
      ...user,
      points: Math.floor(user.points * 0.05), // 5% of total points earned this week
      streak: Math.min(user.streak, 7), // Max 7 days in a week
    }));
  }

  // Sort by the specified field
  data.sort((a, b) => {
    switch (sortBy) {
      case "points":
        return b.points - a.points;
      case "streak":
        return b.streak - a.streak;
      case "completed":
        return b.completedChallenges - a.completedChallenges;
      default:
        return b.points - a.points;
    }
  });

  // Add rank
  return data.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
}

export function getCurrentUserRank(
  timeframe: LeaderboardTimeframe = "all-time",
  sortBy: LeaderboardSortBy = "points"
): LeaderboardEntry | null {
  const data = getLeaderboardData(timeframe, sortBy);
  return data.find(user => user.userId === "current-user") || null;
}

export function getTopUsers(count: number = 10): LeaderboardEntry[] {
  return getLeaderboardData().slice(0, count);
}

export async function getLeaderboard(
  timeframe: LeaderboardTimeframe = "all-time",
  sortBy: LeaderboardSortBy = "points"
): Promise<LeaderboardEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getLeaderboardData(timeframe, sortBy);
}

export function getRankChangeColor(currentRank: number, previousRank?: number): string {
  if (previousRank === undefined) return "text-gray-500";
  if (currentRank < previousRank) return "text-green-600"; // Moved up
  if (currentRank > previousRank) return "text-red-600"; // Moved down
  return "text-gray-500"; // No change
}

export function getRankChangeIcon(currentRank: number, previousRank?: number): string {
  if (previousRank === undefined) return "—";
  if (currentRank < previousRank) return "↑";
  if (currentRank > previousRank) return "↓";
  return "—";
}
