// API client for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types for API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
  preferredLanguage?: string;
  uiLanguage?: string;
  selfAssessedLevel?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  country: string;
  preferredLanguage: string;
  uiLanguage: string;
  selfAssessedLevel: string;
  editorTheme: string;
  editorFontSize: number;
  editorWordWrap: string;
  editorMinimap: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyProgress: boolean;
  points: number;
  streak: number;
  completedChallenges: number;
  lastActive: string;
}

export interface ChallengeSummary {
  id: string;
  title: string;
}

// Submission types
export interface SubmitCodeRequest {
  challengeId: string;
  language: string;
  code: string;
}

export interface SubmissionResponse {
  id: string;
  challengeId?: string;
  language: string;
  status: string;
  output?: string;
  error?: string;
  pointsAwarded: number;
  executionTimeMs: number;
  submittedAt: string;
  completedAt?: string;
}

// Progress types
export interface ProgressSummaryResponse {
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  completedChallenges: number;
  totalSubmissions: number;
  lastActiveAt: string;
  recentActivity: RecentActivityDto[];
}

export interface RecentActivityDto {
  submissionId: string;
  challengeId: string;
  challengeTitle: string;
  status: string;
  submittedAt: string;
  pointsAwarded: number;
}

export interface DailyProgressDto {
  date: string;
  submissionsCount: number;
  completedCount: number;
  pointsEarned: number;
}
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
}

export interface ChallengeDetail extends ChallengeSummary {
  solution?: string;
  hints?: string;
  attempts: number;
}

export interface TrackSummary {
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
}

export interface TrackDetail extends TrackSummary {
  challenges: ChallengeSummary[];
}

export interface UserChallengeProgress {
  challengeId: string;
  challengeTitle: string;
  status: string;
  progressCurrent: number;
  progressTotal: number;
  startedAt?: string;
  completedAt?: string;
  attempts: number;
  lastSolution?: string;
}

export interface ChallengeResult {
  isCorrect: boolean;
  message: string;
  pointsEarned: number;
  progress: UserChallengeProgress;
  achievementsUnlocked: string[];
}

export interface UserTrackProgress {
  trackId: string;
  trackTitle: string;
  status: string;
  progressCurrent: number;
  progressTotal: number;
  startedAt?: string;
  completedAt?: string;
  totalChallenges: number;
  completedChallenges: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProfileResponse {
  id: string;
  email: string;
  displayName: string;
  preferredLanguage: string;
  uiLanguage: string;
  selfAssessedLevel: string;
  editorTheme: string;
  editorFontSize: number;
  editorWordWrap: string;
  editorMinimap: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyProgress: boolean;
  points: number;
  streak: number;
  completedChallenges: number;
  lastActive: string;
}

export interface UpdateProfileRequest {
  displayName: string;
  preferredLanguage: string;
  uiLanguage: string;
  selfAssessedLevel: string;
  editorTheme: string;
  editorFontSize: number;
  editorWordWrap: string;
  editorMinimap: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyProgress: boolean;
}

// Auth API
export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let message = 'Login failed';
      try {
        const error = await response.json();
        message = error.error || message;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(message);
    }

    return response.json();
  },

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      let message = 'Registration failed';
      try {
        const error = await response.json();
        message = error.error || message;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(message);
    }

    return response.json();
  },

  async getCurrentUser(token: string): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  },
};

// Profile API
export const profileApi = {
  async getProfile(token: string): Promise<ProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  },

  async updateProfile(token: string, payload: UpdateProfileRequest): Promise<ProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },
};

// Challenges API
export const challengesApi = {
  async getChallenges(
    token: string,
    options: {
      difficulty?: string;
      topic?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<PagedResult<ChallengeSummary>> {
    const params = new URLSearchParams();
    if (options.difficulty) params.append('difficulty', options.difficulty);
    if (options.topic) params.append('topic', options.topic);
    if (options.page) params.append('page', options.page.toString());
    if (options.pageSize) params.append('pageSize', options.pageSize.toString());

    const response = await fetch(`${API_BASE_URL}/challenges?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get challenges');
    }

    return response.json();
  },

  async getChallengeById(token: string, id: string): Promise<ChallengeDetail> {
    const response = await fetch(`${API_BASE_URL}/challenges/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get challenge');
    }

    return response.json();
  },

  async startChallenge(token: string, id: string): Promise<UserChallengeProgress> {
    const response = await fetch(`${API_BASE_URL}/challenges/${id}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start challenge');
    }

    return response.json();
  },

  async submitChallenge(token: string, id: string, solution: string): Promise<ChallengeResult> {
    const response = await fetch(`${API_BASE_URL}/challenges/${id}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ solution }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit challenge');
    }

    return response.json();
  },
};

// Tracks API
export const tracksApi = {
  async getTracks(
    token: string,
    options: {
      difficulty?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<PagedResult<TrackSummary>> {
    const params = new URLSearchParams();
    if (options.difficulty) params.append('difficulty', options.difficulty);
    if (options.page) params.append('page', options.page.toString());
    if (options.pageSize) params.append('pageSize', options.pageSize.toString());

    const response = await fetch(`${API_BASE_URL}/tracks?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get tracks');
    }

    return response.json();
  },

  async getTrackById(token: string, id: string): Promise<TrackDetail> {
    const response = await fetch(`${API_BASE_URL}/tracks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get track');
    }

    return response.json();
  },

  async getTrackChallenges(
    token: string,
    id: string,
    options: {
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<PagedResult<ChallengeSummary>> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.pageSize) params.append('pageSize', options.pageSize.toString());

    const response = await fetch(`${API_BASE_URL}/tracks/${id}/challenges?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get track challenges');
    }

    return response.json();
  },

  async startTrack(token: string, id: string): Promise<UserTrackProgress> {
    const response = await fetch(`${API_BASE_URL}/tracks/${id}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start track');
    }

    return response.json();
  },
};

// User Progress API
export const userProgressApi = {
  async getRecentProgress(token: string, count = 5): Promise<UserChallengeProgress[]> {
    const response = await fetch(`${API_BASE_URL}/userprogress/recent?count=${count}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get recent progress');
    }

    return response.json();
  },

  async getDailyProgress(token: string): Promise<UserChallengeProgress | null> {
    const response = await fetch(`${API_BASE_URL}/userprogress/daily`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get daily progress');
    }

    return response.json();
  },
};

// Submission API
export const submissionApi = {
  async submitCode(token: string, request: SubmitCodeRequest): Promise<SubmissionResponse> {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit code');
    }

    return response.json();
  },

  async getSubmissions(token: string, challengeId?: string, page = 1, pageSize = 20): Promise<SubmissionResponse[]> {
    const url = new URL(`${API_BASE_URL}/submissions`);
    if (challengeId) url.searchParams.append('challengeId', challengeId);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('pageSize', pageSize.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get submissions');
    }

    return response.json();
  },
};

// Progress API
export const progressApi = {
  async getProgressSummary(token: string): Promise<ProgressSummaryResponse> {
    const response = await fetch(`${API_BASE_URL}/progress/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get progress summary');
    }

    return response.json();
  },

  async getDailyProgress(token: string, days = 7): Promise<DailyProgressDto[]> {
    const response = await fetch(`${API_BASE_URL}/progress/daily?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get daily progress');
    }

    return response.json();
  },
};
