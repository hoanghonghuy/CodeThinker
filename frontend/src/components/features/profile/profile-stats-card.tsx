import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileStats } from "@/lib/profile-mock";

interface ProfileStatsCardProps {
  stats: ProfileStats;
}

export function ProfileStatsCard({ stats }: ProfileStatsCardProps) {
  const completionRate = Math.round((stats.completedChallenges / stats.totalChallenges) * 100);
  const tracksCompletionRate = Math.round((stats.tracksCompleted / stats.totalTracks) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê học tập</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalPoints}</div>
            <div className="text-xs text-muted-foreground">Tổng điểm</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
            <div className="text-xs text-muted-foreground">Chuỗi ngày</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Tiến độ bài tập</span>
              <span className="font-medium">{stats.completedChallenges}/{stats.totalChallenges}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="text-right text-xs text-muted-foreground mt-1">
              {completionRate}%
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Tiến độ lộ trình</span>
              <span className="font-medium">{stats.tracksCompleted}/{stats.totalTracks}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-600 transition-all"
                style={{ width: `${tracksCompletionRate}%` }}
              />
            </div>
            <div className="text-right text-xs text-muted-foreground mt-1">
              {tracksCompletionRate}%
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Level hiện tại</span>
            <span className="font-medium">{stats.currentLevel}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ngày tham gia</span>
            <span className="font-medium">{new Date(stats.joinDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
