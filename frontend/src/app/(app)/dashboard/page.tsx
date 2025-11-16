"use client";

import { useEffect, useState } from "react";

import { useLocale } from "@/components/providers/locale-provider";
import {
  DashboardSummary,
  type DashboardSummaryData,
  type FocusArea,
} from "@/components/features/dashboard/dashboard-summary";
import { DailyChallengeCard } from "@/components/features/dashboard/daily-challenge-card";
import { RecentActivityList } from "@/components/features/dashboard/recent-activity-list";
import { AchievementsPreview } from "@/components/features/dashboard/achievements-preview";
import { apiClient } from "@/lib/api-client";
import type {
  DailyChallengeSummary,
  RecentActivityEntry,
  AchievementPreview,
} from "@/lib/dashboard-mock";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { t } = useLocale();

  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [dailyChallenge, setDailyChallenge] =
    useState<DailyChallengeSummary | null>(null);
  const [recentActivity, setRecentActivity] =
    useState<RecentActivityEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const showSkeleton = loading && !summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.dashboard.title}
        </h1>
        <p className="text-sm text-muted-foreground">{t.dashboard.subtitle}</p>
      </div>

      {showSkeleton ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : summary ? (
        <DashboardSummary
          summary={summary}
          focusAreas={focusAreas}
          messages={t.dashboard}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <DailyChallengeCard challenge={dailyChallenge} />
        </div>
        <AchievementsPreview />
      </div>

      <RecentActivityList items={recentActivity} />
    </div>
  );
}
