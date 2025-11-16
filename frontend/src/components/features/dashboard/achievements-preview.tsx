"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useState, useEffect } from "react";
import type { Achievement } from "@/lib/achievements-mock";

export function AchievementsPreview() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const data = await apiClient.getUnlockedAchievements();
        setAchievements(data.slice(0, 3)); // Show only 3 most recent unlocked achievements
      } catch (error) {
        console.error("Failed to load achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Thành tích gần đây</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Đang tải...
          </div>
        ) : achievements.length === 0 ? (
          <p className="text-muted-foreground">
            Hoàn thành thử thách để mở khóa thành tích đầu tiên của bạn!
          </p>
        ) : (
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 rounded-md border bg-card px-3 py-2"
              >
                <div className="text-lg">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-foreground text-xs">
                    {achievement.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
