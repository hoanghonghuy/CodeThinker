import type {
  ChallengeSummary,
  ChallengeDifficulty,
  ChallengeStatus,
} from "@/components/features/challenges/challenge-list";
import type { Track, TrackStatus, TrackWithProgress } from "@/lib/tracks-mock";
import { challengesApi, tracksApi, authApi } from "@/lib/backend-api";

export const ACCESS_TOKEN_KEY = "ct.accessToken";

// Backend DTO interfaces to replace 'any' types
interface BackendChallengeDto {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string[];
  status: string;
  estimatedHours: number;
  tags: string[];
  trackId?: string;
  trackTitle?: string;
  progressCurrent: number;
  progressTotal: number;
  isCompleted: boolean;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  solution?: string;
  hints?: string;
  attempts: number;
}

interface BackendTrackDto {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string[];
  status: string;
  estimatedHours: number;
  tags: string[];
  progressCurrent: number;
  progressTotal: number;
  isCompleted: boolean;
  challengeCount: number;
  completedChallenges: number;
  startedAt?: string;
  completedAt?: string;
  challengeIds?: string[];
}

import {
  getAchievementsMock,
  getDailyChallengeMock,
  getDashboardSummaryMock,
  getRecentActivityMock,
  type AchievementPreview,
  type DailyChallengeSummary,
  type RecentActivityEntry,
} from "@/lib/dashboard-mock";
import {
  getProfileStats,
  getUserPreferences,
  updateUserPreferences,
  type UserPreferences,
  type ProfileStats,
} from "@/lib/profile-mock";
import {
  getAchievements,
  getAchievementsByCategory,
  getUnlockedAchievements,
  getLockedAchievements,
  type Achievement,
} from "@/lib/achievements-mock";
import {
  getLeaderboard,
  type LeaderboardEntry,
  type LeaderboardTimeframe,
  type LeaderboardSortBy,
} from "@/lib/leaderboard-mock";
import {
  getTracksMock,
  getTrackByIdMock,
  enrichTrackWithProgress,
} from "@/lib/tracks-mock";

// Helper function to get auth token from localStorage
const getAuthToken = (): string => {
  if (typeof window === 'undefined') return '';
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token || '';
};

// API client that now uses the real backend for challenges and tracks
export const apiClient = {
  // Challenges - Now using backend API
  async listChallenges(): Promise<ChallengeSummary[]> {
    try {
      const token = getAuthToken();
      const response = await challengesApi.getChallenges(token, { pageSize: 100 });
      return response.items.map((challenge) =>
        transformChallengeSummary(challenge as BackendChallengeDto),
      );
    } catch (error) {
      console.error('Failed to fetch challenges from backend, using mock data:', error);
      // Fallback to mock data if backend fails
      const { listChallengesMock } = await import("@/lib/challenges-mock");
      return listChallengesMock();
    }
  },

  async getChallengeById(id: string): Promise<ChallengeSummary | undefined> {
    try {
      const token = getAuthToken();
      const challenge = await challengesApi.getChallengeById(token, id);
      return transformChallengeDetail(challenge as BackendChallengeDto);
    } catch (error) {
      console.error('Failed to fetch challenge from backend, using mock data:', error);
      // Fallback to mock data if backend fails
      const { getChallengeByIdMock } = await import("@/lib/challenges-mock");
      return getChallengeByIdMock(id);
    }
  },

  // Dashboard - Still using mock data for now
  async getDashboardSummary(): Promise<{
    summary: import("@/components/features/dashboard/dashboard-summary").DashboardSummaryData;
    focusAreas: import("@/components/features/dashboard/dashboard-summary").FocusArea[];
  }> {
    return getDashboardSummaryMock();
  },

  async getDailyChallenge(): Promise<DailyChallengeSummary | null> {
    return getDailyChallengeMock();
  },

  async getRecentActivity(): Promise<RecentActivityEntry[]> {
    return getRecentActivityMock();
  },

  async getAchievementsPreview(): Promise<AchievementPreview[]> {
    return getAchievementsMock();
  },

  // Tracks - Now using backend API
  async getTracks(): Promise<Track[]> {
    try {
      const token = getAuthToken();
      const response = await tracksApi.getTracks(token, { pageSize: 100 });
      return response.items.map((track) => transformTrackSummary(track as BackendTrackDto));
    } catch (error) {
      console.error('Failed to fetch tracks from backend, using mock data:', error);
      // Fallback to mock data if backend fails
      return getTracksMock();
    }
  },

  async getTrackById(id: string): Promise<Track | undefined> {
    try {
      const token = getAuthToken();
      const track = await tracksApi.getTrackById(token, id);
      return transformTrackDetail(track as BackendTrackDto);
    } catch (error) {
      console.error('Failed to fetch track from backend, using mock data:', error);
      // Fallback to mock data if backend fails
      return getTrackByIdMock(id);
    }
  },

  async getTracksWithProgress(): Promise<TrackWithProgress[]> {
    try {
      const token = getAuthToken();
      const response = await tracksApi.getTracks(token, { pageSize: 100 });
      const tracks = response.items.map((track) => transformTrackSummary(track as BackendTrackDto));
      const challenges = await this.listChallenges();
      return tracks.map((track) => enrichTrackWithProgress(track, challenges));
    } catch (error) {
      console.error('Failed to fetch tracks with progress from backend, using mock data:', error);
      // Fallback to mock data if backend fails
      const tracks = await getTracksMock();
      const challenges = await this.listChallenges();
      return tracks.map((track) => enrichTrackWithProgress(track, challenges));
    }
  },

  async getTrackWithProgressById(id: string): Promise<TrackWithProgress | undefined> {
    try {
      const token = getAuthToken();
      const track = await tracksApi.getTrackById(token, id);
      const trackSummary = transformTrackDetail(track as BackendTrackDto);
      const challenges = await this.listChallenges();
      return enrichTrackWithProgress(trackSummary, challenges);
    } catch (error) {
      console.error('Failed to fetch track with progress from backend, using mock data:', error);
      // Fallback to mock data if backend fails
      const track = await getTrackByIdMock(id);
      if (!track) return undefined;
      const challenges = await this.listChallenges();
      return enrichTrackWithProgress(track, challenges);
    }
  },

  // Profile & Settings - Still using mock data for now
  async getProfileStats(): Promise<ProfileStats> {
    return getProfileStats();
  },

  async getUserPreferences(): Promise<UserPreferences> {
    return getUserPreferences();
  },

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return updateUserPreferences(preferences);
  },

  // Achievements - Still using mock data for now
  async getAchievements(): Promise<Achievement[]> {
    return getAchievements();
  },

  async getAchievementsByCategory(category: Achievement["category"]): Promise<Achievement[]> {
    return getAchievementsByCategory(category);
  },

  async getUnlockedAchievements(): Promise<Achievement[]> {
    return getUnlockedAchievements();
  },

  async getLockedAchievements(): Promise<Achievement[]> {
    return getLockedAchievements();
  },

  // Leaderboard - Still using mock data for now
  async getLeaderboard(
    timeframe: LeaderboardTimeframe = "all-time",
    sortBy: LeaderboardSortBy = "points"
  ): Promise<LeaderboardEntry[]> {
    return getLeaderboard(timeframe, sortBy);
  },

  // New auth methods for backend integration
  async login(email: string, password: string) {
    return authApi.login({ email, password });
  },

  async register(userData: {
    email: string;
    displayName: string;
    password: string;
    preferredLanguage?: string;
    uiLanguage?: string;
    selfAssessedLevel?: string;
  }) {
    return authApi.register(userData);
  },

  async getCurrentUser() {
    const token = getAuthToken();
    return authApi.getCurrentUser(token);
  },

  // Challenge interaction methods
  async startChallenge(id: string) {
    const token = getAuthToken();
    return challengesApi.startChallenge(token, id);
  },

  async submitChallenge(id: string, solution: string) {
    const token = getAuthToken();
    return challengesApi.submitChallenge(token, id, solution);
  },

  // Track interaction methods
  async startTrack(id: string) {
    const token = getAuthToken();
    return tracksApi.startTrack(token, id);
  },
};

// Transform functions to convert backend API responses to frontend types
function transformChallengeSummary(challenge: BackendChallengeDto): ChallengeSummary {
  return {
    id: challenge.id,
    title: challenge.title,
    difficulty: mapDifficultyToEnum(challenge.difficulty),
    topics: challenge.topics || [],
    status: mapStatusToEnum(challenge.status),
    createdAt: challenge.createdAt || new Date().toISOString(),
  };
}

function transformChallengeDetail(challenge: BackendChallengeDto): ChallengeSummary {
  return transformChallengeSummary(challenge);
}

function transformTrackSummary(track: BackendTrackDto): Track {
  return {
    id: track.id,
    title: track.title,
    description: track.description || '',
    estimatedHours: track.estimatedHours || 0,
    difficulty: mapTrackDifficultyToEnum(track.difficulty),
    challengeIds: track.challengeIds || [],
    status: mapTrackStatusToEnum(track.status),
  };
}

function transformTrackDetail(track: BackendTrackDto): Track {
  return transformTrackSummary(track);
}

// Helper functions to map backend strings to frontend enums
function mapDifficultyToEnum(difficulty: string): ChallengeDifficulty {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return 'Easy';
  }
}

function mapTrackDifficultyToEnum(difficulty: string): "Beginner" | "Intermediate" | "Advanced" {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Beginner';
  }
}

function mapStatusToEnum(status: string): ChallengeStatus {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'completed';
    case 'in_progress':
      return 'in_progress';
    default:
      return 'not_started';
  }
}

function mapTrackStatusToEnum(status: string): TrackStatus {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'completed';
    case 'in_progress':
      return 'in_progress';
    default:
      return 'not_started';
  }
}
