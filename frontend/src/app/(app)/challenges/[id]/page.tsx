"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { ChallengeSolveTabs } from "@/components/features/challenges/challenge-solve-tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import type { ChallengeSummary } from "@/components/features/challenges/challenge-list";

export default function ChallengeDetailPage() {
  const params = useParams<{ id: string }>();
  const challengeId = params?.id;
  const { user, loading: authLoading } = useAuth();

  const [challenge, setChallenge] = useState<ChallengeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchChallenge() {
      if (!challengeId || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.getChallengeById(challengeId);
        if (cancelled) return;
        if (!result) {
          setError("Không tìm thấy thử thách này.");
          setChallenge(null);
        } else {
          setChallenge(result);
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load challenge", error);
        setError("Không thể tải thử thách. Vui lòng thử lại.");
        setChallenge(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchChallenge();
    return () => {
      cancelled = true;
    };
  }, [challengeId, user]);

  if (authLoading || loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Đang tải thử thách...</div>;
  }

  if (!user) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">Bạn cần đăng nhập để xem chi tiết thử thách.</p>
        <Button asChild>
          <Link href={`/login?next=/challenges/${challengeId}`}>Đăng nhập</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        Không tìm thấy thử thách.
      </div>
    );
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
