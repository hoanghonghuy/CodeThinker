export type ProfileStats = {
  totalPoints: number;
  currentLevel: string;
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  tracksCompleted: number;
  totalTracks: number;
  joinDate: string;
};

export type UserPreferences = {
  displayName: string;
  email: string;
  preferredLanguage: string;
  uiLanguage: "vi" | "en";
  selfAssessedLevel: "Beginner" | "Intermediate" | "Advanced";
  editorTheme: "vs-dark" | "vs-light" | "hc-black";
  editorFontSize: number;
  editorWordWrap: "on" | "off" | "wordWrapColumn" | "bounded";
  editorMinimap: boolean;
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyProgress: boolean;
  };
};

export const mockStats: ProfileStats = {
  totalPoints: 1250,
  currentLevel: "Intermediate",
  streak: 7,
  completedChallenges: 12,
  totalChallenges: 45,
  tracksCompleted: 2,
  totalTracks: 8,
  joinDate: "2024-01-15",
};

export const mockPreferences: UserPreferences = {
  displayName: "Independent Learner",
  email: "learner@example.com",
  preferredLanguage: "C#",
  uiLanguage: "vi",
  selfAssessedLevel: "Intermediate",
  editorTheme: "vs-dark",
  editorFontSize: 14,
  editorWordWrap: "on",
  editorMinimap: true,
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    weeklyProgress: true,
  },
};

export async function getProfileStats(): Promise<ProfileStats> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockStats;
}

export async function getUserPreferences(): Promise<UserPreferences> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Load from localStorage if available, otherwise return mock
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("userPreferences");
    if (stored) {
      try {
        return { ...mockPreferences, ...JSON.parse(stored) };
      } catch {
        return mockPreferences;
      }
    }
  }
  return mockPreferences;
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const current = await getUserPreferences();
  const updated = { ...current, ...preferences };
  
  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("userPreferences", JSON.stringify(updated));
  }
  
  return updated;
}
