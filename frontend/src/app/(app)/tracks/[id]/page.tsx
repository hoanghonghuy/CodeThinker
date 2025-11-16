"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { TrackDetail } from "@/components/features/tracks/track-detail";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import type { TrackWithProgress } from "@/lib/tracks-mock";
import type { ChallengeSummary } from "@/components/features/challenges/challenge-list";

export default function TrackPage() {
  const params = useParams<{ id: string }>();
  const trackId = params?.id;
  const { user, loading: authLoading } = useAuth();

  const [track, setTrack] = useState<TrackWithProgress | null>(null);
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchTrack() {
      if (!trackId || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [trackResult, challengesResult] = await Promise.all([
          apiClient.getTrackWithProgressById(trackId),
          apiClient.listChallenges(),
        ]);
        if (cancelled) return;
        if (!trackResult) {
          setError("Không tìm thấy lộ trình này.");
          setTrack(null);
        } else {
          setTrack(trackResult);
          setChallenges(challengesResult);
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load track", error);
        setError("Không thể tải lộ trình. Vui lòng thử lại.");
        setTrack(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTrack();
    return () => {
      cancelled = true;
    };
  }, [trackId, user]);

  if (authLoading || loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Đang tải lộ trình...</div>;
  }

  if (!user) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">Bạn cần đăng nhập để xem lộ trình.</p>
        <Button asChild>
          <Link href={`/login?next=/tracks/${trackId}`}>Đăng nhập</Link>
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

  if (!track) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        Không tìm thấy lộ trình.
      </div>
    );
  }

  return <TrackDetail track={track} challenges={challenges} />;
}
