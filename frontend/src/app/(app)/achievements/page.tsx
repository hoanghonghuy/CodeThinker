"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AchievementsGrid } from "@/components/features/achievements/achievements-grid";
import { apiClient } from "@/lib/api-client";
import type { Achievement } from "@/lib/achievements-mock";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const data = await apiClient.getAchievements();
        setAchievements(data);
      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  if (loading) {
    return <div>Loading achievements...</div>;
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thành tích
        </h1>
        <p className="text-sm text-muted-foreground">
          Khám phá và mở khóa các thành tích khi bạn học tập và tiến bộ.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{unlockedCount}</div>
          <div className="text-xs text-muted-foreground">Đã mở khóa</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{totalCount - unlockedCount}</div>
          <div className="text-xs text-muted-foreground">Còn lại</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
          <div className="text-xs text-muted-foreground">Hoàn thành</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {achievements.filter(a => a.rarity === "legendary" && a.unlocked).length}
          </div>
          <div className="text-xs text-muted-foreground">Huyền thoại</div>
        </div>
      </div>

      {/* Achievements Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({totalCount})</TabsTrigger>
          <TabsTrigger value="unlocked">Đã mở khóa ({unlockedCount})</TabsTrigger>
          <TabsTrigger value="locked">Chưa mở khóa ({totalCount - unlockedCount})</TabsTrigger>
          <TabsTrigger value="streak">🔥 Streak</TabsTrigger>
          <TabsTrigger value="challenges">🎯 Thử thách</TabsTrigger>
          <TabsTrigger value="tracks">🛤️ Lộ trình</TabsTrigger>
          <TabsTrigger value="points">💯 Điểm số</TabsTrigger>
          <TabsTrigger value="special">✨ Đặc biệt</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AchievementsGrid achievements={achievements} />
        </TabsContent>

        <TabsContent value="unlocked">
          <AchievementsGrid achievements={achievements} showUnlockedOnly={true} />
        </TabsContent>

        <TabsContent value="locked">
          <AchievementsGrid achievements={achievements.filter(a => !a.unlocked)} />
        </TabsContent>

        <TabsContent value="streak">
          <AchievementsGrid achievements={achievements.filter(a => a.category === "streak")} compact={true} />
        </TabsContent>

        <TabsContent value="challenges">
          <AchievementsGrid achievements={achievements.filter(a => a.category === "challenges")} compact={true} />
        </TabsContent>

        <TabsContent value="tracks">
          <AchievementsGrid achievements={achievements.filter(a => a.category === "tracks")} compact={true} />
        </TabsContent>

        <TabsContent value="points">
          <AchievementsGrid achievements={achievements.filter(a => a.category === "points")} compact={true} />
        </TabsContent>

        <TabsContent value="special">
          <AchievementsGrid achievements={achievements.filter(a => a.category === "special")} compact={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
