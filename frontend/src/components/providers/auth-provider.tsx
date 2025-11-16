"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { apiClient, ACCESS_TOKEN_KEY } from "@/lib/api-client";
import type { UserResponse } from "@/lib/backend-api";

export type AuthContextValue = {
  user: UserResponse | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: {
    email: string;
    password: string;
    displayName: string;
    preferredLanguage?: string;
    uiLanguage?: string;
    selfAssessedLevel?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncTokenFromStorage = useCallback(() => {
    const stored = getStoredToken();
    setToken(stored);
    return stored;
  }, []);

  const hydrateUser = useCallback(async () => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = syncTokenFromStorage();
    if (!stored) {
      setLoading(false);
      return;
    }

    hydrateUser();
  }, [hydrateUser, syncTokenFromStorage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN_KEY) {
        const newToken = event.newValue;
        setToken(newToken);
        if (newToken) {
          hydrateUser();
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [hydrateUser]);

  const persistToken = useCallback((value: string | null) => {
    setToken(value);
    if (typeof window === "undefined") return;
    if (value) {
      localStorage.setItem(ACCESS_TOKEN_KEY, value);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await apiClient.login(email, password);
        persistToken(response.accessToken);
        setUser(response.user);
      } catch (error) {
        throw normalizeError(error, "Đăng nhập thất bại");
      }
    },
    [persistToken],
  );

  const register = useCallback(
    async (params: {
      email: string;
      password: string;
      displayName: string;
      preferredLanguage?: string;
      uiLanguage?: string;
      selfAssessedLevel?: string;
    }) => {
      try {
        const response = await apiClient.register(params);
        persistToken(response.accessToken);
        setUser(response.user);
      } catch (error) {
        throw normalizeError(error, "Đăng ký thất bại");
      }
    },
    [persistToken],
  );

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, [persistToken]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    await hydrateUser();
  }, [hydrateUser, token]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, register, logout, refreshUser }),
    [user, token, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function normalizeError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "object" && error && "message" in error) {
    return new Error(String((error as { message: unknown }).message));
  }

  return new Error(fallbackMessage);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
