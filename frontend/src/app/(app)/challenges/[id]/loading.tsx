import { Skeleton } from "@/components/ui/skeleton";

export default function ChallengeDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-64 rounded-md bg-accent" />
        <div className="h-4 w-40 rounded-md bg-accent/60" />
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-80" />
    </div>
  );
}
