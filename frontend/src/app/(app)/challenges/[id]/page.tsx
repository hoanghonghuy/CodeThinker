import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { ChallengeSolveTabs } from "@/components/features/challenges/challenge-solve-tabs";

interface ChallengePageProps {
  params: {
    id: string;
  };
}

export default async function ChallengeDetailPage({
  params,
}: ChallengePageProps) {
  const challenge = await apiClient.getChallengeById(params.id);

  if (!challenge) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {challenge.title}
          </h1>
          <Badge>{challenge.difficulty}</Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {challenge.topics.map((topic) => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <ChallengeSolveTabs challenge={challenge} />
    </div>
  );
}
