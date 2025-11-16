"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStatsCard } from "@/components/features/profile/profile-stats-card";
import { SettingsForm } from "@/components/features/profile/settings-form";
import { apiClient } from "@/lib/api-client";
import { useLocale } from "@/components/providers/locale-provider";
import type { UserPreferences, ProfileStats } from "@/lib/profile-mock";

export default function ProfilePage() {
  const { t } = useLocale();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, preferencesData] = await Promise.all([
          apiClient.getProfileStats(),
          apiClient.getUserPreferences(),
        ]);
        setStats(statsData);
        setPreferences(preferencesData);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePreferencesSave = (updatedPreferences: UserPreferences) => {
    setPreferences(updatedPreferences);
  };

  if (loading) {
    return <div>{t.profile.loadingProfile}</div>;
  }

  if (!stats || !preferences) {
    return <div>{t.profile.loadFailed}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.profile.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t.profile.subtitle}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Info Card */}
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tên hiển thị</span>
                  <span className="font-medium">{preferences.displayName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{preferences.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ngôn ngữ ưa thích</span>
                  <span className="font-medium">{preferences.preferredLanguage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ngôn ngữ giao diện</span>
                  <span className="font-medium">{preferences.uiLanguage === "vi" ? "Tiếng Việt" : "English"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Trình độ</span>
                  <span className="font-medium">{preferences.selfAssessedLevel}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <ProfileStatsCard stats={stats} />
          </div>

          {/* Recent Achievements Preview */}
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Thành tích gần đây</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="text-2xl mb-2">🔥</div>
                <div className="font-medium">Streak Master</div>
                <div className="text-sm text-muted-foreground">7 ngày liên tục</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-2xl mb-2">💻</div>
                <div className="font-medium">Code Warrior</div>
                <div className="text-sm text-muted-foreground">Hoàn thành 12 bài tập</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium">Track Finisher</div>
                <div className="text-sm text-muted-foreground">Hoàn thành 2 lộ trình</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <SettingsForm
            initialPreferences={preferences}
            onSave={handlePreferencesSave}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
