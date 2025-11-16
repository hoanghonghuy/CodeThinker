"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentActivityEntry } from "@/lib/dashboard-mock";

export type RecentActivityListProps = {
  items: RecentActivityEntry[] | null;
};

export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {!items || items.length === 0 ? (
          <p className="text-muted-foreground">
            Chưa có hoạt động nào gần đây. Sau khi bạn chạy code và nộp bài, lịch
            sử sẽ xuất hiện ở đây.
          </p>
        ) : (
          <div className="space-y-1">
            {items.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between rounded-md border bg-card px-3 py-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        entry.status === "success" ? "default" : "destructive"
                      }
                      className="text-[11px]"
                    >
                      {entry.status === "success" ? "PASS" : "FAIL"}
                    </Badge>
                    <Link
                      href={`/challenges/${entry.challengeId}`}
                      className="text-[11px] font-medium text-foreground hover:underline"
                    >
                      {entry.challengeTitle}
                    </Link>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(entry.ranAt).toLocaleString()} · {entry.language.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
