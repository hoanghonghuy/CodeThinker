"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ProgressChartProps = {
  weeklyCounts: { day: string; count: number }[];
};

export function ProgressChart({ weeklyCounts }: ProgressChartProps) {
  const maxCount = Math.max(...weeklyCounts.map(d => d.count), 1);
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Hoạt động 7 ngày qua</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-1 h-24">
          {weeklyCounts.map((item, index) => {
            const heightPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div className="relative w-full flex flex-col justify-end items-center">
                  <div
                    className="w-full bg-primary rounded-t transition-all"
                    style={{ height: `${heightPercent}%`, minHeight: heightPercent > 0 ? '4px' : '0' }}
                    title={`${item.count} thử thách`}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {weekDays[index] ?? item.day}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Số thử thách hoàn thành mỗi ngày.
        </p>
      </CardContent>
    </Card>
  );
}
