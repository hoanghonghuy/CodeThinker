"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { TrackWithProgress } from "@/lib/tracks-mock";
import type { ChallengeSummary as ChallengeSummaryType } from "@/components/features/challenges/challenge-list";
import { useLocale } from "@/components/providers/locale-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

interface TrackDetailProps {
  track: TrackWithProgress;
  challenges: ChallengeSummaryType[];
}

export function TrackDetail({ track, challenges }: TrackDetailProps) {
  const { t } = useLocale();
  const { user } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  
  const trackChallenges = challenges.filter((c) =>
    track.challengeIds.includes(c.id),
  );

  const handleStartTrack = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để bắt đầu lộ trình.");
      return;
    }
    setIsStarting(true);
    try {
      await apiClient.startTrack(track.id);
      toast.success("Đã bắt đầu lộ trình!");
      // Optionally refetch progress or update local state
    } catch (error) {
      console.error("Failed to start track:", error);
      toast.error("Không thể bắt đầu lộ trình.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleContinueTrack = () => {
    // Navigate to first uncompleted challenge or track overview
    const nextChallenge = trackChallenges.find(c => c.status !== "completed");
    if (nextChallenge) {
      window.location.href = `/challenges/${nextChallenge.id}`;
    } else {
      toast.info("Bạn đã hoàn thành tất cả thử thách trong lộ trình này!");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t.tracks.status.completed;
      case "in_progress":
        return t.tracks.status.inProgress;
      default:
        return t.tracks.status.notStarted;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 dark:text-green-400";
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "Hard":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Track Header */}
      <div className="rounded-lg border p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{track.title}</h1>
            <p className="mt-2 text-muted-foreground">{track.description}</p>
            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="font-medium">{track.difficulty}</span>
              <span>{track.estimatedHours} {t.tracks.estimatedHours}</span>
              <span>{track.totalChallenges} {t.tracks.totalChallenges}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{track.progressPercentage}%</div>
            <div className="text-sm text-muted-foreground">{t.tracks.status.completed}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span>{t.tracks.progress}</span>
            <span className="font-medium">
              {track.completedChallenges}/{track.totalChallenges} {t.tracks.totalChallenges}
            </span>
          </div>
          <div className="mt-2 h-3 w-full rounded-full bg-muted">
            <div
              className="h-3 rounded-full bg-primary transition-all"
              style={{ width: `${track.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">{t.tracks.challengesInTrack}</h2>
        {trackChallenges.length === 0 ? (
          <p className="text-muted-foreground">{t.tracks.noChallenges}</p>
        ) : (
          <div className="space-y-3">
            {trackChallenges.map((challenge, index) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {challenge.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {challenge.topics.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      getStatusVariant(challenge.status) === "default"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : getStatusVariant(challenge.status) === "secondary"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getStatusLabel(challenge.status)}
                  </span>
                  <Link
                    href={`/challenges/${challenge.id}`}
                    className="rounded bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {challenge.status === "completed" ? t.tracks.review : t.tracks.start}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Link
          href="/tracks"
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          ← {t.tracks.backToTracks}
        </Link>
        {track.status === "not_started" && (
          <Button
            onClick={handleStartTrack}
            disabled={isStarting || !user}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isStarting ? "Đang bắt đầu..." : t.tracks.startTrack}
          </Button>
        )}
        {track.status === "in_progress" && (
          <Button
            onClick={handleContinueTrack}
            disabled={!user}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t.tracks.continueTrack}
          </Button>
        )}
      </div>
    </div>
  );
}
