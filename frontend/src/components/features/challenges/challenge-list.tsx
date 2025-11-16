import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Messages } from "@/lib/i18n";

export type ChallengeDifficulty = "Easy" | "Medium" | "Hard";

export type ChallengeStatus = "not_started" | "in_progress" | "completed";

export type ChallengeSummary = {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  topics: string[];
  status: ChallengeStatus;
  createdAt: string;
};

export type ChallengeListProps = {
  challenges: ChallengeSummary[];
  messages: Messages["challenges"];
};

function difficultyVariant(
  difficulty: ChallengeDifficulty,
): "default" | "secondary" | "destructive" | "outline" {
  switch (difficulty) {
    case "Easy":
      return "outline";
    case "Medium":
      return "secondary";
    case "Hard":
      return "default";
    default:
      return "outline";
  }
}

function statusVariant(
  status: ChallengeStatus,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "in_progress":
      return "secondary";
    case "not_started":
    default:
      return "outline";
  }
}

function statusLabel(status: ChallengeStatus): string {
  switch (status) {
    case "completed":
      return "Đã hoàn thành";
    case "in_progress":
      return "Đang làm";
    case "not_started":
    default:
      return "Chưa bắt đầu";
  }
}

export function ChallengeList({ challenges, messages }: ChallengeListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {challenges.map((challenge) => (
        <Link
          key={challenge.id}
          href={`/challenges/${challenge.id}`}
          className="group"
        >
          <Card className="h-full transition-colors group-hover:bg-muted/60">
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">
                  {challenge.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {messages.detailPlaceholder}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={difficultyVariant(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                <Badge
                  variant={statusVariant(challenge.status)}
                  className="text-[11px]"
                >
                  {statusLabel(challenge.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-xs">
              {challenge.topics.map((topic) => (
                <Badge key={topic} variant="outline">
                  {topic}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
