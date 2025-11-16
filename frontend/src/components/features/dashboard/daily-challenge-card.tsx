"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyChallengeSummary } from "@/lib/dashboard-mock";

export type DailyChallengeCardProps = {
  challenge: DailyChallengeSummary | null;
};

export function DailyChallengeCard({ challenge }: DailyChallengeCardProps) {
  if (!challenge) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Daily challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Chưa có daily challenge hôm nay. Khi backend sẵn sàng, phần này sẽ đề
            xuất một bài phù hợp với level và lịch sử của bạn.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold">Daily challenge</CardTitle>
          <p className="text-xs text-muted-foreground">
            Một bài gợi ý cho hôm nay, phù hợp để giữ streak.
          </p>
        </div>
        <Badge variant="outline" className="text-[11px]">
          {challenge.difficulty}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{challenge.title}</p>
          <p className="text-muted-foreground">{challenge.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {challenge.topics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-[11px]">
              {topic}
            </Badge>
          ))}
        </div>
        <Link
          href={`/challenges/${challenge.id}`}
          className="inline-flex items-center text-[11px] font-medium text-primary hover:underline"
        >
          Làm ngay
        </Link>
      </CardContent>
    </Card>
  );
}
