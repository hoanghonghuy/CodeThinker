"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocale } from "@/components/providers/locale-provider";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DashboardSummary,
  type DashboardSummaryData,
  type FocusArea,
} from "@/components/features/dashboard/dashboard-summary";
import { DailyChallengeCard } from "@/components/features/dashboard/daily-challenge-card";
import { RecentActivityList } from "@/components/features/dashboard/recent-activity-list";
import { AchievementsPreview } from "@/components/features/dashboard/achievements-preview";
import { ProgressChart } from "@/components/features/dashboard/progress-chart";
import { apiClient } from "@/lib/api-client";
import type {
  DailyChallengeSummary,
  RecentActivityEntry,
} from "@/lib/dashboard-mock";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { t } = useLocale();
  const { user, loading: authLoading } = useAuth();

  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [dailyChallenge, setDailyChallenge] =
    useState<DailyChallengeSummary | null>(null);
  const [recentActivity, setRecentActivity] =
    useState<RecentActivityEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setError("Bạn cần đăng nhập để xem dashboard.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const [dashboard, daily, recent] = await Promise.all([
          apiClient.getDashboardSummary(),
          apiClient.getDailyChallenge(),
          apiClient.getRecentActivity(),
        ]);

        if (cancelled) return;

        setSummary(dashboard.summary);
        setFocusAreas(dashboard.focusAreas);
        setDailyChallenge(daily);
        setRecentActivity(recent);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Không thể tải dữ liệu dashboard.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  
  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          {!user && (
            <div className="mt-4">
              <Link href="/login?next=/dashboard" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <p className="text-sm text-muted-foreground">Không thể tải dữ liệu dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.dashboard.title}
        </h1>
        <p className="text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
      </div>

      <DashboardSummary
        summary={summary}
        focusAreas={focusAreas}
        messages={t.dashboard}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <DailyChallengeCard challenge={dailyChallenge} />
        </div>
        <AchievementsPreview />
      </div>

      <RecentActivityList items={recentActivity} />
      <ProgressChart weeklyCounts={getWeeklyMockData()} />
    </div>
  );
}

// Simple mock data for weekly progress; replace with backend later
function getWeeklyMockData() {
  const today = new Date();
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    week.push({
      day: d.toLocaleDateString("vi-VN", { weekday: "short" }),
      count: Math.floor(Math.random() * 4),
    });
  }
  return week;
}
