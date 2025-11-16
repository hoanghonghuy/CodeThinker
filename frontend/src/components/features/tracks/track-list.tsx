import Link from "next/link";
import type { TrackWithProgress } from "@/lib/tracks-mock";
import { useLocale } from "@/components/providers/locale-provider";

interface TrackListProps {
  tracks: TrackWithProgress[];
}

export function TrackList({ tracks }: TrackListProps) {
  const { t } = useLocale();
  
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
      case "Beginner":
        return "text-green-600 dark:text-green-400";
      case "Intermediate":
        return "text-yellow-600 dark:text-yellow-400";
      case "Advanced":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tracks.map((track) => (
        <Link
          key={track.id}
          href={`/tracks/${track.id}`}
          className="block rounded-lg border p-6 transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{track.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {track.description}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className={getDifficultyColor(track.difficulty)}>
                  {track.difficulty}
                </span>
                <span>{track.estimatedHours} {t.tracks.estimatedHours}</span>
                <span>{track.totalChallenges} {t.tracks.totalChallenges}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  getStatusVariant(track.status) === "default"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : getStatusVariant(track.status) === "secondary"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {getStatusLabel(track.status)}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span>{t.tracks.progress}</span>
              <span className="font-medium">
                {track.completedChallenges}/{track.totalChallenges}
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${track.progressPercentage}%` }}
              />
            </div>
            <div className="mt-1 text-right text-xs text-muted-foreground">
              {track.progressPercentage}%
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
