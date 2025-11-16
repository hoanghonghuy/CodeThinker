import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Messages } from "@/lib/i18n";

export type DashboardSummaryData = {
  points: number;
  level: string;
  streak: number;
  completedChallenges: number;
};

export type FocusArea = {
  label: string;
  value: string;
};

export type DashboardSummaryProps = {
  summary: DashboardSummaryData;
  focusAreas: FocusArea[];
  messages: Messages["dashboard"];
};

export function DashboardSummary({
  summary,
  focusAreas,
  messages,
}: DashboardSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {messages.totalPoints}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary.points}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Điểm tích luỹ từ các thử thách đã hoàn thành.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {messages.currentLevel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge>{summary.level}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Level tính dựa trên tổng điểm.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {messages.streakAndCompleted}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {summary.streak} ngày
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {summary.completedChallenges} thử thách đã hoàn thành.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{messages.studyPlan}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Mỗi ngày ít nhất 1 thử thách (giữ streak).</p>
            <p>• Xen kẽ giữa bài thuật toán và bài thực tế (API, CLI, SQL).</p>
            <p>• Ưu tiên debug độc lập, chỉ xem gợi ý khi thật sự cần.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.strengthsWeaknesses}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {focusAreas.map((area) => (
              <div
                key={area.label}
                className="flex items-center justify-between rounded-md border bg-card px-3 py-2"
              >
                <span className="text-muted-foreground">{area.label}</span>
                <span className="font-medium">{area.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
